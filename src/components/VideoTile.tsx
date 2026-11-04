"use client";

// One clip in the footer reel. It plays only when it is the centred clip AND
// on screen; every other tile sits paused on its poster, rewound so its turn
// starts from the top. Playback is muted (browsers block autoplay otherwise)
// with a sound toggle in the corner. Reduced motion keeps it on the poster.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function VideoTile({
  src,
  poster,
  label,
  duration,
  active,
  onEnded,
  onSelect,
}: {
  src: string;
  poster: string;
  label: string;
  duration: string;
  /** True for the clip currently centred in the reel. */
  active: boolean;
  /** Fired when this clip plays to its end, so the reel can advance. */
  onEnded: () => void;
  /** Make this clip the centred one. */
  onSelect: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!active) {
      // Rewind as it leaves the centre so the poster frame shows again.
      v.pause();
      v.currentTime = 0;
      return;
    }
    if (inView && !userPaused && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [active, inView, userPaused, reduce]);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      onSelect();
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  const btn =
    "grid h-8 w-8 place-items-center bg-white/90 text-dark transition-colors duration-300 hover:bg-accent";

  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden bg-dark transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        active ? "" : "scale-[0.94]"
      }`}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />

      {/* Held back in ink, not opacity — the footer behind this reel is
          yellow, so fading the tile tinted the paused clips yellow. */}
      {!active && (
        <>
          <div aria-hidden className="absolute inset-0 z-10 bg-dark/55" />
          {/* An off-centre clip is a target, not a player: one tap centres it. */}
          <button
            type="button"
            onClick={onSelect}
            aria-label={`Play ${label}`}
            className="absolute inset-0 z-20 cursor-pointer"
          />
        </>
      )}

      <span className="absolute right-3 top-3 z-30 bg-dark/70 px-2 py-1 text-[0.6875rem] font-semibold text-white">
        {duration}
      </span>

      {active && (
        <div className="absolute inset-x-3 bottom-3 z-30 flex items-center justify-between">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? `Pause ${label}` : `Play ${label}`}
            className={btn}
          >
            {playing ? (
              <svg viewBox="0 0 16 16" aria-hidden className="h-3 w-3 fill-current">
                <path d="M4 3h3v10H4zM9 3h3v10H9z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden className="h-3 w-3 fill-current">
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? `Unmute ${label}` : `Mute ${label}`}
            aria-pressed={!muted}
            className={btn}
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              {muted ? (
                <path d="M22 9l-6 6M16 9l6 6" />
              ) : (
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
              )}
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
