// components/restaurant/ClientComponents/ReviewsClient.tsx
"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

type Ctx = {
  showForm: boolean
  toggleForm: () => void
  initialCount: number
  pageSize: number
}

const ReviewsCtx = createContext<Ctx | null>(null)

export function ReviewsProvider({
  children,
  restaurantId,
  initialCount,
  pageSize = 10,
}: {
  children: React.ReactNode
  restaurantId: string
  initialCount: number
  pageSize?: number
}) {
  const [showForm, setShowForm] = useState(false)
  const value = useMemo(
    () => ({
      showForm,
      toggleForm: () => setShowForm((v) => !v),
      initialCount,
      pageSize,
    }),
    [showForm, initialCount, pageSize]
  )

  return <ReviewsCtx.Provider value={value}>{children}</ReviewsCtx.Provider>
}

function useReviewsCtx() {
  const ctx = useContext(ReviewsCtx)
  if (!ctx) throw new Error("Reviews components must be used inside <ReviewsProvider>")
  return ctx
}

/** Botón del header: “Escribir opinión” (mismo diseño/ubicación) */
export function ReviewsHeaderActions({ canWriteReview }: { canWriteReview: boolean }) {
  const { toggleForm } = useReviewsCtx()
  if (!canWriteReview) return null
  return <Button onClick={toggleForm}>Escribir opinión</Button>
}

/** Formulario (mismo diseño). Aún no envía; placeholders listos para conectar. */
export function ReviewsFormClient({ canWriteReview }: { canWriteReview: boolean }) {
  const { showForm, toggleForm } = useReviewsCtx()
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")

  const handleSubmit = () => {
    // TODO: conectar a tu API o server action (createReview)
    // if (newComment.trim()) { ... }
    // Por ahora solo resetea para mantener UX
    if (!newComment.trim()) return
    setNewComment("")
    setNewRating(5)
    toggleForm()
  }

  if (!canWriteReview || !showForm) return null

  return (
    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
      <h3 className="font-semibold mb-4">Escribe tu opinión</h3>

      {/* Selector de calificación (idéntico) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Calificación</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button key={rating} onClick={() => setNewRating(rating)} className="p-1" aria-label={`${rating} estrellas`}>
              <Star className={`h-6 w-6 ${rating <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Campo de comentario (idéntico) */}
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
        <Button onClick={handleSubmit} disabled={!newComment.trim()}>
          Publicar opinión
        </Button>
        <Button variant="outline" onClick={toggleForm}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

/** Botón “Cargar más opiniones”: sólo si hay >= showThreshold y faltan más */
export function ReviewsLoadMoreClient({
  totalReviews,
  showThreshold = 10,
  ariaLabel,
}: {
  totalReviews: number
  showThreshold?: number
  ariaLabel?: string
}) {
  const { initialCount, pageSize } = useReviewsCtx()

  const hasEnoughInitial = initialCount >= showThreshold
  const hasMore = totalReviews > initialCount

  if (!hasEnoughInitial || !hasMore) return null

  const handleLoadMore = () => {
    // TODO: conectar a tu API o server action (paginación)
    // Por ahora, placeholder sin acción
  }

  return (
    <div className="flex justify-center mt-6">
      <Button variant="outline" onClick={handleLoadMore} aria-label={ariaLabel}>
        Cargar más opiniones
      </Button>
    </div>
  )
}
