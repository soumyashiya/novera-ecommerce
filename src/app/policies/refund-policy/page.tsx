import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { CONTACT } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Refund Policy";
const DESCRIPTION = `Our policy on refunds, returns, and order cancellations at ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/policies/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title={TITLE}
      updated="31 July 2026"
      intro={`Because our products are cold-chain, sealed research compounds, our refund policy is built around product integrity as much as customer satisfaction. Here's exactly how it works.`}
    >
      <LegalSection title="1. Non-returnable products">
        <p>
          Due to the sealed, temperature-sensitive nature of our products, we
          cannot accept returns of any item once it has shipped, whether or
          not the seal has been broken. This protects the integrity of the
          cold-chain for every customer and is standard practice across the
          research-compound industry.
        </p>
      </LegalSection>

      <LegalSection title="2. Damaged or incorrect orders">
        <p>
          If your order arrives damaged, visibly compromised, or does not
          match what you ordered, contact us within 48 hours of delivery
          with:
        </p>
        <ul>
          <li>Your order number.</li>
          <li>Clear photos of the item and its packaging as received.</li>
          <li>A brief description of the issue.</li>
        </ul>
        <p>
          Once verified, we will offer a replacement or a full refund to your
          original payment method, at your choice.
        </p>
      </LegalSection>

      <LegalSection title="3. Lost or non-delivered orders">
        <p>
          If tracking shows no movement for an extended period or your order
          is confirmed lost in transit, we will investigate with the carrier
          and, where appropriate, send a replacement or issue a refund.
        </p>
      </LegalSection>

      <LegalSection title="4. Order cancellations">
        <p>
          Orders can be cancelled free of charge only before they enter
          fulfilment. Once an order has been packed for cold-chain shipment,
          it can no longer be cancelled or modified. Contact us as soon as
          possible if you need to change or cancel an order.
        </p>
      </LegalSection>

      <LegalSection title="5. Refund processing time">
        <p>
          Approved refunds are issued to your original payment method within
          5–10 business days, though your bank or card provider may take
          additional time to reflect the funds.
        </p>
      </LegalSection>

      <LegalSection title="6. How to request a refund">
        <p>
          Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with
          your order number and the details above, and our team will respond
          within one business day.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
