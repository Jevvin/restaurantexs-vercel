"use client"

import { useEffect, useRef } from "react"
import { ExternalLink, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Restaurant } from "@/types/restaurant"

interface RestaurantMapProps {
  restaurant: Restaurant
  className?: string
}

export function RestaurantMap({ restaurant, className }: RestaurantMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    // Simulamos la inicialización del mapa de Mapbox
    // En producción, aquí iría la configuración real de Mapbox GL JS
    if (mapContainer.current && !map.current) {
      // Placeholder para el mapa
      const mapDiv = mapContainer.current
      mapDiv.innerHTML = `
        <div class="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
          <div class="text-center">
            <div class="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <p class="text-sm text-gray-600">${restaurant.name}</p>
            <p class="text-xs text-gray-500">${restaurant.address}</p>
          </div>
        </div>
      `
    }
  }, [restaurant])

  const handleOpenInGoogleMaps = () => {
    if (restaurant.googleMapsLink) {
      window.open(restaurant.googleMapsLink, "_blank")
    } else {
      const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`)
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
    }
  }

  const handleGetDirections = () => {
    const { lat, lng } = restaurant.coordinates
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-2">Ubicación</h3>
          <p className="text-sm text-gray-600">{restaurant.address}</p>
        </div>

        <div ref={mapContainer} className="h-80" />

        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleGetDirections} className="flex-1 bg-transparent">
              <Navigation className="h-4 w-4 mr-2" />
              Cómo llegar
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenInGoogleMaps} className="flex-1 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir en Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
