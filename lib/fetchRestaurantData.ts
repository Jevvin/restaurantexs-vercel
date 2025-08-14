// lib/fetchRestaurantData.ts

import { createClient } from "@/lib/supabaseServer"
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
  Review,
  PriceLevel,
} from "@/types/database"

interface CategorizedImages {
  main: RestaurantImage | null
  interior: RestaurantImage[]
  food: RestaurantImage[]
  menu: RestaurantImage[]
  all: string[]
}

interface FullRestaurantData {
  restaurant: Restaurant | null
  city: City | null
  category: Category | null
  subcategories: Subcategory[]
  images: RestaurantImage[]
  categorizedImages: CategorizedImages
  hours: RestaurantHour[]
  amenities: Amenity[]
  dietaryOptions: DietaryOption[]
  menuCategories: MenuCategory[]
  menuProducts: MenuProduct[]
  reviews: Review[]
  priceLevel: PriceLevel | null
  restaurantSubcategories: (Subcategory & { category: Category })[]
}

export async function fetchRestaurantData(slug: string): Promise<FullRestaurantData> {
  const supabase = createClient()

  const { data: restaurant, error: err1 } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single()

  if (err1 || !restaurant) {
    return {
      restaurant: null,
      city: null,
      category: null,
      subcategories: [],
      images: [],
      categorizedImages: {
        main: null,
        interior: [],
        food: [],
        menu: [],
        all: [],
      },
      hours: [],
      amenities: [],
      dietaryOptions: [],
      menuCategories: [],
      menuProducts: [],
      reviews: [],
      priceLevel: null,
      restaurantSubcategories: [],
    }
  }

  const [
    { data: city },
    { data: category },
    { data: subcategories },
    { data: restaurantSubcategoriesRaw },
    { data: images },
    { data: hours },
    { data: amenitiesRaw },
    { data: dietaryOptionsRaw },
    { data: menuCategories },
    { data: menuProducts },
    { data: reviews },
    { data: priceLevel },
  ] = await Promise.all([
    supabase.from("cities").select("*").eq("id", restaurant.city_id).single(),

    supabase
      .from("categories")
      .select("id, name, slug, icon, sort_order, created_at")
      .eq("id", restaurant.category_id)
      .single(),

    supabase
      .from("subcategories")
      .select("id, category_id, name, slug, sort_order, created_at")
      .eq("category_id", restaurant.category_id),

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
  .eq("restaurant_id", restaurant.id),
  

    supabase.from("restaurant_images").select("*").eq("restaurant_id", restaurant.id),

    supabase
      .from("restaurant_hours")
      .select("id, restaurant_id, day, open_time, close_time, is_open")
      .eq("restaurant_id", restaurant.id),

    supabase
      .from("restaurant_amenities")
      .select("amenities:amenity_id(*)")
      .eq("restaurant_id", restaurant.id),

    supabase
      .from("restaurant_dietary_options")
      .select("options:dietary_option_id(*)")
      .eq("restaurant_id", restaurant.id),

    supabase.from("menu_categories").select("*").eq("restaurant_id", restaurant.id),
    supabase.from("menu_products").select("*").eq("restaurant_id", restaurant.id),
    supabase.from("reviews").select("*").eq("restaurant_id", restaurant.id),
    supabase.from("price_levels").select("*").eq("id", restaurant.price_level_id).single(),
  ])

  const amenities: Amenity[] = (amenitiesRaw || []).flatMap((a) => a.amenities)
  const dietaryOptions: DietaryOption[] = (dietaryOptionsRaw || []).flatMap((d) => d.options)

  const categorizedImages: CategorizedImages = {
    main: (images || []).find((img) => img.type === "main") || null,
    interior: (images || []).filter((img) => img.type === "interior"),
    food: (images || []).filter((img) => img.type === "food"),
    menu: (images || []).filter((img) => img.type === "menu"),
    all: (images || []).map((img) => img.url),
  }

  const restaurantSubcategories: (Subcategory & { category: Category })[] =
  (restaurantSubcategoriesRaw || []).map((r) => {
    const sub: any = r.subcategory_id
    return {
      ...sub,
      category: Array.isArray(sub.category) ? sub.category[0] : sub.category,
    }
  })

  return {
    restaurant,
    city: city || null,
    category: category || null,
    subcategories: subcategories || [],
    images: images || [],
    categorizedImages,
    hours: hours || [],
    amenities,
    dietaryOptions,
    menuCategories: menuCategories || [],
    menuProducts: menuProducts || [],
    reviews: reviews || [],
    priceLevel: priceLevel || null,
    restaurantSubcategories,
  }
}
