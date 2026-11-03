"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";

type ResetResponse = { success: boolean; message: string };

const fieldWrap =
  "group relative border border-line bg-card transition-colors duration-300 focus-within:border-copper focus-within:bg-background";

const inputCls =
  "peer w-full bg-transparent px-5 pt-6 pb-2 text-dark placeholder-transparent focus:outline-none";

const labelCls =
  "pointer-events-none absolute left-5 top-4 text-sm text-muted transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[0.75rem] peer-focus:uppercase peer-focus:tracking-[-0.005em] peer-focus:text-copper peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[0.75rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[-0.005em]";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.9 10.9 0 0 1 12 19c-6.5 0-10-7-10-7a19.6 19.6 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.8 10.8 0 0 1 12 4c6.5 0 10 7 10 7a19.7 19.7 0 0 1-3.16 4.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setNotice(null);

    if (!token) {
      setErrorMsg(
        "Missing reset token. Please use the link from your reset email."
      );
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api<ResetResponse>("/api/auth/reset-password", {
        method: "POST",
        json: { token, password },
      });
      setDone(true);
      setNotice(
        res.message || "Password has been reset successfully. Redirecting…"
      );
      setTimeout(() => router.push("/signin"), 1800);
    } catch (err) {
      setErrorMsg(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-screen">
        <aside className="relative hidden lg:block overflow-hidden">
          <Image
            src="/images/gen/about.webp"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover img-grade"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/70 via-dark/30 to-dark/70" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16 text-background">
            <Link
              href="/"
              className="font-sans font-semibold uppercase text-lg tracking-[-0.005em] leading-none"
            >
              Novera
            </Link>

            <div>
              <span className="inline-block text-[0.75rem] tracking-[-0.005em] uppercase text-background/80 border border-background/30 px-3 py-1 mb-8">
                Secure account recovery
              </span>
              <h2 className="font-serif text-4xl xl:text-5xl leading-[1.05] tracking-[-0.02em]">
                Choose a new password to secure your account.
              </h2>
              <p className="mt-6 text-background/80 text-sm leading-relaxed max-w-md">
                Your reset link is single-use and expires shortly after it was
                issued.
              </p>
            </div>

            <p className="text-[0.75rem] uppercase tracking-[-0.005em] text-background/60">
              For laboratory R&amp;D use only
            </p>
          </div>
        </aside>

        <section className="relative flex items-center justify-center px-6 py-16 sm:py-20 lg:py-12 lg:px-16">
          <Link
            href="/signin"
            className="hidden lg:inline-flex absolute top-8 right-8 items-center gap-2 text-xs text-muted hover:text-dark transition-colors"
          >
            <span aria-hidden>←</span> Back to sign in
          </Link>

          <div className="w-full max-w-md">
            <Link
              href="/"
              className="lg:hidden mb-12 inline-flex items-center gap-2 font-sans font-semibold uppercase text-lg tracking-[-0.005em] leading-none text-dark"
            >
              <span className="h-2 w-2 rounded-full bg-copper" />
              Novera
            </Link>

            <div className="mb-10">
              <p className="eyebrow mb-4">Account</p>
              <h1 className="text-section leading-[1.05]">
                Set a new{" "}
                <em className="not-italic text-copper">password</em>.
              </h1>
              <p className="text-muted mt-4 text-[0.9375rem] leading-relaxed max-w-sm">
                Enter and confirm a new password below. Minimum 6 characters.
              </p>
            </div>

            {notice && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 border border-copper/25 bg-copper/10 p-4 text-sm text-dark"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-copper text-background">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span>{notice}</span>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="mb-6 border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700"
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className={fieldWrap}>
                <input
                  id="new-password"
                  required
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} pr-12`}
                  placeholder="New password"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={done}
                />
                <label htmlFor="new-password" className={labelCls}>
                  New password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>

              <div className={fieldWrap}>
                <input
                  id="confirm-password"
                  required
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`${inputCls} pr-12`}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={done}
                />
                <label htmlFor="confirm-password" className={labelCls}>
                  Confirm new password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={
                    showConfirm ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || done}
                className="btn-lux w-full justify-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-background border-r-transparent animate-spin" />
                    Resetting…
                  </span>
                ) : done ? (
                  "Password reset"
                ) : (
                  "Reset password"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-10">
              Remembered your password?{" "}
              <Link
                href="/signin"
                className="link-underline text-dark font-medium"
              >
                Back to sign in
              </Link>
            </p>

            <p className="mt-14 text-center text-[0.75rem] uppercase tracking-[-0.005em] text-muted">
              For laboratory R&amp;D use only
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
