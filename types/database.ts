// types/database.ts

// 🏙️ Ciudades
export interface City {
  id: string
  name: string
  slug: string
  state: string
  lat: number
  lng: number
  created_at: string
}

// 🏷️ Categorías y subcategorías
export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  sort_order: number
  created_at: string
}

export interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

// 💲 Nivel de precios
export interface PriceLevel {
  id: string
  name: string
  symbol: string         // Ej: "Gourmet", "Gama Alta"
  description: string  // Ej: "$$$$"
  created_at: string
}

// 🍽️ Restaurantes
export interface Restaurant {
  id: string
  owner_id?: string
  city_id: string
  category_id: string
  subcategory_id?: string
  name: string
  slug: string
  tagline?: string
  description?: string
  address: string
  lat: number
  lng: number
  google_maps_url?: string
  phone?: string
  website?: string
  cover_image_url?: string
  logo_image_url?: string
  price_level_id?: string // FK a PriceLevel
  rating_average?: number
  reviews_count?: number
  is_claimed: boolean
  is_approved: boolean
  created_at: string
  timezone: string
  hours: RestaurantHour[]
}

// 🖼️ Imágenes
export interface RestaurantImage {
  id: string
  restaurant_id: string
  url: string
  type: "main" | "interior" | "food" | "menu" // para separar galerías
  created_at: string
}

// 🕐 Horarios
export interface RestaurantHour {
  id: string
  restaurant_id: string
  day: number
  open_time: string
  close_time: string
  is_open: boolean
}


// ✅ Amenidades
export interface Amenity {
  id: string
  name: string
}

// 🧑‍🤝‍🧑 Relación: restaurante - amenidad
export interface RestaurantAmenity {
  id: string
  restaurant_id: string
  amenity_id: string
}

// 🥗 Opciones dietéticas
export interface DietaryOption {
  id: string
  name: string
}

// Relación: restaurante - opción dietética
export interface RestaurantDietaryOption {
  id: string
  restaurant_id: string
  dietary_option_id: string
}

// 📋 Menú - categorías
export interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  description?: string
  sort_order: number
  is_active: boolean
}

// 📦 Menú - productos
export interface MenuProduct {
  id: string
  restaurant_id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url?: string
  label?: string // "NUEVO", "OFERTA", etc.
  sort_order: number
  is_available: boolean
}

// 🌟 Reseñas
export interface Review {
  id: string
  restaurant_id: string
  user_id: string
  rating: number
  comment: string
  images?: string[]
  created_at: string
}

// ❓ Preguntas frecuentes
export interface Question {
  id: string
  restaurant_id: string
  user_id: string
  question: string
  answer?: string
  answered_by?: string
  created_at: string
}

// ❤️ Favoritos
export interface FavoriteList {
  id: string
  user_id: string
  name: string
  is_public: boolean
  created_at: string
}

export interface Favorite {
  user_id: string
  restaurant_id: string
  list_id?: string
  created_at: string
}

export type DatabaseReview = {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  restaurant_id: string
  rating: number
  comment: string
  images?: string[]
  created_at: string
  owner_response?: string
}

export type DatabasePromotion = {
  id: string
  title: string
  description?: string
  valid_until?: string
  is_active: boolean
}

export type DatabaseMenuItem = {
  id: string
  name: string
  description?: string
  price: number
  category: string
  image_url?: string
}
