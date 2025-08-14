// lib/getFiltersByCity.ts
import supabase from "@/lib/supabaseClient"
import type { FilterGroup, FilterOption } from "@/types/filter"

/**
 * Obtiene los grupos de filtros disponibles PARA UNA CIUDAD (usando citySlug),
 * devolviendo SIEMPRE valores por ID (consistente con tu hook useFilteredRestaurants)
 */
export async function getAvailableFilters(citySlug: string): Promise<FilterGroup[]> {
  const filterGroups: FilterGroup[] = []

  // 0) Resolver cityId a partir de citySlug
  const { data: cities, error: cityErr } = await supabase
    .from("cities")
    .select("id, slug")
    .eq("slug", citySlug)
    .limit(1)

  if (cityErr || !cities?.length) return []
  const cityId = cities[0].id

  // 1) Subcategorías (value = ID, label = name)
  // Nota: se asume relación FK desde restaurant_subcategories -> restaurants y -> subcategories
  const { data: subcategoryData } = await supabase
    .from("restaurant_subcategories")
    .select("subcategory:subcategory_id(id, name), restaurant:restaurant_id(city_id)")
    .eq("restaurant.city_id", cityId)

  const subcategories: FilterOption[] =
    subcategoryData
      ?.map((r) => r.subcategory as unknown as { id: string; name: string } | null)
      .filter((x): x is { id: string; name: string } => !!x?.id)
      .reduce((acc: FilterOption[], curr) => {
        if (!acc.some((opt) => opt.value === curr.id)) {
          acc.push({ label: curr.name, value: curr.id }) // ✅ ID!
        }
        return acc
      }, []) ?? []

  if (subcategories.length) {
    filterGroups.push({
      id: "subcategory",
      name: "Tipos de comida",
      options: subcategories,
    })
  }

  // 2) Amenidades (value = ID)
  const { data: amenityData } = await supabase
    .from("restaurant_amenities")
    .select("amenity:amenity_id(id, name), restaurant:restaurant_id(city_id)")
    .eq("restaurant.city_id", cityId)

  const amenities: FilterOption[] =
    amenityData
      ?.map((r) => r.amenity as unknown as { id: string; name: string } | null)
      .filter((x): x is { id: string; name: string } => !!x?.id)
      .reduce((acc: FilterOption[], curr) => {
        if (!acc.some((opt) => opt.value === curr.id)) {
          acc.push({ label: curr.name, value: curr.id }) // ✅ ID!
        }
        return acc
      }, []) ?? []

  if (amenities.length) {
    filterGroups.push({
      id: "amenity",
      name: "Servicios",
      options: amenities,
    })
  }

  // 3) Opciones dietéticas (value = ID)
  const { data: dietData } = await supabase
    .from("restaurant_dietary_options")
    .select("dietary_option:dietary_option_id(id, name), restaurant:restaurant_id(city_id)")
    .eq("restaurant.city_id", cityId)

  const dietaryOptions: FilterOption[] =
    dietData
      ?.map((r) => r.dietary_option as unknown as { id: string; name: string } | null)
      .filter((x): x is { id: string; name: string } => !!x?.id)
      .reduce((acc: FilterOption[], curr) => {
        if (!acc.some((opt) => opt.value === curr.id)) {
          acc.push({ label: curr.name, value: curr.id }) // ✅ ID!
        }
        return acc
      }, []) ?? []

  if (dietaryOptions.length) {
    filterGroups.push({
      id: "dietary",
      name: "Opciones dietéticas",
      options: dietaryOptions,
    })
  }

  // 4) Niveles de precio (value = ID)
  const { data: priceLevelsData } = await supabase
    .from("restaurants")
    .select("price_level_id, price_level:price_level_id(id, name)")
    .eq("city_id", cityId)
    .not("price_level_id", "is", null)

  const priceLevels: FilterOption[] =
    priceLevelsData
      ?.map((r) => r.price_level as unknown as { id: string; name: string } | null)
      .filter((x): x is { id: string; name: string } => !!x?.id)
      .reduce((acc: FilterOption[], curr) => {
        if (!acc.some((opt) => opt.value === curr.id)) {
          acc.push({ label: curr.name, value: curr.id }) // ✅ ID!
        }
        return acc
      }, []) ?? []

  if (priceLevels.length) {
    filterGroups.push({
      id: "price",
      name: "Nivel de precios",
      options: priceLevels,
    })
  }

  return filterGroups
}
