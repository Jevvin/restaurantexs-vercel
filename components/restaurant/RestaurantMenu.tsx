// components/restaurant/RestaurantMenu.tsx
import { MenuCategory, MenuProduct } from "@/types/database"
import { Card } from "@/components/ui/card"

interface RestaurantMenuProps {
  categories: MenuCategory[]
  products: MenuProduct[]
}

export function RestaurantMenu({ categories, products }: RestaurantMenuProps) {
  // ✅ Formateador de precios (MXN)
  const fmt = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  })

  const activeCategories = categories
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <section id="menu" aria-label="Menú del restaurante">
      <Card className="p-5 space-y-12">
        <h2 className="text-[19px] font-semibold mb-2">Menú</h2>

        {activeCategories.map((category) => {
          const categoryProducts = products
            .filter((p) => p.category_id === category.id && p.is_available)
            .sort((a, b) => a.sort_order - b.sort_order)

          if (categoryProducts.length === 0) return null

          return (
            <div key={category.id} id={`menu-cat-${category.id}`}>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                {category.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categoryProducts.map((product) => (
                  <article key={product.id} className="border p-4 rounded-lg">
                    <h4 className="font-semibold text-lg">{product.name}</h4>
                    {product.description && (
                      <p className="text-sm text-neutral-600">{product.description}</p>
                    )}
                    <div className="mt-2 font-medium text-green-700">
                      {fmt.format(product.price)}
                    </div>
                    {product.label && (
                      <span className="inline-block mt-1 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                        {product.label}
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </Card>
    </section>
  )
}
