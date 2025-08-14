// components/city/Header.tsx
"use client"

import { useState } from "react"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import type { BreadcrumbItem } from "@/components/ui/breadcrumbs"
import { cn } from "@/lib/utils"
import { SlidersHorizontal, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RestaurantFiltersSidebar } from "@/components/city/Filters"
import type { FilterGroup } from "@/types/filter"

interface HeaderProps {
  breadcrumbItems: BreadcrumbItem[]
  title: string
  subtitle?: string
  filters: FilterGroup[] // ✅ ahora recibimos los filtros para pasarlos al dialog
  className?: string
}

export function Header({
  breadcrumbItems,
  title,
  subtitle,
  filters,
  className,
}: HeaderProps) {
  const [openFilters, setOpenFilters] = useState(false)

  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      <Breadcrumbs items={breadcrumbItems} className="mb-3 md:mb-4" />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}

      {/* Botones Filtros y Mapa */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {/* Botón Filtros solo en mobile/tablet */}
        <button
          type="button"
          aria-label="Abrir filtros"
          onClick={() => setOpenFilters(true)}
          className="
            block lg:hidden
            inline-flex items-center gap-2 rounded-full
            border border-foreground/20 px-5 py-2.5
            text-sm font-medium
            hover:bg-foreground/[0.03]
          "
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span>Filtros • 1</span>
        </button>

        {/* Botón Mapa siempre visible */}
        <button
          type="button"
          aria-label="Ver mapa"
          className="
            inline-flex items-center gap-2 rounded-full
            bg-green-700 text-white px-5 py-2.5
            text-sm font-medium
            hover:bg-green-800
          "
        >
          <MapPin className="h-5 w-5" />
          <span>Mapa</span>
        </button>
      </div>

      {/* Footer visual */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm md:text-base text-foreground">
          1,000 restaurantes en Cancún
        </p>

        <div className="flex items-center gap-2 text-sm md:text-base">
          <span className="text-foreground">Ordenar:</span>
          <div className="relative">
            <select
              aria-label="Ordenar resultados"
              className="appearance-none bg-transparent underline underline-offset-2 pr-6 cursor-pointer focus:outline-none"
              defaultValue="destacados"
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
      </div>

      {/* Dialog de filtros para mobile/tablet */}
      <Dialog open={openFilters} onOpenChange={setOpenFilters}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
          </DialogHeader>
          <RestaurantFiltersSidebar filters={filters} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
