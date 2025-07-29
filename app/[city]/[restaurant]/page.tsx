import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, Clock, Share2, Heart, Pencil, CheckCircle } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageGallery } from "@/components/restaurant/image-gallery"
import { RestaurantMap } from "@/components/restaurant/restaurant-map"
import { ReviewsSection } from "@/components/restaurant/reviews-section"
import { formatRating, formatReviewCount } from "@/lib/utils"
import {
  getRestaurantBySlug,
  getRestaurantPromotions,
  getRestaurantMenu,
  getRestaurantReviews,
  getRestaurantsByPriceRange,
} from "@/lib/mock-restaurants"
import { RestaurantCarousel } from "@/components/restaurant/restaurant-carousel"

interface PageProps {
  params: {
    city: string
    restaurant: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const restaurant = await getRestaurantBySlug(params.restaurant)

  if (!restaurant) {
    return {
      title: "Restaurante no encontrado",
      description: "El restaurante que buscas no existe o ha sido eliminado.",
    }
  }

  return {
    title: `${restaurant.name} - ${restaurant.tagline} | Restaurantes en ${restaurant.city}`,
    description: restaurant.description,
    keywords: `${restaurant.name}, restaurante, ${restaurant.category}, ${restaurant.city}, comida, reseñas`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.tagline,
      images: restaurant.images.length > 0 ? [restaurant.images[0]] : [],
      type: "business.business",
    },
  }
}

export default async function RestaurantPage({ params }: PageProps) {
  const restaurant = await getRestaurantBySlug(params.restaurant)

  if (!restaurant) {
    notFound()
  }

  // Obtener datos adicionales
  const [promotions, menu, reviews, relatedRestaurants] = await Promise.all([
    getRestaurantPromotions(restaurant.id),
    getRestaurantMenu(restaurant.id),
    getRestaurantReviews(restaurant.id),
    getRestaurantsByPriceRange("mid", 10, restaurant.id), // Fetch related restaurants
  ])

  // Actualizar el restaurante con los datos adicionales
  restaurant.promotions = promotions
  restaurant.menu = menu

  // Breadcrumbs al estilo TripAdvisor
  const breadcrumbItems = [
    { label: "México", href: "#" },
    { label: "Península de Yucatán", href: "#" },
    { label: restaurant.state, href: `/${restaurant.state.toLowerCase().replace(" ", "-")}` },
    { label: "Riviera Maya", href: "#" },
    { label: restaurant.city, href: `/${restaurant.city}` },
    { label: `${restaurant.city} Beach`, href: `/${restaurant.city}-beach` }, // Simular "Tulum Beach"
    {
      label: `Restaurantes en ${restaurant.city} Beach - Opiniones`,
      href: `/${restaurant.city}-beach/restaurantes/opiniones`,
    },
    { label: restaurant.name },
  ]

  const businessHoursArray = Object.entries(restaurant.hours).map(([day, hours]: [string, any]) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    ...hours,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6 text-xs text-gray-500" />

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                {restaurant.name}
                {restaurant.isClaimed && (
                  <span className="text-sm font-normal text-green-700 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 fill-green-700 text-white" />
                    Solicitado
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {/* TripAdvisor style rating circles */}
                  <div className="flex mr-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(restaurant.rating) ? "fill-green-700 text-green-700" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{formatRating(restaurant.rating)}</span>
                  <Link href="#reviews" className="ml-2 text-sm text-gray-600 underline hover:text-gray-900">
                    ({formatReviewCount(restaurant.reviewCount)})
                  </Link>
                </div>
                {restaurant.ranking && (
                  <Link href="#" className="text-sm text-gray-600 underline hover:text-gray-900">
                    #{restaurant.ranking.position} de {restaurant.ranking.total} restaurantes en {restaurant.city}
                  </Link>
                )}
                {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
                  <span className="text-sm text-gray-600">{restaurant.dietaryOptions.join(", ")}</span>
                )}
                <span className="text-sm text-gray-600 uppercase font-semibold">
                  {restaurant.priceRange === "budget" && "$"}
                  {restaurant.priceRange === "mid" && "$$"}
                  {restaurant.priceRange === "premium" && "$$$"}
                  {restaurant.priceRange === "luxury" && "$$$$"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Opinión
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent"
              >
                <Heart className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-6">
          <ImageGallery categorizedImages={restaurant.categorizedImages} restaurantName={restaurant.name} />
        </div>

        {/* Sticky Navigation Menu */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 flex space-x-8 text-sm font-medium text-gray-700">
            <Link
              href="#description"
              className="py-3 border-b-2 border-transparent hover:border-green-700 hover:text-green-700 transition-colors"
            >
              Descripción general
            </Link>
            <Link
              href="#hours"
              className="py-3 border-b-2 border-transparent hover:border-green-700 hover:text-green-700 transition-colors"
            >
              Horas
            </Link>
            <Link
              href="#location"
              className="py-3 border-b-2 border-transparent hover:border-green-700 hover:text-green-700 transition-colors"
            >
              Ubicación
            </Link>
            <Link
              href="#menu"
              className="py-3 border-b-2 border-transparent hover:border-green-700 hover:text-green-700 transition-colors"
            >
              Menú
            </Link>
            <Link
              href="#reviews"
              className="py-3 border-b-2 border-transparent hover:border-green-700 hover:text-green-700 transition-colors"
            >
              Opiniones
            </Link>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <div id="description" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Acerca de</h2>
              <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Amenidades */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Servicios y Amenidades</h2>
              <div className="flex flex-wrap gap-2">
                {restaurant.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Promociones */}
            {restaurant.promotions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Promociones Activas</h2>
                <div className="space-y-3">
                  {restaurant.promotions.map((promotion) => (
                    <div key={promotion.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <h3 className="font-semibold text-green-800">{promotion.title}</h3>
                      <p className="text-green-700 text-sm">{promotion.description}</p>
                      {promotion.validUntil && (
                        <p className="text-xs text-green-600 mt-1">
                          Válido hasta: {new Date(promotion.validUntil).toLocaleDateString("es-MX")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menú */}
            {restaurant.menu.length > 0 && (
              <div id="menu" className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Menú</h2>
                <div className="space-y-4">
                  {Object.entries(
                    restaurant.menu.reduce(
                      (acc, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      },
                      {} as Record<string, typeof restaurant.menu>,
                    ),
                  ).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3 border-b pb-2">{category}</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <div className="ml-4 font-semibold">${item.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <ReviewsSection
              id="reviews"
              reviews={reviews}
              averageRating={restaurant.rating}
              totalReviews={restaurant.reviewCount}
              canWriteReview={true}
            />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Información de contacto y horarios */}
            <div id="hours" className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Información</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium mb-2">Horarios</div>
                    <div className="text-sm space-y-1">
                      {businessHoursArray.map(({ day, open, close, isClosed }) => (
                        <div key={day} className="flex justify-between">
                          <span>{day}</span>
                          <span className={isClosed ? "text-gray-500" : ""}>
                            {isClosed ? "Cerrado" : `${open} - ${close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <RestaurantMap id="location" restaurant={restaurant} />
          </div>
        </div>

        {/* Related Restaurants Carousel */}
        {relatedRestaurants.length > 0 && (
          <RestaurantCarousel
            title="Los mejores restaurantes de precios moderados"
            restaurants={relatedRestaurants}
            linkHref={`/${restaurant.city}/todos?priceRange=mid`} // Example link to a filtered list
            linkText="Ver más"
          />
        )}
      </div>
    </div>
  )
}
