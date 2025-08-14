// components/city/Filters.tsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import type { FilterGroup, FilterType } from "@/types/filter"
import { Checkbox } from "@/components/ui/checkbox"

interface Props {
  filters: FilterGroup[]
}

/** 1) Hook: controla estado/URL y expone conteo + limpiar */
export function useFiltersController(filters: FilterGroup[]) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedValues = useMemo(() => {
    const result: Record<FilterType, string[]> = {} as Record<FilterType, string[]>
    filters.forEach((group) => {
      const values = searchParams.getAll(group.id)
      if (values.length > 0) result[group.id] = values
    })
    return result
  }, [searchParams, filters])

  const selectedCount = useMemo(() => {
    let sum = 0
    for (const group of filters) {
      sum += (selectedValues[group.id]?.length ?? 0)
    }
    return sum
  }, [selectedValues, filters])

  const toggleFilter = (groupId: FilterType, value: string) => {
    const params = new URLSearchParams(searchParams)
    const currentValues = new Set(params.getAll(groupId))

    currentValues.has(value) ? currentValues.delete(value) : currentValues.add(value)

    params.delete(groupId)
    currentValues.forEach((v) => params.append(groupId, v))

    router.replace(`?${params.toString()}`)
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams)
    for (const group of filters) params.delete(group.id)
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : "?")
  }

  return { selectedValues, selectedCount, toggleFilter, clearAll }
}

/** 2) Panel puro reutilizable (se usa en sidebar y en dialog) */
function FiltersPanel({
  filters,
  selectedValues,
  onToggle,
}: {
  filters: FilterGroup[]
  selectedValues: Record<FilterType, string[]>
  onToggle: (groupId: FilterType, value: string) => void
}) {
  return (
    <div className="w-full">
      {filters.map((group) => (
        <div key={group.id} className="mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            {group.name}
          </h3>
          <div className="space-y-2">
            {group.options.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedValues[group.id]?.includes(option.value) || false}
                  onCheckedChange={() => onToggle(group.id, option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** 3) Sidebar (desktop). El parent decide visibilidad con CSS. */
export function RestaurantFiltersSidebar({ filters }: Props) {
  const { selectedValues, selectedCount, toggleFilter, clearAll } = useFiltersController(filters)
  return (
    <aside className="w-full md:w-64 pr-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Filtros</h2>
        {selectedCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground underline underline-offset-2"
            aria-label={`Limpiar filtros (${selectedCount})`}
          >
            Limpiar ({selectedCount})
          </button>
        )}
      </div>
      <FiltersPanel filters={filters} selectedValues={selectedValues} onToggle={toggleFilter} />
    </aside>
  )
}

/** 4) Contenido para Dialog (tablet/mobile). Sin trigger aquí. */
export function RestaurantFiltersDialogContent({ filters }: Props) {
  const { selectedValues, selectedCount, toggleFilter, clearAll } = useFiltersController(filters)
  return (
    <div className="max-h-[70vh] overflow-auto pr-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Filtros</h2>
        {selectedCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground underline underline-offset-2"
            aria-label={`Limpiar filtros (${selectedCount})`}
          >
            Limpiar ({selectedCount})
          </button>
        )}
      </div>
      <FiltersPanel filters={filters} selectedValues={selectedValues} onToggle={toggleFilter} />
    </div>
  )
}
