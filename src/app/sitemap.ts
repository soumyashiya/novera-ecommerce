import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

// Only publicly indexable pages belong here. Cart, checkout, sign-in and
// password reset are per-user or transactional and are disallowed in robots.ts,
// so listing them would ask crawlers to index what we just told them to skip.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const POLICY_SLUGS = [
    "privacy-policy",
    "terms-of-service",
    "shipping-policy",
    "refund-policy",
    "press",
  ];

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/shop"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...PRODUCTS.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...POLICY_SLUGS.map((slug) => ({
      url: absoluteUrl(`/policies/${slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
