"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, Clock, MapPin, ImageIcon, Utensils, Tag, Star, List, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

interface RestaurantSidebarProps {
  restaurantName: string
  restaurantSlug: string
}

export function RestaurantSidebar({ restaurantName, restaurantSlug }: RestaurantSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navigationItems = [
    {
      label: "General",
      items: [
        {
          href: `/dashboard/restaurant`,
          icon: Home,
          label: "Inicio",
        },
        {
          href: `/dashboard/restaurant/general`,
          icon: Settings,
          label: "Información General",
        },
        {
          href: `/dashboard/restaurant/hours`,
          icon: Clock,
          label: "Horarios",
        },
        {
          href: `/dashboard/restaurant/location`,
          icon: MapPin,
          label: "Ubicación",
        },
        {
          href: `/dashboard/restaurant/images`,
          icon: ImageIcon,
          label: "Imágenes",
        },
        {
          href: `/dashboard/restaurant/amenities`,
          icon: List,
          label: "Servicios",
        },
      ],
    },
    {
      label: "Gestión",
      items: [
        {
          href: `/dashboard/restaurant/menu`,
          icon: Utensils,
          label: "Menú",
        },
        {
          href: `/dashboard/restaurant/promotions`,
          icon: Tag,
          label: "Promociones",
        },
        {
          href: `/dashboard/restaurant/reviews`,
          icon: Star,
          label: "Opiniones",
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" className="bg-gray-900 text-gray-50">
      <SidebarHeader className="p-4">
        <Link href="/dashboard/restaurant" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="group-data-[state=collapsed]:hidden">{restaurantName || "Dashboard Restaurante"}</span>
          <span className="group-data-[state=expanded]:hidden">
            <Utensils className="h-6 w-6" />
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-auto">
        {navigationItems.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-gray-400 group-data-[state=collapsed]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="group-data-[state=collapsed]:hidden">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
