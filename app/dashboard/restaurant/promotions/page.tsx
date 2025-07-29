"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRestaurants } from "@/lib/mock-data"
import type { Promotion } from "@/types/restaurant"
import { Plus, Trash2 } from "lucide-react"

export default function PromotionsSettingsPage() {
  const demoRestaurant = mockRestaurants.find((r) => r.slug === "la-pescaderia-del-puerto") || mockRestaurants[0]

  const [promotions, setPromotions] = useState<Promotion[]>(demoRestaurant.promotions)
  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, "id">>({
    title: "",
    description: "",
    validUntil: "",
    isActive: true,
  })

  const handleAddPromotion = () => {
    if (newPromotion.title) {
      setPromotions((prev) => [
        ...prev,
        { ...newPromotion, id: (prev.length + 1).toString() }, // Simple ID generation for demo
      ])
      setNewPromotion({ title: "", description: "", validUntil: "", isActive: true })
    }
  }

  const handleRemovePromotion = (idToRemove: string) => {
    setPromotions((prev) => prev.filter((promo) => promo.id !== idToRemove))
  }

  const handlePromotionChange = (id: string, field: keyof Promotion, value: any) => {
    setPromotions((prev) => prev.map((promo) => (promo.id === id ? { ...promo, [field]: value } : promo)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Promociones actualizadas:", promotions)
    // Aquí iría la lógica para enviar a Supabase
    alert("Promociones guardadas (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Promociones</CardTitle>
        <CardDescription>Crea y gestiona las promociones activas de tu restaurante.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Añadir Nueva Promoción</h3>
            <div className="space-y-2">
              <Label htmlFor="new-title">Título de la Promoción</Label>
              <Input
                id="new-title"
                value={newPromotion.title}
                onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Descripción</Label>
              <Textarea
                id="new-description"
                value={newPromotion.description || ""}
                onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-valid-until">Válido Hasta</Label>
                <Input
                  id="new-valid-until"
                  type="date"
                  value={newPromotion.validUntil || ""}
                  onChange={(e) => setNewPromotion({ ...newPromotion, validUntil: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="new-is-active"
                  checked={newPromotion.isActive}
                  onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, isActive: checked as boolean })}
                />
                <Label htmlFor="new-is-active">Activa</Label>
              </div>
            </div>
            <Button type="button" onClick={handleAddPromotion} disabled={!newPromotion.title}>
              <Plus className="h-4 w-4 mr-2" /> Añadir Promoción
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Promociones Actuales ({promotions.length})</h3>
            {promotions.length === 0 ? (
              <p className="text-gray-500">No hay promociones activas. Añade una arriba.</p>
            ) : (
              <div className="space-y-4">
                {promotions.map((promo) => (
                  <Card key={promo.id} className="p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`promo-title-${promo.id}`}>Título</Label>
                      <Input
                        id={`promo-title-${promo.id}`}
                        value={promo.title}
                        onChange={(e) => handlePromotionChange(promo.id, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor={`promo-description-${promo.id}`}>Descripción</Label>
                      <Textarea
                        id={`promo-description-${promo.id}`}
                        value={promo.description || ""}
                        onChange={(e) => handlePromotionChange(promo.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`promo-valid-until-${promo.id}`}>Válido Hasta</Label>
                        <Input
                          id={`promo-valid-until-${promo.id}`}
                          type="date"
                          value={promo.validUntil || ""}
                          onChange={(e) => handlePromotionChange(promo.id, "validUntil", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <Checkbox
                          id={`promo-is-active-${promo.id}`}
                          checked={promo.isActive}
                          onCheckedChange={(checked) => handlePromotionChange(promo.id, "isActive", checked as boolean)}
                        />
                        <Label htmlFor={`promo-is-active-${promo.id}`}>Activa</Label>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemovePromotion(promo.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="bg-green-700 hover:bg-green-800">
            Guardar Promociones
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
