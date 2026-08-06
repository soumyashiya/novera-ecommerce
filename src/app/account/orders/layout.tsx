import type { Metadata } from "next";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = {
  title: "My Orders",
  description: "View your Novera order history, status, and tracking.",
  robots: { index: false, follow: false },
};

export default function AccountOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
