"use client"

import { useEffect, useState } from "react"
import Map, { Marker, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Navigation, ExternalLink, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface RestaurantMapProps {
  restaurant: {
    name: string
    address: string
    googleMapsLink?: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  className?: string
}

export function RestaurantMap({ restaurant, className }: RestaurantMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
   <section className={className} id="location" aria-label="Mapa y dirección del restaurante">
  <Card className="p-5">
    <div className="mb-4">
      <h2 className="text-[19px] font-semibold text-black flex items-center gap-2">
        <MapPin className="w-5 h-5 text-black" />
        Ubicación
      </h2>
      <address className="not-italic text-sm text-gray-700 mt-1">
        {restaurant.address}
      </address>
    </div>

    <div className="h-80 rounded overflow-hidden" aria-hidden="true">
      {isMounted && restaurant.coordinates.lat && restaurant.coordinates.lng && (
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            latitude: restaurant.coordinates.lat,
            longitude: restaurant.coordinates.lng,
            zoom: 14,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          style={{ width: "100%", height: "100%" }}
        >
          <Marker
            latitude={restaurant.coordinates.lat}
            longitude={restaurant.coordinates.lng}
            anchor="bottom"
          >
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
              <MapPin className="text-white w-5 h-5" />
            </div>
          </Marker>

          <NavigationControl position="bottom-right" showZoom={true} />
        </Map>
      )}
    </div>

    <div className="mt-4">
  <div className="flex gap-2">
    {/* Enlace para cómo llegar */}
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 bg-transparent inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
    >
      <Navigation className="h-4 w-4 mr-2" />
      Cómo llegar
    </a>

    {/* Enlace para abrir en Google Maps */}
    <a
      href={
        restaurant.googleMapsLink
          ? restaurant.googleMapsLink
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${restaurant.name} ${restaurant.address}`
            )}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 bg-transparent inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      Abrir en Google
    </a>
  </div>
</div>

  </Card>
</section>

  )
}
