import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import ShopFilters from "@/components/ShopFilters";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const TITLE = "Shop";
const DESCRIPTION =
  "Browse the full Novera range of research-grade peptides — independently tested by Janoshik, sealed for stability, and supplied strictly for laboratory research.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/shop" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: "/shop",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

// The category tiles and the mega-menu both link here as /shop?category=<slug>.
// Reading that on the server means the filtered grid is in the first response
// rather than appearing after hydration — at the cost of rendering this route
// per request, which is cheap because the catalogue is a local module.
export default async function ShopPage(props: PageProps<"/shop">) {
  const { category } = await props.searchParams;
  // Only honour a slug we actually have a line for, so a stale or hand-typed
  // ?category= value falls back to the full range instead of an empty grid.
  const selected =
    typeof category === "string" && CATEGORIES.some((c) => c.slug === category)
      ? category
      : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: absoluteUrl("/shop"),
    hasPart: PRODUCTS.map((p) => ({
      "@type": "Product",
      name: p.name,
      url: absoluteUrl(`/products/${p.slug}`),
      image: absoluteUrl(p.image),
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    })),
  };

  return (
    /* overflow-x-clip because the line banner breaks the gutter with a 100vw
       full-bleed, and 100vw counts the scrollbar — without this the page
       gained a few pixels of horizontal scroll. clip, not hidden: it does not
       create a scroll container, so sticky/fixed children still behave. */
    <main className="overflow-x-clip pb-24 pt-28 lg:pt-32">
      <JsonLd schema={schema} />

      {/* The visible "The range / All products" block is gone — the line
          banner carries the page's identity now, and on the unfiltered view
          the pills and grid speak for themselves. The heading stays in the
          document for screen readers and the outline, naming the line in
          view so it is not just "All products" on a filtered page. */}
      <h1 className="sr-only">
        {selected
          ? `${CATEGORIES.find((c) => c.slug === selected)?.name} — Novera`
          : "All products — Novera"}
      </h1>

      <section className="container-lux">
        {/* Keyed by the slug so arriving from a different line resets the
            filter state — without it React keeps the mounted component and
            its now-stale category. */}
        <ShopFilters
          key={selected ?? "all"}
          products={PRODUCTS}
          initialCategory={selected}
        />
      </section>

      {/* Research-only notice */}
      <section className="container-lux mt-20 lg:mt-28">
        <div className="flex flex-col items-start gap-4 bg-dark p-6 text-background md:flex-row md:items-center md:gap-8 lg:p-8">
          <Image
            src="/images/gen/why-purity.webp"
            alt=""
            aria-hidden="true"
            width={72}
            height={72}
            className="h-16 w-16 shrink-0 object-cover"
          />
          <p className="text-sm leading-relaxed text-background/80">
            <span className="text-[0.8125rem] font-semibold uppercase tracking-[-0.005em] text-accent">
              Research use only.{" "}
            </span>
            Every product on this page is supplied strictly for laboratory and
            analytical research conducted by qualified professionals — not for
            human or veterinary use. Certificates of analysis are available on
            each product page.
          </p>
        </div>
      </section>
    </main>
  );
}
