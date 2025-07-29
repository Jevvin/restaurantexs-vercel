"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function AdminDashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenido, Administrador</h1>
        <p className="text-gray-700 mb-6">
          Has iniciado sesión como: <span className="font-semibold">{user?.email}</span> (Rol:{" "}
          <span className="font-semibold">{user?.role}</span>)
        </p>
        <p className="text-gray-600 mb-8">
          Este es el panel de administración general. Aquí podrás gestionar usuarios, ciudades, categorías y tener una
          vista global del sistema.
        </p>
        <Button onClick={logout} className="bg-red-600 hover:bg-red-700">
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
