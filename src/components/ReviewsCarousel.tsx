"use client";

// Customer review carousel, modelled on the reference: a full-bleed row that
// alternates two tile types —
//   • photo tiles: portrait, with name / product / serif quote / stars below;
//   • quote cards: a cream panel with stars, a large quote, the name, and the
//     product (name, strength, pack shot) pinned to the bottom.
// Square dark arrows sit on both edges; the row loops endlessly.
//
// Content: TESTIMONIALS in data.ts; each review is paired with a product in
// order.
import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { PRODUCTS, TESTIMONIALS } from "@/lib/data";

const shortName = (name: string) => name.replace(/\s*\(.*?\)\s*$/, "").trim();

const REVIEWS = TESTIMONIALS.map((t, i) => ({
  ...t,
  product: PRODUCTS[i % PRODUCTS.length],
}));

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-[3px] text-[#F5C400] ${className}`} aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden className="h-3 w-3 fill-current">
          <path d="M10 1.5l2.47 5.26 5.78.62-4.32 3.86 1.2 5.7L10 14.9 4.87 18.4l1.2-5.7L1.75 8.84l5.78-.62L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === "next" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
    </svg>
  );
}

type Review = (typeof REVIEWS)[number];

function PhotoTile({ r }: { r: Review }) {
  return (
    <figure className="flex h-full flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-background-secondary">
        <Image
          src={r.image}
          alt={r.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 340px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <figcaption className="px-4 pt-5 text-center">
        <p className="text-[0.8125rem] font-semibold uppercase tracking-[-0.005em] text-dark">
          {r.name}
        </p>
        <p className="mt-1 text-[0.875rem] text-dark">{shortName(r.product.name)}</p>
        <blockquote className="mt-3 font-serif text-[1.125rem] leading-snug text-dark">
          &ldquo;{r.quote}&rdquo;
        </blockquote>
        <Stars className="mt-4 justify-center" />
      </figcaption>
    </figure>
  );
}

function QuoteCard({ r }: { r: Review }) {
  return (
    <figure className="flex aspect-[4/5] w-full flex-col bg-background-secondary p-7">
      <Stars />
      <blockquote className="mt-4 text-[1.25rem] leading-[1.2] tracking-[-0.01em] text-dark">
        &ldquo;{r.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-[0.75rem] font-semibold text-dark">
        {r.name} · {r.role}
      </figcaption>

      <Link
        href={`/products/${r.product.slug}`}
        className="mt-auto flex items-center justify-between gap-4 pt-6"
      >
        <span>
          <span className="block text-[0.875rem] font-semibold leading-tight text-dark">
            {shortName(r.product.name)}
          </span>
          <span className="mt-1 block text-[0.75rem] text-muted">
            {r.product.summary}
          </span>
        </span>
        <span className="relative h-20 w-28 shrink-0 overflow-hidden">
          <Image
            src={r.product.image}
            alt=""
            fill
            sizes="112px"
            className="object-cover"
          />
        </span>
      </Link>
    </figure>
  );
}

// The set is rendered COPIES times so the row always overflows and bleeds
// off both screen edges. It starts on the middle copy and silently re-centres
// when scrolled near either end, so paging loops forever.
const COPIES = 3;
const GAP = 24;

export default function ReviewsCarousel() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLUListElement>(null);

  const setWidth = () => {
    const el = railRef.current;
    return el ? el.scrollWidth / COPIES : 0;
  };

  // Start with the middle copy centred on screen, so partial tiles bleed off
  // both edges like the reference.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const centre = () => {
      const w = setWidth();
      el.scrollLeft = w + (w - el.clientWidth) / 2;
    };
    centre();
    window.addEventListener("resize", centre);
    return () => window.removeEventListener("resize", centre);
  }, []);

  // Keep the scroll position inside the middle copy.
  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const w = setWidth();
    if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
    else if (el.scrollLeft > w * 1.5) el.scrollLeft -= w;
  }, []);

  const page = (dir: 1 | -1) => {
    const el = railRef.current;
    const tile = el?.firstElementChild as HTMLElement | null;
    if (!el || !tile) return;
    el.scrollBy({
      left: dir * (tile.offsetWidth + GAP),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const arrowCls =
    "absolute top-[calc(var(--tile-h)/2)] z-10 grid h-20 w-20 -translate-y-1/2 place-items-center bg-dark text-white transition-colors duration-300 hover:bg-copper max-md:h-12 max-md:w-12";

  return (
    <section id="reviews" className="section-pad overflow-hidden">
      <div className="container-lux mb-14 text-center">
        <h2 className="text-hero text-dark">Verified by researchers.</h2>
        <p className="mt-6 text-[1rem] text-dark">
          Real labs. Real batches. Every report published.
        </p>
        <Link
          href="/#testimonials"
          className="mt-8 inline-flex h-11 items-center justify-center border border-dark px-6 text-[0.875rem] font-bold uppercase leading-none tracking-[-0.03em] text-dark transition-colors duration-300 hover:bg-dark hover:text-white"
        >
          See the expert reviews
        </Link>
      </div>

      <div className="relative [--tile-h:calc(min(342px,78vw)*1.25)]">
        <button
          type="button"
          onClick={() => page(-1)}
          aria-label="Previous reviews"
          className={`${arrowCls} left-0`}
        >
          <Chevron dir="prev" />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          aria-label="Next reviews"
          className={`${arrowCls} right-0`}
        >
          <Chevron dir="next" />
        </button>

        <ul
          ref={railRef}
          onScroll={onScroll}
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ gap: GAP, paddingRight: GAP }}
        >
          {Array.from({ length: COPIES }).flatMap((_, copy) =>
            REVIEWS.map((r, i) => {
              const clone = copy !== 1;
              return (
                <li
                  key={`${copy}-${r.name}`}
                  aria-hidden={clone || undefined}
                  inert={clone || undefined}
                  className="group w-[min(342px,78vw)] shrink-0"
                >
                  {i % 2 === 0 ? <PhotoTile r={r} /> : <QuoteCard r={r} />}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </section>
  );
}
