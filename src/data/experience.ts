export type ExperienceItem = {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  start: string;
  current?: boolean;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Web Developer / WordPress & AI Tools",
    company: "GAO Tek Inc.",
    companyUrl: "https://gaotek.com/",
    period: "May 2025 - Present",
    start: "2025",
    current: true,
    summary: "Developing and maintaining multiple WordPress websites.",
    points: [
      "Build and maintain multiple WordPress websites using Elementor, HTML, CSS, JavaScript and custom design.",
      "Handle ongoing website updates and troubleshooting.",
      "Look after website security, SEO and backups.",
      "Carry out website quality assurance.",
    ],
    stack: ["WordPress", "Elementor", "HTML", "CSS", "JavaScript", "SEO"],
  },
  {
    role: "Freelance Web Developer",
    company: "Upwork",
    period: "2023 - Present",
    start: "2023",
    current: true,
    summary: "Top Rated freelancer with a 100% Job Success Score.",
    points: [
      "Build responsive business and e-commerce websites.",
      "Work with WordPress, Elementor, Shopify, HTML, CSS and JavaScript.",
      "Manage projects end to end: requirements, development, testing, revisions and deployment.",
    ],
    stack: ["WordPress", "Elementor", "Shopify", "HTML", "CSS", "JavaScript"],
  },
  {
    role: "WordPress Developer Intern",
    company: "InternnCraft",
    period: "Oct 2023 - Dec 2023",
    start: "2023",
    summary: "Internship focused on WordPress development.",
    points: [
      "Developed and customized responsive WordPress websites.",
      "Tested and troubleshot websites.",
    ],
    stack: ["WordPress"],
  },
];

export const education = {
  degree: "Bachelor of Science in Artificial Intelligence",
  short: "BS Artificial Intelligence",
  institution: "Dawood University of Engineering and Technology",
  city: "Karachi",
  period: "2021 - 2025",
  status: "Completed 2025",
};

export type Certification = {
  title: string;
  issuer?: string;
};

export const certifications: Certification[] = [
  { title: "Google Data Analytics Professional Certificate", issuer: "Coursera" },
  { title: "Google Prompting Essentials", issuer: "Coursera" },
  { title: "Advanced WordPress Development" },
];

/** Freelance client work (2023 to present). Wording stays within the CV's responsibilities. */
export const clientWork = {
  since: "2023",
  services: [
    "Responsive business websites",
    "E-commerce websites",
    "WordPress & Elementor sites",
    "Shopify stores",
    "Custom HTML, CSS & JavaScript",
  ],
  process: [
    { step: "Requirements", detail: "Understand the goals, content and features the client needs." },
    {
      step: "Development",
      detail: "Build on the right platform for the job: WordPress, Elementor, Shopify or custom code.",
    },
    { step: "Testing", detail: "Check the site works properly and responsively before handover." },
    { step: "Revisions", detail: "Refine the work based on the client's feedback." },
    { step: "Deployment", detail: "Launch the finished website." },
  ],
};
