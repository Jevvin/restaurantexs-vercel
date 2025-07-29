"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRestaurants, mockCategories } from "@/lib/mock-data" // Using mock data for pre-fill

export default function GeneralSettingsPage() {
  // For demo, load a specific restaurant's data
  const demoRestaurant = mockRestaurants.find((r) => r.slug === "la-pescaderia-del-puerto") || mockRestaurants[0]

  const [name, setName] = useState(demoRestaurant.name)
  const [tagline, setTagline] = useState(demoRestaurant.tagline)
  const [description, setDescription] = useState(demoRestaurant.description)
  const [category, setCategory] = useState(demoRestaurant.category)
  const [priceRange, setPriceRange] = useState(demoRestaurant.priceRange)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedData = {
      name,
      tagline,
      description,
      category,
      priceRange,
    }
    console.log("Datos generales actualizados:", updatedData)
    // Aquí iría la lógica para enviar a Supabase
    alert("Datos guardados (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General</CardTitle>
        <CardDescription>Actualiza el nombre, descripción y categoría de tu restaurante.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Restaurante</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Eslogan</Label>
            <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={300} />
            <p className="text-sm text-gray-500">Un eslogan corto y pegadizo para tu restaurante.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Completa</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
            <p className="text-sm text-gray-500">Describe tu restaurante, su ambiente y especialidades.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría Principal</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceRange">Rango de Precio</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger id="priceRange">
                  <SelectValue placeholder="Selecciona un rango" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Económico ($)</SelectItem>
                  <SelectItem value="mid">Gama Media ($$)</SelectItem>
                  <SelectItem value="premium">Premium ($$$)</SelectItem>
                  <SelectItem value="luxury">Lujo ($$$$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="bg-green-700 hover:bg-green-800">
            Guardar Cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
