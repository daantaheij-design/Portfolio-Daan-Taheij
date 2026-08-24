export interface Project {
  number: string;
  slug: string;
  name: string;
  category: string;
  year: string;
  /** Real photo for the main visual (replaces the graphic placeholder). */
  image?: string;
  /** Additional editorial images revealed further down the project block. */
  gallery?: string[];
}

export const projects: Project[] = [
  {
    number: "01",
    slug: "up-international",
    name: "UP International",
    category: "Grafisch Ontwerp / Digitaal",
    year: "2026 — Heden",
  },
  {
    number: "02",
    slug: "crossmedia-algemeen",
    name: "Crossmedia Algemeen",
    category: "Creatief / Campagne / Digitaal",
    year: "2023 — 2026",
    image: "/images/hero/crossmedia-3.webp",
    gallery: [
      "/images/hero/crossmedia-5.webp",
      "/images/hero/crossmedia-1.webp",
      "/images/hero/crossmedia-4.webp",
      "/images/hero/crossmedia-2.webp",
    ],
  },
  {
    number: "03",
    slug: "stoov",
    name: "Stoov",
    category: "Merk / Redactioneel / Print",
    year: "2023",
  },
  {
    number: "04",
    slug: "persoonlijk-werk",
    name: "Persoonlijk Werk",
    category: "Vormgeving / Experimenteel",
    year: "2022 — Doorlopend",
  },
];
