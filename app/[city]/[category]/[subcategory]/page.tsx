// app/[city]/[category]/[subcategory]/page.tsx
import { notFound } from "next/navigation"
import { getAvailableFilters } from "@/lib/filters"
import { RestaurantFiltersSidebar } from "@/components/city/Filters"
import HeaderClient from "@/components/subcategory/ClientComponents/HeaderClient" // ✅ usa el header de SUBCATEGORÍA
import { RestaurantList } from "@/components/city/RestaurantList"
import { createClient } from "@/lib/supabaseServer"
import FaqAccordion from "@/components/city/ClientComponents/FaqAccordion"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Restaurantes por subcategoría" }
export const dynamic = "force-dynamic"

type SP = { [key: string]: string | string[] | undefined }
interface Props {
  params: Promise<{ city: string; category: string; subcategory: string }>
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

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { city, category, subcategory } = await params
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
  const cityTitle = cityRow.name ?? toTitleCaseFromSlug(cityRow.slug)
  const cityDescription: string | null = cityRow.description ?? null

  // ---- Category: slug exacto requerido
  const { data: cat } = await supabase
    .from("categories")
    .select("id, slug, name")
    .eq("slug", category)
    .limit(1)
  const categoryRow = cat?.[0]
  if (!categoryRow) notFound()
  const categoryId = categoryRow.id as string
  const categoryTitle = categoryRow.name ?? toTitleCaseFromSlug(categoryRow.slug)

  // ---- Subcategory: slug exacto requerido + debe pertenecer a category
  const { data: subcat } = await supabase
    .from("subcategories")
    .select("id, slug, name, description, category_id")
    .eq("slug", subcategory)
    .limit(1)
  const subcategoryRow = subcat?.[0]
  if (!subcategoryRow) notFound()
  if (subcategoryRow.category_id !== categoryId) notFound()
  const subcategoryId = subcategoryRow.id as string
  const subcategoryTitle =
    subcategoryRow.name ?? toTitleCaseFromSlug(subcategoryRow.slug)
  const subcategoryDescription: string | null = subcategoryRow.description ?? null

 // ---- Conteo de restaurantes (city + subcategory)
const { count } = await supabase
  .from("restaurants")
  .select("id", { count: "exact", head: true })
  .eq("city_id", cityId)
  .eq("is_approved", true)
  .in(
    "id",
    (
      await supabase
        .from("restaurant_subcategories")
        .select("restaurant_id")
        .eq("subcategory_id", subcategoryId)
    ).data?.map((r) => r.restaurant_id) || []
  )

const totalRestaurants = count ?? 0
const totalRestaurantsLabel = new Intl.NumberFormat("es-MX").format(totalRestaurants)


  // ---- Filtros y orden
  const selected = {
    subcategory: toArray(sp.subcategory),
    amenity: toArray(sp.amenity),
    dietary: toArray(sp.dietary),
    price: toArray(sp.price),
  }
  const sortParamRaw = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort
  const sort: "destacados" | "rating" = sortParamRaw === "rating" ? "rating" : "destacados"

  // ---- FAQs (scope=subcategory + city_id)
  let faqs: { number: number; question: string; answer: string }[] = []
  {
    const { data: faqsData } = await supabase
      .from("faqs")
      .select("question, answer")
      .eq("scope", "subcategory")
      .eq("scope_id", subcategoryId)
      .eq("city_id", cityId)
      .eq("status", "published")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .limit(5)
    faqs = (faqsData || []).map((f, i) => ({
      number: i + 1,
      question: f.question,
      answer: f.answer,
    }))
  }

  return (
    <>
      <HeaderClient
        breadcrumbItems={[
          { label: "Inicio", href: "/" },
          { label: cityTitle, href: `/${city}` },
          { label: categoryTitle, href: `/${city}/${category}` },
          { label: subcategoryTitle, href: `/${city}/${category}/${subcategory}` },
        ]}
        title={`${subcategoryTitle} en ${cityTitle}`}
        subcategoryDescription={subcategoryDescription && subcategoryDescription.trim() !== "" ? subcategoryDescription : undefined}


        subcategoryName={subcategoryTitle} // ✅ nombre legible para el claim
        cityName={cityTitle}
        totalRestaurantsLabel={totalRestaurantsLabel}
        filters={filters}
        citySlug={city}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 order-1 lg:order-2">
          <RestaurantList
            citySlug={city}
            categorySlug={category}
            subcategorySlug={subcategory}
            filters={selected}
            sort={sort}
          />
        </div>
        <div className="hidden lg:block lg:w-64 lg:shrink-0 order-2 lg:order-1">
          <RestaurantFiltersSidebar filters={filters} />
        </div>
      </div>

      {faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Preguntas frecuentes sobre {subcategoryTitle} en {cityTitle}
          </h2>
          <FaqAccordion faqs={faqs} />
        </section>
      )}
    </>
  )
}
