"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import RailControls from "./RailControls";
import { useDriftRail } from "./useDriftRail";
import { CATEGORIES, categoryCount } from "@/lib/data";

// "Shop by line": eyebrow + large serif heading with a View-all link, then a
// full-bleed rail of portrait tiles that drifts continuously (pauses on
// hover), each labelled in large white serif. Below: a count + hint on the
// left and a pair of outlined square arrows that nudge the rail one tile.
//
// The last tile is the full catalogue rather than a category, so every tile
// still points at a real destination.
const TILES = [
  ...CATEGORIES.map((c) => ({
    href: `/shop?category=${c.slug}`,
    label: c.label,
    image: c.image,
    meta: `${categoryCount(c.name)} ${categoryCount(c.name) === 1 ? "product" : "products"}`,
  })),
  {
    href: "/shop",
    label: "The full range",
    image: "/images/gen/why-consistency.webp",
    meta: "All products",
  },
];

// The set is repeated so the loop is seamless at any viewport width.
const COPIES = 4;
const GAP = 24;

export default function Categories() {
  const { trackRef, page, pauseHandlers, reduce } = useDriftRail({
    copies: COPIES,
    gap: GAP,
  });

  return (
    <section id="categories" className="section-pad overflow-hidden">
      <div className="container-lux">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-12">
          <Reveal>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-copper">
              Shop by line
            </p>
            <h2 className="mt-4 max-w-[900px] font-serif text-[clamp(2.25rem,4.2vw,4.25rem)] leading-[1] tracking-[-0.01em] text-dark">
              The complete research range, verified batch by batch.
            </h2>
          </Reveal>
          <Link
            href="/shop"
            className="link-underline mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-dark"
          >
            View all →
          </Link>
        </div>
      </div>

      {/* Full-bleed drifting rail */}
      <div {...pauseHandlers}>
        <ul
          ref={trackRef}
          className="flex w-max will-change-transform"
          style={{ gap: GAP, paddingRight: GAP }}
        >
          {Array.from({ length: COPIES }).flatMap((_, copy) =>
            TILES.map((tile) => {
              const clone = copy > 0;
              return (
                <li
                  key={`${copy}-${tile.href}`}
                  aria-hidden={clone || undefined}
                  className="w-[64vw] shrink-0 sm:w-[38vw] lg:w-[360px]"
                >
                  <Link
                    href={tile.href}
                    tabIndex={clone ? -1 : undefined}
                    className="group relative block aspect-[4/5] overflow-hidden bg-background-secondary"
                  >
                    <Image
                      src={tile.image}
                      alt={clone ? "" : tile.label}
                      fill
                      sizes="(max-width: 640px) 64vw, (max-width: 1024px) 38vw, 360px"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
                    />
                    {/* Bottom scrim so the white label reads on light photos. */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    />
                    <div className="absolute inset-x-6 bottom-6 text-white">
                      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white/80">
                        {tile.meta}
                      </p>
                      <p className="mt-1 font-serif text-[clamp(1.75rem,2.2vw,2.25rem)] leading-none tracking-[-0.01em]">
                        {tile.label}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <RailControls
        label={`${CATEGORIES.length} lines`}
        reduce={reduce}
        onPage={page}
        noun="lines"
      />
    </section>
  );
}
