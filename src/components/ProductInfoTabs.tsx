"use client";

import { useState } from "react";

type Props = {
  packageContents: string[];
  storageLogic: string[];
  supplyChain: string[];
};

const TABS = ["Package Contents", "Storage Logic", "Supply Chain"] as const;
type Tab = (typeof TABS)[number];

export default function ProductInfoTabs({
  packageContents,
  storageLogic,
  supplyChain,
}: Props) {
  const [active, setActive] = useState<Tab>("Package Contents");

  const content: Record<Tab, string[]> = {
    "Package Contents": packageContents,
    "Storage Logic": storageLogic,
    "Supply Chain": supplyChain,
  };

  return (
    <div>
      <div
        role="tablist"
        className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-3"
      >
        {TABS.map((t) => {
          const selected = t === active;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={selected}
              type="button"
              onClick={() => setActive(t)}
              className={`text-sm tracking-wide transition-colors ${
                selected
                  ? "text-dark border-b-2 border-dark -mb-[13px] pb-3"
                  : "text-muted hover:text-dark"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <ul className="mt-5 space-y-2 text-[0.9375rem] leading-relaxed text-muted">
        {content[active].map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
