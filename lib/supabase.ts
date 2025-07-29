import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface DatabaseRestaurant {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  category_id: string
  city_id: string
  address: string
  coordinates: any // PostGIS Point
  google_maps_link: string | null
  rating: number
  review_count: number
  price_range: "budget" | "mid" | "premium" | "luxury"
  images: string[]
  amenities: string[]
  business_hours: any
  is_open: boolean
  is_claimed: boolean
  owner_id: string | null
  created_at: string
  updated_at: string
  cities: {
    name: string
    slug: string
    state: string
  }
  categories: {
    name: string
    slug: string
  }
}

export interface DatabaseReview {
  id: string
  restaurant_id: string
  user_id: string | null
  user_name: string
  user_avatar: string | null
  rating: number
  comment: string
  images: string[] | null
  owner_response: any | null
  created_at: string
  updated_at: string
}

export interface DatabasePromotion {
  id: string
  restaurant_id: string
  title: string
  description: string | null
  valid_until: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseMenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number | null
  category: string | null
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}
