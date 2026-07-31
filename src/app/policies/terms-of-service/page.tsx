import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { CONTACT, DISCLAIMER } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Terms of Service";
const DESCRIPTION = `The terms and conditions governing your use of ${SITE_NAME} and any purchase made on this site.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/policies/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title={TITLE}
      updated="31 July 2026"
      intro={`These Terms of Service ("Terms") govern your access to and use of the ${SITE_NAME} website and any products purchased through it. By using this site or placing an order, you agree to be bound by these Terms.`}
    >
      <LegalSection title="1. Eligibility and research-use acknowledgment">
        <p>
          You must be at least 18 years old and a qualified research
          professional, or purchasing on behalf of a laboratory or research
          institution, to place an order. By ordering, you represent that
          any product purchased will be used solely for laboratory research
          and analytical purposes and confirm the following:
        </p>
        <p className="text-dark">{DISCLAIMER}</p>
      </LegalSection>

      <LegalSection title="2. Products and descriptions">
        <p>
          We aim to describe products, batches, and analytical data as
          accurately as possible, including third-party certificates of
          analysis where available. Formulations, packaging, and pricing may
          change without notice.
        </p>
      </LegalSection>

      <LegalSection title="3. Orders and payment">
        <p>
          Placing an order is an offer to purchase, which we may accept or
          decline at our discretion (for example, where a product is out of
          stock or the order raises verification concerns). Prices are shown
          in the currency stated on the site and are due in full at checkout.
        </p>
      </LegalSection>

      <LegalSection title="4. Intellectual property">
        <p>
          All content on this site — text, graphics, logos, product
          photography, and layout — is the property of {SITE_NAME} or its
          licensors and may not be copied, reproduced, or used without prior
          written consent.
        </p>
      </LegalSection>

      <LegalSection title="5. Prohibited uses">
        <ul>
          <li>Using products for any human or veterinary purpose.</li>
          <li>Misrepresenting your identity, age, or purpose when ordering.</li>
          <li>Reselling products as anything other than research material.</li>
          <li>Using the site in any way that violates applicable law or infringes on the rights of others.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Disclaimer of warranties">
        <p>
          Products are supplied &quot;as is&quot; for research purposes only,
          with no warranty of fitness for any particular purpose beyond
          laboratory analysis. We do not make, and expressly disclaim, any
          therapeutic, diagnostic, or medicinal claims.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <p>
          To the fullest extent permitted by law, {SITE_NAME} shall not be
          liable for any indirect, incidental, or consequential damages
          arising from the use or misuse of any product purchased through
          this site, including any use outside the stated research-only
          purpose.
        </p>
      </LegalSection>

      <LegalSection title="8. Indemnification">
        <p>
          You agree to indemnify and hold {SITE_NAME} harmless from any
          claim, loss, or liability arising from your use of a product
          outside the research-only purpose described in these Terms.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which{" "}
          {SITE_NAME} is registered, without regard to conflict-of-law
          principles.{" "}
          <em>[Add your specific governing jurisdiction here.]</em>
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to these terms">
        <p>
          We may update these Terms from time to time. Continued use of the
          site after changes are posted constitutes acceptance of the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact us">
        <p>
          Questions about these Terms can be sent to{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
