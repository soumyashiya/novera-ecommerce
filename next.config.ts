import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: typically 20–30% smaller than WebP at the same quality. Next
    // content-negotiates and falls back to WebP for browsers that lack it.
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults this allowlist to [75] and silently coerces any other
    // `quality` prop to the nearest entry. 90 is here for the hero, which is
    // the LCP element and is cropped from a 3:1 source.
    qualities: [75, 90],
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
