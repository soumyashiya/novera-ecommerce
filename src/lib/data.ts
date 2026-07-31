// Centralized content for Novera — research-grade peptides for laboratory
// analytical work. All copy is original and positioned strictly for research
// use.

export const BRAND = {
  name: "Novera",
  tagline: "Research-Grade Peptides for Laboratory Analysis",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/#products" },
  { label: "About", href: "/#about" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

// Category grouping for the /shop listing page. Keyed by product slug so the
// Product type (and every existing consumer of PRODUCTS) stays untouched.
export const PRODUCT_CATEGORIES: Record<string, string> = {
  tirzepatide: "Metabolic Research",
  retatrutide: "Metabolic Research",
  "retatrutide-40": "Metabolic Research",
  "bpc-157-tb-500": "Recovery & Repair",
  glow: "Recovery & Repair",
  nad: "Cellular & Longevity",
};

// "Products" — original descriptions for the research compounds in our range.
export type CompoundRow = {
  name: string;
  concentration: string;
  content: string;
};

export type ProductAnalysis = {
  batchNumber: string;
  fillVolume: string;
  purity?: string;
  compounds: CompoundRow[];
  // The Janoshik certificate of analysis (portrait scan) shown in the modal.
  coaImage: string;
  // Sample photographs captured by Janoshik during testing, shown as a gallery
  // beneath the certificate.
  evidenceImages: string[];
  // Official Janoshik verification page for this batch, linked from the modal
  // so visitors can confirm the report against the third-party source.
  reportUrl: string;
};

export type Product = {
  no: string;
  slug: string;
  name: string;
  tag: string;
  price: number;
  summary: string;
  description: string;
  strengths: string[];
  image: string;
  gallery: string[];
  analysis?: ProductAnalysis;
  packageContents: string[];
  storageLogic: string[];
  supplyChain: string[];
};

const STORAGE_LOGIC = [
  "Store refrigerated (2–8°C). Do not freeze.",
  "Supplied in fixed-volume sealed format for laboratory analysis.",
];

const SUPPLY_CHAIN = [
  "Research & Development purposes only.",
];

export const PRODUCTS: Product[] = [
  {
    no: "01",
    slug: "tirzepatide",
    name: "Tirzepatide 40 mg (R&D Only)",
    tag: "Compound Analysis",
    price: 189,
    summary: "Dual-agonist research peptide for in vitro metabolic studies.",
    description:
      "A 40 mg Tirzepatide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    strengths: ["40 mg"],
    image: "/images/alluvi-tirzepatide.jpg",
    gallery: [
      "/images/alluvi-tirzepatide.jpg",
      "/images/alluvi-tirzepatide-2.jpg",
      "/images/alluvi-tirzepatide-open.jpg",
      "/images/alluvi-tirzepatide-uv.jpg",
    ],
    analysis: {
      batchNumber: "TR786PAOS",
      fillVolume: "3 mL",
      purity: "99.85%",
      compounds: [
        { name: "Tirzepatide", concentration: "13.35 mg/mL", content: "40.05 mg" },
      ],
      coaImage: "/images/coa/tirzepatide.png",
      evidenceImages: [
        "/images/coa/evidence/tirzepatide-1.jpg",
        "/images/coa/evidence/tirzepatide-2.jpg",
        "/images/coa/evidence/tirzepatide-3.jpg",
      ],
      reportUrl:
        "https://verify.janoshik.com/tests/147174-ALLUVI_TIRZEPATIDE_40MG_KIT_T5MBWRAYD4HN",
    },
    packageContents: [
      "Pre-filled Research pen (40 mg Tirzepatide)",
      "Research information sheet",
    ],
    storageLogic: STORAGE_LOGIC,
    supplyChain: SUPPLY_CHAIN,
  },
  {
    no: "02",
    slug: "retatrutide",
    name: "Retatrutide 20 mg (R&D Only)",
    tag: "Compound Analysis",
    price: 149,
    summary: "Triple-agonist research peptide for advanced in vitro studies.",
    description:
      "A 20 mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    strengths: ["20 mg"],
    image: "/images/alluvi-retatrutide.jpg",
    gallery: [
      "/images/alluvi-retatrutide.jpg",
      "/images/alluvi-retatrutide-pen.jpg",
      "/images/alluvi-retatrutide-open.jpg",
      "/images/alluvi-retatrutide-uv.jpg",
    ],
    analysis: {
      batchNumber: "AR1721TRT",
      fillVolume: "2.4 mL",
      purity: "99.21%",
      compounds: [
        { name: "Retatrutide", concentration: "9.57 mg/mL", content: "22.96 mg" },
      ],
      coaImage: "/images/coa/retatrutide-20.png",
      evidenceImages: [
        "/images/coa/evidence/retatrutide-20-1.jpg",
        "/images/coa/evidence/retatrutide-20-2.jpg",
      ],
      reportUrl:
        "https://verify.janoshik.com/tests/163215-ALLUVI_RETATRUTIDE_20MG_KIT_GBHEFN58JXXZ",
    },
    packageContents: [
      "Pre-filled Research pen (20 mg Retatrutide)",
      "Research information sheet",
    ],
    storageLogic: STORAGE_LOGIC,
    supplyChain: SUPPLY_CHAIN,
  },
  {
    no: "03",
    slug: "nad",
    name: "NAD+ 1,000 mg",
    tag: "Compound Analysis",
    price: 149,
    summary: "Reference compound for in vitro cellular research.",
    description:
      "NAD+ (Nicotinamide Adenine Dinucleotide) research formulation for laboratory analysis and in vitro studies only. Provided exclusively for controlled laboratory R&D applications.",
    strengths: ["1,000 mg"],
    image: "/images/alluvi-nad.jpg",
    gallery: [
      "/images/alluvi-nad.jpg",
      "/images/alluvi-nad-pen.jpg",
      "/images/alluvi-nad-open.jpg",
      "/images/alluvi-nad-uv.jpg",
    ],
    packageContents: [
      "2 × Pre-filled NAD+ pens (500 mg each)",
      "Research information sheet",
    ],
    storageLogic: STORAGE_LOGIC,
    supplyChain: SUPPLY_CHAIN,
  },
  {
    no: "04",
    slug: "glow",
    name: "Glow 70 mg (R&D Only)",
    tag: "Compound Analysis",
    price: 129,
    summary: "Triple-peptide reference blend for in vitro research.",
    description:
      "A 70 mg triple-peptide formulation supplied in pre-filled research devices, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    strengths: ["70 mg"],
    image: "/images/alluvi-glow.jpg",
    gallery: [
      "/images/alluvi-glow.jpg",
      "/images/alluvi-glow-pen.jpg",
      "/images/alluvi-glow-open.jpg",
      "/images/alluvi-glow-uv.jpg",
    ],
    analysis: {
      batchNumber: "GL0621XSA",
      fillVolume: "3.4 mL",
      compounds: [
        { name: "GHK-Cu", concentration: "7.59 mg/mL", content: "25.8 mg" },
        { name: "BPC-157", concentration: "2.39 mg/mL", content: "8.13 mg" },
        { name: "TB-500", concentration: "1.99 mg/mL", content: "6.76 mg" },
      ],
      coaImage: "/images/coa/glow.png",
      evidenceImages: [
        "/images/coa/evidence/glow-1.jpg",
        "/images/coa/evidence/glow-2.jpg",
      ],
      reportUrl:
        "https://verify.janoshik.com/tests/163217-ALLUVI_GLOW_70MG_KIT_DCL3AJSE4JQP",
    },
    packageContents: [
      "2 × Pre-filled Research pens (each pen: 5 mg BPC-157, 5 mg TB-500, 25 mg GHK-Cu)",
      "Total contents: 10 mg BPC-157, 10 mg TB-500, 50 mg GHK-Cu",
    ],
    storageLogic: STORAGE_LOGIC,
    supplyChain: SUPPLY_CHAIN,
  },
  {
    no: "05",
    slug: "bpc-157-tb-500",
    name: "BPC-157 & TB-500 40 mg (R&D Only)",
    tag: "Compound Analysis",
    price: 169,
    summary: "Dual research peptide blend for in vitro pathway studies.",
    description:
      "A 40 mg BPC-157 & TB-500 formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    strengths: ["40 mg"],
    image: "/images/alluvi-bpc-tb500.jpg",
    gallery: [
      "/images/alluvi-bpc-tb500.jpg",
      "/images/alluvi-bpc-tb500-pen.jpg",
      "/images/alluvi-bpc-tb500-open.jpg",
      "/images/alluvi-bpc-tb500-uv.jpg",
    ],
    analysis: {
      batchNumber: "BP1701FSR",
      fillVolume: "3 mL",
      compounds: [
        { name: "BPC-157", concentration: "7.33 mg/mL", content: "21.99 mg" },
        { name: "TB-500", concentration: "6.53 mg/mL", content: "19.59 mg" },
      ],
      coaImage: "/images/coa/bpc-tb500.png",
      evidenceImages: [
        "/images/coa/evidence/bpc-tb500-1.jpg",
        "/images/coa/evidence/bpc-tb500-2.jpg",
      ],
      reportUrl:
        "https://verify.janoshik.com/tests/163218-ALLUVI_BPC157_TB500_40MG_KIT_EAI125ZEF8TB",
    },
    packageContents: [
      "Pre-filled Research pen (20 mg BPC-157, 20 mg TB-500)",
      "Research information sheet",
    ],
    storageLogic: STORAGE_LOGIC,
    supplyChain: SUPPLY_CHAIN,
  },
  {
    no: "06",
    slug: "retatrutide-40",
    name: "Retatrutide 40 mg (R&D Only)",
    tag: "Compound Analysis",
    price: 249,
    summary: "High-strength triple-agonist research reference peptide.",
    description:
      "A 40 mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    strengths: ["40 mg"],
    image: "/images/alluvi-retatrutide-40.jpg",
    gallery: [
      "/images/alluvi-retatrutide-40.jpg",
      "/images/alluvi-retatrutide-40-pen.jpg",
      "/images/alluvi-retatrutide-40-open.jpg",
      "/images/alluvi-retatrutide-40-uv.jpg",
    ],
    analysis: {
      batchNumber: "AR1739JAT",
      fillVolume: "2.4 mL",
      purity: "99.269%",
      compounds: [
        { name: "Retatrutide", concentration: "18.22 mg/mL", content: "43.72 mg" },
      ],
      coaImage: "/images/coa/retatrutide-40.png",
      evidenceImages: [
        "/images/coa/evidence/retatrutide-40-1.jpg",
        "/images/coa/evidence/retatrutide-40-2.jpg",
      ],
      reportUrl:
        "https://verify.janoshik.com/tests/163216-ALLUVI_RETATRUTIDE_40MG_KIT_TU3SQLQB9ZDQ",
    },
    packageContents: [
      "Pre-filled Research pen (40 mg Retatrutide)",
      "Research information sheet",
    ],
    storageLogic: STORAGE_LOGIC,
    supplyChain: SUPPLY_CHAIN,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== slug);
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// "Why Us" — differentiators, original phrasing.
export const WHY_US = [
  {
    no: "01",
    title: "Purity, verified.",
    text: "Every batch is independently analysed by HPLC and mass spectrometry against a ≥99% purity target. A certificate of analysis ships with each order no guesswork, ever.",
    image: "/images/whyus-purity-seo1.webp",
  },
  {
    no: "02",
    title: "Controlled consistency.",
    text: "Formulations are produced under ISO-aligned, tightly controlled processes, so concentration and quality stay uniform from the first batch to the thousandth.",
    image: "/images/controlled-seo1.webp",
  },
  {
    no: "03",
    title: "Secure, discreet packaging.",
    text: "Temperature-stable, tamper-evident packaging  your order arrives intact and exactly as specified.",
    image: "/images/secure-seo-new.webp",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "I've ordered four times now and every batch matches its COA to the decimal. That kind of consistency is exactly what our laboratory work depends on  I won't source from anyone else.",
    name: "Dr. Hana Al-Rashid",
    role: "Verified Research Client",
    image: "/images/customer-seo1.webp",
  },
  {
    quote:
      "Enquiries are answered promptly and the parcel arrived sealed, cold, and exactly as documented. Packaging and paperwork were spotless — professional supply from start to finish.",
    name: "Marcus Feldmann",
    role: "Verified Research Buyer",
    image: "/images/customer2-seo.webp",
  },
  {
    quote:
      "The purity reporting is transparent and the certificate of analysis is spotless. I now recommend Novera to every colleague who asks me where I source research materials.",
    name: "Priya Nair",
    role: "Returning Research Client",
    image: "/images/customer3-seo.webp",
  },
  {
    quote:
      "Documentation is thorough, presentation is clean, and reordering is effortless. For lab-facing work where paperwork matters, this is the standard I compare other suppliers to.",
    name: "Sofia Marchetti",
    role: "Verified Research Client",
    image: "/images/customer4-seo.webp",
  },
];

export const CONTACT = {
  email: "hello@novera.studio",
};

// Prescribed research-only disclaimer used across product pages, checkout, and
// footer.
export const DISCLAIMER =
  "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Products are supplied strictly for laboratory and analytical research conducted by qualified professionals.";

// Shorter checkout acknowledgement, shown alongside the primary disclaimer.
export const CHECKOUT_ACKNOWLEDGEMENT =
  "By proceeding with this purchase, you acknowledge that these products are intended solely for laboratory research purposes and are not intended for human or veterinary use.";
