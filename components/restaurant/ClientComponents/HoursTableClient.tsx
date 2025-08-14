// components/restaurant/ClientComponents/HoursTableClient.tsx
"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import HoursTableServer from "@/components/restaurant/ServerComponents/HoursTableServer"
import HoursHeadingServer from "@/components/restaurant/ServerComponents/HoursHeadingServer"
import { RestaurantHour } from "@/types/database"

type Props = { hours: RestaurantHour[]; timezone: string }

function getTimeDiffInMinutes(date1: Date, date2: Date) {
  return Math.round((date2.getTime() - date1.getTime()) / (1000 * 60))
}

// Fecha/hora "actual" en la TZ del restaurante
function getNowInTz(tz: string): Date {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const parts = formatter.formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "00"
  const y = parseInt(get("year"))
  const m = parseInt(get("month")) - 1
  const d = parseInt(get("day"))
  const H = parseInt(get("hour"))
  const M = parseInt(get("minute"))
  const S = parseInt(get("second"))
  return new Date(y, m, d, H, M, S)
}

// Construye una fecha "hoy" en la TZ con la hora HH:mm:ss del horario
function getTzDateWithTime(tz: string, timeStr: string): Date {
  const [h, m, s] = timeStr.split(":").map(Number)
  const base = getNowInTz(tz)
  const d = new Date(base)
  d.setHours(h, m, s || 0, 0)
  return d
}

export default function HoursTableClient({ hours, timezone }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    setIsExpanded(window.innerWidth >= 768)
  }, [])

  const { statusMessage, isOpen } = (() => {
    const tz = timezone || "America/Mexico_City"
    const now = getNowInTz(tz)

    // OJO: Date.getDay(): 0=Dom ... 6=Sáb. Asegúrate que hours.day use el mismo esquema.
    const today = now.getDay()
    const todayHour = hours.find((h) => Number(h.day) === today)

    if (!todayHour || !todayHour.is_open || !todayHour.open_time || !todayHour.close_time) {
      return { statusMessage: "Cerrado ahora", isOpen: false }
    }

    const open = getTzDateWithTime(tz, todayHour.open_time)
    let close = getTzDateWithTime(tz, todayHour.close_time)
    if (close <= open) close.setDate(close.getDate() + 1) // cruza medianoche

    if (now >= open && now < close) {
      const diff = getTimeDiffInMinutes(now, close)
      return {
        statusMessage: diff <= 30 ? `Abierto ahora • Cierra en ${diff} min` : "Abierto ahora",
        isOpen: true,
      }
    }

    if (now < open) {
      const diff = getTimeDiffInMinutes(now, open)
      return {
        statusMessage: diff <= 30 ? `Cerrado ahora • Abre en ${diff} min` : "Cerrado ahora",
        isOpen: false,
      }
    }

    return { statusMessage: "Cerrado ahora", isOpen: false }
  })()

  return (
    <section id="hours" aria-label="Horario del restaurante">
      <Card className="px-5 py-5">
        <div className="flex w-full items-center justify-between">
          <HoursHeadingServer />
          <button
            className="flex items-center gap-3"
            aria-expanded={isExpanded}
            aria-controls="hours-table"
            onClick={() => setIsExpanded(prev => !prev)}
          >
            <span
              className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-[30px] ${
                isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isOpen && <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />}
              {statusMessage}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div id="hours-table" className="mt-4 overflow-x-auto">
            <HoursTableServer hours={hours} />
          </div>
        )}
      </Card>
    </section>
  )
}
