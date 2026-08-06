import type { Metadata } from "next";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Look up a Novera order by order number and email to see its status.",
  robots: { index: false, follow: false },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
