// components/city/RestaurantList.tsx
import { RestaurantCard } from "@/components/city/ServerComponents/RestaurantCardServer"
import type { Restaurant } from "@/types/restaurant"
import { createClient } from "@/lib/supabaseServer"

// Helpers
function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

function nameToSymbol(name?: string | null) {
  const n = (name || "").toLowerCase()
  if (n.includes("budget") || n.includes("econ")) return "$"
  if (n.includes("mid") || n.includes("medio")) return "$$"
  if (n.includes("premium") || n.includes("alto")) return "$$$"
  if (n.includes("luxury") || n.includes("lujo")) return "$$$$"
  return "$$"
}

function minutesFromHHmm(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + (m || 0)
}

function getTimeInTZ(timezone?: string) {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone || "UTC",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    })
    const parts = formatter.formatToParts(new Date())
    const hour = Number(parts.find(p => p.type === "hour")?.value || "0")
    const minute = Number(parts.find(p => p.type === "minute")?.value || "0")
    const weekday = (parts.find(p => p.type === "weekday")?.value || "Mon").toLowerCase()
    const map: Record<string, number> = { sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6 }
    const dayIndex = map[weekday.slice(0,3)] ?? 1
    return { minutes: hour * 60 + minute, dayIndex }
  } catch {
    const d = new Date()
    return { minutes: d.getUTCHours() * 60 + d.getUTCMinutes(), dayIndex: d.getUTCDay() }
  }
}

function isOpenNow(hours: any[] | undefined, timezone?: string) {
  if (!Array.isArray(hours) || hours.length === 0) return undefined
  const { minutes, dayIndex } = getTimeInTZ(timezone)
  const todays = hours.filter(h => h.day === dayIndex && h.is_open)
  if (todays.length === 0) return false
  return todays.some(h => {
    if (!h.open_time || !h.close_time) return false
    const start = minutesFromHHmm(h.open_time)
    const end = minutesFromHHmm(h.close_time)
    return minutes >= start && minutes <= end
  })
}

interface Filters {
  subcategory: string[]
  amenity: string[]
  dietary: string[]
  price: string[]
}

interface Props {
  citySlug: string
  filters: Filters
  sort?: "destacados" | "rating"
  /** Opcionales para filtrar por ruta */
  categorySlug?: string
  subcategorySlug?: string
}

export async function RestaurantList({
  citySlug,
  filters,
  sort = "destacados",
  categorySlug,
  subcategorySlug,
}: Props) {
  const supabase = createClient()

  // 0) Resolver IDs por slug (coincidencia exacta, slugs en minúsculas con "-")
  const { data: cities } = await supabase
    .from("cities")
    .select("id, name, slug, state")
    .eq("slug", citySlug)
    .limit(1)
  const city = cities?.[0]
  if (!city) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <p>No se encontró la ciudad.</p>
      </div>
    )
  }

  let categoryId: string | null = null
  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id, slug")
      .eq("slug", categorySlug)
      .limit(1)
    categoryId = cat?.[0]?.id ?? null
  }

  let subcategoryId: string | null = null
  if (subcategorySlug) {
    const { data: subcat } = await supabase
      .from("subcategories")
      .select("id, slug, category_id")
      .eq("slug", subcategorySlug)
      .limit(1)
    // Asegura relación válida subcategory -> category (si ambos vienen)
    if (subcat?.[0]) {
      const row = subcat[0]
      if (categoryId && row.category_id !== categoryId) {
        // Inconsistencia: la subcategoría no pertenece a la categoría de la URL
        return (
          <div className="py-10 text-center text-muted-foreground">
            <p>La subcategoría no pertenece a la categoría indicada.</p>
          </div>
        )
      }
      subcategoryId = row.id
    }
  }

  // 1) Restaurantes de la ciudad (join de relaciones)
  const { data: rows, error: restErr } = await supabase
    .from("restaurants")
    .select(`
      id,
      name,
      slug,
      tagline,
      description,
      address,
      price_level_id,
      rating_average,
      reviews_count,
      timezone,
      is_approved,
      restaurant_images ( url, type ),
      restaurant_subcategories (
        subcategory:subcategory_id (
          id, name, slug,
          category:category_id ( id, name )
        )
      ),
      restaurant_amenities ( amenity_id ),
      restaurant_dietary_options ( dietary_option_id ),
      price_level:price_level_id ( id, name, symbol ),
      restaurant_hours ( day, open_time, close_time, is_open )
    `)
    .eq("city_id", city.id)
    .eq("is_approved", true)

  if (restErr) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <p>Error al cargar restaurantes.</p>
      </div>
    )
  }

  // 2) Filtro por slugs de la ruta (category/subcategory)
  const filteredByRoute = (rows || []).filter((r: any) => {
    if (!categoryId && !subcategoryId) return true // solo ciudad
    const subcats = (r.restaurant_subcategories || [])
    const restaurantSubcatIds = subcats.map((x: any) => x.subcategory?.id).filter(Boolean)
    const restaurantCategoryIds = subcats.map((x: any) => x.subcategory?.category?.id).filter(Boolean)
    if (subcategoryId) {
      return restaurantSubcatIds.includes(subcategoryId)
    }
    if (categoryId) {
      return restaurantCategoryIds.includes(categoryId)
    }
    return true
  })

  // 3) Filtros UI (amenities, diet, price, subcategory IDs desde filtros)
  const selectedSubcats = filters.subcategory
  const selectedAmenities = filters.amenity
  const selectedDietary = filters.dietary
  const selectedPrices = filters.price

  const filtered = filteredByRoute.filter((r) => {
    const subcatIds  = (r.restaurant_subcategories || []).map((x: any) => x.subcategory?.id).filter(Boolean)
    const amenityIds = (r.restaurant_amenities || []).map((x: any) => x.amenity_id)
    const dietIds    = (r.restaurant_dietary_options || []).map((x: any) => x.dietary_option_id)

    const matchSubcat  = selectedSubcats.length   === 0 || subcatIds.some((id: string) => selectedSubcats.includes(id))
    const matchAmenity = selectedAmenities.length === 0 || amenityIds.some((id: string) => selectedAmenities.includes(id))
    const matchDietary = selectedDietary.length   === 0 || dietIds.some((id: string) => selectedDietary.includes(id))
    const matchPrice   = selectedPrices.length    === 0 || (r.price_level_id && selectedPrices.includes(r.price_level_id))

    return matchSubcat && matchAmenity && matchDietary && matchPrice
  })

  // 4) Mapeo a tipo Restaurant
  const restaurants = filtered.map((r: any) => {
    type RestaurantImage = { url: string; type: string }

    const imgs: RestaurantImage[] = Array.isArray(r.restaurant_images)
      ? (r.restaurant_images as RestaurantImage[])
      : []

    const firstOf = (t: string) =>
      imgs.find((img: RestaurantImage) => img.type === t)?.url || ""

    const categorized = {
      interior: {
        url: firstOf("interior"),
        count: imgs.filter((i: RestaurantImage) => i.type === "interior").length,
      },
      food: {
        url: firstOf("food"),
        count: imgs.filter((i: RestaurantImage) => i.type === "food").length,
      },
      menu: {
        url: firstOf("menu"),
        count: imgs.filter((i: RestaurantImage) => i.type === "menu").length,
      },
      all: imgs.map((i: RestaurantImage) => i.url),
    }

    const subcatNames = (r.restaurant_subcategories || [])
      .map((rs: any) => rs.subcategory?.name)
      .filter(Boolean) as string[]

    const parentCatNames = (r.restaurant_subcategories || [])
      .map((rs: any) => rs.subcategory?.category?.name)
      .filter(Boolean) as string[]

    const catLineParts = Array.from(new Set([...parentCatNames, ...subcatNames]))

    const symbol: string =
      (r.price_level && r.price_level.symbol) ||
      nameToSymbol(r.price_level?.name)

    const openNow = isOpenNow(r.restaurant_hours, r.timezone)

    const cardRestaurant: Restaurant = {
      id: r.id,
      name: r.name,
      slug: r.slug,
      tagline: r.tagline || "",
      description: r.description || "",
      category: "",
      city: city.slug,
      state: city.state,
      address: r.address || "",
      coordinates: { lat: 0, lng: 0 },
      googleMapsLink: undefined,
      rating: typeof r.rating_average === "number" ? r.rating_average : 0,
      reviewCount: typeof r.reviews_count === "number" ? r.reviews_count : 0,
      priceRange: "mid",
      images: categorized.all,
      categorizedImages: categorized,
      amenities: [],
      promotions: [],
      menu: [],
      hours: {},
      isOpen: Boolean(openNow),
      isClaimed: false,
      ownerId: undefined,
    }

    return {
      restaurant: cardRestaurant,
      infoLine: {
        categories: catLineParts,
        priceSymbol: symbol || undefined,
        openNow,
      },
    }
  })

  if (restaurants.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <p>No se encontraron restaurantes con esos filtros.</p>
      </div>
    )
  }

  // 5) Ordenar según 'sort'
  const sortedRestaurants = [...restaurants]
  if (sort === "rating") {
    sortedRestaurants.sort((a, b) => {
      const diff = b.restaurant.rating - a.restaurant.rating
      if (diff !== 0) return diff
      return String(a.restaurant.name).localeCompare(String(b.restaurant.name))
    })
  } else {
    sortedRestaurants.sort((a, b) => {
      if (b.restaurant.reviewCount !== a.restaurant.reviewCount) {
        return b.restaurant.reviewCount - a.restaurant.reviewCount
      }
      return b.restaurant.rating - a.restaurant.rating
    })
  }

  // 6) Reviews positivas recientes (batch)
  const ids = sortedRestaurants.map(({ restaurant }) => restaurant.id)

  type ReviewRow = {
    restaurant_id: string | number
    comment: string | null
    rating: number
    created_at: string
  }

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("restaurant_id, comment, rating, created_at")
    .in("restaurant_id", ids as (string | number)[])
    .gte("rating", 4)
    .not("comment", "is", null)
    .neq("comment", "")
    .order("created_at", { ascending: false })

  const truncateWords = (txt: string, n: number) =>
    (txt || "").trim().split(/\s+/).slice(0, n).join(" ")

  const byRestaurant: Record<string, string[]> = {}
  for (const rev of ((reviewsData ?? []) as ReviewRow[])) {
    const rid = String(rev.restaurant_id)
    if (!byRestaurant[rid]) byRestaurant[rid] = []
    if (rev.comment && byRestaurant[rid].length < 2) {
      byRestaurant[rid].push(truncateWords(rev.comment, 5))
    }
  }

  return (
    <div className="space-y-4">
      {sortedRestaurants.map(({ restaurant, infoLine }, i) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          infoLine={infoLine}
          rank={i + 1}
          reviewSnippets={byRestaurant[String(restaurant.id)] || []}
        />
      ))}
    </div>
  )
}
