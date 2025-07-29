import Link from "next/link"
import { MapPin, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getHomePageData } from "@/lib/mock-restaurants"

export default async function HomePage() {
  const { cities, categories, totalRestaurants, totalReviews } = await getHomePageData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Descubre los Mejores Restaurantes de México</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Explora miles de restaurantes, lee reseñas auténticas, encuentra promociones exclusivas y reserva tu mesa en
            los mejores lugares gastronómicos del país.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/cancun">Explorar Cancún</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/dashboard/registro">Registra tu Restaurante</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalRestaurants.toLocaleString()}+</div>
              <div className="text-gray-600">Restaurantes Registrados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{totalReviews.toLocaleString()}+</div>
              <div className="text-gray-600">Reseñas Verificadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{cities.length}+</div>
              <div className="text-gray-600">Ciudades Cubiertas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500K+</div>
              <div className="text-gray-600">Usuarios Activos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ciudades Destacadas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora los destinos gastronómicos más populares de México
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <Link key={city.slug} href={`/${city.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48">
                    <img
                      src={`/placeholder.svg?height=200&width=300&query=${city.name}-mexico-city`}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{city.name}</h3>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {city.restaurantCount} restaurantes
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explora por Categoría</h2>
            <p className="text-gray-600">Encuentra exactamente lo que buscas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const icons: Record<string, string> = {
                mariscos: "🦐",
                "comida-mexicana": "🌮",
                internacional: "🍕",
                buffet: "🍽️",
                desayunos: "🥞",
                "cafe-postres": "☕",
              }

              return (
                <Link key={category.slug} href={`/categoria/${category.slug}`}>
                  <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-3xl mb-2">{icons[category.slug] || "🍴"}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo Funciona?</h2>
            <p className="text-gray-600">Es muy fácil encontrar tu próximo lugar favorito</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Busca</h3>
              <p className="text-gray-600">
                Explora restaurantes por ciudad, categoría o usa nuestros filtros avanzados
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Compara</h3>
              <p className="text-gray-600">Lee reseñas reales, compara precios y revisa menús antes de decidir</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Disfruta</h3>
              <p className="text-gray-600">Visita el restaurante y comparte tu experiencia con la comunidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes un Restaurante?</h2>
          <p className="text-xl mb-8">
            Únete a miles de restaurantes que ya están creciendo con nosotros. Gestiona tu perfil, responde reseñas y
            atrae más clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/dashboard/registro">Registrar Restaurante Gratis</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/planes">Ver Planes Premium</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
