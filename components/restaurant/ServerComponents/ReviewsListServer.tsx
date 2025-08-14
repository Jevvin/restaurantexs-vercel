// components/restaurant/ServerComponents/ReviewsListServer.tsx
import Image from "next/image"
import { Star, MoreHorizontal, ThumbsUp, Flag } from "lucide-react"
import type { Review } from "@/types/restaurant"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ReviewsListServer({ reviews }: { reviews: Review[] }) {
  if (!reviews?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aún no hay opiniones para este restaurante.</p>
        {/* El texto de “sé el primero” lo controla el Client si canWriteReview === true */}
      </div>
    )
  }

  return (
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
                        loading="lazy"
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

              {/* Acciones (idéntico + placeholders no funcionales) */}
              <div className="flex items-center gap-4 mt-3">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Útil
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Flag className="h-4 w-4 mr-1" />
                  Reportar
                </Button>
                {/* Placeholders adicionales, mismo estilo (no funcionales) */}
                <Button variant="ghost" size="sm" className="text-gray-500">
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
