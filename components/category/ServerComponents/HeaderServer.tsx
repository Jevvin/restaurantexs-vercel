// components/category/ServerComponents/HeaderServer.tsx
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import type { BreadcrumbItem } from "@/components/ui/breadcrumbs"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
  breadcrumbItems: BreadcrumbItem[]
  title: string
  /** Descripción de la categoría (categories.description en Markdown) */
  categoryDescription?: string
  /** Nombre legible de la categoría, ej: "Comida Japonesa" */
  categoryName: string
  /** Nombre de la ciudad, ej: "Cancún" */
  cityName: string
  /** Conteo formateado, ej: "123" */
  totalRestaurantsLabel: string
  filtersButton?: ReactNode
  orderControl?: ReactNode
  className?: string
  citySlug?: string // opcional, no se usa aquí
}

export default function HeaderServer({
  breadcrumbItems,
  title,
  categoryDescription,
  categoryName,
  cityName,
  totalRestaurantsLabel,
  filtersButton,
  orderControl,
  className,
}: Props) {
  const mdDescription = (categoryDescription ?? "").replace(/\\n/g, "\n")

  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      <Breadcrumbs items={breadcrumbItems} className="mb-3 md:mb-4" />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
        {title}
      </h1>

      {/* Descripción de categoría (Markdown → HTML) */}
      {mdDescription && (
        <div
          data-category-desc
          className="mt-2 text-[14px] md:text-[14px] text-gray-500 w-full max-w-none [&>p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {mdDescription}
          </ReactMarkdown>
        </div>
      )}

      {/* Fila de acciones */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {filtersButton ?? <span className="block lg:hidden" aria-hidden="true" />}

        <button
          type="button"
          aria-label="Ver mapa"
          className="inline-flex items-center gap-2 rounded-full bg-green-700 text-white px-5 py-2.5 text-sm font-medium"
        >
          <MapPin className="h-5 w-5" aria-hidden="true" />
          <span>Mapa</span>
        </button>
      </div>

      {/* Footer informativo + ordenar */}
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-sm md:text-base text-foreground">
          Mejores {totalRestaurantsLabel} restaurantes de {categoryName} en {cityName}
        </h2>
        {orderControl ?? null}
      </div>
    </div>
  )
}
