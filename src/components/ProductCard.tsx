// Server component. Card anatomy follows the reference product card: a photo
// with a white merchandising tag top-left and a round wishlist heart top-right;
// below it the serif name with the price opposite, a small tracked meta line,
// an outlined strength pill, and an outlined batch/COA chip. Square corners
// except the pill and the heart.
import Link from "next/link";
import Image from "next/image";
import WishlistHeart from "./WishlistHeart";
import { PRODUCT_CATEGORIES, formatPrice, type Product } from "@/lib/data";

// "Tirzepatide 40 mg (R&D Only)" → "Tirzepatide"; the strength moves to the
// meta line and the pill.
const shortName = (name: string) =>
  name
    .replace(/\s*\(.*?\)\s*$/, "")
    .replace(/\s+[\d,]+\s*mg$/i, "")
    .trim();

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const analysis = product.analysis;
  const href = `/products/${product.slug}`;
  const name = shortName(product.name);

  // Two kinds of hover image, laid out differently: a cutout swaps inside the
  // product well, a photograph covers the whole tile. Cutouts are the default
  // because that is what the supplied product set contains.
  const hoverImage = product.tileHoverImage;
  const hoverIsPhoto = Boolean(hoverImage && product.tileHoverFit === "cover");

  return (
    <article className="group flex h-full flex-col">
      <div className="relative">
        {/* Merchandising tile, built after the Absolute Collagen product
            card: a flat cream ground, a yellow pill badge in the top-left, a
            centred outlined capsule and dose line, and the product cutout
            standing on the lower edge. The badge/capsule/dose text is real
            markup rather than pixels baked into the photograph, so it stays
            crisp at any size and can be edited from data.ts. */}
        <Link
          href={href}
          className="relative block aspect-[4/5] overflow-hidden bg-background-secondary"
        >
          {product.badge && (
            <span className="absolute left-3.5 top-3.5 z-20 rounded-[10px] bg-accent px-3 py-2 text-[0.8125rem] font-bold leading-none text-dark">
              {product.badge}
            </span>
          )}

          {/* Only fades under a full-bleed hover photograph, which would
              otherwise run underneath this copy. A cutout hover swaps inside
              the product well below, so the dose line stays put. The badge
              survives either way: it's merchandising, not packshot copy. */}
          <div
            className={`absolute inset-x-0 top-[16%] z-10 px-4 text-center transition-opacity duration-500 ${
              hoverIsPhoto ? "group-hover:opacity-0 group-focus-within:opacity-0" : ""
            }`}
          >
            <span className="inline-flex items-center rounded-full border border-dark px-3.5 py-1.5 text-[0.6875rem] font-bold leading-none text-dark">
              {analysis ? "Independently assayed" : "Research use only"}
            </span>
            {/* Second line only promises what this product actually carries:
                an assayed figure, else a certificate, else neither. */}
            <p className="mt-2.5 text-[clamp(0.9375rem,1.3vw,1.375rem)] font-bold leading-[1.18] tracking-[-0.02em] text-dark">
              {product.strengths[0]} {name}
              <br />
              {analysis?.purity
                ? `+ ${analysis.purity} purity`
                : analysis
                  ? "+ Batch COA"
                  : "+ Sealed & cold-stored"}
            </p>
          </div>

          {/* The product well. The packshot cutout stands on the tile's lower
              edge; object-bottom puts every product on the same baseline
              whatever its aspect — cartons are ~2:1, bare pens ~3:1. A cutout
              hover image swaps in here, in the same well. */}
          <div className="absolute inset-x-[6%] bottom-[6%] top-[52%]">
            <Image
              src={product.tileImage}
              alt={name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-contain object-bottom transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04] ${
                product.tileHoverImage
                  ? "group-hover:opacity-0 group-focus-within:opacity-0"
                  : ""
              }`}
            />
            {hoverImage && !hoverIsPhoto && (
              <Image
                src={hoverImage}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain object-bottom opacity-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-100 group-focus-within:opacity-100"
              />
            )}
          </div>

          {/* Lifestyle photograph, cross-faded over the whole tile. Full-bleed
              and object-cover, because these are 4:5 photographs with their
              own ground — not cutouts to stand in the well above. */}
          {hoverImage && hoverIsPhoto && (
            <Image
              src={hoverImage}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03] group-hover:opacity-100 group-focus-within:opacity-100"
            />
          )}
        </Link>
        <div className="absolute right-4 top-4 z-10">
          <WishlistHeart slug={product.slug} name={name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-[1.375rem] leading-none tracking-[-0.01em] text-dark">
            <Link
              href={href}
              className="transition-colors duration-300 hover:text-copper"
            >
              {name}
            </Link>
          </h3>
          <p className="shrink-0 text-[0.9375rem] text-dark">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
          {PRODUCT_CATEGORIES[product.slug]} · {product.strengths.join(" · ")} pen
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.strengths.map((s) => (
            <span
              key={s}
              className="rounded-full border border-dark/20 px-3 py-1 text-[0.625rem] uppercase leading-none tracking-[0.16em] text-muted"
            >
              {s}
            </span>
          ))}
        </div>

        {analysis && (
          <p className="mt-3 inline-flex w-fit items-center gap-2 border border-copper/40 px-3 py-1.5 text-[0.625rem] font-medium uppercase leading-none tracking-[0.18em] text-dark">
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="h-3 w-3 text-copper"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M6 2h4M7 2v4L3.5 13a1 1 0 0 0 .9 1.5h7.2a1 1 0 0 0 .9-1.5L9 6V2" strokeLinejoin="round" />
            </svg>
            Batch {analysis.batchNumber} · COA
          </p>
        )}
      </div>
    </article>
  );
}
