"use client"

import type React from "react"

import { useState, useEffect } from "react" // Importa useEffect
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isAuthenticated, user } = useAuth() // Obtén isAuthenticated y user
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        router.replace("/dashboard/admin") // Usa replace para evitar problemas con el botón de atrás
      } else if (user?.role === "restaurant") {
        router.replace("/dashboard/restaurant")
      }
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (login(email, password)) {
      // La redirección ya es manejada por AuthProvider
    } else {
      setError("Credenciales inválidas. Intenta con admin@admin / admin o restaurant@admin / admin.")
    }
  }

  // Si ya está autenticado, muestra un estado de carga o null mientras redirige
  if (isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder al dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Credenciales demo:</p>
            <p>Admin: `admin@admin` / `admin`</p>
            <p>Restaurante: `restaurant@admin` / `admin`</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
