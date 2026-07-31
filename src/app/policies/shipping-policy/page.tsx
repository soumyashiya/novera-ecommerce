import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { CONTACT } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Shipping Policy";
const DESCRIPTION = `How ${SITE_NAME} packages, ships, and delivers cold-chain research orders.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/policies/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title={TITLE}
      updated="31 July 2026"
      intro={`Every order is temperature-sensitive research material, so shipping is built around an unbroken cold-chain from our facility to your bench.`}
    >
      <LegalSection title="1. Processing time">
        <p>
          Orders are processed and prepared for cold-chain shipment within
          1–2 business days of payment confirmation. Orders placed on
          weekends or holidays are processed the next business day.
        </p>
      </LegalSection>

      <LegalSection title="2. Cold-chain packaging">
        <p>
          Products requiring refrigeration are packed with insulated liners
          and cooling packs to maintain a stable 2–8°C environment in
          transit, and sealed in discreet, tamper-evident outer packaging.
        </p>
      </LegalSection>

      <LegalSection title="3. Shipping regions and rates">
        <p>
          We currently ship to the regions listed at checkout. Shipping
          costs and estimated delivery windows are calculated automatically
          based on your address and are shown before you complete payment.
        </p>
      </LegalSection>

      <LegalSection title="4. Delivery estimates">
        <p>
          Standard delivery typically takes 3–7 business days domestically
          and 7–14 business days internationally, once dispatched. These are
          estimates, not guarantees, and can be affected by customs or
          carrier delays outside our control.
        </p>
      </LegalSection>

      <LegalSection title="5. Order tracking">
        <p>
          You will receive a tracking number by email as soon as your order
          ships. Use it to follow your package to delivery.
        </p>
      </LegalSection>

      <LegalSection title="6. Customs and international orders">
        <p>
          International customers are responsible for any customs duties,
          taxes, or import fees levied by their country. All shipments are
          declared and labelled accurately as research material for
          laboratory use only.
        </p>
      </LegalSection>

      <LegalSection title="7. Lost or delayed packages">
        <p>
          If your tracking shows no movement for several days or your
          delivery window has passed, contact us and we will open an
          investigation with the carrier and keep you updated until it is
          resolved.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact us">
        <p>
          Shipping questions can be sent to{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
