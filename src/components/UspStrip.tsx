// Server component. The four claims are restatements of material already in
// lib/data.ts (the Janoshik reports on PRODUCTS[].analysis, the WHY_US entries,
// STORAGE_LOGIC and CONTACT) — nothing new is promised here.
import { CONTACT } from "@/lib/data";

const USPS = [
  {
    title: "Independently assayed",
    text: "Every batch with a certificate is tested by Janoshik Analytical before it is listed.",
  },
  {
    title: "Documented purity",
    text: "Batch number, fill volume and verified compound content are published on each product page.",
  },
  {
    title: "Sealed cold storage",
    text: "Supplied sealed and tamper-evident, stored refrigerated at 2–8°C.",
  },
  {
    title: "A real reply",
    text: `Questions go to ${CONTACT.email} and are answered by a person.`,
  },
];

export default function UspStrip() {
  return (
    <section className="bg-background-secondary">
      <div className="container-lux grid gap-x-10 gap-y-9 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        {USPS.map((usp, i) => (
          <div key={usp.title}>
            <p className="font-serif text-2xl leading-none text-copper">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-[0.8125rem] font-medium uppercase tracking-[-0.005em] text-dark">
              {usp.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {usp.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
