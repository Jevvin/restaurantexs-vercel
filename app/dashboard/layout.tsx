"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login") // Cambiado a replace
    } else if (isAuthenticated && pathname === "/login") {
      if (user?.role === "admin") {
        router.replace("/dashboard/admin") // Cambiado a replace
      } else if (user?.role === "restaurant") {
        router.replace("/dashboard/restaurant") // Cambiado a replace
      }
    }
  }, [isAuthenticated, pathname, router, user])

  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirigiendo al inicio de sesión...</p>
      </div>
    )
  }

  return <>{children}</>
}
