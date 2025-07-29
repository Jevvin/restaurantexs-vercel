import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Directorio Gastronómico</h3>
            <p className="text-gray-400 text-sm">
              Descubre los mejores restaurantes y lugares gastronómicos de México.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Ciudades Populares</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/cancun" className="hover:text-white">
                  Cancún
                </Link>
              </li>
              <li>
                <Link href="/playa-del-carmen" className="hover:text-white">
                  Playa del Carmen
                </Link>
              </li>
              <li>
                <Link href="/merida" className="hover:text-white">
                  Mérida
                </Link>
              </li>
              <li>
                <Link href="/puerto-vallarta" className="hover:text-white">
                  Puerto Vallarta
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/mariscos" className="hover:text-white">
                  Mariscos
                </Link>
              </li>
              <li>
                <Link href="/comida-mexicana" className="hover:text-white">
                  Comida Mexicana
                </Link>
              </li>
              <li>
                <Link href="/internacional" className="hover:text-white">
                  Internacional
                </Link>
              </li>
              <li>
                <Link href="/buffet" className="hover:text-white">
                  Buffet
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Para Restaurantes</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/dashboard/registro" className="hover:text-white">
                  Registra tu restaurante
                </Link>
              </li>
              <li>
                <Link href="/dashboard/login" className="hover:text-white">
                  Acceso restaurantes
                </Link>
              </li>
              <li>
                <Link href="/planes" className="hover:text-white">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="hover:text-white">
                  Ayuda
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Directorio Gastronómico. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
