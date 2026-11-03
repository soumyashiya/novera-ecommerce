"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

export default function AddToCart({ slug }: { slug: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-4">
        {/* Quantity stepper */}
        <div className="flex items-center border border-line">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-12 w-12 text-lg text-muted hover:text-dark transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="h-12 w-12 text-lg text-muted hover:text-dark transition-colors"
          >
            +
          </button>
        </div>

        <button type="button" onClick={handleAdd} className="btn-lux flex-1 justify-center min-w-[180px]">
          {added ? "Added to cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
