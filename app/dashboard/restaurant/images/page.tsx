"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRestaurants } from "@/lib/mock-data"
import { Plus, X } from "lucide-react"

export default function ImagesSettingsPage() {
  const demoRestaurant = mockRestaurants.find((r) => r.slug === "la-pescaderia-del-puerto") || mockRestaurants[0]

  const [allImages, setAllImages] = useState<string[]>(demoRestaurant.categorizedImages.all)
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setAllImages((prev) => [...prev, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setAllImages((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Imágenes actualizadas:", allImages)
    // Aquí iría la lógica para enviar a Supabase
    alert("Imágenes guardadas (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Imágenes</CardTitle>
        <CardDescription>Sube y organiza las fotos de tu restaurante.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="new-image-url">Añadir Nueva Imagen (URL)</Label>
            <div className="flex gap-2">
              <Input
                id="new-image-url"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button type="button" onClick={handleAddImage} disabled={!newImageUrl.trim()}>
                <Plus className="h-4 w-4 mr-2" /> Añadir
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Introduce la URL de la imagen. Para subir archivos, necesitarías una integración de almacenamiento (ej.
              Vercel Blob).
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Imágenes Actuales ({allImages.length})</h3>
            {allImages.length === 0 ? (
              <p className="text-gray-500">No hay imágenes cargadas.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allImages.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="bg-green-700 hover:bg-green-800">
            Guardar Imágenes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
