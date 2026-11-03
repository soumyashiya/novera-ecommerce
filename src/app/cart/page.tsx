"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { getProduct, formatPrice, DISCLAIMER } from "@/lib/data";

export default function CartPage() {
  const { items, setQty, remove, subtotal, count, hydrated } = useCart();

  const lines = items
    .map((i) => ({ item: i, product: getProduct(i.slug) }))
    .filter((l) => l.product);

  return (
    <main className="pt-28 lg:pt-32 pb-20 min-h-[70vh]">
      <div className="container-lux">
        <h1 className="text-section mb-3">Your cart</h1>
        <p className="text-muted mb-12">
          {hydrated
            ? count > 0
              ? `${count} item${count === 1 ? "" : "s"} ready for enquiry.`
              : "Your cart is currently empty."
            : "Loading…"}
        </p>

        {hydrated && lines.length === 0 ? (
          <div className="border-t border-line pt-12">
            <p className="text-muted mb-6">
              Browse the range and add a product to get started.
            </p>
            <Link href="/#products" className="btn-lux">
              View Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Line items */}
            <div className="lg:col-span-8 border-t border-line">
              {lines.map(({ item, product }) => (
                <div
                  key={item.slug}
                  className="flex gap-4 sm:gap-6 py-7 border-b border-line"
                >
                  <Link
                    href={`/products/${product!.slug}`}
                    className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden bg-background-secondary"
                  >
                    <Image
                      src={product!.image}
                      alt={product!.name}
                      fill
                      sizes="112px"
                      className="object-cover img-grade"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${product!.slug}`}
                          className="text-subhead text-xl link-underline"
                        >
                          {product!.name}
                        </Link>
                        <p className="text-sm text-muted mt-1">{product!.tag}</p>
                      </div>
                      <p className="text-dark whitespace-nowrap">
                        {formatPrice(product!.price * item.qty)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                      <div className="flex items-center border border-line">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="h-10 w-10 text-muted hover:text-dark transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center tabular-nums text-sm">
                          {item.qty}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="h-10 w-10 text-muted hover:text-dark transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.slug)}
                        className="link-underline text-sm text-muted hover:text-dark transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 border border-line bg-card p-7 lg:p-8">
              <h2 className="text-subhead text-2xl mb-6">Order summary</h2>
              <div className="flex justify-between text-muted mb-6">
                <span>Subtotal</span>
                <span className="text-dark">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg border-t border-line pt-5 mb-8">
                <span>Total</span>
                <span className="font-serif text-2xl text-copper">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link href="/checkout" className="btn-lux w-full justify-center">
                Checkout
              </Link>
              <Link
                href="/#products"
                className="link-underline mt-5 block text-center text-sm text-muted hover:text-dark transition-colors"
              >
                Continue browsing
              </Link>

              {/* Research-only acknowledgement */}
              <div
                role="note"
                aria-label="Research-only notice"
                className="mt-6 border border-copper/40 bg-copper/5 p-4 text-xs leading-relaxed text-dark"
              >
                <p className="text-[0.75rem] tracking-[-0.005em] uppercase text-copper font-semibold">
                  Research use only
                </p>
                <p className="mt-2">{DISCLAIMER}</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
