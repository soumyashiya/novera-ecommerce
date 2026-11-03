"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { CONTACT } from "@/lib/data";

// Every answer below is drawn from content that already exists on this site —
// the policy pages under /policies, STORAGE_LOGIC, the Janoshik reports on
// PRODUCTS[].analysis, and DISCLAIMER. No new policy or claim is introduced
// here; questions whose answers are not already published are not included.
const FAQS = [
  {
    q: "What does “research use only” mean?",
    a: "Everything in the range is supplied strictly for laboratory and analytical research carried out by qualified professionals. It is not intended for human or veterinary use, and not intended to diagnose, treat, cure or prevent any disease.",
  },
  {
    q: "Who tests the batches?",
    a: "Batches carrying a certificate are analysed by Janoshik Analytical, an independent third-party laboratory. The batch number, fill volume and verified compound content are published on the product page, and each report links to Janoshik's own verification page so you can check it at source.",
  },
  {
    q: "How should the products be stored?",
    a: "Store refrigerated between 2 and 8°C. Do not freeze. Products are supplied in a fixed-volume sealed format intended for laboratory analysis.",
  },
  {
    q: "How do I pay for an order?",
    a: "Orders are placed without a card charge. Once your order is submitted we email confirmation and payment details to the address you provide, and payment is completed from there.",
  },
  {
    q: "Can I track an order?",
    a: "Yes. Use the Track Order page with your order number and the email address used at checkout. If you have an account, your full order history is under My Orders.",
  },
  {
    q: "What are the shipping and refund terms?",
    a: "They are set out in full on the Shipping Policy and Refund Policy pages, linked in the footer.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
        open ? "rotate-45" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad bg-background-secondary">
      <div className="container-lux">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow mb-5">Questions</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-section">Before you order</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                Anything not covered here —{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="link-underline text-dark"
                >
                  {CONTACT.email}
                </a>
                .
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="border-t border-line">
              {FAQS.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={faq.q} className="border-b border-line">
                    <dt>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-trigger-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-300 hover:text-copper"
                      >
                        <span className="text-[0.9375rem] text-dark">
                          {faq.q}
                        </span>
                        <Chevron open={isOpen} />
                      </button>
                    </dt>
                    <dd
                      id={`faq-panel-${i}`}
                      aria-labelledby={`faq-trigger-${i}`}
                      hidden={!isOpen}
                      className="pb-6 pr-10 text-sm leading-relaxed text-muted"
                    >
                      {faq.a}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/track" className="btn-lux btn-outline">
                Track an order
              </Link>
              <Link
                href="/policies/shipping-policy"
                className="btn-lux btn-outline"
              >
                Shipping policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
