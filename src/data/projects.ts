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
    category: "Creative / Campaign / Digital",
    year: "2024",
  },
  {
    number: "02",
    slug: "stoov",
    name: "Stoov",
    category: "Brand / Editorial / Print",
    year: "2023",
  },
  {
    number: "03",
    slug: "personal-work",
    name: "Personal Work",
    category: "Design / Experimental",
    year: "2022 — Ongoing",
  },
];
