import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthProvider } from "@/components/dashboard/auth-provider" // Import AuthProvider

const inter = Inter({ subsets: ["latin"] })

const keywords =
  "restaurantes México, directorio gastronómico, mariscos, comida mexicana, reseñas restaurantes, menús, ubicaciones restaurantes"

export const metadata: Metadata = {
  title: "Directorio Gastronómico - Los Mejores Restaurantes de México",
  description:
    "Descubre los mejores restaurantes, marisquerías y lugares gastronómicos de México. Reseñas, menús, ubicaciones y más.",
  keywords: keywords,
  openGraph: {
    title: "Directorio Gastronómico - Los Mejores Restaurantes de México",
    description: "Descubre los mejores restaurantes, marisquerías y lugares gastronómicos de México",
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
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* Wrap with AuthProvider */}
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
