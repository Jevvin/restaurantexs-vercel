"use client"

import { useState } from "react"
import { Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface RestaurantFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  availableAmenities: string[]
}

export interface FilterState {
  rating: number[]
  priceRange: string[]
  amenities: string[]
  openNow: boolean
}

export function RestaurantFilters({ onFiltersChange, availableAmenities }: RestaurantFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    rating: [],
    priceRange: [],
    amenities: [],
    openNow: false,
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const priceRanges = [
    { value: "budget", label: "Económico ($)", icon: "💰" },
    { value: "mid", label: "Gama Media ($$)", icon: "💰💰" },
    { value: "premium", label: "Premium ($$$)", icon: "💰💰💰" },
    { value: "luxury", label: "Lujo ($$$$)", icon: "💰💰💰💰" },
  ]

  const ratings = [5, 4, 3, 2, 1]

  const activeFiltersCount =
    filters.rating.length + filters.priceRange.length + filters.amenities.length + (filters.openNow ? 1 : 0)

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </h3>
        {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
      </div>

      <div className="space-y-4">
        {/* Abierto ahora */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="openNow"
            checked={filters.openNow}
            onCheckedChange={(checked) => updateFilters({ openNow: checked as boolean })}
          />
          <label htmlFor="openNow" className="text-sm font-medium">
            Abierto ahora
          </label>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-medium mb-2">Calificación</h4>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating.includes(rating)}
                  onCheckedChange={(checked) => {
                    const newRating = checked ? [...filters.rating, rating] : filters.rating.filter((r) => r !== rating)
                    updateFilters({ rating: newRating })
                  }}
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-1">y más</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div>
          <h4 className="font-medium mb-2">Rango de Precio</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.value}`}
                  checked={filters.priceRange.includes(range.value)}
                  onCheckedChange={(checked) => {
                    const newPriceRange = checked
                      ? [...filters.priceRange, range.value]
                      : filters.priceRange.filter((p) => p !== range.value)
                    updateFilters({ priceRange: newPriceRange })
                  }}
                />
                <label htmlFor={`price-${range.value}`} className="text-sm">
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenidades */}
        <div>
          <h4 className="font-medium mb-2">Servicios</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    const newAmenities = checked
                      ? [...filters.amenities, amenity]
                      : filters.amenities.filter((a) => a !== amenity)
                    updateFilters({ amenities: newAmenities })
                  }}
                />
                <label htmlFor={`amenity-${amenity}`} className="text-sm">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Limpiar filtros */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const clearedFilters = {
                rating: [],
                priceRange: [],
                amenities: [],
                openNow: false,
              }
              setFilters(clearedFilters)
              onFiltersChange(clearedFilters)
            }}
            className="w-full"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
