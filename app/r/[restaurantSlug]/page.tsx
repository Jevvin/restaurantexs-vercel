// src/app/r/[restaurantSlug]/page.tsx
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { fetchRestaurantData } from "@/lib/fetchRestaurantData"
import { RestaurantMenu } from "@/components/restaurant/RestaurantMenu"
import { Card } from "@/components/ui/card"
import ReviewsSection from "@/components/restaurant/ServerComponents/ReviewsSection"
import { ImageGallery } from "@/components/restaurant/image-gallery"
import { RestaurantAbout } from "@/components/restaurant/restaurant-about"
import { RestaurantAmenities } from "@/components/restaurant/restaurant-amenities"
import { RestaurantHeader } from "@/components/restaurant/RestaurantHeader"
import HoursTableClient from "@/components/restaurant/ClientComponents/HoursTableClient"
import MapRestaurantClient from "@/components/restaurant/ClientComponents/MapRestaurantClient"
import MenuJsonLdServer from "@/components/restaurant/Seo/MenuJsonLdServer"
import RestaurantJsonLdServer from "@/components/restaurant/Seo/RestaurantJsonLdServer"
import type { Review } from "@/types/restaurant"
import { createClient } from "@/lib/supabaseServer"

interface PageProps {
  params: {
    restaurantSlug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { restaurant } = await fetchRestaurantData(params.restaurantSlug)
  if (!restaurant) return { title: "Restaurante no encontrado" }
  return {
    title: `${restaurant.name} | Restaurante`,
    description: restaurant.tagline ?? "",
  }
}

export default async function RestaurantPage({ params }: PageProps) {
  const {
    restaurant,
    city,
    category,
    subcategories,
    menuCategories,
    menuProducts,
    hours,
    amenities,
    reviews,
    images,
    priceLevel,
    restaurantSubcategories,
  } = await fetchRestaurantData(params.restaurantSlug)

  if (!restaurant) notFound()

  // ------ Nombres y slugs principales (evita null -> usa undefined)
  const primary = restaurantSubcategories?.[0]
  const categoryName: string | undefined = primary?.category?.name ?? undefined
  const subcategoryName: string | undefined = primary?.name ?? undefined

  const citySlug: string | undefined = city?.slug ?? undefined
  const categorySlug: string | undefined = primary?.category?.slug ?? undefined
  const subcategorySlug: string | undefined = primary?.slug ?? undefined

  // ------ Ranking real en ciudad (destacados: reviews_count desc, luego rating_average desc)
  let rankInCity: number | undefined = undefined
  let totalInCity: number | undefined = undefined
  if (city?.id) {
    const supabase = createClient()
    const { data: cityRestaurants } = await supabase
      .from("restaurants")
      .select("id, rating_average, reviews_count, is_approved")
      .eq("city_id", city.id)
      .eq("is_approved", true)

    const sorted =
      (cityRestaurants ?? [])
        .slice()
        .sort((a: any, b: any) => {
          const ra = Number(a.reviews_count ?? 0)
          const rb = Number(b.reviews_count ?? 0)
          if (rb !== ra) return rb - ra
          const rA = Number(a.rating_average ?? 0)
          const rB = Number(b.rating_average ?? 0)
          return rB - rA
        })

    totalInCity = sorted.length
    const idx = sorted.findIndex((r: any) => String(r.id) === String(restaurant.id))
    rankInCity = idx >= 0 ? idx + 1 : undefined
  }

  // ------ Reviews transformadas
  const transformedReviews: Review[] = (reviews ?? []).map((r: any) => ({
    id: String(r.id),
    userId: r.user_id ?? "",
    userName: (r.user_name?.trim() || "Anónimo"),
    userAvatar: r.user_avatar || undefined,
    restaurantId: r.restaurant_id as string,
    rating: typeof r.rating === "number" ? r.rating : 0,
    comment: r.comment ?? "",
    images: Array.isArray(r.images) ? r.images.filter(Boolean) : [],
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    ownerResponse: r.owner_response
      ? {
          message: r.owner_response.message ?? "",
          createdAt: r.owner_response.created_at
            ? new Date(r.owner_response.created_at).toISOString()
            : new Date().toISOString(),
        }
      : undefined,
  }))

  // ------ Imágenes categorizadas
  const categorizedImages = {
    interior: images.filter((img) => img.type === "interior").map((img) => img.url),
    food: images.filter((img) => img.type === "food").map((img) => img.url),
    menu: images.filter((img) => img.type === "menu").map((img) => img.url),
    all: images.map((img) => img.url),
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <RestaurantHeader
          restaurant={restaurant}
          city={city}
          categoryName={categoryName}
          subcategoryName={subcategoryName}
          priceLevel={priceLevel}
          /* nuevos props para ranking y urls */
          rankInCity={rankInCity}
          totalInCity={totalInCity}
          citySlug={citySlug}
          categorySlug={categorySlug}
          subcategorySlug={subcategorySlug}
        />

        {/* Galería */}
        <div className="mb-6">
          <Card className="p-5">
            <ImageGallery categorizedImages={categorizedImages} restaurantName={restaurant.name} />
          </Card>
        </div>

        {/* Navegación anclada */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
          <nav className="max-w-6xl mx-auto px-4 flex space-x-8 text-sm font-medium text-gray-700">
            <Link href="#about" className="py-3 border-b-2 border-transparent hover:border-green-700">Descripción</Link>
            <Link href="#hours" className="py-3 border-b-2 border-transparent hover:border-green-700">Horarios</Link>
            <Link href="#menu" className="py-3 border-b-2 border-transparent hover:border-green-700">Menú</Link>
            <Link href="#reviews" className="py-3 border-b-2 border-transparent hover:border-green-700">Opiniones</Link>
          </nav>
        </div>

        {/* Grid 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Columna izquierda */}
          <div className="space-y-6 lg:col-span-2">
            <RestaurantAbout description={restaurant.description ?? ""} />

            <RestaurantAmenities
              amenities={amenities.map(a => ({
                id: Number(a.id),
                name: a.name,
              }))}
            />

            {/* Menú */}
            {menuProducts && menuProducts.length > 0 && (
              <>
                <RestaurantMenu categories={menuCategories} products={menuProducts} />
                <MenuJsonLdServer
                  restaurantName={restaurant.name}
                  categories={menuCategories}
                  products={menuProducts}
                  priceCurrency="MXN"
                />
              </>
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6 lg:col-span-1">
            <HoursTableClient hours={hours} timezone={restaurant.timezone} />
            <MapRestaurantClient
              title="Ubicación"
              address={restaurant.address ?? ""}
              lat={typeof restaurant.lat === "number" ? restaurant.lat : undefined}
              lng={typeof restaurant.lng === "number" ? restaurant.lng : undefined}
              googleMapsLink={restaurant.google_maps_url ?? undefined}
              mapHeight={260}
            />
          </div>
        </div>

        {/* Opiniones */}
        <section id="reviews" className="mt-6 scroll-mt-20">
          <ReviewsSection
            initialReviews={transformedReviews.slice(0, 10)}
            averageRating={restaurant.rating_average ?? 0}
            totalReviews={restaurant.reviews_count || 0}
            canWriteReview
            restaurantId={restaurant.id}
            pageSize={10}
          />
        </section>

        <RestaurantJsonLdServer
          name={restaurant.name}
          address={restaurant.address}
          lat={restaurant.lat}
          lng={restaurant.lng}
          phone={restaurant.phone ?? undefined}
          website={restaurant.website ?? undefined}
          googleMapsUrl={restaurant.google_maps_url ?? undefined}
          priceRange={priceLevel?.symbol ?? undefined}
          ratingAverage={restaurant.rating_average ?? undefined}
          reviewsCount={restaurant.reviews_count ?? undefined}
          hours={hours.map(h => ({
            day: h.day,
            open_time: h.open_time,
            close_time: h.close_time,
            is_open: h.is_open,
          }))}
        />
      </div>
    </div>
  )
}
