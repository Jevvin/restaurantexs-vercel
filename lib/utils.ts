import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatReviewCount(count: number): string {
  if (count === 0) return "Sin opiniones"
  if (count === 1) return "1 opinión"
  return `${count.toLocaleString()} opiniones`
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function isRestaurantOpen(hours: any): boolean {
  const now = new Date()
  const currentDay = now.toLocaleLowerCase().substring(0, 3)
  const currentTime = now.toTimeString().substring(0, 5)

  const todayHours = hours[currentDay]
  if (!todayHours || todayHours.isClosed) return false

  return currentTime >= todayHours.open && currentTime <= todayHours.close
}

export function truncateText(text: string, maxWords: number): string {
  const words = text.split(" ")
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(" ") + "..."
}
