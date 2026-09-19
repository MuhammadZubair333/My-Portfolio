import type { ReactNode } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { profile } from "@/data/profile";
import { Button } from "../ui/Button";
import { CopyButton } from "../ui/CopyButton";
import { Reveal } from "../ui/Reveal";

type Detail = {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  icon: ReactNode;
  copy?: boolean;
};

const details: Detail[] = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <Mail aria-hidden className="size-4" />,
    copy: true,
  },
  {
    label: "WhatsApp",
    value: profile.whatsapp.display,
    href: profile.whatsapp.href,
    external: true,
    icon: <FaWhatsapp aria-hidden className="size-4 text-[#25D366]" />,
  },
  {
    label: "LinkedIn",
    value: "muhammad-zubair",
    href: profile.links.linkedin,
    external: true,
    icon: <FaLinkedinIn aria-hidden className="size-4" />,
  },
  {
    label: "GitHub",
    value: "MuhammadZubair333",
    href: profile.links.github,
    external: true,
    icon: <FaGithub aria-hidden className="size-4" />,
  },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-20 sm:py-24 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_40%,black,transparent_75%)]" />
        <div className="absolute left-1/2 top-[30%] h-[28rem] w-[min(60rem,90vw)] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px]" />
      </div>

      <div className="container-page">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow flex items-center justify-center gap-3">
            <span className="text-accent-soft">07</span>
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span>Contact</span>
          </p>
          <h2
            id="contact-title"
            className="mt-6 text-balance text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[5.5rem]"
          >
            Let&apos;s build something{" "}
            <span className="bg-gradient-to-r from-accent-soft to-violet bg-clip-text text-transparent">useful.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-fg-muted">
            Have a website, AI solution, automation idea, or digital product in mind? Let&apos;s discuss it.
          </p>
          <div className="mx-auto mt-10 flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <Button href={`mailto:${profile.email}`} size="lg" icon={<Mail aria-hidden className="size-4" />}>
              Email Me
            </Button>
            <Button
              href={profile.whatsapp.href}
              external
              size="lg"
              variant="secondary"
              icon={<FaWhatsapp aria-hidden className="size-4 text-[#25D366]" />}
              className="hover:!border-[#25D366]/50"
            >
              WhatsApp
            </Button>
            <Button
              href={profile.links.github}
              external
              size="lg"
              variant="secondary"
              icon={<FaGithub aria-hidden className="size-4" />}
            >
              View GitHub
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-6xl sm:mt-20">
          <ul className="grid overflow-hidden rounded-[1.75rem] border border-line bg-ink-950/60 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
            {details.map((d) => {
              const content = (
                <>
                  <span className="flex items-center gap-2 text-fg-subtle">
                    {d.icon}
                    <span className="eyebrow !text-[0.68rem]">{d.label}</span>
                  </span>
                  <span className="mt-3 flex items-center gap-1.5 text-[0.92rem] [overflow-wrap:anywhere] text-fg">
                    {d.value}
                    {d.external && (
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 shrink-0 text-fg-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-soft"
                      />
                    )}
                  </span>
                </>
              );
              return (
                <li
                  key={d.label}
                  className="relative flex items-center justify-between gap-3 border-b border-line last:border-b-0 sm:[&:nth-child(n+3)]:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex min-w-0 flex-1 flex-col p-5 transition-colors duration-300 hover:bg-white/[0.03] lg:p-6"
                    >
                      {content}
                      {d.external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  ) : (
                    <div className="flex min-w-0 flex-1 flex-col p-5 lg:p-6">{content}</div>
                  )}
                  {d.copy && (
                    <div className="pr-4 lg:hidden">
                      <CopyButton value={d.value} label="email address" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
