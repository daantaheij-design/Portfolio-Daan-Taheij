export interface Project {
  number: string;
  slug: string;
  name: string;
  category: string;
  year: string;
}

export const projects: Project[] = [
  {
    number: "01",
    slug: "altermedia",
    name: "Altermedia",
    category: "Creatief / Campagne / Digitaal",
    year: "2023 — 2026",
  },
  {
    number: "02",
    slug: "stoov",
    name: "Stoov",
    category: "Merk / Redactioneel / Print",
    year: "2023",
  },
  {
    number: "03",
    slug: "persoonlijk-werk",
    name: "Persoonlijk Werk",
    category: "Vormgeving / Experimenteel",
    year: "2022 — Doorlopend",
  },
];
