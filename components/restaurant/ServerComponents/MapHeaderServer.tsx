// /components/restaurant/ServerComponents/MapHeaderServer.tsx

import { MapPin } from "lucide-react";

export default function MapHeaderServer({
  address,
  title = "Ubicación",
}: {
  address: string;
  title?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-[19px] font-semibold text-black flex items-center gap-2">
        <MapPin className="w-5 h-5 text-black" />
        {title}
      </h2>
      <address className="not-italic text-sm text-gray-700 mt-1">
        {address}
      </address>
    </div>
  );
}
