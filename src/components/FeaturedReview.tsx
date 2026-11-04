// Featured client review — a large portrait on the left, the quote centred in
// the right half under an italic uppercase headline, with the client's name
// and a single outlined CTA. Content comes from TESTIMONIALS in data.ts.
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { TESTIMONIALS } from "@/lib/data";

const FEATURED = TESTIMONIALS[0];

/** This section's own shot, kept out of data.ts so the Testimonials grid
 *  still uses the portrait attached to the same quote. */
const IMAGE = "/images/single-review.png";

export default function FeaturedReview() {
  if (!FEATURED) return null;

  return (
    <section id="featured-review" className="section-pad">
      {/* Inside .container-lux so both edges sit on the same gutter as every
          other section; the photo column is narrower than the copy column. */}
      <div className="container-lux grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal y={30}>
          {/* Kept at the shot's own 4:5 so nothing is cropped. */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden bg-background-secondary lg:mx-0">
            <Image
              src={IMAGE}
              alt="A woman holding a sealed ALLUVI Glow 5 mg pen"
              fill
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.08} className="mx-auto max-w-[460px] text-center">
            {/* Names the commercial proof the quote below supplies — repeat
                purchase — rather than restating the batch claim a third time
                after the hero and the statement banner. */}
            <h2 className="text-hero text-dark">Why researchers reorder.</h2>
            <blockquote className="mt-8 text-[1rem] leading-relaxed text-dark">
              &ldquo;{FEATURED.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-[1rem] text-dark">
              {FEATURED.name} — {FEATURED.role}
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-11 items-center justify-center bg-accent px-6 text-[0.875rem] font-bold uppercase leading-none tracking-[-0.03em] text-dark transition-colors duration-300 hover:bg-dark hover:text-accent"
            >
              Shop the Novera range
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
