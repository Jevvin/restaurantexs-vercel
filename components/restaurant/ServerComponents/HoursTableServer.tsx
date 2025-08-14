// components/restaurant/ServerComponents/HoursTableServer.tsx

import { RestaurantHour } from "@/types/database"

type Props = { hours: RestaurantHour[] }

const daysMap: Record<number, string> = {
  0: "Domingo", 1: "Lunes", 2: "Martes", 3: "Miércoles",
  4: "Jueves", 5: "Viernes", 6: "Sábado",
}

function formatTo12Hour(timeStr: string): string {
  const [hour, minute] = timeStr.split(":").map(Number)
  const period = hour >= 12 ? "p.m." : "a.m."
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`
}

export default function HoursTableServer({ hours }: Props) {
  const sorted = [...hours].sort((a, b) => a.day - b.day)
  const today = new Date().getDay()

  return (
    <table className="w-full text-[16px] font-normal table-fixed" aria-label="Tabla de horarios">
      <thead className="sr-only">
        <tr>
          <th scope="col">Día</th>
          <th scope="col">Horario</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((h) => {
          const isToday = Number(h.day) === today
          return (
            <tr key={h.day} className={isToday ? "bg-gray-100 rounded-md" : ""}>
              <td className="w-1/2 text-left font-medium px-2 py-1 align-top">
                <strong>{daysMap[h.day]}</strong>
              </td>
              <td className="w-1/2 text-right px-2 py-1">
                {!h.is_open || !h.open_time || !h.close_time ? (
                  "Cerrado"
                ) : (
                  <>
                    De <time dateTime={h.open_time}>{formatTo12Hour(h.open_time)}</time> a{" "}
                    <time dateTime={h.close_time}>{formatTo12Hour(h.close_time)}</time>
                  </>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
