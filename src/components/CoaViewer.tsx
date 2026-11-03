"use client";

// "View Janoshik Analytical Report" trigger + modal, modelled on alluvi.bz but
// styled in Novera's own palette (cream card, copper accents) rather than a dark
// theme. The modal summarises this batch's third-party analysis and links out
// to the official Janoshik verification page. Content is driven entirely by the
// product's `analysis`, so every product page shows its own figures.

import { useEffect, useState } from "react";
import type { ProductAnalysis } from "@/lib/data";

type Props = {
  analysis: ProductAnalysis;
  productName: string;
};

export default function CoaViewer({ analysis, productName }: Props) {
  // Opens automatically when the product page loads. The button below stays so
  // the report can be reopened after it's dismissed.
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-line bg-background-secondary px-5 py-2.5 text-sm text-dark transition-colors hover:border-dark"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        View Janoshik Analytical Report
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} — Janoshik Analytical Report`}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative my-8 w-full max-w-md border border-line bg-card p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close report"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-line text-muted transition-colors hover:border-dark hover:text-dark"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Flask icon */}
            <div className="mx-auto grid h-12 w-12 place-items-center bg-copper/10 text-copper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 2v6.34a2 2 0 0 1-.34 1.11L4.2 16.1A2 2 0 0 0 5.87 19h12.26a2 2 0 0 0 1.67-2.9l-4.46-6.65A2 2 0 0 1 15 8.34V2M7 2h10M7.5 13h9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-center text-lg font-semibold text-dark">
              Janoshik Third-Party Lab Analysis
            </h2>
            <p className="mt-1 text-center text-sm text-muted">
              Independently tested and verified by Janoshik Analytical.
            </p>

            {/* Meta cards */}
            <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div className=" border border-line bg-background-secondary px-3 py-3 text-center">
                <dt className="text-[0.75rem] tracking-[-0.005em] uppercase text-muted">
                  Batch Number
                </dt>
                <dd className="mt-1 text-sm font-semibold text-dark">
                  {analysis.batchNumber}
                </dd>
              </div>
              <div className=" border border-line bg-background-secondary px-3 py-3 text-center">
                <dt className="text-[0.75rem] tracking-[-0.005em] uppercase text-muted">
                  Fill Volume
                </dt>
                <dd className="mt-1 text-sm font-semibold text-dark">
                  {analysis.fillVolume}
                </dd>
              </div>
              {analysis.purity && (
                <div className="col-span-2 border border-line bg-background-secondary px-3 py-3 text-center sm:col-span-1">
                  <dt className="text-[0.75rem] tracking-[-0.005em] uppercase text-muted">
                    Purity
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-copper">
                    {analysis.purity}
                  </dd>
                </div>
              )}
            </dl>

            {/* Compound table */}
            <div className="mt-4 overflow-hidden border border-line">
              <table className="w-full text-left text-xs">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="px-3 py-2 text-[0.75rem] font-normal tracking-[-0.005em] uppercase text-muted">
                      Compound
                    </th>
                    <th className="px-3 py-2 text-[0.75rem] font-normal tracking-[-0.005em] uppercase text-muted">
                      Concentration
                    </th>
                    <th className="px-3 py-2 text-[0.75rem] font-normal tracking-[-0.005em] uppercase text-muted">
                      Verified Content
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.compounds.map((c) => (
                    <tr key={c.name} className="border-t border-line">
                      <td className="px-3 py-2 text-sm font-medium text-dark">
                        {c.name}
                      </td>
                      <td className="px-3 py-2 text-sm text-dark">
                        {c.concentration}
                      </td>
                      <td className="px-3 py-2 text-sm text-dark">
                        {c.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
              Concentration is measured per mL; verified content reflects the
              total assayed mass across the stated fill volume.
            </p>

            {/* CTA */}
            <a
              href={analysis.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-dark px-5 py-3.5 text-sm font-medium text-background transition-colors hover:bg-copper"
            >
              View Full Janoshik Report
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17L17 7M17 7H8M17 7v9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
