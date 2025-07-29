import type React from "react"
import { notFound } from "next/navigation"
import { RestaurantSidebar } from "@/components/dashboard/restaurant-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { getRestaurantBySlug } from "@/lib/mock-restaurants"

export default async function RestaurantDashboardLayout({ children }: { children: React.ReactNode }) {
  // For demo purposes, we'll hardcode a restaurant slug.
  // In a real app, this would come from the authenticated user's restaurant ID.
  const demoRestaurantSlug = "la-pescaderia-del-puerto"
  const restaurant = await getRestaurantBySlug(demoRestaurantSlug)

  if (!restaurant) {
    notFound() // Or redirect to a "no restaurant assigned" page
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <RestaurantSidebar restaurantName={restaurant.name} restaurantSlug={restaurant.slug} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold text-gray-900">Dashboard de {restaurant.name}</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
