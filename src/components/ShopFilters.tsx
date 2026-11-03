"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import {
  CATEGORIES,
  PRODUCT_CATEGORIES,
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

export default function ShopFilters({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const name = CATEGORIES.find((c) => c.slug === category)?.name;
    const list = name
      ? products.filter((p) => PRODUCT_CATEGORIES[p.slug] === name)
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
