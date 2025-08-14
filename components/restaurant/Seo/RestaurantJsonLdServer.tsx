// components/seo/RestaurantJsonLdServer.tsx

type OpeningHour = {
  day: number;                // 0=Dom, 1=Lun, ...
  open_time?: string;         // "09:00:00"
  close_time?: string;        // "18:00:00"
  is_open: boolean;
};

type Props = {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  phone?: string;
  website?: string;
  googleMapsUrl?: string;     // de tu columna google_maps_url
  priceRange?: string;        // ej: "$$", "$$$"
  ratingAverage?: number;     // ej: 4.5
  reviewsCount?: number;      // ej: 123
  servesCuisine?: string[];   // ej: ["Mexicana","Mariscos"]
  hours?: OpeningHour[];      // de restaurant_hours si quieres
};

export default function RestaurantJsonLdServer({
  name,
  address,
  lat,
  lng,
  phone,
  website,
  googleMapsUrl,
  priceRange,
  ratingAverage,
  reviewsCount,
  servesCuisine,
  hours,
}: Props) {
  const openingHours = (hours ?? [])
    .filter((h) => h.is_open && h.open_time && h.close_time)
    .map((h) => {
      const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${dayName(days[h.day])}`,
        opens: (h.open_time as string).slice(0, 5),  // "HH:MM"
        closes: (h.close_time as string).slice(0, 5),
      };
    });

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      // Si tienes ciudad/estado/código postal, agrégalos aquí:
      // addressLocality: cityName,
      // addressRegion: stateName,
      // postalCode: "XXXXX",
      // addressCountry: "MX",
    },
    ...(website ? { url: website } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(typeof lat === "number" && typeof lng === "number"
      ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } }
      : {}),
    ...(googleMapsUrl ? { sameAs: [googleMapsUrl] } : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(Array.isArray(servesCuisine) && servesCuisine.length
      ? { servesCuisine }
      : {}),
    ...(typeof ratingAverage === "number" && typeof reviewsCount === "number"
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: ratingAverage,
            reviewCount: reviewsCount,
          },
        }
      : {}),
    ...(openingHours.length ? { openingHoursSpecification: openingHours } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function dayName(code: string) {
  // Mapea "Su" -> "Sunday", etc., para la URL de schema
  const map: Record<string, string> = {
    Su: "Sunday",
    Mo: "Monday",
    Tu: "Tuesday",
    We: "Wednesday",
    Th: "Thursday",
    Fr: "Friday",
    Sa: "Saturday",
  };
  return map[code] || "Monday";
}
