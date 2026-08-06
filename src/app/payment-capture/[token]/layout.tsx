import type { Metadata } from "next";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = {
  title: "Complete Your Payment",
  description:
    "Complete your Novera order payment via bank transfer and upload proof of payment.",
  robots: { index: false, follow: false },
};

export default function PaymentCaptureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
