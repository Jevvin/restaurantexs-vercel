// @/components/restaurant/ClientComponents/MapRestaurantClient"

"use client";

import { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import MapHeaderServer from "@/components/restaurant/ServerComponents/MapHeaderServer";
import MapButtonsServer from "@/components/restaurant/ServerComponents/MapButtonsServer";

type Props = {
  title?: string;
  address: string;
  lat?: number;
  lng?: number;
  googleMapsLink?: string;
  mapHeight?: number; // default 320
  className?: string;
};

export default function MapRestaurantClient({
  title = "Ubicación",
  address,
  lat,
  lng,
  googleMapsLink,
  mapHeight = 320,
  className,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const hasCoords = typeof lat === "number" && typeof lng === "number";

  return (
    <section className={className} id="location" aria-label="Mapa y dirección del restaurante">
      <Card className="p-5">
        {/* Header (SERVER): título + dirección */}
        <MapHeaderServer title={title} address={address} />

        {/* Mapa (CLIENT): react-map-gl */}
        <div className="h-80 rounded overflow-hidden" aria-hidden="true" style={{ height: mapHeight }}>
          {isMounted && hasCoords && (
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              initialViewState={{
                latitude: lat!,
                longitude: lng!,
                zoom: 14,
              }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              style={{ width: "100%", height: "100%" }}
            >
              <Marker latitude={lat!} longitude={lng!} anchor="bottom">
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                  <MapPin className="text-white w-5 h-5" />
                </div>
              </Marker>
              <NavigationControl position="bottom-right" showZoom />
            </Map>
          )}
        </div>

        {/* Botones (SERVER): iguales a los tuyos */}
        {hasCoords && (
          <MapButtonsServer
            name={title}
            address={address}
            lat={lat!}
            lng={lng!}
            googleMapsLink={googleMapsLink}
          />
        )}
      </Card>
    </section>
  );
}
