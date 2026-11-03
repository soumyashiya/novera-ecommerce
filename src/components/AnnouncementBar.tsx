"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ANNOUNCEMENTS } from "@/lib/data";

// The reference shows ONE centred message on a dark bar and rotates through
// them — not a scrolling marquee. Reduced-motion holds on the first message.
const INTERVAL_MS = 5000;

export default function AnnouncementBar() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="bg-dark text-background">
      <div className="container-lux flex min-h-[34px] items-center justify-center">
        {/* aria-live so the rotation is announced once, not re-read per tick. */}
        <p
          aria-live="polite"
          className="text-center text-[0.8125rem] font-semibold leading-tight tracking-[-0.02em]"
        >
          {ANNOUNCEMENTS[index]}
          <span className="hidden sm:inline">
            {" | "}
            <Link href="/shop" className="underline underline-offset-2">
              Shop the range
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
}
