import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">404 - Página No Encontrada</h2>
      <p className="text-lg text-gray-600 mb-8">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
      <Link href="/">
        <Button className="bg-green-700 hover:bg-green-800">Volver al Inicio</Button>
      </Link>
    </div>
  )
}
