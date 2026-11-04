"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import ProductCard from "./ProductCard";
import {
  CATEGORIES,
  categoryCount,
  productCategories,
  type Product,
} from "@/lib/data";

// Client-side filter + sort. The catalogue is a local module, so no request is
// involved and no API contract is touched — this is presentation only.
const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
] as const;

type SortKey = (typeof SORTS)[number]["key"];

// Same curve RevealImage uses, so the banner settles like every other
// revealed image on the site rather than inventing its own motion.
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

// One banner behind every line. CATEGORIES[].image stays what it was — the
// homepage rail still needs its four separate 4:5 tiles — so the shared
// artwork lives here rather than being duplicated across all four entries.
const LINE_BANNER = "/images/shopline-banner.png";

export default function ShopFilters({
  products,
  initialCategory = null,
}: {
  products: Product[];
  /** Line to open on, from ?category= on the URL. Null shows everything. */
  initialCategory?: string | null;
}) {
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [sort, setSort] = useState<SortKey>("featured");
  const reduce = useReducedMotion();

  // The banner is driven by state, not by the URL, so it follows a pill click
  // as well as a ?category= deep link. This is a client component, so it still
  // renders into the server HTML on a deep link — no flash of the plain page.
  const line = CATEGORIES.find((c) => c.slug === category);

  const visible = useMemo(() => {
    const name = CATEGORIES.find((c) => c.slug === category)?.name;
    const list = name
      ? products.filter((p) => productCategories(p.slug).includes(name))
      : [...products];

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, sort]);

  const pill = (active: boolean) =>
    `border px-4 py-2 text-[0.75rem] uppercase tracking-[-0.005em] transition-colors duration-300 ${
      active
        ? "border-dark bg-dark text-background"
        : "border-dark/25 text-dark hover:border-dark"
    }`;

  return (
    <>
      {/* Line banner. These photographs are all 1374×1145 with the subject
          right of frame, so the headline takes the clear left side behind a
          left-weighted scrim. Each line carries its own bannerPosition —
          the subjects sit at different heights and one shared crop cut the
          runner's head off in the metabolic shot. */}
      {line && (
        /* Full-bleed, sitting flush under the header. It breaks .container-lux
           with the 50vw trick; main carries overflow-x-clip, which is what
           keeps 100vw safe against the scrollbar. The negative margin
           trims main's pt-28 / lg:pt-32 down to the header's own height
           rather than cancelling it outright: this header is an opaque
           announcement strip plus a yellow bar (~105px), not the transparent
           one in the reference, so anything running under it is simply lost —
           it cut the runner's head off in the metabolic shot. svh rather than
           vh so mobile browser chrome does not clip the bottom. */
        <div className="relative isolate mb-10 -mt-4 left-1/2 right-1/2 -mx-[50vw] h-[58svh] w-screen min-h-[380px] overflow-hidden lg:-mt-6 lg:h-[64svh]">
          {/* Keyed on the slug so the reveal replays on every line change, not
              just the first paint — this banner swaps on a filter click, so a
              scroll-triggered once-only reveal would never fire again. The
              image settles from a slight scale while a mask wipes it open,
              matching RevealImage's language elsewhere on the site. */}
          <motion.div
            key={line.slug}
            className="absolute inset-0"
            initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.1, ease: REVEAL_EASE }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: REVEAL_EASE }}
            >
              <Image
                src={LINE_BANNER}
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectPosition: line.bannerPosition }}
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Two layers: an overall sink so the whole frame reads dark, then a
              left-weighted ramp so the type side is darkest. The subject sits
              right of frame in every one of these photographs. */}
          <div aria-hidden className="absolute inset-0 bg-dark/25" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/50 to-transparent"
          />
          {/* Inner container puts the type on the shared gutter line rather
              than the viewport edge, matching the nav and the headings. */}
          <div className="container-lux relative flex h-full flex-col justify-end pb-9 text-background lg:pb-14">
            <motion.p
              key={`${line.slug}-eyebrow`}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: REVEAL_EASE, delay: 0.18 }}
              className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-background/70"
            >
              {line.label} · {categoryCount(line.name)}{" "}
              {categoryCount(line.name) === 1 ? "product" : "products"}
            </motion.p>
            <motion.h2
              key={`${line.slug}-headline`}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: REVEAL_EASE, delay: 0.28 }}
              className="mt-4 max-w-[18ch] text-balance font-serif text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.02] tracking-[-0.02em]"
            >
              {line.headline}
            </motion.h2>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={pill(category === null)}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              aria-pressed={category === c.slug}
              className={pill(category === c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <label
            htmlFor="shop-sort"
            className="text-[0.75rem] uppercase tracking-[-0.005em] text-muted"
          >
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-dark/25 bg-transparent px-3 py-2 text-[0.8125rem] text-dark focus:border-copper focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/40"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-[0.8125rem] text-muted">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {visible.map((product, i) => (
          <ProductCard key={product.slug} product={product} priority={i < 4} />
        ))}
      </div>
    </>
  );
}
