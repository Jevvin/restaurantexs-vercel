"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant/restaurant-card"
import type { Restaurant } from "@/types/restaurant"

interface RestaurantCarouselProps {
  title: string
  restaurants: Restaurant[]
  linkHref: string
  linkText: string
}

export function RestaurantCarousel({ title, restaurants, linkHref, linkText }: RestaurantCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8 // Scroll 80% of visible width
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Button variant="link" asChild className="text-green-700 hover:text-green-800">
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 -mx-4 px-4" // Added negative margin and padding for full-width scroll
        >
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="flex-shrink-0 w-[300px] sm:w-[320px]">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {restaurants.length > 3 && ( // Only show arrows if there are more than 3 restaurants to scroll
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md z-10 -ml-4 hidden md:flex"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md z-10 -mr-4 hidden md:flex"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
