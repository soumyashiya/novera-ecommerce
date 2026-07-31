"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError, setSession, type ApiUser } from "@/lib/api";

type AuthResponse = { success: boolean; token: string; user: ApiUser };

const fieldWrap =
  "group relative rounded-2xl border border-line bg-card transition-colors duration-300 focus-within:border-olive focus-within:bg-background";

const inputCls =
  "peer w-full bg-transparent px-5 pt-6 pb-2 text-dark placeholder-transparent focus:outline-none";

const labelCls =
  "pointer-events-none absolute left-5 top-4 text-sm text-muted transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[0.62rem] peer-focus:uppercase peer-focus:tracking-[0.22em] peer-focus:text-olive peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[0.62rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.22em]";

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

type ForgotResponse = { success: boolean; message: string };

type Mode = "signin" | "signup" | "forgot";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    nationality: "",
    country: "",
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const switchMode = (m: Mode) => {
    setMode(m);
    setNotice(null);
    setErrorMsg(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setNotice(null);

    try {
      if (mode === "signup") {
        await api<AuthResponse>("/api/auth/register", {
          method: "POST",
          json: {
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            password: form.password,
            date_of_birth: form.dob,
            nationality: form.nationality,
            country_of_residence: form.country,
          },
        });
        setForm((f) => ({ ...f, password: "" }));
        setMode("signin");
        setNotice(
          "Account created — please sign in with your new credentials."
        );
      } else if (mode === "forgot") {
        const res = await api<ForgotResponse>("/api/auth/forgot-password", {
          method: "POST",
          json: { email: form.email },
        });
        setNotice(
          res.message ||
            "If an account exists with this email, a password reset link has been sent."
        );
      } else {
        const res = await api<AuthResponse>("/api/auth/login", {
          method: "POST",
          json: { email: form.email, password: form.password },
        });
        setSession(res.token, res.user);
        router.push("/#top");
      }
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

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  return (
    <main className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-screen">
        {/* ── Left — editorial visual ── */}
        <aside className="relative hidden lg:block overflow-hidden">
          <Image
            src="/images/whyus-purity-seo1.webp"
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
              className="font-sans font-semibold uppercase text-lg tracking-[0.26em] leading-none"
            >
              Novera
            </Link>

            <div>
              <span className="inline-block text-[0.62rem] tracking-[0.3em] uppercase text-background/80 border border-background/30 rounded-full px-3 py-1 mb-8">
                Research-grade, verified
              </span>
              <h2 className="font-serif text-4xl xl:text-5xl leading-[1.05] tracking-[-0.02em]">
                Purity, verified — batch by batch, molecule by molecule.
              </h2>
              <p className="mt-6 text-background/80 text-sm leading-relaxed max-w-md">
                Sign in to access your order history, download certificates of
                analysis, and manage your research supply account.
              </p>
            </div>

            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-background/60">
              For research purposes only  not for human or veterinary use
            </p>
          </div>
        </aside>

        {/* ── Right — form ── */}
        <section className="relative flex items-center justify-center px-6 py-16 sm:py-20 lg:py-12 lg:px-16">
          {/* Decorative back-to-home in top-right on desktop */}
          <Link
            href="/"
            className="hidden lg:inline-flex absolute top-8 right-8 items-center gap-2 text-xs text-muted hover:text-dark transition-colors"
          >
            <span aria-hidden>←</span> Back to site
          </Link>

          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <Link
              href="/"
              className="lg:hidden mb-12 inline-flex items-center gap-2 font-sans font-semibold uppercase text-lg tracking-[0.26em] leading-none text-dark"
            >
              <span className="h-2 w-2 rounded-full bg-olive" />
              Novera
            </Link>

            {/* Header */}
            <div className="mb-10">
                  <p className="eyebrow mb-4">Account</p>
                  <h1 className="text-section leading-[1.05]">
                    {isSignup ? (
                      <>Create your <em className="not-italic text-olive">Novera</em> account.</>
                    ) : isForgot ? (
                      <>Reset your <em className="not-italic text-olive">password</em>.</>
                    ) : (
                      <>Welcome back.</>
                    )}
                  </h1>
                  <p className="text-muted mt-4 text-[0.95rem] leading-relaxed max-w-sm">
                    {isSignup
                      ? "Track orders, access COAs, and manage recurring shipments."
                      : isForgot
                        ? "Enter your account email and we'll send a secure link to reset your password."
                        : "Sign in to access your orders and documentation."}
                  </p>
                </div>

                {notice && (
                  <div
                    role="status"
                    className="mb-6 flex items-start gap-3 rounded-2xl border border-olive/25 bg-olive/10 p-4 text-sm text-dark"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-olive text-background">
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
                    className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700"
                  >
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  {isSignup && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className={fieldWrap}>
                        <input
                          id="firstName"
                          required
                          value={form.firstName}
                          onChange={set("firstName")}
                          className={inputCls}
                          placeholder="First name"
                          autoComplete="given-name"
                        />
                        <label htmlFor="firstName" className={labelCls}>
                          First name
                        </label>
                      </div>
                      <div className={fieldWrap}>
                        <input
                          id="lastName"
                          required
                          value={form.lastName}
                          onChange={set("lastName")}
                          className={inputCls}
                          placeholder="Last name"
                          autoComplete="family-name"
                        />
                        <label htmlFor="lastName" className={labelCls}>
                          Last name
                        </label>
                      </div>
                    </div>
                  )}

                  {isSignup && (
                    <>
                      <div className={fieldWrap}>
                        <input
                          id="dob"
                          required
                          type="date"
                          value={form.dob}
                          onChange={set("dob")}
                          className={`${inputCls} placeholder-shown:text-transparent`}
                          placeholder="Date of birth"
                          autoComplete="bday"
                        />
                        <label htmlFor="dob" className={labelCls}>
                          Date of birth
                        </label>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className={fieldWrap}>
                          <input
                            id="nationality"
                            required
                            value={form.nationality}
                            onChange={set("nationality")}
                            className={inputCls}
                            placeholder="Nationality"
                          />
                          <label htmlFor="nationality" className={labelCls}>
                            Nationality
                          </label>
                        </div>
                        <div className={fieldWrap}>
                          <input
                            id="country"
                            required
                            value={form.country}
                            onChange={set("country")}
                            className={inputCls}
                            placeholder="Country of residence"
                            autoComplete="country-name"
                          />
                          <label htmlFor="country" className={labelCls}>
                            Country of residence
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className={fieldWrap}>
                    <input
                      id="email"
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      className={inputCls}
                      placeholder="Email address"
                      autoComplete="email"
                    />
                    <label htmlFor="email" className={labelCls}>
                      Email address
                    </label>
                  </div>

                  {!isForgot && (
                    <div className={fieldWrap}>
                      <input
                        id="password"
                        required
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={set("password")}
                        className={`${inputCls} pr-12`}
                        placeholder="Password"
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        minLength={6}
                      />
                      <label htmlFor="password" className={labelCls}>
                        Password
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
                  )}

                  {!isSignup && !isForgot && (
                    <div className="flex items-center justify-between mt-1">
                      <label className="inline-flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
                        <input type="checkbox" className="peer sr-only" />
                        <span className="grid h-4 w-4 place-items-center rounded border border-line bg-card peer-checked:bg-dark peer-checked:border-dark transition-colors">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-background opacity-0 peer-checked:opacity-100"
                            aria-hidden
                          >
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="link-underline text-xs text-muted hover:text-dark"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {isSignup && (
                    <label className="mt-1 inline-flex items-start gap-2.5 text-xs text-muted leading-relaxed cursor-pointer">
                      <input required type="checkbox" className="mt-0.5 h-4 w-4 rounded border-line accent-dark" />
                      <span>
                        I agree to the{" "}
                        <Link href="/policies/terms-of-service" className="link-underline text-dark">Terms</Link>
                        {" "}and{" "}
                        <Link href="/policies/privacy-policy" className="link-underline text-dark">Privacy Policy</Link>.
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-lux w-full justify-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full border-2 border-background border-r-transparent animate-spin" />
                        {isSignup
                          ? "Creating account…"
                          : isForgot
                            ? "Sending reset link…"
                            : "Signing in…"}
                      </span>
                    ) : isSignup ? (
                      "Create account"
                    ) : isForgot ? (
                      "Send reset link"
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>

                {/* Bottom switch link */}
                <p className="text-center text-sm text-muted mt-10">
                  {isSignup ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
                        className="link-underline text-dark font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  ) : isForgot ? (
                    <>
                      Remembered your password?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
                        className="link-underline text-dark font-medium"
                      >
                        Back to sign in
                      </button>
                    </>
                  ) : (
                    <>
                      New to Novera?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("signup")}
                        className="link-underline text-dark font-medium"
                      >
                        Create an account
                      </button>
                    </>
                  )}
                </p>

            <p className="mt-14 text-center text-[0.62rem] uppercase tracking-[0.3em] text-muted">
              For laboratory R&amp;D use only
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
