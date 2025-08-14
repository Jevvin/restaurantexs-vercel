"use client"

import { Card } from "@/components/ui/card"
import { Clock, ChevronDown, ChevronUp } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { RestaurantHour } from "@/types/database"

type Props = {
  hours: RestaurantHour[]
}

const daysMap: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
}

function formatTo12Hour(timeStr: string): string {
  const [hour, minute] = timeStr.split(":").map(Number)
  const period = hour >= 12 ? "p.m." : "a.m."
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`
}

function getTimeDiffInMinutes(date1: Date, date2: Date) {
  return Math.round((date2.getTime() - date1.getTime()) / (1000 * 60))
}

function getNowInMexicoCity(): Date {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const parts = formatter.formatToParts(now)
  const extract = (type: string) => parts.find(p => p.type === type)?.value ?? "00"

  const year = parseInt(extract("year"))
  const month = parseInt(extract("month")) - 1
  const day = parseInt(extract("day"))
  const hour = parseInt(extract("hour"))
  const minute = parseInt(extract("minute"))
  const second = parseInt(extract("second"))

  return new Date(year, month, day, hour, minute, second)
}

function getMexicoCityDateWithTime(timeStr: string): Date {
  const [h, m, s] = timeStr.split(":").map(Number)
  const now = getNowInMexicoCity()
  const d = new Date(now)
  d.setHours(h, m, s || 0, 0)
  return d
}

export function RestaurantHours({ hours }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean | null>(null)
  const sorted = [...hours].sort((a, b) => a.day - b.day)

  const { statusMessage, isOpen } = useMemo(() => {
    const now = getNowInMexicoCity()
    const today = now.getDay()
    const todayHour = hours.find((h) => Number(h.day) === today)

    if (!todayHour || !todayHour.is_open || !todayHour.open_time || !todayHour.close_time) {
      return { statusMessage: "Cerrado ahora", isOpen: false }
    }

    const open = getMexicoCityDateWithTime(todayHour.open_time)
    let close = getMexicoCityDateWithTime(todayHour.close_time)

    if (close <= open) {
      close.setDate(close.getDate() + 1)
    }

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
  }, [hours])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth >= 768
      setIsExpanded(isDesktop)
    }
  }, [])

  if (isExpanded === null) return null

  return (
    <section id="hours" aria-label="Horario del restaurante">
  <Card className={isExpanded ? "p-5" : "px-5 py-5"}>
    <button
      className="flex justify-between items-center w-full"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <h2 className="text-[19px] font-semibold text-black flex items-center gap-2">
        <Clock className="w-5 h-5 text-black" />
        Horario
      </h2>

      <div className="flex items-center gap-3">
        <span
          className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-[30px] ${
            isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isOpen && (
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          )}
          {statusMessage}
        </span>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    </button>

    {isExpanded && (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-[16px] font-normal table-fixed">
          <thead className="sr-only">
            <tr>
              <th scope="col">Día</th>
              <th scope="col">Horario</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h) => {
              const today = new Date().getDay()
              const isToday = Number(h.day) === today

              return (
                <tr
                  key={h.day}
                  className={`${isToday ? "bg-gray-100 rounded-md" : ""}`}
                >
                  {/* Columna días */}
                  <td className="w-1/2 text-left font-medium px-2 py-1 align-top">
                    <strong>{daysMap[h.day]}</strong>
                  </td>

                  {/* Columna horas */}
                  <td className="w-1/2 text-right px-2 py-1">
                    {!h.is_open || !h.open_time || !h.close_time ? (
                      "Cerrado"
                    ) : (
                      <>
                        De{" "}
                        <time dateTime={h.open_time}>
                          {formatTo12Hour(h.open_time)}
                        </time>{" "}
                        a{" "}
                        <time dateTime={h.close_time}>
                          {formatTo12Hour(h.close_time)}
                        </time>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )}
  </Card>
</section>


  )
}
