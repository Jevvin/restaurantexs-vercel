// components/restaurant/restaurant-amenities.tsx
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type Props = {
  amenities: { id?: number | string; name: string }[]
}

export function RestaurantAmenities({ amenities }: Props) {
  if (!amenities?.length) return null

  return (
    <section id="amenities" aria-label="Amenidades del restaurante">
      <Card className="p-5">
        <h2 className="text-[19px] font-semibold mb-2">Amenidades</h2>
        <div className="flex flex-wrap gap-2">
          {amenities.map((a, index) => (
            <Badge key={`${a.id ?? a.name}-${index}`} variant="outline">
              {a.name}
            </Badge>
          ))}
        </div>
      </Card>
    </section>
  )
}
