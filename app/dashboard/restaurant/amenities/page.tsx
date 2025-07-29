"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRestaurants, getUniqueAmenities } from "@/lib/mock-data"

export default function AmenitiesSettingsPage() {
  const demoRestaurant = mockRestaurants.find((r) => r.slug === "la-pescaderia-del-puerto") || mockRestaurants[0]
  const allAvailableAmenities = getUniqueAmenities()

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(demoRestaurant.amenities)

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities((prev) => (checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Servicios actualizados:", selectedAmenities)
    // Aquí iría la lógica para enviar a Supabase
    alert("Servicios guardados (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios y Amenidades</CardTitle>
        <CardDescription>Selecciona los servicios y amenidades que ofrece tu restaurante.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allAvailableAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm font-medium">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
          <Button type="submit" className="bg-green-700 hover:bg-green-800">
            Guardar Servicios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
