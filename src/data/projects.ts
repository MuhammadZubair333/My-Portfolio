/**
 * Project data: add a new object to `projects` to publish a new project.
 * The Projects section, filters and layout all derive from this file.
 *
 * Card sizes come from position, not from the data: the first project is the
 * spotlight, and the rest alternate big/small down the grid. Keep the featured
 * projects at the top of the array, since the section sorts them first and the
 * resulting order is what decides which project lands in which slot.
 */

export const projectCategories = [
  "Web Development",
  "WordPress",
  "Shopify",
  "AI",
  "Chatbots",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  url: string;
  /** Short human label shown on the card. */
  label: string;
  /** Used by the filter bar. A project can belong to several categories. */
  categories: ProjectCategory[];
  description: string;
  /** Screenshot in /public/projects. Leave empty to render a branded placeholder. */
  image?: string;
  /** What the project is / what it includes, taken from the live site. */
  tags: string[];
  /** Fill in when you want to list the stack used for a project. */
  technologies?: string[];
  /** Sorted to the front of the grid. Keep these first in the array too. */
  featured?: boolean;
  /** Brand accent used for small details on the card. */
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "brandwings",
    title: "BrandWings",
    url: "https://brandwings.online/",
    label: "Web Development · AI & Automation",
    categories: ["Web Development", "AI"],
    description:
      "Website for a digital solutions agency offering web development, mobile apps, AI chatbots, AI automation, SEO and branding, presented through a dark, high-impact visual identity with dedicated service pages and a consultation booking flow.",
    image: "/projects/brandwings.webp",
    tags: ["Agency website", "Service pages", "AI & automation services", "Consultation booking"],
    featured: true,
    accent: "#6b8cff",
  },
  {
    slug: "onyx-movers",
    title: "Onyx Movers",
    url: "https://onyx-movers.vercel.app/",
    label: "Web Development",
    categories: ["Web Development"],
    description:
      "A bold website for a Lahore-based packers & movers company, covering house shifting, office relocation, storage, cargo and truck rental, with a clear path to requesting a free quote.",
    image: "/projects/onyx-movers.webp",
    tags: ["Moving & logistics", "Service catalogue", "Quote requests", "WhatsApp contact"],
    featured: true,
    accent: "#e5243b",
  },
  {
    slug: "mgt-packers-movers",
    title: "MGT Packers & Movers",
    url: "https://www.mgtpackersmovers.com/",
    label: "Web Development",
    categories: ["Web Development"],
    description:
      "Professional business website for a Karachi moving and logistics company, with service pages, fleet, gallery, blog and an on-page quote request form.",
    image: "/projects/mgt-packers-movers.webp",
    tags: ["Moving & logistics", "Quote form", "Blog", "Fleet & gallery"],
    featured: true,
    accent: "#e11d2a",
  },
  {
    slug: "doctor-ai",
    title: "Doctor AI",
    url: "https://doctor-ai-gold.vercel.app/",
    label: "AI Chatbot",
    categories: ["AI", "Chatbots"],
    description:
      "An AI-powered conversational experience for general health-related information, set inside a clean healthcare-style interface with quick links to emergency ambulance services. For information only, not a substitute for professional medical advice.",
    image: "/projects/doctor-ai.webp",
    tags: ["AI chatbot", "Conversational UI", "Health information"],
    featured: true,
    accent: "#3b82f6",
  },
  {
    slug: "amp-mobile-parts",
    title: "AMP Mobile Parts",
    url: "https://mobile-parts-store.vercel.app/",
    label: "E-commerce Storefront",
    categories: ["Web Development"],
    description:
      "Online store for a Karachi supplier of iPhone spare parts, with a searchable catalogue of displays, batteries, charging flex, cameras and NFC modules, filters by model, a cart, and a checkout that hands the order over to WhatsApp.",
    image: "/projects/amp-mobile-parts.webp",
    tags: ["Mobile parts store", "Catalogue search & filters", "Cart & checkout", "WhatsApp enquiries"],
    featured: true,
    accent: "#ff7a1a",
  },
  {
    slug: "vip-setup-showcase",
    title: "VIP Setup",
    url: "https://vip-setup-showcase.vercel.app/",
    label: "Restaurant E-commerce",
    categories: ["Web Development"],
    description:
      "An online menu and ordering-style website for VIPSETUP, a fast-food restaurant in Bahadurabad, Karachi, with a category-filtered menu, add-to-cart and directions.",
    image: "/projects/vip-setup-showcase.webp",
    tags: ["Restaurant", "Online menu", "Cart", "Location & directions"],
    accent: "#f59e0b",
  },
  {
    slug: "ai-proposal-writer",
    title: "AI Proposal Writer",
    url: "https://upwork-proposal-ai.vercel.app/",
    label: "AI Application",
    categories: ["AI"],
    description:
      "An AI tool that turns a pasted Upwork job description into a tailored proposal draft. A focused, single-purpose interface built around one job.",
    image: "/projects/ai-proposal-writer.webp",
    tags: ["Generative AI", "Proposal generation", "Single-purpose tool"],
    accent: "#10b981",
  },
];
