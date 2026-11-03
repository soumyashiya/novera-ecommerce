"use client";

// The product row under the hero: a sentence-case serif heading, then a
// four-across row of ProductCards that pages sideways with an arrow on each
// side (no auto-motion). Still server-rendered, so the product links are in
// the initial HTML for crawlers.
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "@/lib/data";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === "next" ? (
        <path d="M5 12h14M13 6l6 6-6 6" />
      ) : (
        <path d="M19 12H5M11 6l-6 6 6 6" />
      )}
    </svg>
  );
}

// Vertically centred on the card IMAGE, not the whole card: margin-top
// percentages resolve against the container's width, so this is half the
// 4:5 image height for a 2-up (mobile) / 4-up (desktop) row.
/** How long each card rests before the rail steps to the next one. */
const PAGE_MS = 4000;

// NB: no `disabled:pointer-events-none`. It removes the button from hit
// testing, so once the rail reaches an end the click lands on the product
// card sitting underneath and navigates to its detail page. A `disabled`
// button already swallows clicks without firing them, which is what we want —
// it just has to stay in the hit-test tree to do it.
const arrowCls =
  "absolute top-0 z-20 mt-[calc((100%-16px)*0.3125)] lg:mt-[calc((100%-72px)*0.15625)] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-dark shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-[background-color,color,opacity] duration-300 hover:bg-dark hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white/90 disabled:hover:text-dark";

export default function Products() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  // Advance by one card plus its gap, so paging lands on a card edge.
  const page = useCallback(
    (dir: 1 | -1) => {
      const el = railRef.current;
      const card = el?.firstElementChild as HTMLElement | null;
      if (!el || !card) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      el.scrollBy({
        left: dir * (card.offsetWidth + gap),
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce]
  );

  // ── Autoplay ──────────────────────────────────────────────────────────
  // Steps one card every PAGE_MS and rewinds at the end. Held whenever the
  // rail shouldn't be moving under someone: pointer over it, keyboard focus
  // inside it, a touch in progress, the tab hidden, or the rail scrolled off
  // screen. Disabled outright under prefers-reduced-motion.
  const held = useRef(false);
  const hold = useCallback((v: boolean) => () => (held.current = v), []);

  useEffect(() => {
    const el = railRef.current;
    if (!el || reduce) return;

    let onScreen = true;
    const io = new IntersectionObserver(
      ([e]) => (onScreen = e.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);

    const id = window.setInterval(() => {
      if (held.current || !onScreen || document.hidden) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        page(1);
      }
    }, PAGE_MS);

    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [reduce, page]);

  return (
    <section id="products" className="section-pad !pt-12">
      <div className="container-lux">
        {/* Not wrapped in <Reveal>: it sits just under the hero fold and
            should be visible on load, as on the reference. */}
        <h2 className="mb-8 text-section lg:!text-[1.75rem]">
          Shop our independently tested research range.
        </h2>

        {/* Hold autoplay while anyone is actually using the rail. Pointer and
            focus cover mouse and keyboard; touchstart/touchend cover a swipe,
            which fires no mouseenter on most mobile browsers. */}
        <div
          className="relative"
          onMouseEnter={hold(true)}
          onMouseLeave={hold(false)}
          onFocusCapture={hold(true)}
          onBlurCapture={hold(false)}
          onTouchStart={hold(true)}
          onTouchEnd={hold(false)}
        >
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label="Previous products"
            className={`${arrowCls} left-2 lg:-left-5`}
          >
            <Arrow dir="prev" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label="Next products"
            className={`${arrowCls} right-2 lg:-right-5`}
          >
            <Arrow dir="next" />
          </button>

          <ul
            ref={railRef}
            onScroll={sync}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden"
          >
            {PRODUCTS.map((product, i) => (
              <li
                key={product.slug}
                className="w-[calc((100%-16px)/2)] shrink-0 snap-start lg:w-[calc((100%-72px)/4)]"
              >
                <ProductCard product={product} priority={i < 2} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
