"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { projectCategories, projects, type ProjectCategory } from "@/data/projects";
import { cn } from "@/lib/cn";
import { ProjectCard, type CardVariant } from "../projects/ProjectCard";
import { Accent, SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

type Filter = "All" | ProjectCategory;

/** Featured projects first, then the original order from the data file. */
const ordered = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

/**
 * Layout is derived from position so any number of projects works:
 * first = spotlight, then alternating 7/5 and 5/7 pairs, a trailing single = wide.
 */
function layoutFor(i: number, count: number): { variant: CardVariant; span: string } {
  if (i === 0) return { variant: "spotlight", span: "md:col-span-2 lg:col-span-12" };
  const pos = i - 1;
  const rest = count - 1;
  if (rest % 2 === 1 && pos === rest - 1) return { variant: "wide", span: "md:col-span-2 lg:col-span-12" };
  const pair = Math.floor(pos / 2);
  const first = pos % 2 === 0;
  const big = pair % 2 === 0 ? first : !first;
  return { variant: "tile", span: big ? "lg:col-span-7" : "lg:col-span-5" };
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");

  // Categories without projects stay hidden until a project is added for them.
  const filters = useMemo(() => {
    const counts = projectCategories
      .map((c) => ({ name: c as Filter, count: projects.filter((p) => p.categories.includes(c)).length }))
      .filter((c) => c.count > 0);
    return [{ name: "All" as Filter, count: projects.length }, ...counts];
  }, []);

  const visible = filter === "All" ? ordered : ordered.filter((p) => p.categories.includes(filter));

  // Mobile carousel position (the list becomes a horizontal swipe row below md).
  const listRef = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);
  const onListScroll = () => {
    const el = listRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    setSlide(Math.round(el.scrollLeft / (first.offsetWidth + 12)));
  };
  const selectFilter = (name: Filter) => {
    setFilter(name);
    setSlide(0);
    listRef.current?.scrollTo({ left: 0 });
  };

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-16 sm:py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(91,140,255,0.08),transparent)]" />
      <div className="container-page">
        <SectionHeading
          id="projects-title"
          index="02"
          label="Selected Work"
          title={
            <>
              Live projects, <Accent>shipped</Accent> and online.
            </>
          }
          intro="Business websites, e-commerce and AI applications. Every project below links to the live site."
        />

        <Reveal delay={0.05} className="mt-12">
          <div
            role="group"
            aria-label="Filter projects by category"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {filters.map((f) => {
              const active = filter === f.name;
              return (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => selectFilter(f.name)}
                  aria-pressed={active}
                  className={cn(
                    "relative isolate flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300",
                    active
                      ? "border-transparent text-ink-950"
                      : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 -z-10 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {f.name}
                  <span className={cn("font-mono text-[0.68rem]", active ? "text-ink-950/60" : "text-fg-subtle")}>
                    {String(f.count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <LayoutGroup>
          <motion.ul
            ref={listRef}
            layout
            layoutScroll
            onScroll={onListScroll}
            aria-label="Projects"
            className="relative -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-12 lg:gap-5 [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project, i) => {
                const { variant, span } = layoutFor(i, visible.length);
                return (
                  <motion.li
                    key={project.slug}
                    layout
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("relative w-[86%] shrink-0 snap-center md:w-auto md:col-span-1", span)}
                  >
                    <Reveal className="h-full" delay={variant === "tile" ? (i % 2) * 0.08 : 0}>
                      <ProjectCard
                        project={project}
                        index={ordered.indexOf(project)}
                        total={ordered.length}
                        variant={variant}
                      />
                    </Reveal>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {/* Mobile swipe indicator */}
        <div className="mt-5 flex items-center justify-between md:hidden" aria-hidden>
          <div className="flex items-center gap-1.5">
            {visible.map((p, i) => (
              <span
                key={p.slug}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === Math.min(slide, visible.length - 1) ? "w-6 bg-accent" : "w-1.5 bg-white/20",
                )}
              />
            ))}
          </div>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-fg-subtle">
            {String(Math.min(slide, visible.length - 1) + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")} · Swipe
          </span>
        </div>
      </div>
    </section>
  );
}
