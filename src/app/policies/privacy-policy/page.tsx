import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { CONTACT } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Privacy Policy";
const DESCRIPTION = `How ${SITE_NAME} collects, uses, and protects your personal information.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/policies/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title={TITLE}
      updated="31 July 2026"
      intro={`This Privacy Policy explains how ${SITE_NAME} ("${SITE_NAME}", "we", "us", or "our") collects, uses, discloses, and safeguards information when you visit our website, place an order, or otherwise interact with us.`}
    >
      <LegalSection title="1. Information we collect">
        <p>We collect information in the following ways:</p>
        <ul>
          <li>
            <strong>Information you provide:</strong> name, email address,
            shipping and billing address, phone number, and order details
            when you create an account, place an order, subscribe to our
            newsletter, or contact us.
          </li>
          <li>
            <strong>Payment information:</strong> payments are processed by a
            third-party payment provider. We do not store full card numbers
            on our servers.
          </li>
          <li>
            <strong>Automatically collected information:</strong> IP address,
            browser type, device information, pages viewed, and referring
            URLs, collected via cookies and similar technologies.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <ul>
          <li>To process, fulfil, and ship your orders.</li>
          <li>To communicate order confirmations, updates, and support.</li>
          <li>To send newsletters and marketing communications you have opted into (you may unsubscribe at any time).</li>
          <li>To maintain the security and integrity of our website.</li>
          <li>To comply with legal obligations and enforce our Terms of Service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Cookies">
        <p>
          We use cookies and similar technologies to remember your cart,
          understand how the site is used, and improve performance. You can
          control cookies through your browser settings; disabling them may
          affect certain site features such as the shopping cart.
        </p>
      </LegalSection>

      <LegalSection title="4. Sharing your information">
        <p>We do not sell your personal information. We may share it with:</p>
        <ul>
          <li>Service providers who help us operate the site, process payments, and fulfil shipments.</li>
          <li>Third-party analytical laboratories (e.g. Janoshik Analytical) solely for batch verification and certificate-of-analysis purposes — order-identifying information is not shared with these labs.</li>
          <li>Authorities, when required by law or to protect our legal rights.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data security">
        <p>
          We use reasonable administrative, technical, and physical
          safeguards to protect your information. No method of transmission
          or storage is completely secure, and we cannot guarantee absolute
          security.
        </p>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <p>
          We retain personal information for as long as necessary to fulfil
          the purposes described in this policy, including to satisfy legal,
          accounting, or reporting requirements.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          Depending on your location, you may have the right to access,
          correct, delete, or port your personal information, and to object
          to or restrict certain processing. To exercise these rights,
          contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection title="8. Children's privacy">
        <p>
          Our site and products are intended for qualified research
          professionals aged 18 and over. We do not knowingly collect
          personal information from minors.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The
          &quot;Last updated&quot; date at the top of this page reflects the
          most recent revision.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact us">
        <p>
          Questions about this Privacy Policy can be sent to{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
