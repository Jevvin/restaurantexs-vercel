"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  categorizedImages: {
    interior: { url: string; count: number }
    food: { url: string; count: number }
    menu: { url: string; count: number }
    all: string[]
  }
  restaurantName: string
}

export function ImageGallery({ categorizedImages, restaurantName }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return

    if (direction === "prev") {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : categorizedImages.all.length - 1)
    } else {
      setSelectedImageIndex(selectedImageIndex < categorizedImages.all.length - 1 ? selectedImageIndex + 1 : 0)
    }
  }

  const mainImage = categorizedImages.all[0] || "/placeholder.svg?height=400&width=600"

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:h-[400px]">
        {/* Main Image (Left side) */}
        <div className="md:col-span-2 relative aspect-[3/2] md:aspect-auto md:h-full cursor-pointer group rounded-lg overflow-hidden">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={`${restaurantName} - Vista principal`}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(0)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          <div className="absolute bottom-3 left-3 bg-green-700 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Camera className="h-3 w-3" />
            {categorizedImages.all.length}
          </div>
        </div>

        {/* Categorized Galleries (Right side) */}
        <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 md:grid-rows-3 gap-2">
          {Object.entries(categorizedImages).map(([key, value], index) => {
            if (key === "all") return null // Skip the 'all' key

            // Only render the first 3 categories to match the screenshot's visible items
            if (index >= 3) return null

            const categoryName = key.charAt(0).toUpperCase() + key.slice(1)
            const imageUrl = value.url || "/placeholder.svg?height=200&width=200"
            const count = value.count || 0

            return (
              <div
                key={key}
                className={cn(
                  "relative aspect-square md:aspect-auto md:h-full cursor-pointer group rounded-lg overflow-hidden",
                  index === 0 && "col-span-2 md:col-span-1", // Make the first category span 2 columns on mobile
                )}
                onClick={() => openLightbox(0)} // Open lightbox from the first image for simplicity
              >
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={`${restaurantName} - ${categoryName}`}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
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

      {/* Lightbox */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full">
              <Image
                src={categorizedImages.all[selectedImageIndex] || "/placeholder.svg"}
                alt={`${restaurantName} - Imagen ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
              />

              {/* Navigation Controls */}
              {categorizedImages.all.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} de {categorizedImages.all.length}
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
