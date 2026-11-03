"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import {
  ApiError,
  getOrderByNumber,
  type PaymentCaptureItem,
  type UserOrder,
} from "@/lib/api";

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

const FOCUS_RING =
  "focus:border-copper focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/50";
const inputCls = `w-full bg-transparent border border-line px-5 py-3.5 text-dark placeholder-muted/70 ${FOCUS_RING} transition-colors duration-300`;

function IconCircle({
  tone,
  children,
}: {
  tone: "copper" | "muted" | "red";
  children: React.ReactNode;
}) {
  const toneCls =
    tone === "copper"
      ? "bg-copper text-background"
      : tone === "red"
        ? "bg-red-500/15 text-red-700"
        : "bg-background text-muted";
  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center ${toneCls}`}
      aria-hidden
    >
      {children}
    </span>
  );
}

const STAGES = [
  { key: "pending", label: "Order placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];
const NEGATIVE_STATUSES = ["cancelled", "canceled", "rejected", "refunded"];

function ShipmentStatus({ status }: { status: string }) {
  const normalized = (status || "").toLowerCase();

  if (NEGATIVE_STATUSES.includes(normalized)) {
    return (
      <div className="flex items-center gap-3 border border-red-500/25 bg-red-500/10 px-4 py-3.5 text-sm text-red-700">
        <IconCircle tone="red">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </IconCircle>
        <span className="capitalize">{status}</span>
      </div>
    );
  }

  const currentIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.key === normalized)
  );

  return (
    <div>
      <div className="flex items-center">
        {STAGES.map((stage, i) => {
          const done = i <= currentIndex;
          return (
            <Fragment key={stage.key}>
              {i > 0 && (
                <span
                  className={`h-px flex-1 transition-colors duration-500 ${done ? "bg-copper" : "bg-line"}`}
                  aria-hidden
                />
              )}
              <span
                aria-current={i === currentIndex ? "step" : undefined}
                className={`grid h-8 w-8 shrink-0 place-items-center text-xs transition-colors duration-500 ${
                  done
                    ? "bg-copper text-background"
                    : "border border-line bg-background text-muted"
                }`}
              >
                {i < currentIndex ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
            </Fragment>
          );
        })}
      </div>
      <div className="mt-2.5 flex">
        {STAGES.map((stage, i) => (
          <span
            key={stage.key}
            className={`flex-1 text-center text-[0.75rem] uppercase tracking-[-0.005em] first:text-left last:text-right ${
              i <= currentIndex ? "text-dark" : "text-muted"
            }`}
          >
            {stage.label}
          </span>
        ))}
      </div>
    </div>
  );
}

type Result =
  | { kind: "found"; order: UserOrder; items: PaymentCaptureItem[] }
  | { kind: "not-found" };

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const number = orderNumber.trim();
    if (!number) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await getOrderByNumber(number);
      setResult({ kind: "found", order: res.order, items: res.items });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 400 || err.status === 404)) {
        setResult({ kind: "not-found" });
      } else {
        setError(
          err instanceof Error ? err.message : "Couldn't look up that order."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const trackAnother = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="pt-28 lg:pt-32 pb-24 min-h-screen">
      <div className="container-lux max-w-2xl">
        <div className="mb-12">
          <p className="eyebrow mb-3">Track</p>
          <h1 className="text-section">Track your order</h1>
          <p className="mt-4 max-w-xl text-muted text-sm leading-relaxed">
            Enter your order number to see its current status.
          </p>
        </div>

        {!result && (
          <form
            onSubmit={onSubmit}
            className=" border border-line bg-card p-6 lg:p-8 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]"
          >
            <div>
              <label htmlFor="orderNumber" className="sr-only">
                Order number
              </label>
              <input
                id="orderNumber"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Order number (e.g. ORD-20260630-164254633-93504D)"
                className={`${inputCls} bg-background font-mono text-sm`}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="btn-lux w-full justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-background border-r-transparent animate-spin" />
                  Looking up order…
                </span>
              ) : (
                "Track order"
              )}
            </button>
          </form>
        )}

        {result?.kind === "not-found" && (
          <div className=" border border-line bg-background-secondary p-8 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]">
            <IconCircle tone="red">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </IconCircle>
            <p className="mt-5 font-serif text-2xl text-dark">Order not found</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We couldn&apos;t find an order matching that order number.
              Double-check it and try again.
            </p>
            <button type="button" onClick={trackAnother} className="btn-lux mt-7">
              Try again
            </button>
          </div>
        )}

        {result?.kind === "found" && (
          <div className=" border border-line bg-card p-6 lg:p-8 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-line">
              <div className="min-w-0">
                <p className="font-mono text-xs text-dark truncate">
                  {result.order.order_number}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(result.order.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="font-serif text-2xl text-dark whitespace-nowrap">
                {formatPrice(toNumber(result.order.total))}
              </span>
            </div>

            <div className="py-7 border-b border-line">
              <ShipmentStatus status={result.order.status} />
            </div>

            {result.items.length > 0 && (
              <div className="flex flex-col gap-4 py-6 border-b border-line">
                {result.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-dark text-sm truncate">{it.name}</p>
                      <p className="text-muted text-xs mt-0.5">
                        Qty {it.quantity} · {formatPrice(toNumber(it.unit_price))} each
                      </p>
                    </div>
                    <span className="text-sm text-dark whitespace-nowrap">
                      {formatPrice(toNumber(it.line_total))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {result.order.tracking_number && (
              <div className="mt-6 flex items-center justify-between gap-3 border border-line bg-background px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-[0.75rem] uppercase tracking-[-0.005em] text-muted">
                    Tracking number
                  </p>
                  <p className="mt-0.5 text-sm text-dark font-mono truncate">
                    {result.order.tracking_number}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={trackAnother} className="btn-lux btn-outline">
                Track another order
              </button>
              <Link href="/" className="text-sm text-muted hover:text-dark self-center transition-colors">
                Back to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
