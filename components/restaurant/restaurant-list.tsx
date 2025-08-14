"use client"

import { useState } from "react"
import type { Restaurant } from "@/types/restaurant"
import { RestaurantCard } from "@/components/restaurant/restaurant-card"

interface RestaurantListProps {
  restaurants: Restaurant[]
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())

  const handleFavoriteToggle = (restaurantId: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(restaurantId)) {
        newSet.delete(restaurantId)
      } else {
        newSet.add(restaurantId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isFavorited={favoriteIds.has(restaurant.id)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      ))}
    </div>
  )
}
