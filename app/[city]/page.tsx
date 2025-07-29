"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { RestaurantCard } from "@/components/restaurant/restaurant-card"
import type { Restaurant } from "@/types/restaurant"
import { getRestaurantsByCity, getCityBySlug } from "@/lib/mock-restaurants"

interface PageProps {
  params: {
    city: string
  }
}

// Categorías populares para mostrar
const popularCategories = [
  { name: "Mariscos", slug: "mariscos", icon: "🦐", description: "Pescados y mariscos frescos" },
  { name: "Comida Mexicana", slug: "comida-mexicana", icon: "🌮", description: "Auténtica cocina mexicana" },
  { name: "Internacional", slug: "internacional", icon: "🍕", description: "Cocina internacional" },
  { name: "Café y Postres", slug: "cafe-postres", icon: "☕", description: "Cafeterías y reposterías" },
]

export default function CityPage({ params }: PageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [city, setCity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        console.log("Loading data for city:", params.city)

        const [restaurantsData, cityData] = await Promise.all([
          getRestaurantsByCity(params.city),
          getCityBySlug(params.city),
        ])

        console.log("Loaded data:", {
          restaurantsCount: restaurantsData.length,
          city: cityData?.name,
        })

        setRestaurants(restaurantsData)
        setCity(cityData)

        if (!cityData) {
          setError(`No se encontró la ciudad "${params.city}"`)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Error al cargar los datos. Por favor intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.city])

  const handleFavoriteToggle = (restaurantId: string) => {
    setFavoriteRestaurants((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(restaurantId)) {
        newFavorites.delete(restaurantId)
      } else {
        newFavorites.add(restaurantId)
      }
      return newFavorites
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la ciudad...</p>
        </div>
      </div>
    )
  }

  if (error || !city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ciudad no encontrada</h1>
          <p className="text-gray-600 mb-4">{error || `La ciudad "${params.city}" no existe en nuestro directorio.`}</p>
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

  // Obtener estadísticas
  const totalRestaurants = restaurants.length
  const averageRating =
    restaurants.length > 0 ? restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length : 0
  const totalReviews = restaurants.reduce((sum, r) => sum + r.reviewCount, 0)

  // Restaurantes destacados (mejor calificados)
  const featuredRestaurants = restaurants
    .filter((r) => r.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">
              Restaurantes en {city.name}, {city.state}
            </h1>
            <p className="text-xl mb-6">
              Descubre los mejores lugares para comer en {city.name}. Desde mariscos frescos hasta auténtica comida
              mexicana.
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
              <Link key={category.slug} href={`/${params.city}/${category.slug}`}>
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
                <Link href={`/${params.city}/todos`}>Ver todos</Link>
              </Button>
            )}
          </div>

          {featuredRestaurants.length > 0 ? (
            <div className="space-y-4">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorited={favoriteRestaurants.has(restaurant.id)}
                />
              ))}
            </div>
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

        {/* Información adicional */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Por qué elegir restaurantes en {city.name}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Variedad Gastronómica</h3>
              <p className="text-gray-600">
                {city.name} ofrece una increíble diversidad culinaria, desde mariscos frescos del Caribe hasta auténtica
                comida yucateca y opciones internacionales de alta calidad.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Experiencias Únicas</h3>
              <p className="text-gray-600">
                Disfruta de cenas con vista al mar, ambientes familiares tradicionales y restaurantes de lujo que
                combinan sabores locales con técnicas culinarias internacionales.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
