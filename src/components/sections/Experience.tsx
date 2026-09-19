"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { experience } from "@/data/experience";
import { Accent, SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-16 sm:py-24 md:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              id="experience-title"
              index="03"
              label="Experience"
              title={
                <>
                  Where I&apos;ve <Accent>worked.</Accent>
                </>
              }
              intro="In-house WordPress development, freelance client work, and where it started."
            />
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-8">
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-[9px]" />
          <motion.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent-soft to-violet md:left-[9px]"
          />

          {experience.map((job, i) => (
            <li key={job.company} className="relative pb-8 pl-8 last:pb-0 sm:pb-14 md:pl-14">
              <span
                aria-hidden
                className="absolute left-0 top-1.5 grid size-[15px] place-items-center rounded-full border border-line-strong bg-ink-950 md:size-[19px]"
              >
                <span className={job.current ? "pulse-dot size-[5px] rounded-full bg-accent md:size-[7px]" : "size-[5px] rounded-full bg-fg-subtle md:size-[7px]"} />
              </span>

              <Reveal delay={i * 0.05}>
                <article className="card-surface group rounded-3xl p-5 transition-colors duration-500 hover:border-line-strong sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">
                      <time>{job.period}</time>
                    </p>
                    {job.current && (
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-emerald-300">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-[1.7rem]">{job.role}</h3>
                  <p className="mt-1.5 text-fg-muted">
                    {job.companyUrl ? (
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 py-1 text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-soft hover:decoration-accent-soft"
                      >
                        {job.company}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="text-fg">{job.company}</span>
                    )}
                    <span className="mt-1 block text-fg-subtle">{job.summary}</span>
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-relaxed text-fg-muted">
                        <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent/70" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-7 flex flex-wrap gap-1.5 border-t border-line pt-6" aria-label="Tools used">
                    {job.stack.map((s) => (
                      <li
                        key={s}
                        className="rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-fg-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
