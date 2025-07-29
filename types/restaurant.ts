export interface Restaurant {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  category: string
  subcategory?: string
  city: string
  state: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  googleMapsLink?: string
  rating: number
  reviewCount: number
  priceRange: "budget" | "mid" | "premium" | "luxury"
  images: string[] // Mantener para compatibilidad, pero usaremos categorizedImages
  categorizedImages: {
    interior: { url: string; count: number }
    food: { url: string; count: number }
    menu: { url: string; count: number }
    all: string[] // Todas las imágenes para el lightbox
  }
  amenities: string[]
  promotions: Promotion[]
  menu: MenuItem[]
  hours: BusinessHours
  isOpen: boolean
  isClaimed: boolean
  ownerId?: string
  ranking?: {
    position: number
    total: number
  }
  dietaryOptions?: string[]
}

export interface Promotion {
  id: string
  title: string
  description: string
  validUntil: string
  isActive: boolean
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

export interface BusinessHours {
  [key: string]: {
    open: string
    close: string
    isClosed: boolean
  }
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  restaurantId: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  ownerResponse?: {
    message: string
    createdAt: string
  }
}

export interface FavoriteList {
  id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  restaurants: string[]
  createdAt: string
}

export interface City {
  id: string
  name: string
  slug: string
  state: string
  restaurantCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId?: string
  subcategories?: Category[]
}
