// Server component. Mirrors the reference's "The stats don't lie." row: a
// sentence-case serif heading, then four columns of a small bold label, a giant
// serif numeral, and a sans caption beside it.
//
// Every figure is derived from lib/data.ts rather than asserted — see the
// values computed in Stats() below.
import Reveal from "./Reveal";
import { PRODUCTS } from "@/lib/data";

export default function Stats() {
  const verified = PRODUCTS.filter((p) => p.analysis).length;

  // Lowest published purity across certified batches, so the headline figure is
  // a floor we can stand behind rather than a best case.
  const purities = PRODUCTS.map((p) => p.analysis?.purity)
    .filter((v): v is string => Boolean(v))
    .map((v) => parseFloat(v));
  const minPurity = purities.length ? Math.min(...purities) : null;

  const compounds = new Set(
    PRODUCTS.flatMap((p) => p.analysis?.compounds.map((c) => c.name) ?? [])
  );

  const items = [
    {
      label: "Verified purity.",
      figure: minPurity ? `${minPurity.toFixed(1)}` : "—",
      unit: "%",
      text: "Lowest assayed purity across all certified batches.",
    },
    {
      label: "Independently tested.",
      figure: String(verified),
      unit: "batches",
      text: "Each with a Janoshik certificate you can verify at source.",
    },
    {
      label: "Documented compounds.",
      figure: String(compounds.size),
      unit: "assayed",
      text: "Concentration and verified content published per compound.",
    },
    {
      label: "Cold storage.",
      figure: "2–8",
      unit: "°C",
      text: "Supplied sealed and stored refrigerated. Do not freeze.",
    },
  ];

  return (
    <section className="section-pad">
      <div className="container-lux">
        <Reveal>
          <h2 className="text-section mb-10 text-copper">
            The numbers, published.
          </h2>
        </Reveal>

        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <div>
                <dt className="text-[0.875rem] font-semibold text-dark">
                  {item.label}
                </dt>
                <dd className="mt-3 flex items-start gap-2">
                  <span className="stat-figure text-dark">{item.figure}</span>
                  <span className="max-w-[160px] pt-1 text-[0.8125rem] leading-snug text-muted">
                    <span className="block text-dark">{item.unit}</span>
                    {item.text}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
