// Featured client review — a large portrait on the left, the quote centred in
// the right half under an italic uppercase headline, with the client's name
// and a single outlined CTA. Content comes from TESTIMONIALS in data.ts.
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { TESTIMONIALS } from "@/lib/data";

const FEATURED = TESTIMONIALS[0];

export default function FeaturedReview() {
  if (!FEATURED) return null;

  return (
    <section id="featured-review" className="section-pad">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-0">
        <Reveal y={30} className="lg:pl-[2%]">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-background-secondary lg:max-h-[860px]">
            <Image
              src={FEATURED.image}
              alt={FEATURED.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        <div className="container-lux lg:px-16">
          <Reveal delay={0.08} className="mx-auto max-w-[460px] text-center">
            <h2 className="text-hero text-dark">Every batch. Exact.</h2>
            <blockquote className="mt-8 text-[1rem] leading-relaxed text-dark">
              &ldquo;{FEATURED.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-[1rem] text-dark">
              {FEATURED.name} — {FEATURED.role}
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-11 items-center justify-center border border-dark px-6 text-[0.875rem] font-bold uppercase leading-none tracking-[-0.03em] text-dark transition-colors duration-300 hover:bg-dark hover:text-white"
            >
              Shop the range
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
