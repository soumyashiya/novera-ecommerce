// New arrivals — the two products being promoted, shown as large split
// cards: photo on one side, details on a cream panel on the other. Edit
// FEATURED below to change which two, or their shots.
//
// This is a curated pair rather than every `badge: "New"` product: five
// carry that badge, and the badge still drives the "New" pill in the shop
// grid, so filtering on it here would put all five in this section.
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { PRODUCTS, primaryCategory, formatPrice } from "@/lib/data";

/** Slug plus the shot used here — a wider crop than the catalogue cut-out,
 *  so these stay independent of the product's own `image`. */
const FEATURED = [
  { slug: "tesamorelin", image: "/images/tessa-new-arrivals.webp" },
  { slug: "cjc-1295", image: "/images/cjc-new-arrival.webp" },
];

const shortName = (name: string) =>
  name
    .replace(/\s*\(.*?\)\s*$/, "")
    .replace(/\s+[\d,]+\s*mg$/i, "")
    .trim();

export default function NewArrivals() {
  const items = FEATURED.flatMap((f) => {
    const product = PRODUCTS.find((p) => p.slug === f.slug);
    return product ? [{ ...product, image: f.image }] : [];
  });
  if (!items.length) return null;

  return (
    <section id="new-arrivals" className="section-pad">
      <div className="container-lux">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <Reveal>
            <p className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-copper">
              <span aria-hidden className="h-px w-8 bg-copper" />
              Just landed at Novera
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.5rem,5.06vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-dark">
              New <em>arrivals</em>
            </h2>
          </Reveal>
          <Link
            href="/shop"
            className="link-underline mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-dark"
          >
            Shop all →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((p, i) => {
            const href = `/products/${p.slug}`;
            const name = shortName(p.name);
            return (
              <Reveal key={p.slug} delay={i * 0.08} y={32}>
                <Link
                  href={href}
                  className="group grid h-full overflow-hidden bg-background-secondary sm:grid-cols-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <span className="absolute left-4 top-4 z-10 bg-accent px-3 py-2 text-[0.6875rem] font-medium uppercase leading-none tracking-[0.14em] text-dark">
                      New
                    </span>
                    <Image
                      src={p.image}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]"
                    />
                  </div>

                  <div className="flex flex-col p-7 lg:p-9">
                    <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                      {primaryCategory(p.slug)}
                    </p>
                    <h3 className="mt-3 font-serif text-[clamp(2rem,2.86vw,2.75rem)] leading-none tracking-[-0.015em] text-dark">
                      {name}
                    </h3>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                      {p.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.strengths.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-dark/20 px-3 py-1 text-[0.625rem] uppercase leading-none tracking-[0.16em] text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-dark/10 pt-6">
                      <span className="font-serif text-[1.75rem] leading-none text-dark">
                        {formatPrice(p.price)}
                      </span>
                      <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-dark">
                        Discover
                        <span
                          aria-hidden
                          className="grid h-9 w-9 place-items-center rounded-full bg-dark text-background transition-colors duration-300 group-hover:bg-accent group-hover:text-dark"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
