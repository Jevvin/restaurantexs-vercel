"use client"

import type React from "react"
import { createContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; role: "admin" | "restaurant" } | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; role: "admin" | "restaurant" } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate checking for a session on mount
    const storedUser = localStorage.getItem("demoUser")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
  }, [])

  const login = useCallback(
    (email: string, password: string) => {
      // Demo credentials
      if (email === "admin@admin" && password === "admin") {
        const demoUser = { email: "admin@admin", role: "admin" as const }
        setUser(demoUser)
        setIsAuthenticated(true)
        localStorage.setItem("demoUser", JSON.stringify(demoUser))
        router.replace("/dashboard/admin") // Cambiado a replace
        return true
      } else if (email === "restaurant@admin" && password === "admin") {
        const demoUser = { email: "restaurant@admin", role: "restaurant" as const }
        setUser(demoUser)
        setIsAuthenticated(true)
        localStorage.setItem("demoUser", JSON.stringify(demoUser))
        router.replace("/dashboard/restaurant") // Cambiado a replace
        return true
      }
      return false
    },
    [router],
  )

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("demoUser")
    router.push("/login")
  }, [router])

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}
