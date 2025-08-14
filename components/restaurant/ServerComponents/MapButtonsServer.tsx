// /components/restaurant/ServerComponents/MapButtonsServer.tsx

import { ExternalLink, Navigation } from "lucide-react";

type Props = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  googleMapsLink?: string;
};

export default function MapButtonsServer({
  name,
  address,
  lat,
  lng,
  googleMapsLink,
}: Props) {
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const openHref =
    googleMapsLink &&
    googleMapsLink.trim().length > 0
      ? googleMapsLink
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${name} ${address}`
        )}`;

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-transparent inline-flex items-center justify-center px-4 py-2 md:px-3 md:py-2 lg:px-3 lg:py-2 border rounded-md text-[14px] md:text-[13px] font-medium hover:bg-gray-100 leading-none"


        >
          <Navigation className="h-4 w-4 mr-2" />
          Cómo llegar
        </a>
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-transparent inline-flex items-center justify-center px-4 py-2 md:px-3 md:py-1.5 lg:px-3 lg:py-2 border rounded-md text-[14px] md:text-[13px] font-medium hover:bg-gray-100 leading-none"


        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir en Google
        </a>
      </div>
    </div>
  );
}
