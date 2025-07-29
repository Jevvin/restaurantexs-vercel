"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Star, Heart, MapPin } from "lucide-react"
import type { Restaurant } from "@/types/restaurant"
import { formatRating, formatReviewCount, truncateText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RestaurantCardProps {
  restaurant: Restaurant
  showDistance?: boolean
  distance?: number
  onFavoriteToggle?: (restaurantId: string) => void
  isFavorited?: boolean
}

export function RestaurantCard({
  restaurant,
  showDistance,
  distance,
  onFavoriteToggle,
  isFavorited = false,
}: RestaurantCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.(restaurant.id)
  }

  return (
    <Link href={`/${restaurant.city}/${restaurant.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="flex">
          {/* Imagen */}
          <div className="relative w-48 h-40 flex-shrink-0">
            <Image
              src={restaurant.images[0] || "/placeholder.svg?height=160&width=192"}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleFavoriteClick}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
            <div className="absolute bottom-2 left-2">
              <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                {restaurant.isOpen ? "Abierto" : "Cerrado"}
              </Badge>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{restaurant.category}</p>
              </div>
              {showDistance && distance && <div className="text-sm text-gray-500">{distance.toFixed(1)} km</div>}
            </div>

            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{formatRating(restaurant.rating)}</span>
                <span className="ml-1 text-sm text-gray-500">({formatReviewCount(restaurant.reviewCount)})</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{truncateText(restaurant.description, 20)}</p>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{restaurant.address}</span>
            </div>

            {/* Amenidades principales */}
            <div className="flex flex-wrap gap-1 mb-3">
              {restaurant.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {restaurant.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{restaurant.amenities.length - 3} más
                </Badge>
              )}
            </div>

            {/* Últimas reseñas */}
            <div className="border-t pt-2">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 italic">"Excelente comida y servicio..."</p>
                <p className="text-xs text-gray-500 italic">"Ambiente familiar y acogedor..."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
