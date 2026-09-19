import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";

const links = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "WhatsApp", href: profile.whatsapp.href, external: true },
  { label: "Call", href: profile.phone.href },
  { label: "GitHub", href: profile.links.github, external: true },
  { label: "LinkedIn", href: profile.links.linkedin, external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-11 place-items-center rounded-xl border border-line-strong text-sm font-semibold tracking-[-0.04em]">
            <span>M<span className="text-accent-soft">Z</span></span>
          </span>
          <div>
            <p className="font-medium">{profile.name}</p>
            <p className="text-sm text-fg-subtle">
              {profile.title} · {profile.location}
            </p>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="py-2 text-fg-muted transition-colors hover:text-fg"
            >
              {l.label}
              {l.external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          ))}
          <a
            href="#home"
            className="group inline-flex items-center gap-2 py-2 text-fg-muted transition-colors hover:text-fg"
          >
            Back to top
            <ArrowUp aria-hidden className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </nav>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-fg-subtle sm:flex-row sm:justify-between">
        <p>© 2026 {profile.name}</p>
        <p>AI Engineer · Web Developer</p>
      </div>
    </footer>
  );
}
