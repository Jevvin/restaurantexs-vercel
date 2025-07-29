"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Star, Utensils, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function RestaurantOverviewPage() {
  const { user } = useAuth()

  // Mock data for overview
  const overviewStats = [
    { title: "Calificación Promedio", value: "4.5", icon: Star, color: "text-yellow-500" },
    { title: "Total de Reseñas", value: "324", icon: Users, color: "text-blue-500" },
    { title: "Elementos en Menú", value: "25", icon: Utensils, color: "text-green-500" },
    { title: "Promociones Activas", value: "2", icon: DollarSign, color: "text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.email.split("@")[0]}!</h2>
      <p className="text-gray-600">
        Aquí puedes ver un resumen rápido del rendimiento de tu restaurante y acceder a las herramientas de gestión.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Utiliza el menú de la izquierda para navegar y gestionar los detalles de tu restaurante:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Actualiza la información general y la descripción.</li>
            <li>Ajusta tus horarios de apertura y cierre.</li>
            <li>Verifica y edita la ubicación en el mapa.</li>
            <li>Sube nuevas fotos de tu interior, comida y menú.</li>
            <li>Gestiona tus elementos del menú y sus precios.</li>
            <li>Crea y edita promociones para atraer más clientes.</li>
            <li>Responde a las opiniones de tus clientes.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
