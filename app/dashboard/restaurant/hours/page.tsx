"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRestaurants } from "@/lib/mock-data"
import type { BusinessHours } from "@/types/restaurant"

export default function HoursSettingsPage() {
  const demoRestaurant = mockRestaurants.find((r) => r.slug === "la-pescaderia-del-puerto") || mockRestaurants[0]

  const [hours, setHours] = useState<BusinessHours>(demoRestaurant.hours)

  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]
  const dayNames: Record<string, string> = {
    lun: "Lunes",
    mar: "Martes",
    mie: "Miércoles",
    jue: "Jueves",
    vie: "Viernes",
    sab: "Sábado",
    dom: "Domingo",
  }

  const handleHourChange = (day: string, field: "open" | "close", value: string) => {
    setHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        [field]: value,
      },
    }))
  }

  const handleClosedChange = (day: string, checked: boolean) => {
    setHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        isClosed: checked,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Horarios actualizados:", hours)
    // Aquí iría la lógica para enviar a Supabase
    alert("Horarios guardados (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios de Apertura</CardTitle>
        <CardDescription>Configura los horarios de tu restaurante para cada día de la semana.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {daysOfWeek.map((day) => (
            <div key={day} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="font-medium capitalize">{dayNames[day]}</Label>
              <div className="flex items-center space-x-2 md:col-span-3">
                <Checkbox
                  id={`closed-${day}`}
                  checked={hours[day]?.isClosed || false}
                  onCheckedChange={(checked) => handleClosedChange(day, checked as boolean)}
                />
                <Label htmlFor={`closed-${day}`} className="text-sm">
                  Cerrado todo el día
                </Label>
              </div>
              {!hours[day]?.isClosed && (
                <>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor={`open-${day}`}>Apertura</Label>
                    <Input
                      id={`open-${day}`}
                      type="time"
                      value={hours[day]?.open || ""}
                      onChange={(e) => handleHourChange(day, "open", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor={`close-${day}`}>Cierre</Label>
                    <Input
                      id={`close-${day}`}
                      type="time"
                      value={hours[day]?.close || ""}
                      onChange={(e) => handleHourChange(day, "close", e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          <Button type="submit" className="bg-green-700 hover:bg-green-800">
            Guardar Horarios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
