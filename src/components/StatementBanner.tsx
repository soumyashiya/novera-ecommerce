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
  /** object-position for the image variant, where the subject is not centred. */
  imagePosition?: string;
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
  imagePosition,
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
        {/* bg-dark is the ground the type sits on once the image stops filling
            the block on small screens. */}
        <div className="relative isolate overflow-hidden bg-dark sm:min-h-[380px] lg:min-h-[460px]">
          {/* Below sm the image is a band at its own ratio with the statement
              underneath it. Overlaying instead would crop a wide photograph to
              whatever is left of a near-square frame — the 3:1 artwork on
              /about kept barely a third of its width that way, which cut two
              of the three cartons out of shot. From sm the frame is wide
              enough to hold the composition, so the type moves back over it. */}
          <div className="relative aspect-[3/1] w-full sm:absolute sm:inset-0 sm:aspect-auto sm:h-full">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
              className="object-cover"
            />
            {/* Left-weighted scrim so white type stays legible over the art.
                Only once the type is actually over it. */}
            <div
              aria-hidden
              className="absolute inset-0 hidden bg-gradient-to-r from-dark/75 via-dark/45 to-transparent sm:block"
            />
          </div>
          <div className="relative flex flex-col justify-center p-8 text-background sm:min-h-[380px] lg:min-h-[460px] lg:max-w-[60%] lg:p-14">
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
          <h2 className="text-hero !text-[clamp(2.25rem,3.74vw,3.25rem)]">
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

        {/* Image tile with spec lines. The specs only overlay the photo from
            lg up: in a near-square mobile tile the 46% panel left too little
            width for the picture, cropping the subject off its own edge. */}
        <div className="relative">
          <div className="relative aspect-[3/2] overflow-hidden bg-background-secondary lg:aspect-auto lg:h-full lg:min-h-[400px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover ${flipImage ? "-scale-x-100" : ""}`}
            />
            {specs && specs.length > 0 && (
              /* Lightens the right side so the dark spec type reads. */
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-gradient-to-l from-[#f4ede2]/90 via-[#f4ede2]/40 to-transparent lg:block"
              />
            )}
          </div>
          {specs && specs.length > 0 && (
            <dl className="mt-7 flex flex-col gap-6 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[46%] lg:justify-center lg:pr-10">
              {specs.map((sp) => (
                <div key={sp.label}>
                  <dt className="text-[0.9375rem] text-dark">{sp.label}</dt>
                  <dd className="mt-1 text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.1] tracking-[-0.01em] text-dark">
                    {sp.value}
                  </dd>
                </div>
              ))}
              {specNote && (
                <p className="text-[0.9375rem] text-dark">{specNote}</p>
              )}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
