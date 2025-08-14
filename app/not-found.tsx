import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Página no encontrada
      </h2>
      <p className="text-base md:text-lg text-gray-600 max-w-lg mb-8">
        Lo sentimos, no pudimos encontrar la página que estás buscando.  
        Es posible que el enlace esté roto o que la página haya sido eliminada.
      </p>
      <Link href="/" passHref>
        <Button size="lg" className="bg-green-700 hover:bg-green-800">
          Volver al inicio
        </Button>
      </Link>
    </div>
  )
}
