// hooks/city/useFilteredRestaurants.ts

"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { getRestaurantsWithFilters } from "@/lib/restaurants"
import type { RestaurantWithFilters } from "@/types/restaurant"

export function useFilteredRestaurants(citySlug: string) {
  const searchParams = useSearchParams()
  const [allRestaurants, setAllRestaurants] = useState<RestaurantWithFilters[]>([])
  const [loading, setLoading] = useState(true)

  const filters = useMemo(() => {
    return {
      subcategories: searchParams.getAll("subcategory"),
      amenities: searchParams.getAll("amenity"),
      dietary: searchParams.getAll("dietary"),
      priceLevels: searchParams.getAll("price"),
    }
  }, [searchParams])

  // Cargar restaurantes solo una vez por ciudad
  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true)
      const data = await getRestaurantsWithFilters(citySlug)
      setAllRestaurants(data)
      setLoading(false)
    }

    fetchRestaurants()
  }, [citySlug])

  // Filtrar en memoria
  const filteredRestaurants = useMemo(() => {
    return allRestaurants.filter((r) => {
      const matchSubcategories =
        filters.subcategories.length === 0 ||
        r.subcategories?.some((s) => filters.subcategories.includes(s.id))

      const matchAmenities =
        filters.amenities.length === 0 ||
        r.amenities?.some((a) => filters.amenities.includes(a.id))

      const matchDietary =
        filters.dietary.length === 0 ||
        r.dietary_options?.some((d) => filters.dietary.includes(d.id))

      const matchPrice =
        filters.priceLevels.length === 0 ||
        filters.priceLevels.includes(r.price_level_id || "")

      return matchSubcategories && matchAmenities && matchDietary && matchPrice
    })
  }, [allRestaurants, filters])

  return {
    restaurants: filteredRestaurants,
    loading,
  }
}
