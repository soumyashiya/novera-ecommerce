"use client";

// Footer video reel. One clip plays at a time, centred in the row, with its
// neighbours sitting dimmed either side. When the centred clip reaches its
// end the reel advances and brings the next one to the middle.
//
// The clip list is rendered three times over and the playing clip is always
// kept inside the middle copy. That is what removes the dead space at the
// ends: there is a full set of clips to the left and right of whatever is
// centred, so the first clip centres exactly like any other and the track
// needs no edge padding. Stepping off the end of the middle copy rewinds by
// one copy — the copies are identical, so the only tell is that this one
// transition cuts instead of sliding.
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import VideoTile from "./VideoTile";

export type Clip = {
  n: number;
  src: string;
  poster: string;
  label: string;
  duration: string;
};

const COPIES = 3;

export default function VideoReel({ clips }: { clips: Clip[] }) {
  const reduce = useReducedMotion();
  const count = clips.length;
  // Start on the first clip of the middle copy. `pos` stays in [count, 2*count).
  const [pos, setPos] = useState(count);
  const track = useRef<HTMLUListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const prev = useRef(count);
  const mounted = useRef(false);

  useEffect(() => {
    const ul = track.current;
    const el = items.current[pos];
    // A move of more than one step is the copy rewind: snap, do not animate,
    // or the reel visibly scrolls backwards through the whole set.
    const jumped = Math.abs(pos - prev.current) > 1;
    const first = !mounted.current;
    prev.current = pos;
    mounted.current = true;
    if (!ul || !el) return;

    // Drive the track's own scrollLeft rather than scrollIntoView. This reel
    // sits in the footer, and scrollIntoView scrolls every scrollable ancestor
    // including the document — `block: "nearest"` does not stop that when the
    // target is off screen, which it always is on first paint. The result was
    // that opening any page jumped past the hero straight down to the reel.
    const t = ul.getBoundingClientRect();
    const e = el.getBoundingClientRect();
    const left = ul.scrollLeft + (e.left - t.left) - (t.width - e.width) / 2;

    // The initial centring is a starting position, not a transition.
    ul.scrollTo({
      left,
      behavior: reduce || jumped || first ? "auto" : "smooth",
    });
  }, [pos, reduce]);

  const next = useCallback(() => {
    setPos((p) => {
      const n = p + 1;
      return n >= 2 * count ? n - count : n;
    });
  }, [count]);

  // Selecting a clip targets its twin in the middle copy, so the invariant
  // above holds however the visitor jumps around.
  const select = useCallback(
    (i: number) => setPos(count + (i % count)),
    [count]
  );

  const reel = Array.from({ length: COPIES }, () => clips).flat();

  return (
    <ul
      ref={track}
      className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {reel.map((c, i) => (
        <li
          key={`${c.n}-${i}`}
          ref={(el) => {
            items.current[i] = el;
          }}
          className="w-[58vw] shrink-0 snap-center sm:w-[38vw] lg:w-[22vw]"
        >
          <VideoTile
            src={c.src}
            poster={c.poster}
            label={c.label}
            duration={c.duration}
            active={i === pos}
            onEnded={next}
            onSelect={() => select(i)}
          />
        </li>
      ))}
    </ul>
  );
}
