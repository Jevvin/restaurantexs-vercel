"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockReviews } from "@/lib/mock-data"
import type { Review } from "@/types/restaurant"
import { Star } from "lucide-react"

export default function ReviewsManagementPage() {
  // For demo, we'll use all mock reviews, but in a real app, filter by restaurantId
  const [reviews, setReviews] = useState<Review[]>(mockReviews)

  const handleOwnerResponseChange = (reviewId: string, message: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              ownerResponse: {
                message,
                createdAt: new Date().toISOString(), // Simulate current time
              },
            }
          : review,
      ),
    )
  }

  const handleSubmitResponse = (reviewId: string, message: string) => {
    console.log(`Respuesta para reseña ${reviewId}:`, message)
    // Aquí iría la lógica para enviar a Supabase
    alert("Respuesta guardada (simulado)!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Opiniones</CardTitle>
        <CardDescription>
          Responde a las opiniones de tus clientes y gestiona la reputación de tu restaurante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Aún no hay opiniones para gestionar.</p>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                    <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span>{new Date(review.createdAt).toLocaleDateString("es-MX")}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    {review.ownerResponse ? (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-3 rounded">
                        <div className="font-semibold text-blue-800 mb-1">Tu Respuesta:</div>
                        <p className="text-sm text-blue-700">{review.ownerResponse.message}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Respondido el: {new Date(review.ownerResponse.createdAt).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`response-${review.id}`}>Escribe tu respuesta:</Label>
                        <Textarea
                          id={`response-${review.id}`}
                          placeholder="Agradece al cliente o aborda sus comentarios..."
                          rows={3}
                          value={review.ownerResponse?.message || ""}
                          onChange={(e) => handleOwnerResponseChange(review.id, e.target.value)}
                        />
                        <Button
                          onClick={() => handleSubmitResponse(review.id, review.ownerResponse?.message || "")}
                          disabled={!review.ownerResponse?.message.trim()}
                          className="bg-green-700 hover:bg-green-800"
                        >
                          Publicar Respuesta
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
