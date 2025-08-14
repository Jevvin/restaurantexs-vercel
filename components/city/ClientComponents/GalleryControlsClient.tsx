// components/city/ClientComponents/GalleryControlsClient.tsx

"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export default function GalleryControlsClient({
  containerId,
}: {
  containerId: string
}) {
  const scrollBy = (dir: -1 | 1) => {
    const el = document.getElementById(containerId)
    if (!el) return
    // desplaza exactamente un “viewport” del contenedor
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" })
  }

  return (
    <>
      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={(e) => { e.stopPropagation(); scrollBy(-1) }}
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 flex items-center justify-center"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Siguiente imagen"
        onClick={(e) => { e.stopPropagation(); scrollBy(1) }}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 flex items-center justify-center"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  )
}
