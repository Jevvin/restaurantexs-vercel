// components/restaurant/ServerComponents/ReviewsSection.tsx
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Review } from "@/types/restaurant"
import { formatRating } from "@/lib/utils"
import ReviewsListServer from "./ReviewsListServer"
import {
  ReviewsProvider,
  ReviewsHeaderActions,
  ReviewsFormClient,
  ReviewsLoadMoreClient,
} from "@/components/restaurant/ClientComponents/ReviewsClient"

interface Props {
  initialReviews: Review[]
  averageRating: number
  totalReviews: number
  canWriteReview?: boolean
  restaurantId: string
  pageSize?: number
}

export default function ReviewsSection({
  initialReviews,
  averageRating,
  totalReviews,
  canWriteReview = false,
  restaurantId,
  pageSize = 10,
}: Props) {
  // Distribución (igual diseño). Siempre muestra 5 líneas; porcentaje sobre totalReviews.
  const ratingDistribution: Array<{ stars: number; count: number; percentage: number }> = [5, 4, 3, 2, 1].map(
    (stars: number) => {
      const count = initialReviews.filter((r) => Math.floor(r.rating) === stars).length
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
      return { stars, count, percentage }
    }
  )

  return (
    <Card id="reviews" className="p-5">
      <ReviewsProvider restaurantId={restaurantId} initialCount={initialReviews.length} pageSize={pageSize}>
        {/* Header (mismo layout) */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-[19px] font-semibold mb-2">Opiniones</h2>
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

          {/* Botón "Escribir opinión" (controlado en Client, mismo lugar/diseño) */}
          <ReviewsHeaderActions canWriteReview={canWriteReview} />
        </div>

        {/* Distribución (mismo diseño) */}
        <div className="mb-8">
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-2">
                <div className="flex items-center w-16">
                  <span className="text-sm">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                </div>
                {/* Fondo gris SIEMPRE visible */}
                <div className="flex-1 bg-gray-200 rounded-full h-2" aria-hidden>
                  {/* Relleno amarillo proporcional (0% si no hay) */}
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <div className="w-12 text-sm text-gray-600">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario (aparece cuando el botón lo activa; mismo diseño) */}
        <ReviewsFormClient canWriteReview={canWriteReview} />

        {/* Lista inicial SSR (mismo diseño) */}
        <ReviewsListServer reviews={initialReviews} />

        {/* Cargar más: sólo si hay >=10 iniciales y aún faltan por cargar */}
        <ReviewsLoadMoreClient
          totalReviews={totalReviews}
          showThreshold={10}
          ariaLabel="Cargar más opiniones"
        />
      </ReviewsProvider>
    </Card>
  )
}
