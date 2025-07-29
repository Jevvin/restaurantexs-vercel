"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRestaurants } from "@/lib/mock-data"
import { RestaurantMap } from "@/components/restaurant/restaurant-map" // Re-use existing map component

export default function LocationSettingsPage() {
  const demoRestaurant = mockRestaurants.find((r) => r.slug === "la-pescaderia-del-puerto") || mockRestaurants[0]

  const [address, setAddress] = useState(demoRestaurant.address)
  const [lat, setLat] = useState(demoRestaurant.coordinates.lat.toString())
  const [lng, setLng] = useState(demoRestaurant.coordinates.lng.toString())
  const [googleMapsLink, setGoogleMapsLink] = useState(demoRestaurant.googleMapsLink || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedData = {
      address,
      coordinates: {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      },
      googleMapsLink,
    }
    console.log("Ubicación actualizada:", updatedData)
    // Aquí iría la lógica para enviar a Supabase
    alert("Ubicación guardada (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubicación del Restaurante</CardTitle>
        <CardDescription>Actualiza la dirección y las coordenadas de tu restaurante.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección Completa</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <p className="text-sm text-gray-500">Ej: Blvd. Kukulcán Km 9.5, Zona Hotelera, 77500 Cancún, Q.R.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitud</Label>
              <Input id="lat" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitud</Label>
              <Input id="lng" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleMapsLink">Enlace de Google Maps (opcional)</Label>
            <Input
              id="googleMapsLink"
              type="url"
              value={googleMapsLink}
              onChange={(e) => setGoogleMapsLink(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
            />
            <p className="text-sm text-gray-500">Enlace directo a la ubicación de tu restaurante en Google Maps.</p>
          </div>
          <Button type="submit" className="bg-green-700 hover:bg-green-800">
            Guardar Ubicación
          </Button>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Vista Previa del Mapa</h3>
          <RestaurantMap
            restaurant={{
              ...demoRestaurant,
              address,
              coordinates: { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) },
              googleMapsLink,
            }}
            className="h-80"
          />
        </div>
      </CardContent>
    </Card>
  )
}
