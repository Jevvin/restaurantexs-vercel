"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

export default function FavoriteButtonClient() {
  const [fav, setFav] = useState(false)
  return (
    <button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
      onClick={(e) => { e.stopPropagation(); setFav(v => !v) }}
      className="
        inline-flex items-center justify-center
        h-9 w-9 rounded-full bg-white shadow
        focus:outline-none focus:ring-2 focus:ring-black/20
      "
    >
      <Heart className={`h-5 w-5 ${fav ? "fill-red-500 text-red-500" : "text-black"}`} />
    </button>
  )
}
