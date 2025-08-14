// types/filter.ts

export type FilterType = "subcategory" | "amenity" | "dietary" | "price"

export interface FilterOption {
  label: string    // Lo que ve el usuario
  value: string    // UUID de la entidad relacionada
}

export interface FilterGroup {
  id: FilterType
  name: string
  options: FilterOption[]
}
