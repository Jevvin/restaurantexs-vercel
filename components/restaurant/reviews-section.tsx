"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ThumbsUp, Flag, MoreHorizontal } from "lucide-react"
import type { Review } from "@/types/restaurant"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRating } from "@/lib/utils"

interface ReviewsSectionProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  canWriteReview?: boolean
  onSubmitReview?: (rating: number, comment: string, images?: File[]) => void
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  canWriteReview = false,
  onSubmitReview,
}: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const handleSubmitReview = () => {
    if (onSubmitReview && newComment.trim()) {
      onSubmitReview(newRating, newComment.trim(), selectedImages)
      setNewComment("")
      setNewRating(5)
      setSelectedImages([])
      setShowReviewForm(false)
    }
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    stars: rating,
    count: reviews.filter((r) => Math.floor(r.rating) === rating).length,
    percentage: (reviews.filter((r) => Math.floor(r.rating) === rating).length / totalReviews) * 100,
  }))

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Opiniones</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="ml-2 text-2xl font-bold">{formatRating(averageRating)}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{totalReviews.toLocaleString()}</span> opiniones
            </div>
          </div>
        </div>

        {canWriteReview && <Button onClick={() => setShowReviewForm(!showReviewForm)}>Escribir opinión</Button>}
      </div>

      {/* Distribución de calificaciones */}
      <div className="mb-8">
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-2">
              <div className="flex items-center w-16">
                <span className="text-sm">{stars}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
              </div>
              <div className="w-12 text-sm text-gray-600">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de nueva reseña */}
      {showReviewForm && (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h3 className="font-semibold mb-4">Escribe tu opinión</h3>

          {/* Selector de calificación */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Calificación</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} onClick={() => setNewRating(rating)} className="p-1">
                  <Star
                    className={`h-6 w-6 ${rating <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Campo de comentario */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tu opinión</label>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmitReview} disabled={!newComment.trim()}>
              Publicar opinión
            </Button>
            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-6">
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
                    <div className="flex items-center gap-2">
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
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("es-MX")}
                      </span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                {/* Imágenes de la reseña */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((image, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Foto de ${review.userName}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Respuesta del propietario */}
                {review.ownerResponse && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-3 rounded">
                    <div className="flex items-center mb-1">
                      <Badge variant="outline" className="text-xs">
                        Respuesta del propietario
                      </Badge>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(review.ownerResponse.createdAt).toLocaleDateString("es-MX")}
                      </span>
                    </div>
                    <p className="text-sm">{review.ownerResponse.message}</p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-4 mt-3">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Útil
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Flag className="h-4 w-4 mr-1" />
                    Reportar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aún no hay opiniones para este restaurante.</p>
          {canWriteReview && <p className="mt-2">¡Sé el primero en dejar una opinión!</p>}
        </div>
      )}
    </div>
  )
}
