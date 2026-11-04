// Server component — see the note in About.tsx. Only the Reveal wrappers are
// client code; the copy and layout render to HTML.
import Reveal from "./Reveal";
import RevealImage from "./RevealImage";
import { WHY_US } from "@/lib/data";

export default function WhyUs() {
  return (
    <section id="why-us" className="section-band section-pad bg-background-secondary">
      <div className="container-lux">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <Reveal>
            <p className="eyebrow mb-5">Why Novera</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-section">
              Trusted where
              <br />
              precision matters most.
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col gap-16 lg:gap-24">
          {WHY_US.map((f, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={f.no}
                className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                {/* Image */}
                <div
                  className={`lg:col-span-7 ${
                    reversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <RevealImage
                    src={f.image}
                    alt={f.title}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="aspect-[16/10] w-full lg:"
                    imgClassName="scale-90"
                  />
                </div>

                {/* Text */}
                <div
                  className={`lg:col-span-5 ${
                    reversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Reveal>
                    <span className="font-serif text-6xl lg:text-7xl text-dark/15 leading-none block mb-6">
                      {f.no}
                    </span>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <h3 className="text-subhead mb-5">{f.title}</h3>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="text-muted text-[1.0625rem] leading-[1.8] max-w-md">
                      {f.text}
                    </p>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
