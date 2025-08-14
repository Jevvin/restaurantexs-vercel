// components/seo/MenuJsonLdServer.tsx

import { MenuCategory, MenuProduct } from "@/types/database";

type Props = {
  restaurantName: string;
  categories: MenuCategory[];
  products: MenuProduct[];
  priceCurrency?: string; // "MXN" por defecto
};

export default function MenuJsonLdServer({
  restaurantName,
  categories,
  products,
  priceCurrency = "MXN",
}: Props) {
  const sections = categories
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => {
      const items = products
        .filter((p) => p.category_id === c.id && p.is_available)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p) => ({
          "@type": "MenuItem",
          name: p.name,
          ...(p.description ? { description: p.description } : {}),
          offers: {
            "@type": "Offer",
            price: Number(p.price),
            priceCurrency,
            availability: "https://schema.org/InStock",
          },
        }));

      return items.length
        ? { "@type": "MenuSection", name: c.name, hasMenuItem: items }
        : null;
    })
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${restaurantName} - Menú`,
    hasMenuSection: sections,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
