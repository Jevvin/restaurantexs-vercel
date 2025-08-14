// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const keywords =
  "restaurantes México, directorio gastronómico, mariscos, comida mexicana, reseñas restaurantes, menús, ubicaciones restaurantes"

export const metadata: Metadata = {
  title: "Directorio Gastronómico - Los Mejores Restaurantes de México",
  description:
    "Descubre los mejores restaurantes, marisquerías y lugares gastronómicos de México. Reseñas, menús, ubicaciones y más.",
  keywords,
  openGraph: {
    title: "Directorio Gastronómico - Los Mejores Restaurantes de México",
    description:
      "Descubre los mejores restaurantes, marisquerías y lugares gastronómicos de México",
    type: "website",
    locale: "es_MX",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={poppins.variable}>
      <body className="font-sans">
        <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto">
          <Header />
          <main className="mt-2 mb-8">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
