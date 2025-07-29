import { supabase, type DatabaseReview, type DatabasePromotion, type DatabaseMenuItem } from "./supabase"
import type { Restaurant, Review, Promotion, MenuItem } from "@/types/restaurant"

// Convertir datos de la base de datos al tipo de la aplicación
function convertDatabaseRestaurant(dbRestaurant: any): Restaurant {
  // Parsear coordenadas del formato "(-86.8515,21.1619)"
  let coordinates = { lat: 0, lng: 0 }
  if (dbRestaurant.coordinates) {
    const coordString = dbRestaurant.coordinates.replace(/[()]/g, "")
    const [lng, lat] = coordString.split(",").map((coord: string) => Number.parseFloat(coord.trim()))
    coordinates = { lat: lat || 0, lng: lng || 0 }
  }

  return {
    id: dbRestaurant.id,
    name: dbRestaurant.name,
    slug: dbRestaurant.slug,
    tagline: dbRestaurant.tagline || "",
    description: dbRestaurant.description || "",
    category: dbRestaurant.category_slug || "",
    city: dbRestaurant.city_slug || "",
    state: dbRestaurant.city_state || "",
    address: dbRestaurant.address,
    coordinates,
    googleMapsLink: dbRestaurant.google_maps_link,
    rating: dbRestaurant.rating,
    reviewCount: dbRestaurant.review_count,
    priceRange: dbRestaurant.price_range,
    images: dbRestaurant.images || [],
    amenities: dbRestaurant.amenities || [],
    promotions: [], // Se carga por separado
    menu: [], // Se carga por separado
    hours: dbRestaurant.business_hours || {},
    isOpen: dbRestaurant.is_open,
    isClaimed: dbRestaurant.is_claimed,
    ownerId: dbRestaurant.owner_id,
  }
}

function convertDatabaseReview(dbReview: DatabaseReview): Review {
  return {
    id: dbReview.id,
    userId: dbReview.user_id || "",
    userName: dbReview.user_name,
    userAvatar: dbReview.user_avatar,
    restaurantId: dbReview.restaurant_id,
    rating: dbReview.rating,
    comment: dbReview.comment,
    images: dbReview.images,
    createdAt: dbReview.created_at,
    ownerResponse: dbReview.owner_response,
  }
}

function convertDatabasePromotion(dbPromotion: DatabasePromotion): Promotion {
  return {
    id: dbPromotion.id,
    title: dbPromotion.title,
    description: dbPromotion.description || "",
    validUntil: dbPromotion.valid_until || "",
    isActive: dbPromotion.is_active,
  }
}

function convertDatabaseMenuItem(dbMenuItem: DatabaseMenuItem): MenuItem {
  return {
    id: dbMenuItem.id,
    name: dbMenuItem.name,
    description: dbMenuItem.description || "",
    price: dbMenuItem.price || 0,
    category: dbMenuItem.category || "",
    image: dbMenuItem.image_url,
  }
}

// Obtener restaurantes por ciudad usando consultas separadas
export async function getRestaurantsByCity(citySlug: string) {
  try {
    console.log("Fetching city with slug:", citySlug)

    // Primero obtenemos la ciudad - usar select() sin single() para debug
    const { data: cities, error: cityError } = await supabase
      .from("cities")
      .select("id, name, slug, state")
      .eq("slug", citySlug)

    console.log("Cities query result:", { cities, cityError })

    if (cityError) {
      console.error("Error fetching city:", cityError)
      return []
    }

    if (!cities || cities.length === 0) {
      console.error("No city found with slug:", citySlug)
      return []
    }

    if (cities.length > 1) {
      console.warn("Multiple cities found with slug:", citySlug, cities)
    }

    const city = cities[0] // Tomar la primera ciudad

    console.log("Using city:", city)

    // Luego obtenemos los restaurantes de esa ciudad
    const { data: restaurants, error: restaurantsError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("city_id", city.id)
      .order("rating", { ascending: false })

    console.log("Restaurants query result:", { count: restaurants?.length, restaurantsError })

    if (restaurantsError) {
      console.error("Error fetching restaurants:", restaurantsError)
      return []
    }

    if (!restaurants || restaurants.length === 0) {
      console.log("No restaurants found for city:", city.name)
      return []
    }

    // Obtener las categorías de los restaurantes
    const categoryIds = [...new Set(restaurants.map((r) => r.category_id).filter(Boolean))]
    console.log("Category IDs:", categoryIds)

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, slug")
      .in("id", categoryIds)

    console.log("Categories query result:", { categories, categoriesError })

    // Combinar los datos
    const restaurantsWithDetails = restaurants.map((restaurant) => ({
      ...restaurant,
      city_slug: city.slug,
      city_state: city.state,
      category_slug: categories?.find((c) => c.id === restaurant.category_id)?.slug || "",
    }))

    const convertedRestaurants = restaurantsWithDetails.map(convertDatabaseRestaurant)
    console.log("Converted restaurants count:", convertedRestaurants.length)

    return convertedRestaurants
  } catch (error) {
    console.error("Unexpected error in getRestaurantsByCity:", error)
    return []
  }
}

// Obtener restaurantes por ciudad y categoría
export async function getRestaurantsByCityAndCategory(citySlug: string, categorySlug: string) {
  try {
    console.log("Fetching city and category:", { citySlug, categorySlug })

    // Obtener ciudad y categoría por separado para mejor debugging
    const { data: cities, error: cityError } = await supabase
      .from("cities")
      .select("id, name, slug, state")
      .eq("slug", citySlug)

    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("slug", categorySlug)

    console.log("Query results:", { cities, categories, cityError, categoryError })

    if (cityError || categoryError) {
      console.error("Error fetching city or category:", { cityError, categoryError })
      return []
    }

    if (!cities || cities.length === 0) {
      console.error("No city found with slug:", citySlug)
      return []
    }

    if (!categories || categories.length === 0) {
      console.error("No category found with slug:", categorySlug)
      return []
    }

    const city = cities[0]
    const category = categories[0]

    // Obtener restaurantes
    const { data: restaurants, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("city_id", city.id)
      .eq("category_id", category.id)
      .order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching restaurants:", error)
      return []
    }

    if (!restaurants || restaurants.length === 0) {
      console.log("No restaurants found for city/category:", { city: city.name, category: category.name })
      return []
    }

    // Combinar datos
    const restaurantsWithDetails = restaurants.map((restaurant) => ({
      ...restaurant,
      city_slug: city.slug,
      city_state: city.state,
      category_slug: category.slug,
    }))

    return restaurantsWithDetails.map(convertDatabaseRestaurant)
  } catch (error) {
    console.error("Unexpected error in getRestaurantsByCityAndCategory:", error)
    return []
  }
}

// Obtener un restaurante por slug
export async function getRestaurantBySlug(restaurantSlug: string) {
  try {
    console.log("Fetching restaurant with slug:", restaurantSlug)

    const { data: restaurants, error } = await supabase.from("restaurants").select("*").eq("slug", restaurantSlug)

    console.log("Restaurant query result:", { restaurants, error })

    if (error) {
      console.error("Error fetching restaurant:", error)
      return null
    }

    if (!restaurants || restaurants.length === 0) {
      console.error("No restaurant found with slug:", restaurantSlug)
      return null
    }

    const restaurant = restaurants[0]

    // Obtener ciudad y categoría
    const [{ data: cities }, { data: categories }] = await Promise.all([
      supabase.from("cities").select("name, slug, state").eq("id", restaurant.city_id),
      supabase.from("categories").select("name, slug").eq("id", restaurant.category_id),
    ])

    const city = cities?.[0]
    const category = categories?.[0]

    const restaurantWithDetails = {
      ...restaurant,
      city_slug: city?.slug || "",
      city_state: city?.state || "",
      category_slug: category?.slug || "",
    }

    return convertDatabaseRestaurant(restaurantWithDetails)
  } catch (error) {
    console.error("Unexpected error in getRestaurantBySlug:", error)
    return null
  }
}

// Obtener promociones de un restaurante
export async function getRestaurantPromotions(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching promotions:", error)
      return []
    }

    return data?.map(convertDatabasePromotion) || []
  } catch (error) {
    console.error("Unexpected error in getRestaurantPromotions:", error)
    return []
  }
}

// Obtener menú de un restaurante
export async function getRestaurantMenu(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("category", { ascending: true })

    if (error) {
      console.error("Error fetching menu:", error)
      return []
    }

    return data?.map(convertDatabaseMenuItem) || []
  } catch (error) {
    console.error("Unexpected error in getRestaurantMenu:", error)
    return []
  }
}

// Obtener reseñas de un restaurante
export async function getRestaurantReviews(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return []
    }

    return data?.map(convertDatabaseReview) || []
  } catch (error) {
    console.error("Unexpected error in getRestaurantReviews:", error)
    return []
  }
}

// Obtener ciudad por slug
export async function getCityBySlug(citySlug: string) {
  try {
    const { data: cities, error } = await supabase.from("cities").select("*").eq("slug", citySlug)

    if (error) {
      console.error("Error fetching city:", error)
      return null
    }

    if (!cities || cities.length === 0) {
      console.error("No city found with slug:", citySlug)
      return null
    }

    return cities[0]
  } catch (error) {
    console.error("Unexpected error in getCityBySlug:", error)
    return null
  }
}

// Obtener categoría por slug
export async function getCategoryBySlug(categorySlug: string) {
  try {
    const { data: categories, error } = await supabase.from("categories").select("*").eq("slug", categorySlug)

    if (error) {
      console.error("Error fetching category:", error)
      return null
    }

    if (!categories || categories.length === 0) {
      console.error("No category found with slug:", categorySlug)
      return null
    }

    return categories[0]
  } catch (error) {
    console.error("Unexpected error in getCategoryBySlug:", error)
    return null
  }
}

// Obtener todas las amenidades disponibles
export async function getAvailableAmenities() {
  try {
    const { data, error } = await supabase.from("restaurants").select("amenities")

    if (error) {
      console.error("Error fetching amenities:", error)
      return []
    }

    const amenitiesSet = new Set<string>()
    data?.forEach((restaurant) => {
      if (restaurant.amenities) {
        restaurant.amenities.forEach((amenity: string) => amenitiesSet.add(amenity))
      }
    })

    return Array.from(amenitiesSet).sort()
  } catch (error) {
    console.error("Unexpected error in getAvailableAmenities:", error)
    return []
  }
}
