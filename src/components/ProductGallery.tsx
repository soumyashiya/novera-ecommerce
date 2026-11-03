"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const gallery = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden lg:">
        <Image
          key={gallery[active]}
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain img-grade transition-opacity duration-500"
        />
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex justify-center gap-3">
          {gallery.map((src, i) => {
            const selected = i === active;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={selected}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden border transition-colors duration-300 ${
                  selected
                    ? "border-copper ring-1 ring-copper/40"
                    : "border-line hover:border-dark/30"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className={`object-contain img-grade transition-opacity duration-300 ${
                    selected ? "opacity-100" : "opacity-80 hover:opacity-100"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
