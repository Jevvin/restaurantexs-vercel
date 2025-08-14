// components/city/RestaurantCard.tsx
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, ChevronLeft, ChevronRight, Utensils, Clock } from "lucide-react"
import type { Restaurant } from "@/types/restaurant"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface InfoLineProps {
  categories: string[]
  priceSymbol?: string
  openNow?: boolean
}

interface Props {
  restaurant: Restaurant
  infoLine?: InfoLineProps
  rank?: number
  reviewSnippets?: string[] // 👈 dos reseñas ya truncadas desde el padre
}

export function RestaurantCard({ restaurant, infoLine, rank, reviewSnippets }: Props) {
  // Reunimos imágenes y limitamos a las últimas 10
  const allImages = useMemo(() => {
    const categorizedAll =
      (restaurant.categorizedImages?.all ?? [])
        .map((img: any) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean) as string[]

    const plainImages = Array.isArray(restaurant.images)
      ? (restaurant.images.filter(Boolean) as string[])
      : []

    const merged = [...categorizedAll, ...plainImages]
    if (merged.length > 0) return merged.slice(-10)

    const fallback =
      restaurant.categorizedImages?.food?.url ||
      restaurant.categorizedImages?.interior?.url ||
      restaurant.categorizedImages?.menu?.url ||
      "/placeholder.svg?height=240&width=320"

    return [fallback].filter(Boolean) as string[]
  }, [restaurant.categorizedImages, restaurant.images])

  const [index, setIndex] = useState(0)
  const totalImages = allImages.length

  const goPrev = () => setIndex((i) => (i - 1 + totalImages) % totalImages)
  const goNext = () => setIndex((i) => (i + 1) % totalImages)

  function Dot() {
    return <span className="mx-1 text-muted-foreground">•</span>
  }

  // Helpers locales por si llegan reseñas largas (defensa extra)
  const truncateWords = (txt: string, n: number) => {
    const parts = txt.trim().split(/\s+/)
    return parts.slice(0, n).join(" ")
  }

  const cats = infoLine?.categories?.filter(Boolean) ?? []
  const visibleCats = cats.slice(0, 3)
  const extraCats = cats.slice(3)
  const extraCount = extraCats.length

  return (
    <Card className="group w-full overflow-hidden">
      <div className="flex w-full flex-col sm:flex-row gap-4 p-4">
        {/* Izquierda: galería */}
        <div
          className="relative shrink-0 w-full sm:w-56 h-40 rounded-lg overflow-hidden bg-muted"
          role="group"
          aria-roledescription="Carrusel de imágenes"
          aria-label={`Galería de ${restaurant.name}`}
        >
          <div className="relative h-full w-full">
            {allImages.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
                aria-hidden={i !== index}
              >
                <Image
                  src={src}
                  alt={`${restaurant.name} — foto ${i + 1} de ${totalImages}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 224px, 100vw"
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          <span className="sr-only">Mostrando imagen {index + 1} de {totalImages}</span>

          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Imagen anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Siguiente imagen"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Derecha: contenido sin link global */}
        <div className="min-w-0 flex-1 flex flex-col">
          {/* Título */}
          <h3 className="text-lg font-semibold truncate">
            {rank ? `${rank}. ` : ""}{restaurant.name}
          </h3>

          {/* ⭐ Rating y número de opiniones — arriba de categorías */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-foreground">
                {Number.isFinite(restaurant.rating as number) ? (restaurant.rating as number).toFixed(1) : "0.0"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({restaurant.reviewCount} opiniones)
            </span>
          </div>

          {/* Línea de categorías / precio / abierto */}
          <div className="mt-1 text-sm text-muted-foreground flex flex-wrap items-center gap-2">
            {/* Icono de tipos de comida */}
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

            {/* Precio */}
            {infoLine?.priceSymbol && <span>{infoLine.priceSymbol}</span>}

            {/* Separador y estado abierto/cerrado con reloj */}
            {(infoLine?.priceSymbol && typeof infoLine?.openNow === "boolean") && <Dot />}
            {typeof infoLine?.openNow === "boolean" && (
              <span className={`inline-flex items-center gap-1 ${infoLine.openNow ? "text-green-700" : ""}`}>
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {infoLine.openNow ? "Abierto ahora" : "Cerrado ahora"}
              </span>
            )}
          </div>

          {/* 📝 Tagline — debajo de categorías */}
          {restaurant.tagline && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {restaurant.tagline}
            </p>
          )}

          {/* 💬 2 comentarios positivos más recientes (máx 5 palabras c/u) */}
          {Array.isArray(reviewSnippets) && reviewSnippets.length > 0 && (
            <div className="mt-2 space-y-1">
              {reviewSnippets.slice(0, 2).map((c, i) => (
                <p key={i} className="text-xs text-muted-foreground italic">
                  “{truncateWords(c, 5)}”
                </p>
              ))}
            </div>
          )}

          {/* Dirección */}
          {restaurant.address && (
            <div className="mt-3 pt-3 border-t flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{restaurant.address}</span>
            </div>
          )}

          {/* Botón "Ver restaurante" */}
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
