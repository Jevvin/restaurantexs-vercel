// app/[city]/page.tsx
import { getAvailableFilters } from "@/lib/filters"
import { RestaurantFiltersSidebar } from "@/components/city/Filters"
import HeaderClient from "@/components/city/ClientComponents/HeaderClient"
import { RestaurantList } from "@/components/city/RestaurantList"
import { createClient } from "@/lib/supabaseServer"
import FaqAccordion from "@/components/city/ClientComponents/FaqAccordion"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Restaurantes en la ciudad" }
export const dynamic = "force-dynamic"

type SP = { [key: string]: string | string[] | undefined }
interface Props { params: Promise<{ city: string }>; searchParams: Promise<SP> }

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params
  const sp = await searchParams

  const supabase = createClient()
  const filters = await getAvailableFilters(city)

  // Valor de respaldo (por si no se encontrara la fila): capitalizar slug
  let cityTitle: string = city.charAt(0).toUpperCase() + city.slice(1)

  const selected = {
    subcategory: toArray(sp.subcategory),
    amenity: toArray(sp.amenity),
    dietary: toArray(sp.dietary),
    price: toArray(sp.price),
  }

  const sortParamRaw = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort
  const sort: "destacados" | "rating" = sortParamRaw === "rating" ? "rating" : "destacados"

  // Trae id + name + description para ciudad
  let totalRestaurants = 0
  let cityDescription: string | null = null
  let cityId: string | null = null

  const { data: cities } = await supabase
    .from("cities")
    .select("id, name, description, slug")
    .eq("slug", city)
    .limit(1)

  const cityRow = cities?.[0]
  if (cityRow) {
    cityId = cityRow.id
    cityTitle = cityRow.name               // 👈 usa el nombre tal cual con acentos/mayúsculas
    cityDescription = cityRow.description ?? null

    const { count } = await supabase
      .from("restaurants")
      .select("id", { count: "exact", head: true })
      .eq("city_id", cityRow.id)
      .eq("is_approved", true)
    totalRestaurants = count ?? 0
  }

  // Traer FAQs desde Supabase
  let faqs: { number: number; question: string; answer: string }[] = []
  if (cityId) {
    const { data: faqsData } = await supabase
      .from("faqs")
      .select("question, answer")
      .eq("scope", "city")
      .eq("scope_id", cityId)
      .eq("status", "published")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .limit(5)

    faqs = (faqsData || []).map((faq, idx) => ({
      number: idx + 1,
      question: faq.question,
      answer: faq.answer,
    }))
  }

  const totalRestaurantsLabel = new Intl.NumberFormat("es-MX").format(totalRestaurants)

  return (
    <>
      <HeaderClient
        breadcrumbItems={[
          { label: "Inicio", href: "/" },
          { label: cityTitle, href: `/${city}` },
        ]}
        title={`Restaurantes en ${cityTitle}`}
        subtitle={cityDescription || undefined}
        cityName={cityTitle}
        totalRestaurantsLabel={totalRestaurantsLabel}
        filters={filters}
        citySlug={city}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 order-1 lg:order-2">
          <RestaurantList citySlug={city} filters={selected} sort={sort} />
        </div>
        <div className="hidden lg:block lg:w-64 lg:shrink-0 order-2 lg:order-1">
          <RestaurantFiltersSidebar filters={filters} />
        </div>
      </div>

      {faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Preguntas frecuentes sobre restaurantes en {cityTitle}
          </h2>
          <FaqAccordion faqs={faqs} />
        </section>
      )}
    </>
  )
}
