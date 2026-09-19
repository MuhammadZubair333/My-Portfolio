import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";

export type CardVariant = "spotlight" | "tile" | "wide";

type Props = {
  project: Project;
  index: number;
  total: number;
  variant: CardVariant;
};

const host = (url: string) => new URL(url).host.replace(/^www\./, "");
const pad = (n: number) => String(n).padStart(2, "0");

/** Screenshot in a minimal browser frame, or a branded placeholder if there's no image. */
function Preview({ project, variant }: { project: Project; variant: CardVariant }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="VIEW"
      tabIndex={-1}
      aria-hidden
      className="group/preview relative block overflow-hidden rounded-[1.4rem] border border-line bg-ink-900"
      style={{
        backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${project.accent}26, transparent 60%)`,
      }}
    >
      <div
        className={cn(
          "relative",
          variant === "spotlight" ? "px-4 pt-4 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10" : "px-4 pt-4 sm:px-6 sm:pt-6",
        )}
      >
        <div className="overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-ink-850 shadow-[0_-10px_60px_-20px_rgba(0,0,0,0.9)]">
          <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.06] px-3">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="ml-3 truncate font-mono text-[0.68rem] text-fg-subtle">{host(project.url)}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            {project.image ? (
              <Image
                src={project.image}
                alt=""
                fill
                sizes={
                  variant === "spotlight" ? "(min-width: 1024px) 60vw, 95vw" : "(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 95vw"
                }
                className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover/preview:scale-[1.035]"
              />
            ) : (
              <div
                className="absolute inset-0 grid place-items-center"
                style={{ background: `linear-gradient(135deg, ${project.accent}33, transparent 70%)` }}
              >
                <span className="text-3xl font-semibold tracking-[-0.04em] text-fg/80">{project.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-fg-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function LiveLink({ project, prominent }: { project: Project; prominent?: boolean }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="OPEN"
      className={cn(
        "group/link inline-flex items-center gap-2 rounded-full text-sm font-medium transition-[background-color,border-color,color] duration-300",
        prominent
          ? "h-11 border border-line-strong bg-white/[0.04] px-5 text-fg hover:border-white/25 hover:bg-white/[0.08]"
          : "min-h-11 text-fg hover:text-accent-soft",
      )}
    >
      View Live Website
      <span className="sr-only">: {project.title} (opens in a new tab)</span>
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-500 ease-out-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
    </a>
  );
}

export function ProjectCard({ project, index, total, variant }: Props) {
  const counter = (
    <span className="font-mono text-xs text-fg-subtle">
      {pad(index + 1)} <span className="text-fg-subtle/60">/ {pad(total)}</span>
    </span>
  );

  if (variant === "spotlight") {
    return (
      <article className="group grid h-full content-start gap-6 rounded-[1.75rem] border border-line bg-white/[0.015] p-3 transition-colors duration-500 hover:border-line-strong sm:p-4 lg:grid-cols-12 lg:gap-10 lg:p-5">
        <div className="lg:col-span-8">
          <Preview project={project} variant={variant} />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6 px-3 pb-4 lg:col-span-4 lg:px-2 lg:py-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent-soft">
                <span className="size-1.5 rounded-full bg-accent" />
                Featured
              </span>
              {counter}
            </div>
            <p className="mt-6 eyebrow lg:mt-8">{project.label}</p>
            <h3 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] sm:text-5xl">{project.title}</h3>
            <p className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-fg-muted sm:mt-5 sm:text-base">{project.description}</p>
          </div>
          <div className="space-y-6">
            <div className="hidden md:block">
              <Tags tags={project.tags} />
            </div>
            <LiveLink project={project} prominent />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article className="group flex h-full flex-col gap-6 rounded-[1.75rem] md:grid border border-line bg-white/[0.015] p-3 transition-colors duration-500 hover:border-line-strong sm:p-4 md:grid-cols-2 md:items-center md:gap-10">
        <Preview project={project} variant={variant} />
        <div className="flex flex-1 flex-col gap-4 px-3 pb-4 md:gap-5 md:px-2 md:pb-0">
          <div className="flex items-center justify-between">
            <p className="eyebrow">{project.label}</p>
            {counter}
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{project.title}</h3>
          <p className="text-pretty text-[0.95rem] leading-relaxed text-fg-muted sm:text-base">{project.description}</p>
          <div className="hidden md:block">
            <Tags tags={project.tags} />
          </div>
          <div className="mt-auto pt-1 md:mt-0">
            <LiveLink project={project} prominent />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-white/[0.015] p-3 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong sm:p-4">
      <Preview project={project} variant={variant} />
      <div className="flex flex-1 flex-col gap-4 px-3 pb-3 pt-6 sm:px-2">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{project.label}</p>
          {counter}
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] sm:text-[1.7rem]">{project.title}</h3>
        <p className="text-pretty text-[0.95rem] leading-relaxed text-fg-muted sm:text-base">{project.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-3">
          <div className="hidden md:block">
            <Tags tags={project.tags.slice(0, 3)} />
          </div>
          <LiveLink project={project} />
        </div>
      </div>
    </article>
  );
}
