import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PRODUCTS,
  getProduct,
  relatedProducts,
  formatPrice,
  DISCLAIMER,
} from "@/lib/data";
import AddToCart from "@/components/cart/AddToCart";
import ProductGallery from "@/components/ProductGallery";
import ProductInfoTabs from "@/components/ProductInfoTabs";
import CoaViewer from "@/components/CoaViewer";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  const url = `/products/${product.slug}`;

  return {
    // Brand suffix comes from the root layout's title template.
    title: product.name,
    description: product.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} — ${SITE_NAME}`,
      description: product.summary,
      type: "website",
      url,
      siteName: SITE_NAME,
      images: [
        { url: product.image, width: 1200, height: 1200, alt: product.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${SITE_NAME}`,
      description: product.summary,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(slug);
  const url = absoluteUrl(`/products/${product.slug}`);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.gallery.map((src) => absoluteUrl(src)),
    sku: product.slug,
    category: product.tag,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@id": absoluteUrl("/#organization") },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: absoluteUrl("/#products"),
      },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  return (
    <main className="pt-28 lg:pt-32 pb-20">
      <JsonLd schema={[productSchema, breadcrumbSchema]} />
      <div className="container-lux">
        {/* Breadcrumb — aria-label distinguishes it from the primary nav */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted mb-10">
          <ol className="flex flex-wrap items-center">
            <li>
              <Link href="/" className="hover:text-dark transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="mx-2 text-line">
              /
            </li>
            <li>
              <Link
                href="/#products"
                className="hover:text-dark transition-colors"
              >
                Products
              </Link>
            </li>
            <li aria-hidden="true" className="mx-2 text-line">
              /
            </li>
            <li>
              <span aria-current="page" className="text-dark">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Detail */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — image gallery (sticky on desktop while right column scrolls) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.gallery} alt={product.name} />
          </div>

          {/* Right — details */}
          <div className="lg:py-4">
            <p className="text-[0.75rem] tracking-[-0.005em] uppercase text-muted">
              {product.tag.toUpperCase()}
            </p>

            <h1 className="text-section mt-4">{product.name}</h1>

            <p className="font-serif font-light text-4xl text-copper mt-4">
              {formatPrice(product.price)}
            </p>

            <p className="text-muted text-[1.0625rem] leading-relaxed mt-6 max-w-lg">
              {product.description}
            </p>

            {/* Prominent research-only notice */}
            <div className="mt-6 border-2 border-copper/40 bg-copper/5 px-4 py-3 text-sm text-dark max-w-lg">
              <span className="font-semibold text-copper">
                FOR RESEARCH PURPOSES ONLY.
              </span>{" "}
              Not intended for human or veterinary use. Supplied strictly for
              laboratory and analytical research conducted by qualified
              professionals.
            </div>

            {/* Janoshik report button */}
            {product.analysis && (
              <div className="mt-6">
                <CoaViewer
                  analysis={product.analysis}
                  productName={product.name}
                />
              </div>
            )}

            {/* Analytical panel */}
            {product.analysis && (
              <div className="mt-8 max-w-lg border border-line bg-background-secondary p-5">
                <p className="text-center text-sm font-medium text-dark">
                  Janoshik Third-Party Lab Analysis
                </p>
                <p className="text-center text-xs text-muted mt-1">
                  Independently tested and verified by Janoshik Analytical.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[0.75rem] tracking-[-0.005em] uppercase text-muted">
                      Batch Number
                    </p>
                    <p className="text-sm text-dark mt-1">
                      {product.analysis.batchNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.75rem] tracking-[-0.005em] uppercase text-muted">
                      Fill Volume
                    </p>
                    <p className="text-sm text-dark mt-1">
                      {product.analysis.fillVolume}
                    </p>
                  </div>
                  {product.analysis.purity && (
                    <div>
                      <p className="text-[0.75rem] tracking-[-0.005em] uppercase text-muted">
                        Purity
                      </p>
                      <p className="text-sm text-dark mt-1">
                        {product.analysis.purity}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 overflow-hidden border border-line">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/60">
                      <tr>
                        <th className="px-3 py-2 text-[0.75rem] tracking-[-0.005em] uppercase text-muted font-normal">
                          Compound
                        </th>
                        <th className="px-3 py-2 text-[0.75rem] tracking-[-0.005em] uppercase text-muted font-normal">
                          Concentration
                        </th>
                        <th className="px-3 py-2 text-[0.75rem] tracking-[-0.005em] uppercase text-muted font-normal">
                          Verified Content
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.analysis.compounds.map((c) => (
                        <tr key={c.name} className="border-t border-line">
                          <td className="px-3 py-2 text-sm text-dark">
                            {c.name}
                          </td>
                          <td className="px-3 py-2 text-sm text-dark">
                            {c.concentration}
                          </td>
                          <td className="px-3 py-2 text-sm text-dark">
                            {c.content}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
                  Concentration is measured per mL; verified content reflects
                  the total assayed mass across the stated fill volume.
                </p>
              </div>
            )}

            {/* Package Contents / Storage Logic / Supply Chain tabs */}
            <div className="mt-10 max-w-lg">
              <ProductInfoTabs
                packageContents={product.packageContents}
                storageLogic={product.storageLogic}
                supplyChain={product.supplyChain}
              />
            </div>

            <AddToCart slug={product.slug} />

            <p className="mt-8 text-[0.8125rem] leading-relaxed text-muted/80 max-w-lg border-t border-line pt-6">
              {DISCLAIMER}
            </p>
          </div>
        </div>

        {/* Related products */}
        <section className="mt-24 lg:mt-32">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-subhead">Related products</h2>
            <Link
              href="/#products"
              className="link-underline text-sm text-muted hover:text-dark transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
            {related.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group">
                <div className="relative aspect-square w-full overflow-hidden lg:">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-contain img-grade transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-subhead text-xl lg:text-2xl">{p.name}</h3>
                  <span className="text-muted text-sm shrink-0">
                    {formatPrice(p.price)}
                  </span>
                </div>
                <p className="text-sm text-muted mt-1">{p.tag}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
