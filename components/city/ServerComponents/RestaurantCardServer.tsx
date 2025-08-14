// components/city/ServerComponents/RestaurantCard.tsx
import Link from "next/link"
import { MapPin, Star, Utensils, Clock } from "lucide-react"
import type { Restaurant } from "@/types/restaurant"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

import GalleryServer from "@/components/city/ServerComponents/GalleryServer"
import GalleryControlsClient from "@/components/city/ClientComponents/GalleryControlsClient"
import FavoriteButtonClient from "@/components/city/ClientComponents/FavoriteButtonClient"

interface InfoLineProps {
  categories: string[]
  priceSymbol?: string
  openNow?: boolean
}

interface Props {
  restaurant: Restaurant
  infoLine?: InfoLineProps
  rank?: number
  reviewSnippets?: string[]
}

export function RestaurantCard({ restaurant, infoLine, rank, reviewSnippets }: Props) {
  const categorizedAll =
    (restaurant.categorizedImages?.all ?? [])
      .map((img: any) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean) as string[]

  const plainImages = Array.isArray(restaurant.images)
    ? (restaurant.images.filter(Boolean) as string[])
    : []

  const merged = [...categorizedAll, ...plainImages]
  const allImages =
    merged.length > 0
      ? merged.slice(-10)
      : [
          restaurant.categorizedImages?.food?.url ||
            restaurant.categorizedImages?.interior?.url ||
            restaurant.categorizedImages?.menu?.url ||
            "/placeholder.svg?height=240&width=320",
        ].filter(Boolean) as string[]

  const cats = infoLine?.categories?.filter(Boolean) ?? []
  const visibleCats = cats.slice(0, 3)
  const extraCats = cats.slice(3)
  const extraCount = extraCats.length
  const Dot = () => <span className="mx-1 text-muted-foreground">•</span>
  const truncateWords = (t: string, n: number) => (t || "").trim().split(/\s+/).slice(0, n).join(" ")

  const galleryId = `gal-${restaurant.id}`

  return (
    <Card className="group w-full overflow-hidden">
      <div className="flex w-full flex-col md:flex-row gap-4 p-4">
        {/* Galería */}
        <div className="relative shrink-0 w-full md:w-56 h-56 md:h-40 rounded-lg overflow-hidden bg-muted">
          <GalleryServer
            images={allImages}
            altBase={restaurant.name}
            containerId={galleryId}
            sizes="(min-width: 768px) 224px, 100vw"
            mobilePeek={false}   // ← sin peek: ocupa 100%, sin huecos
          />
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButtonClient />
          </div>
          <GalleryControlsClient containerId={galleryId} />
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold truncate">
            {rank ? `${rank}. ` : ""}{restaurant.name}
          </h3>

          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-foreground">
                {Number.isFinite(restaurant.rating as number)
                  ? (restaurant.rating as number).toFixed(1)
                  : "0.0"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({restaurant.reviewCount} opiniones)
            </span>
          </div>

          <div className="mt-1 text-sm text-muted-foreground flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Utensils className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="truncate">{visibleCats.join(", ")}</span>
            </span>

            {extraCount > 0 && (
              <>
                <span>,&nbsp;</span>
                <HoverCard openDelay={100}>
                  <HoverCardTrigger asChild>
                    <span
                      role="button"
                      tabIndex={0}
                      className="underline underline-offset-2 hover:text-foreground focus:outline-none"
                      aria-label={`Ver ${extraCount} categorías adicionales`}
                    >
                      +{extraCount} más
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 text-sm">
                    <div className="font-medium mb-1">Más categorías</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {extraCats.map((c, i) => (
                        <li key={`${c}-${i}`}>{c}</li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </>
            )}

            {(cats.length > 0 && (infoLine?.priceSymbol || typeof infoLine?.openNow === "boolean")) && <Dot />}
            {infoLine?.priceSymbol && <span>{infoLine.priceSymbol}</span>}
            {(infoLine?.priceSymbol && typeof infoLine?.openNow === "boolean") && <Dot />}
            {typeof infoLine?.openNow === "boolean" && (
              <span className={`inline-flex items-center gap-1 ${infoLine.openNow ? "text-green-700" : ""}`}>
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {infoLine.openNow ? "Abierto ahora" : "Cerrado ahora"}
              </span>
            )}
          </div>

          {restaurant.tagline && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {restaurant.tagline}
            </p>
          )}

          {Array.isArray(reviewSnippets) && reviewSnippets.length > 0 && (
            <div className="mt-2 space-y-1">
              {reviewSnippets.slice(0, 2).map((c, i) => (
                <p key={i} className="text-xs text-muted-foreground italic">“{truncateWords(c, 5)}”</p>
              ))}
            </div>
          )}

          {restaurant.address && (
            <div className="mt-3 pt-3 border-t flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{restaurant.address}</span>
            </div>
          )}

          <div className="mt-3">
            <Button asChild size="sm" variant="secondary">
              <Link href={`/r/${restaurant.slug}`}>Ver restaurante</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
