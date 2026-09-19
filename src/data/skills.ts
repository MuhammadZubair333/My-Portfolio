import type { ComponentType } from "react";
import {
  SiClaude,
  SiCss,
  SiElementor,
  SiGooglesheets,
  SiHtml5,
  SiJavascript,
  SiNotion,
  SiPantheon,
  SiPython,
  SiShopify,
  SiWordpress,
  SiXampp,
} from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import {
  PiMicrosoftExcelLogo,
  PiMicrosoftPowerpointLogo,
  PiMicrosoftWordLogo,
} from "react-icons/pi";
import {
  Bot,
  Languages,
  MessageSquareCode,
  Palette,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Workflow,
} from "lucide-react";

type Icon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

export type Skill = {
  name: string;
  icon?: Icon;
  /** Optional qualifier, e.g. "Basic", keeps proficiency honest. */
  note?: string;
  /** Official brand colours: tile background + icon colour. Omit for generic concepts. */
  brand?: { bg: string; fg: string };
};

export type SkillGroup = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  /** Primary groups get the large treatment; supporting groups stay compact. */
  tier: "primary" | "supporting";
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "web",
    title: "Web Development",
    kicker: "Core practice",
    description: "Responsive business and e-commerce websites, built and maintained daily.",
    tier: "primary",
    skills: [
      { name: "WordPress", icon: SiWordpress, brand: { bg: "#21759B", fg: "#fff" } },
      { name: "Elementor", icon: SiElementor, brand: { bg: "#92003B", fg: "#fff" } },
      { name: "Shopify", icon: SiShopify, brand: { bg: "#95BF47", fg: "#fff" } },
      { name: "HTML", icon: SiHtml5, brand: { bg: "#E34F26", fg: "#fff" } },
      { name: "CSS", icon: SiCss, brand: { bg: "#663399", fg: "#fff" } },
      { name: "JavaScript", icon: SiJavascript, brand: { bg: "#F7DF1E", fg: "#000" } },
      { name: "Custom Web Design", icon: Palette },
    ],
  },
  {
    id: "ai",
    title: "AI & Automation",
    kicker: "Core practice",
    description: "Using generative AI to build tools, automate work and develop faster.",
    tier: "primary",
    skills: [
      { name: "Prompt Engineering", icon: MessageSquareCode },
      { name: "Claude Code", icon: SiClaude, brand: { bg: "#D97757", fg: "#fff" } },
      { name: "OpenAI", icon: RiOpenaiFill, brand: { bg: "#FFFFFF", fg: "#000" } },
      { name: "Generative AI", icon: Sparkles },
      { name: "AI-Assisted Development", icon: TerminalSquare },
      { name: "AI Automation", icon: Workflow },
      { name: "AI Tools", icon: Bot },
    ],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    kicker: "Supporting",
    description: "Local environments, hosting and everyday tooling.",
    tier: "supporting",
    skills: [
      { name: "Python", icon: SiPython, note: "Basic", brand: { bg: "#3776AB", fg: "#FFD43B" } },
      { name: "XAMPP", icon: SiXampp, brand: { bg: "#FB7A24", fg: "#fff" } },
      { name: "Pantheon", icon: SiPantheon, brand: { bg: "#FFDC28", fg: "#000" } },
      { name: "Notion", icon: SiNotion, brand: { bg: "#FFFFFF", fg: "#000" } },
      { name: "Google Sheets", icon: SiGooglesheets, brand: { bg: "#34A853", fg: "#fff" } },
    ],
  },
  {
    id: "supporting",
    title: "Supporting Skills",
    kicker: "Supporting",
    description: "Website care, office tools and communication.",
    tier: "supporting",
    skills: [
      { name: "SEO, Security & Backups", icon: ShieldCheck },
      { name: "Microsoft Word", icon: PiMicrosoftWordLogo, brand: { bg: "#2B579A", fg: "#fff" } },
      { name: "Microsoft Excel", icon: PiMicrosoftExcelLogo, brand: { bg: "#217346", fg: "#fff" } },
      { name: "Microsoft PowerPoint", icon: PiMicrosoftPowerpointLogo, brand: { bg: "#D24726", fg: "#fff" } },
      { name: "English & Urdu", icon: Languages },
    ],
  },
];
