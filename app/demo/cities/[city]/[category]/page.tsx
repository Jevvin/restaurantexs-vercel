// app/[city]/[category]/page.tsx
import { MapPin, Filter } from "lucide-react"
import type { Restaurant } from "@/types/restaurant"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { RestaurantCard } from "@/components/restaurant/restaurant-card"
import { RestaurantFilters } from "@/components/restaurant/restaurant-filters"
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

export default async function CategoryPage({ params }: PageProps) {
  const { city: citySlug, category: categorySlug } = params

  const [restaurants, city, category, availableAmenities] = await Promise.all([
    getRestaurantsByCityAndCategory(citySlug, categorySlug),
    getCityBySlug(citySlug),
    getCategoryBySlug(categorySlug),
    getAvailableAmenities(),
  ])

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
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Restaurantes de {category.name} en {city.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{restaurants.length} restaurantes encontrados</span>
              </div>
            </div>
            {/* Este botón podría manejar filtros desde el cliente si los implementas */}
            <Button variant="outline" className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros (pueden implementarse client-side si decides usar client components) */}
          <div className="lg:col-span-1 hidden lg:block">
            <RestaurantFilters
  availableAmenities={availableAmenities}
  onFiltersChange={() => {}}
/>

          </div>

          {/* Lista de restaurantes */}
          <div className="lg:col-span-3">
            {restaurants.length > 0 ? (
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onFavoriteToggle={() => {}}
                    isFavorited={false}
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
