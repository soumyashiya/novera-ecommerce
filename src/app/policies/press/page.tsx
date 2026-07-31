import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { CONTACT, DISCLAIMER } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Press";
const DESCRIPTION = `Media resources and press contact information for ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/policies/press" },
};

export default function PressPage() {
  return (
    <LegalLayout
      eyebrow="Media"
      title={TITLE}
      updated="31 July 2026"
      intro={`Resources for journalists and researchers writing about ${SITE_NAME}.`}
    >
      <LegalSection title="About us">
        <p>
          {SITE_NAME} supplies research-grade peptides for laboratory
          analytical work. Every batch is independently tested by a
          third-party laboratory, and a certificate of analysis is available
          for each product listed in our shop.
        </p>
        <p className="text-dark">{DISCLAIMER}</p>
      </LegalSection>

      <LegalSection title="Press inquiries">
        <p>
          For interview requests, fact-checking, or brand assets, contact us
          at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and a
          member of our team will respond within two business days.
        </p>
      </LegalSection>

      <LegalSection title="In the news">
        <p>
          We have no press coverage to share at this time. Check back here
          for updates as they are published.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
