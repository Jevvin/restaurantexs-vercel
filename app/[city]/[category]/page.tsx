"use client"

import { useState, useMemo, useEffect } from "react"
import { MapPin, Filter } from "lucide-react"
import type { Restaurant } from "@/types/restaurant"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { RestaurantCard } from "@/components/restaurant/restaurant-card"
import { RestaurantFilters, type FilterState } from "@/components/restaurant/restaurant-filters"
import { Button } from "@/components/ui/button"
import {
  getRestaurantsByCityAndCategory,
  getCityBySlug,
  getCategoryBySlug,
  getAvailableAmenities,
} from "@/lib/mock-restaurants"

interface PageProps {
  params: {
    city: string
    category: string
  }
}

export default function CategoryPage({ params }: PageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [city, setCity] = useState<any>(null)
  const [category, setCategory] = useState<any>(null)
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    rating: [],
    priceRange: [],
    amenities: [],
    openNow: false,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [restaurantsData, cityData, categoryData, amenitiesData] = await Promise.all([
          getRestaurantsByCityAndCategory(params.city, params.category),
          getCityBySlug(params.city),
          getCategoryBySlug(params.category),
          getAvailableAmenities(),
        ])

        setRestaurants(restaurantsData)
        setCity(cityData)
        setCategory(categoryData)
        setAvailableAmenities(amenitiesData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.city, params.category])

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Filtro por calificación
      if (filters.rating.length > 0) {
        const meetRating = filters.rating.some((rating) => restaurant.rating >= rating)
        if (!meetRating) return false
      }

      // Filtro por rango de precio
      if (filters.priceRange.length > 0) {
        if (!filters.priceRange.includes(restaurant.priceRange)) return false
      }

      // Filtro por amenidades
      if (filters.amenities.length > 0) {
        const hasAmenities = filters.amenities.every((amenity) => restaurant.amenities.includes(amenity))
        if (!hasAmenities) return false
      }

      // Filtro por abierto ahora
      if (filters.openNow && !restaurant.isOpen) return false

      return true
    })
  }, [restaurants, filters])

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
          <p className="text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    )
  }

  if (!city || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
          <p className="text-gray-600">La ciudad o categoría que buscas no existe.</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: city.state, href: `/${city.state.toLowerCase().replace(" ", "-")}` },
    { label: city.name, href: `/${city.slug}` },
    { label: category.name },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Restaurantes de {category.name} en {city.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{filteredRestaurants.length} restaurantes encontrados</span>
              </div>
            </div>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros - Desktop siempre visible, Mobile condicional */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"} lg:col-span-1`}>
            <RestaurantFilters onFiltersChange={setFilters} availableAmenities={availableAmenities} />
          </div>

          {/* Lista de restaurantes */}
          <div className="lg:col-span-3">
            {filteredRestaurants.length > 0 ? (
              <div className="space-y-4">
                {filteredRestaurants.map((restaurant) => (
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
                  <h3 className="text-lg font-medium mb-2">No se encontraron restaurantes</h3>
                  <p>Intenta ajustar los filtros para ver más opciones</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
