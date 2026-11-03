"use client";

import { useEffect, useState } from "react";

const KEY = "novera-wishlist";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Round heart toggle on product cards; saves the slug in this browser. */
export default function WishlistHeart({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => setSaved(read().includes(slug)), [slug]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const list = read().filter((s) => s !== slug);
    if (!saved) list.push(slug);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
    setSaved(!saved);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-dark backdrop-blur-sm transition-colors duration-300 hover:bg-white"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      >
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
    </button>
  );
}
