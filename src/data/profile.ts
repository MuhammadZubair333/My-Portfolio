import { projects } from "./projects";

export const profile = {
  name: "Muhammad Zubair",
  firstName: "Muhammad",
  lastName: "Zubair",
  initials: "MZ",
  title: "AI Engineer",
  positioning: ["AI Engineer", "Web Developer", "AI Automation", "WordPress & Shopify"],
  location: "Karachi, Pakistan",
  email: "arshadzubair91@gmail.com",
  phone: {
    display: "0324 219 2003",
    href: "tel:+923242192003",
  },
  whatsapp: {
    display: "0324 219 2003",
    href: "https://wa.me/923242192003?text=" +
      encodeURIComponent("Hi Zubair, I came across your portfolio and would like to discuss a project."),
  },
  links: {
    github: "https://github.com/MuhammadZubair333",
    linkedin: "https://www.linkedin.com/in/muhammad-zubair-8b11ab263/",
  },
  currentRole: {
    title: "Web Developer / WordPress & AI Tools",
    company: "GAO Tek Inc.",
  },
} as const;

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

/** Facts only: every item here comes straight from the CV. */
export const highlights = [
  { value: "3+", label: "Years building websites" },
  { value: "BSAI", label: "Artificial Intelligence graduate, 2025" },
  { value: String(projects.length), label: "Live projects shown here" },
  { value: "2023", label: "Working with clients since" },
] as const;
