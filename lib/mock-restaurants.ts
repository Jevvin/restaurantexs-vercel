import { mockRestaurants, mockCities, mockCategories, mockReviews, getUniqueAmenities } from "./mock-data"
import type { Restaurant, Review, Promotion, MenuItem } from "@/types/restaurant"

// Simular delay de red para hacer más realista
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Obtener restaurantes por ciudad
export async function getRestaurantsByCity(citySlug: string): Promise<Restaurant[]> {
  await delay(300) // Simular latencia de red

  const city = mockCities.find((c) => c.slug === citySlug)
  if (!city) {
    console.log(`City not found: ${citySlug}`)
    return []
  }

  const restaurants = mockRestaurants.filter((r) => r.city === citySlug)
  console.log(`Found ${restaurants.length} restaurants in ${city.name}`)
  return restaurants
}

// Obtener restaurantes por ciudad y categoría
export async function getRestaurantsByCityAndCategory(citySlug: string, categorySlug: string): Promise<Restaurant[]> {
  await delay(300)

  const city = mockCities.find((c) => c.slug === citySlug)
  const category = mockCategories.find((c) => c.slug === categorySlug)

  if (!city || !category) {
    console.log(`City or category not found: ${citySlug}, ${categorySlug}`)
    return []
  }

  const restaurants = mockRestaurants.filter((r) => r.city === citySlug && r.category === categorySlug)
  console.log(`Found ${restaurants.length} restaurants in ${city.name} for category ${category.name}`)
  return restaurants
}

// Obtener un restaurante por slug
export async function getRestaurantBySlug(restaurantSlug: string): Promise<Restaurant | null> {
  await delay(200)

  const restaurant = mockRestaurants.find((r) => r.slug === restaurantSlug)
  if (!restaurant) {
    console.log(`Restaurant not found: ${restaurantSlug}`)
    return null
  }

  console.log(`Found restaurant: ${restaurant.name}`)
  return restaurant
}

// Obtener promociones de un restaurante
export async function getRestaurantPromotions(restaurantId: string): Promise<Promotion[]> {
  await delay(150)

  const restaurant = mockRestaurants.find((r) => r.id === restaurantId)
  if (!restaurant) return []

  return restaurant.promotions || []
}

// Obtener menú de un restaurante
export async function getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
  await delay(150)

  const restaurant = mockRestaurants.find((r) => r.id === restaurantId)
  if (!restaurant) return []

  return restaurant.menu || []
}

// Obtener reseñas de un restaurante
export async function getRestaurantReviews(restaurantId: string): Promise<Review[]> {
  await delay(200)

  // Simular reciclar las mismas opiniones para todos los restaurantes
  // Devolver un subconjunto fijo de reseñas, por ejemplo, las primeras 3
  const recycledReviews = mockReviews.slice(0, 3)
  console.log(`Recycling ${recycledReviews.length} reviews for restaurant ${restaurantId}`)
  return recycledReviews
}

// Obtener ciudad por slug
export async function getCityBySlug(citySlug: string) {
  await delay(100)

  const city = mockCities.find((c) => c.slug === citySlug)
  if (!city) {
    console.log(`City not found: ${citySlug}`)
    return null
  }

  return city
}

// Obtener categoría por slug
export async function getCategoryBySlug(categorySlug: string) {
  await delay(100)

  const category = mockCategories.find((c) => c.slug === categorySlug)
  if (!category) {
    console.log(`Category not found: ${categorySlug}`)
    return null
  }

  return category
}

// Obtener todas las amenidades disponibles
export async function getAvailableAmenities(): Promise<string[]> {
  await delay(100)
  return getUniqueAmenities()
}

// Obtener datos para la página principal
export async function getHomePageData() {
  await delay(400)

  return {
    cities: mockCities,
    categories: mockCategories,
    totalRestaurants: mockRestaurants.length,
    totalReviews: mockReviews.length,
  }
}

// Buscar restaurantes (función adicional para futuras funcionalidades)
export async function searchRestaurants(query: string, citySlug?: string): Promise<Restaurant[]> {
  await delay(300)

  let restaurants = mockRestaurants
  if (citySlug) {
    restaurants = restaurants.filter((r) => r.city === citySlug)
  }

  const searchTerm = query.toLowerCase()
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm) ||
      r.description.toLowerCase().includes(searchTerm) ||
      r.amenities.some((a) => a.toLowerCase().includes(searchTerm)),
  )
}

// Nueva función para obtener restaurantes por rango de precio (para el carrusel)
export async function getRestaurantsByPriceRange(
  priceRange: "budget" | "mid" | "premium" | "luxury",
  limit = 10,
  excludeRestaurantId?: string,
): Promise<Restaurant[]> {
  await delay(250)
  let filteredRestaurants = mockRestaurants.filter((r) => r.priceRange === priceRange)

  if (excludeRestaurantId) {
    filteredRestaurants = filteredRestaurants.filter((r) => r.id !== excludeRestaurantId)
  }

  // Shuffle and take limit
  return filteredRestaurants.sort(() => 0.5 - Math.random()).slice(0, limit)
}
