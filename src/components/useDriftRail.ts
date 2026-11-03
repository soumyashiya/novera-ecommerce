"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A full-bleed rail that drifts left continuously and loops seamlessly.
 * Render the item set `copies` times inside the track (a flex row whose gap
 * equals `gap`, with `paddingRight: gap`) — it wraps after one set's width,
 * which is invisible because every copy is identical.
 *
 * Returns the track ref, hover/focus handlers that pause the drift, and a
 * `page(dir)` that eases the rail one item forward or back.
 */
export function useDriftRail({
  copies,
  gap,
  speed = 40,
}: {
  copies: number;
  gap: number;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const pos = useRef(0);
  const nudge = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      let step = 0;
      if (!paused.current && !reduce) step += speed * dt;
      // Ease the arrow nudge out over ~0.4s (instant under reduced motion).
      if (nudge.current !== 0) {
        const d = reduce ? nudge.current : nudge.current * Math.min(1, dt * 9);
        step += d;
        nudge.current -= d;
        if (Math.abs(nudge.current) < 0.5) {
          step += nudge.current;
          nudge.current = 0;
        }
      }

      const w = track.scrollWidth / copies;
      if (w > 0) {
        pos.current = (((pos.current + step) % w) + w) % w;
        track.style.transform = `translate3d(${-pos.current}px,0,0)`;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduce, copies, speed]);

  const page = (dir: 1 | -1) => {
    const item = trackRef.current?.firstElementChild as HTMLElement | null;
    nudge.current += dir * ((item?.offsetWidth ?? 360) + gap);
  };

  const pauseHandlers = {
    onMouseEnter: () => (paused.current = true),
    onMouseLeave: () => (paused.current = false),
    onFocus: () => (paused.current = true),
    onBlur: () => (paused.current = false),
  };

  return { trackRef, page, pauseHandlers, reduce };
}
