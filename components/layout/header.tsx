// components/layout/header.tsx
"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/** Header para desktop (lg y arriba) */
function HeaderDesktop() {
  const searchParams = useSearchParams()

  return (
    <div className="hidden lg:block w-full">
      {/* Top row */}
      <div className="flex items-center justify-between h-16 w-full">
        <div className="flex items-center gap-4 min-w-0">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-700 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" className="w-6 h-6" aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
              <path d="M10.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM13.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 14c-2.206 0-4 1.794-4 4h2c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4z" />
            </svg>
            Restaurantexs
          </Link>

          {/* Search (al centro, ocupa el espacio disponible) */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar"
              className="pl-9 pr-3 py-2 rounded-full bg-gray-100 border-none focus:ring-green-500 focus:ring-1 w-full"
              defaultValue={searchParams.get("query") || ""}
            />
          </div>
        </div>

        {/* Right nav */}
        <nav className="flex items-center space-x-4">
          <Link href="#" className="text-gray-700 hover:text-green-700 text-sm font-medium">Descubrir</Link>
          <Link href="#" className="text-gray-700 hover:text-green-700 text-sm font-medium">Viajes</Link>
          <Link href="#" className="text-gray-700 hover:text-green-700 text-sm font-medium">Escribir opinión</Link>
          <div className="flex items-center text-gray-700 text-sm font-medium">
            <Globe className="h-4 w-4 mr-1" aria-hidden="true" />
            MXN
            <ChevronDown className="h-3 w-3 ml-1" aria-hidden="true" />
          </div>
          <Button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
            Iniciar sesión
          </Button>
        </nav>
      </div>

      {/* Bottom nav */}
      <nav className="flex items-center space-x-6 h-12 text-sm text-gray-700 w-full">
        <Link href="#" className="hover:text-green-700 font-medium">Tulum Beach</Link>
        <Link href="#" className="hover:text-green-700 font-medium">Hoteles</Link>
        <Link href="#" className="hover:text-green-700 font-medium">Cosas que hacer</Link>
        <Link href="#" className="hover:text-green-700 font-medium border-b-2 border-green-700 pb-2">Restaurantes</Link>
        <Link href="#" className="hover:text-green-700 font-medium">Vuelos</Link>
        <Link href="#" className="hover:text-green-700 font-medium">Alquileres de vacaciones</Link>
        <Link href="#" className="hover:text-green-700 font-medium">Cruceros</Link>
        <Link href="#" className="hover:text-green-700 font-medium">Foros</Link>
      </nav>
    </div>
  )
}

/** Header para tablet y mobile (por debajo de lg) */
function HeaderMobile() {
  const searchParams = useSearchParams()

  return (
    <div className="lg:hidden w-full">
      {/* Una sola fila: Logo | Buscador | Iniciar sesión */}
      <div className="flex items-center h-14 gap-3 w-full">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-green-700 flex items-center gap-1 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="currentColor" className="w-6 h-6" aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
            <path d="M10.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM13.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 14c-2.206 0-4 1.794-4 4h2c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4z" />
          </svg>
          Restaurantexs
        </Link>

        {/* Buscador en medio */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar"
            className="pl-9 pr-3 py-2 rounded-full bg-gray-100 border-none focus:ring-green-500 focus:ring-1 w-full"
            defaultValue={searchParams.get("query") || ""}
          />
        </div>

        {/* Iniciar sesión */}
        <Button className="bg-white text-green-700 border border-green-700 hover:bg-green-50 px-3 py-2 rounded-full text-sm font-medium shrink-0 whitespace-nowrap">
  Iniciar sesión
</Button>

      </div>
    </div>
  )
}

/** Wrapper full width, sin padding lateral */
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b w-full">
      {/* SIN contenedor con padding: el header ocupa todo el ancho */}
      <HeaderDesktop />
      <HeaderMobile />
    </header>
  )
}
