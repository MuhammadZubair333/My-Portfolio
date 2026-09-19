import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  /** Adds target=_blank + rel and swaps the arrow for an external-link arrow. */
  external?: boolean;
  icon?: ReactNode;
  hideArrow?: boolean;
};

const variants = {
  primary:
    "bg-fg text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_30px_-8px_rgba(91,140,255,0.45)]",
  secondary:
    "bg-white/[0.04] text-fg border border-line-strong hover:bg-white/[0.08] hover:border-white/25",
  ghost: "text-fg-muted hover:text-fg",
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  external,
  icon,
  hideArrow,
  className,
  children,
  ...rest
}: Props) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-tight",
        "transition-[background-color,border-color,transform,color] duration-300 ease-out-expo active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {icon}
      <span>{children}</span>
      {!hideArrow && (
        <span aria-hidden className="relative -mr-1 inline-flex size-4 overflow-hidden">
          <Arrow
            className={cn(
              "absolute inset-0 size-4 transition-transform duration-500 ease-out-expo",
              external
                ? "group-hover:translate-x-4 group-hover:-translate-y-4"
                : "group-hover:translate-x-4",
            )}
          />
          <Arrow
            className={cn(
              "absolute inset-0 size-4 transition-transform duration-500 ease-out-expo",
              external
                ? "-translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"
                : "-translate-x-4 group-hover:translate-x-0",
            )}
          />
        </span>
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
