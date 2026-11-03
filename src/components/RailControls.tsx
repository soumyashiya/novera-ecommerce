"use client";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === "next" ? (
        <path d="M5 12h14M13 6l6 6-6 6" />
      ) : (
        <path d="M19 12H5M11 6l-6 6 6 6" />
      )}
    </svg>
  );
}

const arrowCls =
  "grid h-11 w-11 place-items-center border border-dark/80 text-dark transition-colors duration-300 hover:bg-dark hover:text-background";

/** Footer row under a drifting rail: count + hint left, square arrows right. */
export default function RailControls({
  label,
  reduce,
  onPage,
  noun,
}: {
  label: string;
  reduce: boolean | null;
  onPage: (dir: 1 | -1) => void;
  noun: string;
}) {
  return (
    <div className="container-lux mt-8 flex items-center justify-between gap-6">
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-dark/70">
        {label} · {reduce ? "Use the arrows" : "Hover to pause"}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPage(-1)}
          aria-label={`Previous ${noun}`}
          className={arrowCls}
        >
          <Arrow dir="prev" />
        </button>
        <button
          type="button"
          onClick={() => onPage(1)}
          aria-label={`Next ${noun}`}
          className={arrowCls}
        >
          <Arrow dir="next" />
        </button>
      </div>
    </div>
  );
}
