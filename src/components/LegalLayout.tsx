import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** Shared shell for the /policies pages — consistent heading, spacing, and
 * section rhythm so legal copy reads like the rest of the site, not a
 * bolted-on plain-text dump. */
export default function LegalLayout({
  eyebrow = "Legal",
  title,
  updated,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="pt-28 lg:pt-32 pb-24">
      <div className="container-lux max-w-3xl">
        <Reveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-section">{title}</h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-muted text-sm mt-5">Last updated: {updated}</p>
        </Reveal>
        {intro && (
          <Reveal delay={0.1}>
            <p className="lede max-w-none mt-8">{intro}</p>
          </Reveal>
        )}

        <div className="mt-16 space-y-14 border-t border-line pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-subhead text-2xl lg:text-[1.75rem]">{title}</h2>
      <div className="mt-4 space-y-4 text-muted leading-relaxed [&_a]:link-underline [&_a]:text-dark [&_strong]:text-dark [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
