// app/[city]/page.tsx
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { RestaurantCard } from "@/components/restaurant/restaurant-card"
import type { Restaurant } from "@/types/restaurant"
import { getRestaurantsByCity, getCityBySlug } from "@/lib/mock-restaurants"
import { RestaurantList } from "@/components/restaurant/restaurant-list"


// Categorías populares para mostrar
const popularCategories = [
  { name: "Mariscos", slug: "mariscos", icon: "🦐", description: "Pescados y mariscos frescos" },
  { name: "Comida Mexicana", slug: "comida-mexicana", icon: "🌮", description: "Auténtica cocina mexicana" },
  { name: "Internacional", slug: "internacional", icon: "🍕", description: "Cocina internacional" },
  { name: "Café y Postres", slug: "cafe-postres", icon: "☕", description: "Cafeterías y reposterías" },
]

export default async function CityPage({ params }: { params: { city: string } }) {
  const { city: citySlug } = params

  const [restaurants, city] = await Promise.all([
    getRestaurantsByCity(citySlug),
    getCityBySlug(citySlug),
  ])

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ciudad no encontrada</h1>
          <p className="text-gray-600 mb-4">{`La ciudad "${citySlug}" no existe en nuestro directorio.`}</p>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: city.state, href: `/${city.state.toLowerCase().replace(" ", "-")}` },
    { label: city.name },
  ]

  const totalRestaurants = restaurants.length
  const averageRating = restaurants.length > 0
    ? restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length
    : 0
  const totalReviews = restaurants.reduce((sum, r) => sum + r.reviewCount, 0)

  const featuredRestaurants = restaurants
    .filter((r) => r.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">
              Restaurantes en {city.name}, {city.state}
            </h1>
            <p className="text-xl mb-6">
              Descubre los mejores lugares para comer en {city.name}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalRestaurants}</div>
                <div className="text-blue-100">Restaurantes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                <div className="text-blue-100">Calificación Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{totalReviews.toLocaleString()}</div>
                <div className="text-blue-100">Reseñas Totales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categorías Populares */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Explora por Categoría</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <Link key={category.slug} href={`/${citySlug}/${category.slug}`}>
                <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {restaurants.filter((r) => r.category === category.slug).length} lugares
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Restaurantes Destacados */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Restaurantes Destacados</h2>
            {restaurants.length > 6 && (
              <Button variant="outline" asChild>
                <Link href={`/${citySlug}/todos`}>Ver todos</Link>
              </Button>
            )}
          </div>

          {featuredRestaurants.length > 0 ? (
  <RestaurantList restaurants={featuredRestaurants} />
) : (

            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Próximamente</h3>
                <p>Estamos trabajando para agregar más restaurantes en {city.name}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
