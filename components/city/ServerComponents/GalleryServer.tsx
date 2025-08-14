// components/city/ServerComponents/GalleryServer.tsx
import Image from "next/image"

interface Props {
  images: string[]
  altBase: string
  containerId: string
  sizes?: string
  /** Activa el carrusel "peek" en mobile (varias fotos visibles) */
  mobilePeek?: boolean
}

export default function GalleryServer({
  images,
  altBase,
  containerId,
  sizes,
  mobilePeek = true,
}: Props) {
  const total = images.length

  // Si NO queremos peek: 100% de ancho en todos los breakpoints
  const itemClass = mobilePeek ? "w-[80%] sm:w-[70%] md:w-full" : "w-full"

  // Clases del scroller: con peek usamos gap+padding; sin peek, nada.
  const scrollerClasses = [
    "flex h-full w-full overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar",
    "[-webkit-overflow-scrolling:touch]",
    mobilePeek ? "gap-3 px-4" : "gap-0 px-0", // ← aquí el switch
  ].join(" ")

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      aria-label={`Galería de ${altBase}`}
      role="region"
    >
      <ul id={containerId} className={scrollerClasses}>
        {images.map((src, i) => (
          <li
            key={`${src}-${i}`}
            className={`relative shrink-0 ${itemClass} snap-start h-full rounded-lg overflow-hidden`}
          >
            <Image
              src={src}
              alt={`${altBase} — foto ${i + 1} de ${total}`}
              fill
              className="object-cover select-none"
              sizes={sizes ?? "100vw"}
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </li>
        ))}
      </ul>

      <span className="sr-only">Galería con {total} imágenes</span>
    </div>
  )
}
