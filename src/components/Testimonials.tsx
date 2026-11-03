// Server component. The reference's review block is a static 4-up grid of
// cards — portrait tile, uppercase name, role, centred serif quote, five black
// stars — under a centred italic-uppercase statement. Nothing here needs state,
// so this ships as HTML instead of the previous auto-advancing client carousel.
//
// Content comes straight from TESTIMONIALS in lib/data.ts. No rating counts,
// ages or customer totals are shown, because we have no data for them.
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { TESTIMONIALS } from "@/lib/data";

function Stars() {
  return (
    <div
      className="flex justify-center gap-[3px] text-[#F5C400]"
      aria-label="5 out of 5"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden className="h-3.5 w-3.5 fill-current">
          <path d="M10 1.5l2.47 5.26 5.78.62-4.32 3.86 1.2 5.7L10 14.9 4.87 18.4l1.2-5.7L1.75 8.84l5.78-.62L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-pad">
      <div className="container-lux">
        {/* Centred statement, matching the reference's review headline. */}
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <Reveal>
            <p className="eyebrow mb-5">Expert voices</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-statement">Trusted by researchers &amp; experts.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
              Laboratory professionals on purity reporting, packaging and
              paperwork — in their words.
            </p>
          </Reveal>
        </div>

        {/* Grid on desktop; a snap-scrolling rail on mobile, which is how the
            reference degrades its carousel on small screens. */}
        <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-x-6">
          {TESTIMONIALS.map((item, i) => (
            <li
              key={item.name}
              className="flex w-[78vw] shrink-0 snap-start sm:w-auto"
            >
              {/* h-full has to be threaded through the Reveal wrapper too, or
                  the figure can't stretch and the star rows stop aligning. */}
              <Reveal className="h-full w-full" delay={(i % 4) * 0.05} y={28}>
                <figure className="flex h-full flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-background-secondary">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  <figcaption className="pt-5 text-center">
                    <p className="text-[0.8125rem] font-semibold uppercase tracking-[-0.005em] text-dark">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-muted">
                      {item.role}
                    </p>
                  </figcaption>

                  <blockquote className="mt-4 text-center font-serif text-[1.0625rem] leading-snug text-dark">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <div className="mt-auto pt-5">
                    <Stars />
                  </div>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-14 text-center">
            <Link href="/shop" className="btn-lux btn-outline">
              Shop the range
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
