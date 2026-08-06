"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/data";
import {
  ApiError,
  getCurrentUser,
  getOrdersByEmail,
  type ApiUser,
  type UserOrder,
} from "@/lib/api";

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

const STATUS_DOT: Record<string, string> = {
  paid: "bg-olive",
  received: "bg-olive",
  delivered: "bg-olive",
  shipped: "bg-olive",
  rejected: "bg-red-500",
  cancelled: "bg-red-500",
  pending: "bg-muted",
};

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-background px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-muted">
      <span
        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[label?.toLowerCase()] || "bg-muted"}`}
        aria-hidden
      />
      {label || "pending"}
    </span>
  );
}

function OrderCard({ order }: { order: UserOrder }) {
  const total = toNumber(order.total);
  const date = new Date(order.created_at);
  const dateLabel = Number.isNaN(date.getTime())
    ? order.created_at
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="rounded-[28px] border border-line bg-card p-6 lg:p-7 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs text-dark truncate">
            {order.order_number}
          </p>
          <p className="mt-1 text-xs text-muted">{dateLabel}</p>
        </div>
        <span className="font-serif text-2xl text-dark whitespace-nowrap">
          {formatPrice(total)}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusPill label={order.status} />
        <StatusPill label={order.payment_status} />
      </div>

      {order.tracking_number && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-line bg-background px-4 py-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">
              Tracking number
            </p>
            <p className="mt-0.5 text-sm text-dark font-mono truncate">
              {order.tracking_number}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null | undefined>(undefined);
  const [orders, setOrders] = useState<UserOrder[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (!current) {
      router.replace("/signin");
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    getOrdersByEmail(user.email)
      .then((res) => setOrders(res.orders))
      .catch((err) => {
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load your orders."
        );
      });
  }, [user]);

  /* ---- Resolving session / redirecting ---- */
  if (user === undefined || user === null) {
    return (
      <main className="pt-28 lg:pt-32 pb-24 min-h-screen">
        <div className="container-lux">
          <p className="eyebrow mb-3">Account</p>
          <h1 className="text-section mb-8">My Orders</h1>
          <div className="flex items-center gap-3 rounded-[28px] border border-line bg-card px-6 py-5 text-muted text-sm w-fit">
            <span className="h-4 w-4 rounded-full border-2 border-olive border-r-transparent animate-spin" />
            Loading your account…
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 lg:pt-32 pb-24 min-h-screen">
      <div className="container-lux max-w-4xl">
        <div className="mb-12">
          <p className="eyebrow mb-3">Account</p>
          <h1 className="text-section">My Orders</h1>
          <p className="mt-4 max-w-xl text-muted text-sm leading-relaxed">
            Order status and tracking updates appear here automatically once
            your shipment is on its way.
          </p>
        </div>

        {loadError && (
          <p
            role="alert"
            className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700"
          >
            {loadError}
          </p>
        )}

        {!loadError && orders === null && (
          <div className="flex items-center gap-3 rounded-[28px] border border-line bg-card px-6 py-5 text-muted text-sm w-fit">
            <span className="h-4 w-4 rounded-full border-2 border-olive border-r-transparent animate-spin" />
            Fetching your orders…
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className="rounded-[28px] border border-line bg-background-secondary p-8 shadow-[0_20px_60px_-32px_rgba(26,26,26,0.25)]">
            <p className="font-serif text-2xl text-dark">No orders yet</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              When you place an order, it&apos;ll show up here with live
              status and tracking.
            </p>
            <Link href="/#products" className="btn-lux mt-7">
              View products
            </Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
