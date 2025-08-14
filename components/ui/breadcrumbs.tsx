// components/ui/breadcrumbs.tsx

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-[11px] md:text-[11px] lg:text-[12px] text-black",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-0 text-gray-400" />}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-black transition-colors text-[11px] md:text-[11px] lg:text-[12px]"
            >
              {item.label.toLocaleLowerCase()}
            </Link>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? "text-black text-[11px] md:text-[11px] lg:text-[12px]"
                  : ""
              }
            >
              {item.label.toLocaleLowerCase()}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
