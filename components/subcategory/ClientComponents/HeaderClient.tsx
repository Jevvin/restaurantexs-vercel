// components/subcategory/ClientComponents/HeaderClient.tsx

"use client"

import { useMemo, useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import HeaderServer from "@/components/subcategory/ServerComponents/HeaderServer" // ✅ subcategory server header
import { RestaurantFiltersDialogContent } from "@/components/city/Filters"
import type { FilterGroup } from "@/types/filter"
import type { BreadcrumbItem } from "@/components/ui/breadcrumbs"

interface Props {
  breadcrumbItems: BreadcrumbItem[]
  title: string
  /** Markdown desde subcategories.description */
  subcategoryDescription?: string
  /** Nombre legible de la subcategoría, ej: "Sushi" */
  subcategoryName: string
  /** Nombre de la ciudad, ej: "Cancún" */
  cityName: string
  /** Conteo formateado, ej: "123" (idealmente de la subcategoría en esa ciudad) */
  totalRestaurantsLabel: string
  filters: FilterGroup[]
  citySlug: string
}

// 🔧 Configura el modo de colapso de la descripción:
const TRUNCATE_MODE: "paragraph" | "words" = "paragraph"
const WORD_LIMIT = 50

export default function HeaderClient({
  breadcrumbItems,
  title,
  subcategoryDescription,
  subcategoryName,
  cityName,
  totalRestaurantsLabel,
  filters,
  citySlug,
}: Props) {
  const [openFilters, setOpenFilters] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Conteo dinámico de filtros seleccionados
  const selectedCount = useMemo(() => {
    if (!searchParams) return 0
    let sum = 0
    for (const group of filters) sum += searchParams.getAll(group.id).length
    return sum
  }, [searchParams, filters])

  const filtersLabel = selectedCount > 0 ? `Filtros • ${selectedCount}` : "Filtros"

  // Limpiar filtros (borra solo params de filtros)
  const handleClear = () => {
    const params = new URLSearchParams(searchParams?.toString() || "")
    for (const group of filters) params.delete(group.id)
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(url, { scroll: false })
  }

  // Valor actual del ordenar según query (?sort=rating | destacados)
  const sortValue = (searchParams?.get("sort") === "rating" ? "rating" : "destacados") as
    | "destacados"
    | "rating"

  const handleSortChange = (value: "destacados" | "rating") => {
    const params = new URLSearchParams(searchParams?.toString() || "")
    if (value === "destacados") params.delete("sort")
    else params.set("sort", value)
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(url, { scroll: false })
  }

  // -------- Ver más / Ver menos sin corte feo --------
  useEffect(() => {
    const desc = document.querySelector<HTMLElement>("[data-subcategory-desc]") // ✅ coincide con HeaderServer (subcategory)
    if (!desc) return

    // evita duplicar botón si se re-monta
    let button = desc.nextElementSibling as HTMLButtonElement | null
    const isToggleBtn =
      !!button && button.tagName === "BUTTON" && (button as HTMLButtonElement).dataset.descToggle !== undefined
    if (!isToggleBtn) {
      button = document.createElement("button")
      button.type = "button"
      button.dataset.descToggle = ""
      button.className = "mt-2 inline-block text-sm text-muted-foreground underline underline-offset-2"
      button.textContent = "Ver más"
      desc.insertAdjacentElement("afterend", button)
    }

    if (!button) return

    // MODO A: solo primer párrafo
    const collapseToFirstParagraph = () => {
      const children = Array.from(desc.children) as HTMLElement[]
      children.forEach((el, i) => {
        el.style.display = i === 0 ? "" : "none"
      })
    }
    const expandAllParagraphs = () => {
      const children = Array.from(desc.children) as HTMLElement[]
      children.forEach((el) => {
        el.style.display = ""
      })
    }

    // MODO B: primeras N palabras
    const originalHTML = desc.innerHTML
    const makeTruncatedHTML = (limit: number) => {
      const words = (desc.textContent || "").trim().split(/\s+/)
      const snippet = words.slice(0, limit).join(" ")
      return `<p>${snippet}${words.length > limit ? "…" : ""}</p>`
    }
    const collapseToWords = () => {
      desc.innerHTML = makeTruncatedHTML(WORD_LIMIT)
    }
    const expandAllWords = () => {
      desc.innerHTML = originalHTML
    }

    const hasMultipleBlocks = desc.children.length > 1
    const hasManyWords = ((desc.textContent || "").trim().split(/\s+/).length) > WORD_LIMIT
    const shouldShowToggle = TRUNCATE_MODE === "paragraph" ? hasMultipleBlocks : hasManyWords
    if (!shouldShowToggle) {
      button.style.display = "none"
      return
    }
    button.style.display = ""

    // Estado inicial: colapsado
    if (TRUNCATE_MODE === "paragraph") collapseToFirstParagraph()
    else collapseToWords()

    const onClick = () => {
      const isCollapsed =
        TRUNCATE_MODE === "paragraph"
          ? Array.from(desc.children).slice(1).some((el) => (el as HTMLElement).style.display === "none")
          : desc.innerHTML !== originalHTML

      if (isCollapsed) {
        if (TRUNCATE_MODE === "paragraph") expandAllParagraphs()
        else expandAllWords()
        button!.textContent = "Ver menos"
      } else {
        if (TRUNCATE_MODE === "paragraph") collapseToFirstParagraph()
        else collapseToWords()
        button!.textContent = "Ver más"
      }
    }

    button.addEventListener("click", onClick)
    return () => {
      button?.removeEventListener("click", onClick)
      if (TRUNCATE_MODE === "words") desc.innerHTML = originalHTML
      else expandAllParagraphs()
    }
  }, [citySlug, subcategoryName]) // 🔁 reevalúa si cambia la subcategoría

  return (
    <>
      <HeaderServer
        breadcrumbItems={breadcrumbItems}
        title={title}
        subcategoryDescription={subcategoryDescription} // ✅ subcategories.description
        subcategoryName={subcategoryName}
        cityName={cityName}
        totalRestaurantsLabel={totalRestaurantsLabel}
        citySlug={citySlug}
        /* Botón Filtros (client) */
        filtersButton={
          <button
            type="button"
            aria-label={`Abrir filtros. ${selectedCount} seleccionado${selectedCount === 1 ? "" : "s"}`}
            onClick={() => setOpenFilters(true)}
            className="
              block lg:hidden
              inline-flex items-center gap-2 rounded-full
              border border-foreground/20 px-5 py-2.5
              text-sm font-medium
              hover:bg-foreground/[0.03] focus:outline-none focus:ring-2 focus:ring-foreground/20
            "
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>{filtersLabel}</span>
          </button>
        }
        /* Ordenar (client controlado) */
        orderControl={
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-foreground">Ordenar:</span>
            <div className="relative">
              <select
                aria-label="Ordenar resultados"
                className="appearance-none bg-transparent underline underline-offset-2 pr-6 cursor-pointer focus:outline-none"
                value={sortValue}
                onChange={(e) =>
                  handleSortChange((e.target.value as "destacados" | "rating") ?? "destacados")
                }
              >
                <option value="destacados">Destacados</option>
                <option value="rating">Calificación más alta</option>
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
              >
                ▾
              </span>
            </div>
          </div>
        }
      />

      {/* Dialog de filtros (mobile/tablet) */}
      <Dialog open={openFilters} onOpenChange={setOpenFilters}>
        <DialogContent className="w-full max-w-md p-0 sm:rounded-2xl max-h-[85vh] overflow-hidden">
          <DialogTitle className="sr-only">Filtros</DialogTitle>
          <div className="flex h-full flex-col bg-white">
            <div className="flex items-center justify-end px-5 py-4 border-b">
              <button
                onClick={() => setOpenFilters(false)}
                className="text-sm text-muted-foreground underline underline-offset-2"
              >
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-auto px-5 py-4">
              <RestaurantFiltersDialogContent filters={filters} />
            </div>
            <div className="px-5 py-4 border-t">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="text-sm text-muted-foreground underline underline-offset-2"
                  onClick={handleClear}
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  className="rounded-full bg-green-700 text-white text-sm px-5 py-2.5"
                  onClick={() => setOpenFilters(false)}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
