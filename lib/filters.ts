import { createClient } from "@/lib/supabaseServer"
import type { FilterGroup } from "@/types/filter"

export async function getAvailableFilters(citySlug: string): Promise<FilterGroup[]> {
  const supabase = createClient()

  const [{ data: cities }, { data: amenities }, { data: subcategories }, { data: dietary }] = await Promise.all([
    supabase.from("cities").select("id").eq("slug", citySlug),
    supabase.from("amenities").select("id, name"),
    supabase.from("subcategories").select("id, name"),
    supabase.from("dietary_options").select("id, name"),
  ])

  const city = cities?.[0]
  if (!city) return []

  return [
  {
    id: "amenity", // antes decía "amenities"
    name: "Amenidades",
    options: (amenities || []).map((a) => ({ label: a.name, value: String(a.id) })),
  },
  {
    id: "subcategory", // antes decía "subcategories"
    name: "Tipos de restaurante",
    options: (subcategories || []).map((s) => ({ label: s.name, value: String(s.id) })),
  },
  {
    id: "dietary", // antes decía "dietary_options"
    name: "Opciones alimenticias",
    options: (dietary || []).map((d) => ({ label: d.name, value: String(d.id) })),
  },
]

}
