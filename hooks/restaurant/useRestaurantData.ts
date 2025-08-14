"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import type {
  Restaurant,
  City,
  Category,
  Subcategory,
  MenuCategory,
  MenuProduct,
  Amenity,
  DietaryOption,
  RestaurantImage,
  RestaurantHour,
} from "@/types/database"

interface FullRestaurantData {
  restaurant: Restaurant | null
  city: City | null
  category: Category | null
  subcategories: Subcategory[]
  images: RestaurantImage[]
  hours: RestaurantHour[]
  amenities: Amenity[]
  dietaryOptions: DietaryOption[]
  menuCategories: MenuCategory[]
  menuProducts: MenuProduct[]
  restaurantSubcategories: (Subcategory & { category: Category })[]
  loading: boolean
  error: string | null
}

export function useRestaurantData(slug: string): FullRestaurantData {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [city, setCity] = useState<City | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [images, setImages] = useState<RestaurantImage[]>([])
  const [hours, setHours] = useState<RestaurantHour[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [dietaryOptions, setDietaryOptions] = useState<DietaryOption[]>([])
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [menuProducts, setMenuProducts] = useState<MenuProduct[]>([])
  const [restaurantSubcategories, setRestaurantSubcategories] = useState<
    (Subcategory & { category: Category })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: r, error: err1 } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single()

      if (err1 || !r) {
        setError("No se pudo cargar el restaurante")
        setLoading(false)
        return
      }

      setRestaurant(r)

      const [
        { data: c },
        { data: cat },
        { data: sub },
        { data: imgs },
        { data: hrs },
        { data: ams },
        { data: diets },
        { data: cats },
        { data: prods },
        { data: restaurantSubcategoriesRaw },
      ] = await Promise.all([
        supabase.from("cities").select("*").eq("id", r.city_id).single(),
        supabase.from("categories").select("*").eq("id", r.category_id).single(),
        supabase.from("subcategories").select("*").eq("category_id", r.category_id),
        supabase.from("restaurant_images").select("*").eq("restaurant_id", r.id),
        supabase.from("restaurant_hours").select("*").eq("restaurant_id", r.id),
        supabase
          .from("restaurant_amenities")
          .select("amenities:amenity_id(*)")
          .eq("restaurant_id", r.id),
        supabase
          .from("restaurant_dietary_options")
          .select("options:dietary_option_id(*)")
          .eq("restaurant_id", r.id),
        supabase.from("menu_categories").select("*").eq("restaurant_id", r.id),
        supabase.from("menu_products").select("*").eq("restaurant_id", r.id),
        supabase
          .from("restaurant_subcategories")
          .select(`
            subcategory_id (
              id, category_id, name, slug, sort_order, created_at,
              category:category_id (
                id, name, slug, icon, sort_order, created_at
              )
            )
          `)
          .eq("restaurant_id", r.id),
      ])

      const restaurantSubcategoriesClean: (Subcategory & { category: Category })[] =
        (restaurantSubcategoriesRaw || []).map((r: any) => {
          const sub = r.subcategory_id
          return {
            ...sub,
            category: Array.isArray(sub.category) ? sub.category[0] : sub.category,
          }
        })

      setCity(c || null)
      setCategory(cat || null)
      setSubcategories(sub || [])
      setImages(imgs || [])
      setHours(hrs || [])
      setAmenities((ams || []).flatMap((a) => a.amenities))
      setDietaryOptions((diets || []).flatMap((d) => d.options))
      setMenuCategories(cats || [])
      setMenuProducts(prods || [])
      setRestaurantSubcategories(restaurantSubcategoriesClean)
      setLoading(false)
    }

    fetchData()
  }, [slug])

  return {
    restaurant,
    city,
    category,
    subcategories,
    images,
    hours,
    amenities,
    dietaryOptions,
    menuCategories,
    menuProducts,
    restaurantSubcategories,
    loading,
    error,
  }
}

export default useRestaurantData
