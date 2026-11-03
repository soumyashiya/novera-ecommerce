// Server component. Two banner shapes lifted from the reference:
//
//  variant="split" — two separate tiles: a solid yellow panel of italic-
//                    uppercase serif + outlined CTA, and an image tile with
//                    optional spec lines set over its clear side (their "More
//                    isn't better" block).
//  variant="image" — one full-bleed image with the statement set over it in
//                    white (their "Quality. Hydrolysed. Peptides." block).
import Image from "next/image";
import Link from "next/link";

type Props = {
  variant: "split" | "image";
  lines: string[];
  body?: string;
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
  /** Split variant: label + value pairs set over the image's clear side. */
  specs?: { label: string; value: string }[];
  /** Split variant: closing line under the specs. */
  specNote?: string;
  /** Split variant: mirror the photo so its subject sits on the left. */
  flipImage?: boolean;
};

export default function StatementBanner({
  variant,
  lines,
  body,
  cta,
  image,
  imageAlt,
  specs,
  specNote,
  flipImage = false,
}: Props) {
  const heading = (
    <h2 className="text-statement">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );

  if (variant === "image") {
    return (
      <section className="container-lux section-pad">
        <div className="relative isolate min-h-[380px] overflow-hidden lg:min-h-[460px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover"
          />
          {/* Left-weighted scrim so white type stays legible over the art. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-dark/75 via-dark/45 to-transparent"
          />
          <div className="relative flex min-h-[380px] flex-col justify-center p-8 text-background lg:min-h-[460px] lg:max-w-[60%] lg:p-14">
            {heading}
            {body && (
              <p className="mt-5 max-w-md font-serif text-[1rem] leading-relaxed text-background/90">
                {body}
              </p>
            )}
            <div className="mt-8">
              <Link href={cta.href} className="btn-lux btn-paper">
                {cta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-lux section-pad">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Yellow statement tile */}
        <div className="flex min-h-[340px] flex-col justify-center bg-accent p-8 text-dark lg:min-h-[400px] lg:p-12">
          <h2 className="text-hero !text-[clamp(2.25rem,3.4vw,3.25rem)]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          {body && (
            <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-dark/80">
              {body}
            </p>
          )}
          <div className="mt-10">
            <Link
              href={cta.href}
              className="inline-flex h-11 items-center justify-center border !border-dark px-6 text-[0.8125rem] font-bold uppercase tracking-[-0.02em] text-dark transition-colors duration-300 hover:bg-dark hover:text-accent"
            >
              {cta.label}
            </Link>
          </div>
        </div>

        {/* Image tile with spec lines */}
        <div className="relative min-h-[340px] overflow-hidden bg-background-secondary lg:min-h-[400px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover ${flipImage ? "-scale-x-100" : ""}`}
          />
          {specs && specs.length > 0 && (
            <>
              {/* Lightens the right side so the dark spec type reads. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-l from-[#f4ede2]/90 via-[#f4ede2]/40 to-transparent"
              />
              <dl className="absolute inset-y-0 right-0 flex w-[46%] flex-col justify-center gap-6 pr-6 sm:pr-10">
                {specs.map((sp) => (
                  <div key={sp.label}>
                    <dt className="text-[0.9375rem] text-dark">{sp.label}</dt>
                    <dd className="mt-1 text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.1] tracking-[-0.01em] text-dark">
                      {sp.value}
                    </dd>
                  </div>
                ))}
                {specNote && (
                  <p className="text-[0.9375rem] text-dark">{specNote}</p>
                )}
              </dl>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
