"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPrice, DISCLAIMER } from "@/lib/data";
import {
  ApiError,
  paymentCapture,
  type PaymentCaptureItem,
  type PaymentCaptureValidateResponse,
} from "@/lib/api";

// Order/payment monetary fields come back as strings (Postgres NUMERIC) —
// coerce before formatting, same convention as elsewhere in this API.
function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

// focus-visible (not focus) so the ring appears for keyboard users without
// firing on mouse clicks.
const FOCUS_RING =
  "focus:border-copper focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/50";

const inputCls = `w-full bg-transparent border border-line px-5 py-3.5 text-dark placeholder-muted/70 ${FOCUS_RING} transition-colors duration-300`;

type PromoState =
  | { kind: "idle" }
  | { kind: "checking" }
  | {
      kind: "applied";
      code: string;
      percent: number;
      discountAmount: number;
      total: number;
    }
  | { kind: "error"; msg: string };

type UploadResult = {
  status: "received" | "rejected" | "pending";
  screenshotUrl?: string;
  verification_error?: string;
};

const STATUS_DOT: Record<string, string> = {
  paid: "bg-copper",
  received: "bg-copper",
  rejected: "bg-red-500",
  pending: "bg-muted",
};

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

export default function PaymentCapturePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [ctx, setCtx] = useState<PaymentCaptureValidateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoState>({ kind: "idle" });

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  useEffect(() => {
    if (!token) return;
    paymentCapture
      .validate(token)
      .then((res) => setCtx(res))
      .catch((err) => {
        setLoadError(
          err instanceof ApiError
            ? err.status === 400 || err.status === 404
              ? "This payment link is invalid or has expired."
              : err.message
            : "Failed to load payment link."
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code || promo.kind === "checking") return;
    setPromo({ kind: "checking" });
    try {
      const res = await paymentCapture.applyPromo(token, code);
      setPromo({
        kind: "applied",
        code: res.promoCode,
        percent: res.promoDiscountPercent,
        discountAmount: res.discountAmount,
        total: res.total,
      });
    } catch (err) {
      setPromo({
        kind: "error",
        msg: err instanceof Error ? err.message : "Couldn't apply promo code.",
      });
    }
  };

  const submitScreenshot = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setUploadError(null);
    try {
      const res = await paymentCapture.upload(token, file);
      setUploadResult({
        status: res.payment_status,
        screenshotUrl: res.screenshotUrl,
        verification_error: res.verification_error,
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  /* ---- Loading ---- */
  if (loading) {
    return (
      <main className="pt-28 lg:pt-32 pb-24 min-h-[70vh]">
        <div className="container-lux">
          <p className="eyebrow mb-3">Payment</p>
          <h1 className="text-section mb-8">Complete your payment</h1>
          <div className="flex items-center gap-3 border border-line bg-card px-6 py-5 text-muted text-sm w-fit">
            <span className="h-4 w-4 rounded-full border-2 border-copper border-r-transparent animate-spin" />
            Validating your payment link…
          </div>
        </div>
      </main>
    );
  }

  /* ---- Invalid / expired link ---- */
  if (loadError || !ctx) {
    return (
      <main className="pt-28 lg:pt-32 pb-24 min-h-[70vh]">
        <div className="container-lux max-w-xl">
          <p className="eyebrow mb-3">Payment</p>
          <h1 className="text-section mb-8">Complete your payment</h1>
          <div className=" border border-line bg-background-secondary p-8 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]">
            <IconCircle tone="red">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </IconCircle>
            <p className="mt-5 font-serif text-2xl text-dark">Link unavailable</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {loadError || "This payment link could not be loaded."}
            </p>
            <Link href="/" className="btn-lux mt-7">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { order, items, bank } = ctx;
  const subtotal = toNumber(order.subtotal);
  const shipping = toNumber(order.shipping);
  const discountAmount =
    promo.kind === "applied" ? promo.discountAmount : toNumber(order.discount_amount);
  const total = promo.kind === "applied" ? promo.total : toNumber(order.total);
  const promoLabel = promo.kind === "applied" ? promo.code : order.promo_code;

  return (
    <main className="pt-28 lg:pt-32 pb-24">
      <div className="container-lux max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow mb-3">Payment</p>
          <h1 className="text-section">Complete your payment</h1>
          <p className="mt-4 max-w-xl text-muted text-sm leading-relaxed">
            Transfer the amount due to the account on the right, then upload a
            screenshot of your confirmation below so we can verify it against
            order{" "}
            <span className="text-dark font-mono text-xs">
              {order.order_number}
            </span>
            .
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left — order + upload */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Order summary */}
            <section
              aria-labelledby="capture-order"
              className=" border border-line bg-card p-6 lg:p-8 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 id="capture-order" className="text-subhead text-2xl">
                  Order summary
                </h2>
                <span className="inline-flex items-center gap-2 border border-line bg-background px-4 py-1.5 text-[0.8125rem] uppercase tracking-[-0.005em] text-muted">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[order.payment_status] || "bg-muted"}`}
                    aria-hidden
                  />
                  {order.payment_status || "pending"}
                </span>
              </div>

              <div className="flex flex-col gap-5 pb-6 border-b border-line">
                {items.map((it: PaymentCaptureItem) => (
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

              <div className="flex flex-col gap-2.5 pt-5 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-dark">{formatPrice(subtotal)}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Shipping</span>
                    <span className="text-dark">{formatPrice(shipping)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>
                      Discount{promoLabel ? ` (${promoLabel})` : ""}
                    </span>
                    <span className="text-dark">
                      −{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Promo code */}
              {ctx.allowPromo && promo.kind !== "applied" && (
                <div className="mt-6 pt-6 border-t border-line">
                  <p className="text-dark text-sm mb-3">Have a promo code?</p>
                  <div className="flex gap-2">
                    <label htmlFor="promo" className="sr-only">
                      Promo code
                    </label>
                    <input
                      id="promo"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        if (promo.kind === "error") setPromo({ kind: "idle" });
                      }}
                      placeholder="Promo code"
                      className={`${inputCls} min-w-0 bg-background`}
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promo.kind === "checking" || !promoInput.trim()}
                      className="shrink-0 bg-background border border-line px-6 py-3.5 text-sm text-dark hover:bg-background-secondary hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {promo.kind === "checking" ? "…" : "Apply"}
                    </button>
                  </div>
                  {promo.kind === "error" && (
                    <p className="mt-2 text-xs text-red-600">{promo.msg}</p>
                  )}
                </div>
              )}
              {promo.kind === "applied" && (
                <p className="mt-6 text-xs text-copper">
                  {promo.code} — {promo.percent}% off applied.
                </p>
              )}
            </section>

            {/* Upload */}
            <section
              aria-labelledby="capture-upload"
              className=" border border-line bg-card p-6 lg:p-8 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]"
            >
              <h2 id="capture-upload" className="text-subhead text-2xl mb-2">
                Upload proof of payment
              </h2>
              <p className="text-muted text-sm mb-6">
                We&apos;ll verify your transfer and update your order. Any file
                type is accepted, up to 25 MB.
              </p>

              <label
                htmlFor="screenshot"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const dropped = e.dataTransfer.files?.[0];
                  if (dropped) {
                    setFile(dropped);
                    setUploadError(null);
                  }
                }}
                className={`flex cursor-pointer flex-col items-center justify-center border border-dashed p-10 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-copper bg-copper/10 scale-[1.01]"
                    : file
                      ? "border-copper/60 bg-copper/5"
                      : "border-line bg-background-secondary hover:border-copper/50 hover:bg-copper/5"
                }`}
              >
                <IconCircle tone={file ? "copper" : "muted"}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 15V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                </IconCircle>
                <p className="mt-4 text-sm text-dark">
                  {file ? file.name : "Choose a screenshot or drag it here"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {file
                    ? `${(file.size / 1024).toFixed(0)} KB`
                    : "PNG, JPG, or PDF up to 25 MB"}
                </p>
                <input
                  id="screenshot"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setUploadError(null);
                  }}
                />
              </label>

              {uploadError && (
                <p
                  role="alert"
                  className="mt-4 border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-700"
                >
                  {uploadError}
                </p>
              )}

              {uploadResult?.status === "received" && (
                <div
                  role="status"
                  className="mt-4 flex items-start gap-4 border border-copper/40 bg-copper/5 p-5 text-sm text-dark"
                >
                  <IconCircle tone="copper">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </IconCircle>
                  <div>
                    <p className="font-medium">Payment confirmed</p>
                    <p className="mt-1.5 text-muted">
                      Your transfer was verified. We&apos;ll get your order ready
                      shortly.
                    </p>
                  </div>
                </div>
              )}
              {uploadResult?.status === "pending" && (
                <div
                  role="status"
                  className="mt-4 flex items-start gap-4 border border-line bg-background-secondary p-5 text-sm text-dark"
                >
                  <IconCircle tone="muted">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                  </IconCircle>
                  <div>
                    <p className="font-medium">Awaiting manual review</p>
                    <p className="mt-1.5 text-muted">
                      Automatic verification isn&apos;t available right now — our
                      team will review your screenshot shortly and email you the
                      result.
                    </p>
                  </div>
                </div>
              )}
              {uploadResult?.status === "rejected" && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-4 border border-red-500/25 bg-red-500/10 p-5 text-sm text-red-700"
                >
                  <IconCircle tone="red">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </IconCircle>
                  <div>
                    <p className="font-medium">Payment couldn&apos;t be verified</p>
                    <p className="mt-1.5">
                      We couldn&apos;t match this screenshot to your transfer.
                      Double-check the amount and reference, then upload a
                      clearer image to try again.
                    </p>
                  </div>
                </div>
              )}
              {uploadResult?.verification_error && (
                <p className="mt-2 text-xs text-muted">
                  Details: {uploadResult.verification_error}
                </p>
              )}

              <button
                type="button"
                onClick={submitScreenshot}
                disabled={!file || uploading || uploadResult?.status === "received"}
                className="btn-lux w-full justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-background border-r-transparent animate-spin" />
                    Uploading…
                  </span>
                ) : uploadResult?.status === "received" ? (
                  "Submitted"
                ) : uploadResult ? (
                  "Re-submit screenshot"
                ) : (
                  "Submit for verification"
                )}
              </button>
            </section>

            <p className="text-[0.8125rem] leading-relaxed text-muted">
              {DISCLAIMER}
            </p>
          </div>

          {/* Right — bank details */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className=" border border-line bg-background-secondary p-6 lg:p-8 shadow-[0_30px_70px_-30px_rgba(83,96,82,0.3)]">
              <div className="flex items-center gap-3 mb-6">
                <IconCircle tone="copper">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <path d="M3 10h18M7 15h4" />
                  </svg>
                </IconCircle>
                <h2 className="text-subhead text-2xl">Transfer to</h2>
              </div>

              <div className="flex flex-col gap-3">
                <BankRow label="Payee" value={bank.payeeName} />
                <BankRow label="Sort code" value={bank.sortCode} mono />
                <BankRow label="Account number" value={bank.accountNumber} mono />
                <BankRow label="Reference" value={bank.reference} mono />
              </div>

              <div className="flex justify-between items-baseline mt-6 pt-5 border-t border-line">
                <span className="text-dark text-lg">Amount due</span>
                <span className="font-serif text-3xl text-copper">
                  {formatPrice(total)}
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted">
                Use the reference above so we can match your transfer. Once
                sent, upload the confirmation screenshot on the left.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function BankRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 border border-line bg-card px-4 py-3 transition-colors duration-300 hover:border-copper/40">
      <div className="min-w-0">
        <p className="text-[0.75rem] uppercase tracking-[-0.005em] text-muted">
          {label}
        </p>
        <p className={`mt-0.5 text-sm text-dark truncate ${mono ? "font-mono" : ""}`}>
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
          copied ? "text-copper" : "text-muted hover:text-dark hover:bg-background"
        }`}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12l5 5L20 7" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
