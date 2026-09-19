"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "@/data/profile";
import { useIntroDone } from "@/lib/intro";
import { cn } from "@/lib/cn";
import { Button } from "./ui/Button";

export function Navbar() {
  const introDone = useIntroDone();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section = whichever section crosses a band around 40% of the viewport.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = [
          menuButton.current,
          ...panel.current.querySelectorAll<HTMLElement>("a, button"),
        ].filter((el): el is HTMLElement => Boolean(el));
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-ink-950"
      >
        Skip to content
      </a>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={introDone ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-[background-color,border-color] duration-500",
            scrolled || open
              ? "border-b border-line bg-ink-950/75 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent",
          )}
        >
          <nav
            aria-label="Primary"
            className={cn(
              "container-page flex items-center justify-between transition-[height] duration-500",
              scrolled ? "h-16" : "h-[4.5rem] md:h-20",
            )}
          >
            <a
              href="#home"
              className="group flex items-center gap-3"
              aria-label={`${profile.name}, back to top`}
            >
              <span className="grid size-9 place-items-center rounded-xl border border-line-strong bg-white/[0.03] text-[0.8rem] font-semibold tracking-[-0.04em] transition-colors duration-300 group-hover:border-accent/60">
                <span>M<span className="text-accent-soft">Z</span></span>
              </span>
              <span className="hidden text-sm font-medium tracking-tight text-fg sm:block">
                {profile.name}
              </span>
            </a>

            <ul className="hidden items-center gap-1 rounded-full border border-line bg-white/[0.02] p-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative isolate block rounded-full px-4 py-1.5 text-[0.84rem] transition-colors duration-300",
                        isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <Button href="#contact" className="hidden !h-10 sm:inline-flex">
                Let&apos;s Talk
              </Button>
              <button
                ref={menuButton}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-10 place-items-center rounded-full border border-line-strong bg-white/[0.03] text-fg transition-colors hover:bg-white/[0.08] lg:hidden"
              >
                {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex h-full flex-col justify-between overflow-y-auto pb-10 pt-24">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === link.id ? "true" : undefined}
                      className="flex items-baseline justify-between py-4 text-3xl font-semibold tracking-[-0.03em]"
                    >
                      <span className={active === link.id ? "text-fg" : "text-fg-muted"}>
                        {link.label}
                      </span>
                      <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-4">
                <Button href="#contact" size="lg" onClick={() => setOpen(false)} className="w-full">
                  Let&apos;s Talk
                </Button>
                <p className="text-center font-mono text-xs text-fg-subtle">{profile.email}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
