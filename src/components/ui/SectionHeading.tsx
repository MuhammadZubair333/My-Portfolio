import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  className?: string;
  aside?: ReactNode;
};

export function SectionHeading({ index, label, title, intro, id, className, aside }: Props) {
  return (
    <div className={cn("flex flex-col gap-8 md:flex-row md:items-end md:justify-between", className)}>
      <Reveal className="max-w-3xl">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent-soft">{index}</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          <span>{label}</span>
        </p>
        <h2
          id={id}
          className="mt-5 text-balance text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem]"
        >
          {title}
        </h2>
        {intro && (
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
            {intro}
          </p>
        )}
      </Reveal>
      {aside && <Reveal delay={0.1}>{aside}</Reveal>}
    </div>
  );
}

/** Accent highlight used inside headings. */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-accent-soft to-violet bg-clip-text text-transparent">
      {children}
    </span>
  );
}
