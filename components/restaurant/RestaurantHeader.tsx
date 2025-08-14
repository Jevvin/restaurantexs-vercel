// components/restaurant/RestaurantHeader.tsx

import { Restaurant, PriceLevel, City } from "@/types/database"
import { Share2Icon, PencilIcon, HeartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import Link from "next/link"

interface Props {
  restaurant: Restaurant
  city: City | null
  categoryName?: string
  subcategoryName?: string
  priceLevel: PriceLevel | null
  /** Nuevos props para ranking real */
  rankInCity?: number
  totalInCity?: number
  /** Slugs reales */
  citySlug?: string
  categorySlug?: string
  subcategorySlug?: string
}

export function RestaurantHeader({
  restaurant,
  categoryName,
  subcategoryName,
  priceLevel,
  city,
  rankInCity,
  totalInCity,
  citySlug,
  categorySlug,
  subcategorySlug
}: Props) {
  const rating = restaurant.rating_average || 0
  const reviewsCount = restaurant.reviews_count || 0

  const breadcrumbItems = [
    { label: "Rest", href: "/" },
    {
      label: `Restaurantes en ${city?.name || "Ciudad"}`,
      href: `/${citySlug || city?.slug || "#"}`,
    },
    categoryName
      ? { label: categoryName, href: citySlug && categorySlug ? `/${citySlug}/${categorySlug}` : undefined }
      : null,
  
subcategoryName
  ? { label: subcategoryName, href: citySlug && categorySlug && subcategorySlug ? `/${citySlug}/${categorySlug}/${subcategorySlug}` : undefined }
  : null,

    { label: restaurant.name },
  ].filter(Boolean) as { label: string; href?: string }[]

  return (
    <header className="w-full mb-4 space-y-2">
      {/* Breadcrumbs visuales */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Título y botones */}
      <div className="flex flex-wrap items-start sm:items-center gap-2 sm:justify-between">
        <h1 className="flex-1 min-w-0 text-2xl sm:text-3xl font-bold break-words sm:break-normal">
          {restaurant.name}
        </h1>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <DesktopActions />
          <MobileActions />
        </div>
      </div>

      {/* Segunda línea: rating, ranking, categorías */}
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-muted-foreground">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="font-medium text-black">{rating.toFixed(1)}</span>
          <div className="flex gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < Math.round(rating) ? "bg-green-700" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <Link href="#reviews" className="underline">
            ({reviewsCount} opiniones)
          </Link>
        </div>

        {/* Ranking */}
        {rankInCity && totalInCity && city?.name && (
          <Link href={`/${citySlug || city?.slug}`} className="underline">
            #{rankInCity} de {totalInCity} restaurantes en {city?.name}
          </Link>
        )}

        {/* Categoría / Subcategoría / Precio */}
        <div className="text-muted-foreground">
          {categoryName && (
            <Link
              href={citySlug && categorySlug ? `/${citySlug}/${categorySlug}` : "#"}
              className="underline"
            >
              {categoryName}
            </Link>
          )}
          {subcategoryName && (
            <>
              {categoryName && ", "}
              <Link
  href={citySlug && categorySlug && subcategorySlug ? `/${citySlug}/${categorySlug}/${subcategorySlug}` : "#"}
  className="underline"
>
  {subcategoryName}
</Link>
            </>
          )}
          {priceLevel?.symbol && (
            <>
              {" • "}
              <span>{priceLevel.symbol}</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

// ✅ Botones visibles en desktop
function DesktopActions() {
  return (
    <div className="hidden sm:flex gap-2">
      <Button variant="ghost" size="sm" className="text-xs px-2 py-1">
        <Share2Icon className="w-4 h-4 mr-1" /> Compartir
      </Button>
      <Button variant="ghost" size="sm" className="text-xs px-2 py-1">
        <PencilIcon className="w-4 h-4 mr-1" /> Opinión
      </Button>
      <Button variant="outline" size="sm" className="text-xs px-2 py-1">
        <HeartIcon className="w-4 h-4 mr-1" /> Guardar
      </Button>
    </div>
  )
}

// ✅ Botones visibles en mobile
function MobileActions() {
  return (
    <div className="flex sm:hidden gap-2">
      <Button variant="ghost" size="icon" className="p-2">
        <Share2Icon className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="text-xs px-2 py-1">
        <HeartIcon className="w-4 h-4 mr-1" /> Guardar
      </Button>
    </div>
  )
}
