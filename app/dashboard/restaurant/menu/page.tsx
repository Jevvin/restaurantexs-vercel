"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRestaurants } from "@/lib/mock-data"
import type { MenuItem } from "@/types/restaurant"
import { Plus, Trash2 } from "lucide-react"

export default function MenuSettingsPage() {
  const demoRestaurant = mockRestaurants.find((r) => r.slug === "la-pescaderia-del-puerto") || mockRestaurants[0]

  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoRestaurant.menu)
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  })

  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      setMenuItems((prev) => [
        ...prev,
        { ...newItem, id: (prev.length + 1).toString() }, // Simple ID generation for demo
      ])
      setNewItem({ name: "", description: "", price: 0, category: "", image: "" })
    }
  }

  const handleRemoveItem = (idToRemove: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== idToRemove))
  }

  const handleItemChange = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Menú actualizado:", menuItems)
    // Aquí iría la lógica para enviar a Supabase
    alert("Menú guardado (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión del Menú</CardTitle>
        <CardDescription>Añade, edita o elimina elementos de tu menú.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Añadir Nuevo Elemento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Nombre</Label>
                <Input
                  id="new-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-category">Categoría</Label>
                <Input
                  id="new-category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Ej: Entradas, Platos Fuertes, Bebidas"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Descripción</Label>
              <Textarea
                id="new-description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-price">Precio</Label>
                <Input
                  id="new-price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-image">URL de Imagen (opcional)</Label>
                <Input
                  id="new-image"
                  type="url"
                  value={newItem.image || ""}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={handleAddItem}
              disabled={!newItem.name || !newItem.price || !newItem.category}
            >
              <Plus className="h-4 w-4 mr-2" /> Añadir Elemento
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Elementos del Menú Actuales ({menuItems.length})</h3>
            {menuItems.length === 0 ? (
              <p className="text-gray-500">No hay elementos en el menú. Añade algunos arriba.</p>
            ) : (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`item-name-${item.id}`}>Nombre</Label>
                        <Input
                          id={`item-name-${item.id}`}
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-price-${item.id}`}>Precio</Label>
                        <Input
                          id={`item-price-${item.id}`}
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor={`item-description-${item.id}`}>Descripción</Label>
                      <Textarea
                        id={`item-description-${item.id}`}
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`item-category-${item.id}`}>Categoría</Label>
                        <Input
                          id={`item-category-${item.id}`}
                          value={item.category}
                          onChange={(e) => handleItemChange(item.id, "category", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-image-${item.id}`}>URL de Imagen</Label>
                        <Input
                          id={`item-image-${item.id}`}
                          type="url"
                          value={item.image || ""}
                          onChange={(e) => handleItemChange(item.id, "image", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="bg-green-700 hover:bg-green-800">
            Guardar Menú
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
