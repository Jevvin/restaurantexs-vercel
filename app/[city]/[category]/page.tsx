// app/[city]/[category]/page.tsx
import { notFound } from "next/navigation"
import { getAvailableFilters } from "@/lib/filters"
import { RestaurantFiltersSidebar } from "@/components/city/Filters"
import HeaderClient from "@/components/category/ClientComponents/HeaderClient"
import { RestaurantList } from "@/components/city/RestaurantList"
import { createClient } from "@/lib/supabaseServer"
import FaqAccordion from "@/components/city/ClientComponents/FaqAccordion"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Restaurantes por categoría" }
export const dynamic = "force-dynamic"

type SP = { [key: string]: string | string[] | undefined }
interface Props {
  params: Promise<{ city: string; category: string }>
  searchParams: Promise<SP>
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

function toTitleCaseFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { city, category } = await params
  const sp = await searchParams

  const supabase = createClient()
  const filters = await getAvailableFilters(city)

  // ---- City: slug exacto requerido
  const { data: cities } = await supabase
    .from("cities")
    .select("id, name, description, slug")
    .eq("slug", city)
    .limit(1)

  const cityRow = cities?.[0]
  if (!cityRow) notFound()

  const cityId = cityRow.id as string
  const cityTitle = cityRow.name // 👈 usa el nombre con acento
  const cityDescription: string | null = cityRow.description ?? null

  // ---- Category: slug exacto requerido
  const { data: cat } = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .eq("slug", category)
    .limit(1)

  const categoryRow = cat?.[0]
  if (!categoryRow) notFound()

  const categoryId = categoryRow.id as string
  const categoryTitle =
    categoryRow.name ?? toTitleCaseFromSlug(categoryRow.slug)
  const categoryDescription: string | null = categoryRow.description ?? null

  // ---- Conteo de restaurantes (solo de ESTA categoría en ESTA ciudad)
  // 1) Obtener todas las subcategorías que pertenecen a la categoría
  const { data: subcatsForCategory } = await supabase
    .from("subcategories")
    .select("id")
    .eq("category_id", categoryId)

  const subcatIds = (subcatsForCategory || []).map((s) => s.id)

  // 2) Contar restaurantes aprobados en la ciudad que tengan al menos una de esas subcategorías
  let totalRestaurants = 0
  if (subcatIds.length > 0) {
    const { count: catCount } = await supabase
      .from("restaurants")
      .select("id, restaurant_subcategories!inner(subcategory_id)", { count: "exact", head: true })
      .eq("city_id", cityId)
      .eq("is_approved", true)
      .in("restaurant_subcategories.subcategory_id", subcatIds as string[])
    totalRestaurants = catCount ?? 0
  } else {
    totalRestaurants = 0
  }

  const totalRestaurantsLabel = new Intl.NumberFormat("es-MX").format(totalRestaurants)

  // ---- Parámetros de filtros y orden
  const selected = {
    subcategory: toArray(sp.subcategory),
    amenity: toArray(sp.amenity),
    dietary: toArray(sp.dietary),
    price: toArray(sp.price),
  }

  const sortParamRaw = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort
  const sort: "destacados" | "rating" = sortParamRaw === "rating" ? "rating" : "destacados"

  // ---- FAQs (scope=category + city_id)
  let faqs: { number: number; question: string; answer: string }[] = []
  {
    const { data: faqsData } = await supabase
      .from("faqs")
      .select("question, answer")
      .eq("scope", "category")
      .eq("scope_id", categoryId)
      .eq("city_id", cityId)
      .eq("status", "published")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .limit(5)

    faqs = (faqsData || []).map((faq, idx) => ({
      number: idx + 1,
      question: faq.question,
      answer: faq.answer,
    }))
  }

  return (
    <>
      <HeaderClient
        breadcrumbItems={[
          { label: "Inicio", href: "/" },
          { label: cityTitle, href: `/${city}` },
          { label: categoryTitle, href: `/${city}/${category}` },
        ]}
        title={`${categoryTitle} en ${cityTitle}`}
        categoryDescription={categoryDescription || undefined}
        categoryName={categoryTitle}
        cityName={cityTitle}
        totalRestaurantsLabel={totalRestaurantsLabel}
        filters={filters}
        citySlug={city}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 order-1 lg:order-2">
          <RestaurantList citySlug={city} categorySlug={category} filters={selected} sort={sort} />
        </div>
        <div className="hidden lg:block lg:w-64 lg:shrink-0 order-2 lg:order-1">
          <RestaurantFiltersSidebar filters={filters} />
        </div>
      </div>

      {faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Preguntas frecuentes sobre los restaurantes de {categoryTitle} en {cityTitle}
          </h2>
          <FaqAccordion faqs={faqs} />
        </section>
      )}
    </>
  )
}
