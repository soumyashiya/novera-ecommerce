import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import ShopFilters from "@/components/ShopFilters";
import { PRODUCTS } from "@/lib/data";
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

export default function ShopPage() {
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
    <main className="pb-24 pt-28 lg:pt-32">
      <JsonLd schema={schema} />

      <section className="container-lux">
        <Reveal>
          <p className="eyebrow mb-5">The range</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-section">All products</h1>
        </Reveal>
        <Reveal delay={0.1}>
          {/* Counted from PRODUCTS so the copy can't drift out of date as
              lines are added — it read "Six" while nine were listed. */}
          <p className="lede mt-5">
            {PRODUCTS.length} research lines, each supplied in a sealed
            fixed-volume format. Certified batches are independently assayed by
            Janoshik Analytical and published with their batch number and
            verified content. For laboratory research use only.
          </p>
        </Reveal>
      </section>

      <section className="container-lux mt-10 lg:mt-14">
        <ShopFilters products={PRODUCTS} />
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
