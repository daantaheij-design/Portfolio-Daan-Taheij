export interface Project {
  number: string;
  slug: string;
  name: string;
  /** Supporting context (client / employer) shown under the title. */
  context?: string;
  category: string;
  year: string;
  /** Homepage cover image. Falls back to images[0] when omitted. */
  coverImage?: string;
  /** Full ordered image set for the fullscreen gallery. */
  images?: string[];
}

export const projects: Project[] = [
  {
    number: "01",
    slug: "packaging-design",
    name: "Packaging Design",
    context: "UP International",
    category: "Verpakkingsontwerp / Grafisch Ontwerp",
    year: "2026 — Heden",
  },
  {
    number: "02",
    slug: "crossmedia",
    name: "Crossmedia",
    category: "Creatief / Campagne / Digitaal",
    year: "2023 — 2026",
    coverImage: "/images/hero/crossmedia-3.webp",
    images: [
      "/images/hero/crossmedia-3.webp",
      "/images/hero/crossmedia-1.webp",
      "/images/hero/crossmedia-2.webp",
      "/images/hero/crossmedia-4.webp",
      "/images/hero/crossmedia-5.webp",
    ],
  },
  {
    number: "03",
    slug: "red-dot",
    name: "Red Dot",
    context: "Stoov",
    category: "Branding / Redactioneel / Print",
    year: "2023",
    coverImage: "/images/hero/red-dot-1.webp",
    images: [
      "/images/hero/red-dot-1.webp",
      "/images/hero/red-dot-2.webp",
      "/images/hero/red-dot-3.webp",
      "/images/hero/red-dot-4.webp",
    ],
  },
  {
    number: "04",
    slug: "klantenlogos",
    name: "Klantenlogo's",
    category: "Logo-ontwerp / Identiteit",
    year: "2022 — Doorlopend",
    coverImage: "/images/hero/klant-1.webp",
    images: [
      "/images/hero/klant-1.webp",
      "/images/hero/klant-2.webp",
      "/images/hero/klant-3.webp",
    ],
  },
  {
    number: "05",
    slug: "social-media",
    name: "Social Media",
    category: "Social Media / Digitale Vormgeving",
    year: "2022 — Doorlopend",
  },
  {
    number: "06",
    slug: "persoonlijk-werk",
    name: "Persoonlijk Werk",
    category: "Vormgeving / Experimenteel",
    year: "2022 — Doorlopend",
  },
];
