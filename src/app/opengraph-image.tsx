import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

// Generated at build time rather than shipped as a static asset, so the card
// can never drift out of sync with the brand copy in lib/. Next reuses this for
// twitter:image too when no twitter-image file exists.
export const alt = `${SITE_NAME} — Research-Grade Peptides for Laboratory Analysis`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette mirrors globals.css.
const BACKGROUND = "#fffdf0";
const DARK = "#14171a";
const COPPER = "#8a5029";
const MUTED = "#5b6066";
const LINE = "rgba(20,23,26,0.12)";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BACKGROUND,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          Novera Research
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
              color: DARK,
            }}
          >
            Precision in
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
              color: COPPER,
            }}
          >
            Every Batch.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 28,
            fontSize: 24,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>
            Verified purity · For research purposes only
          </div>
          <div style={{ display: "flex", color: DARK, fontWeight: 600 }}>
            {SITE_NAME}
          </div>
        </div>
      </div>
    ),
    size
  );
}
