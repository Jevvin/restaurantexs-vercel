// components/restaurant/image-gallery.tsx

"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ImageGalleryProps {
  categorizedImages: {
    interior: string[]
    food: string[]
    menu: string[]
    all: string[]
  }
  restaurantName: string
}

export function ImageGallery({ categorizedImages, restaurantName }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [lightboxCategory, setLightboxCategory] = useState<"all" | "interior" | "food" | "menu">("all")

  const openLightboxFromCategory = (
    category: "all" | "interior" | "food" | "menu",
    index: number
  ) => {
    setLightboxCategory(category)
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
    setLightboxCategory("all")
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return
    const images = categorizedImages[lightboxCategory]
    const max = images.length
    setSelectedImageIndex(
      direction === "prev"
        ? (selectedImageIndex - 1 + max) % max
        : (selectedImageIndex + 1) % max
    )
  }

  const mainImage = categorizedImages.all[0] || "/placeholder.svg?height=400&width=600"

  return (
    <>
      {/* Desktop y tablet */}
      <div className="hidden md:grid grid-cols-3 gap-2 md:h-[400px]">
        {/* Imagen principal */}
        <div
          className="col-span-2 relative h-full cursor-pointer group rounded-lg overflow-hidden"
          onClick={() => openLightboxFromCategory("all", 0)}
        >
          <Image
            src={mainImage}
            alt={`${restaurantName} - Vista principal`}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          <div className="absolute bottom-3 left-3 bg-green-700 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Camera className="h-3 w-3" />
            {categorizedImages.all.length}
          </div>
        </div>

        {/* Subgalerías */}
        <div className="col-span-1 grid grid-rows-3 gap-2">
          {["interior", "food", "menu"].map((key) => {
            const images = categorizedImages[key as "interior" | "food" | "menu"]
            if (!images || images.length === 0) return null

            const categoryName = key.charAt(0).toUpperCase() + key.slice(1)
            const imageUrl = images[0]
            const count = images.length

            return (
              <div
                key={key}
                className="relative h-full cursor-pointer group rounded-lg overflow-hidden"
                onClick={() => openLightboxFromCategory(key as any, 0)}
              >
                <Image
                  src={imageUrl}
                  alt={`${restaurantName} - ${categoryName}`}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="font-semibold text-sm">{categoryName}</span>
                  <span className="text-xs">{count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="grid md:hidden gap-2">
        {/* Imagen principal */}
        <div
          className="relative aspect-[3/2] cursor-pointer group rounded-lg overflow-hidden"
          onClick={() => openLightboxFromCategory("all", 0)}
        >
          <Image
            src={mainImage}
            alt={`${restaurantName} - Vista principal`}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          <div className="absolute bottom-3 left-3 bg-green-700 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Camera className="h-3 w-3" />
            {categorizedImages.all.length}
          </div>
        </div>

        {/* Subgalerías en fila */}
        <div className="flex gap-2">
          {["interior", "food", "menu"].map((key) => {
            const images = categorizedImages[key as "interior" | "food" | "menu"]
            if (!images || images.length === 0) return null

            const categoryName = key.charAt(0).toUpperCase() + key.slice(1)
            const imageUrl = images[0]
            const count = images.length

            return (
              <div
                key={key}
                className="relative w-1/3 aspect-square cursor-pointer group rounded-lg overflow-hidden"
                onClick={() => openLightboxFromCategory(key as any, 0)}
              >
                <Image
                  src={imageUrl}
                  alt={`${restaurantName} - ${categoryName}`}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-2 text-white">
                  <span className="font-semibold text-[10px] leading-tight">{categoryName}</span>
                  <span className="text-[10px]">{count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black">
          <DialogTitle className="sr-only">Galería de {restaurantName}</DialogTitle>
          {selectedImageIndex !== null && (
  <div className="relative w-full h-full">
    <Image
      src={categorizedImages[lightboxCategory][selectedImageIndex] || "/placeholder.svg"}
      alt={`${restaurantName} - Imagen ${selectedImageIndex + 1}`}
      fill
      className="object-contain"
      loading="eager"
    />

    {categorizedImages[lightboxCategory].length > 1 && (
      <>
        {/* Botón Anterior */}
        <Button
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white text-black shadow-md rounded-full w-10 h-10"
          onClick={() => navigateImage("prev")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Botón Siguiente */}
        <Button
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white text-black shadow-md rounded-full w-10 h-10"
          onClick={() => navigateImage("next")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </>
    )}

    {/* Indicador inferior */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
      {selectedImageIndex + 1} de {categorizedImages[lightboxCategory].length}
    </div>

    {/* Botón Cerrar */}
    <Button
      size="icon"
      className="absolute top-4 right-4 bg-white hover:bg-white text-black shadow-md rounded-full w-6 h-6"
      onClick={closeLightbox}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
)}

        </DialogContent>
      </Dialog>

      {/* Fallback rastreable para bots (todas las URLs) */}
      <noscript>
        <div>
          {categorizedImages.all.map((url, i) => (
            <a key={i} href={url}>
              <img src={url} alt={`${restaurantName} - imagen ${i + 1}`} />
            </a>
          ))}
        </div>
      </noscript>

      {/* Lista oculta pero presente en el DOM (apoya el rastreo) */}
      <ul className="sr-only">
        {categorizedImages.all.map((url, i) => (
          <li key={i}>
            <a href={url}>{url}</a>
          </li>
        ))}
      </ul>
    </>
  )
}
