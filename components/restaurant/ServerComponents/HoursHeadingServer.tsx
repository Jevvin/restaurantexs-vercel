// components/restaurant/ServerComponents/HoursHeadingServer.tsx

import { Clock } from "lucide-react";

export default function HoursHeadingServer() {
  return (
    <h2 className="text-[19px] font-semibold text-black flex items-center gap-2">
      <Clock className="w-5 h-5 text-black" />
      Horario
    </h2>
  );
}
