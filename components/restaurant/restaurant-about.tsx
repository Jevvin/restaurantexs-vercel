// components/restaurant/restaurant-about.tsx
import { Card } from "@/components/ui/card"

interface Props {
  description: string
}

export function RestaurantAbout({ description }: Props) {
  if (!description?.trim()) return null

  return (
    <section id="about" aria-label="Acerca del restaurante">
      <Card className="p-5">
        <h2 className="text-[19px] font-semibold mb-2">Acerca de</h2>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </Card>
    </section>
  )
}
