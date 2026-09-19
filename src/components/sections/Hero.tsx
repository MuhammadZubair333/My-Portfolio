"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { useIntroDone } from "@/lib/intro";
import { Button } from "../ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

const facts = [
  { value: "3+ Years", label: "Web development" },
  { value: "25+ Live", label: "Projects online" },
  { value: "BS AI", label: "Graduate, 2025" },
];

export function Hero() {
  const introDone = useIntroDone();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-reactive light + gentle portrait parallax (desktop pointers only).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const portraitX = useTransform(sx, (v) => v * 10);
  const portraitY = useTransform(sy, (v) => v * 6);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
    };
  }, [px, py, reduce]);

  const show = introDone ? "show" : "hidden";
  const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="noise relative isolate overflow-hidden lg:min-h-[100svh]"
      style={{ ["--mx" as string]: "70%", ["--my" as string]: "40%" }}
    >
      {/* ---------- Backdrop ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black_20%,transparent_75%)]" />
        <div className="absolute right-[-5%] top-[5%] h-[60vh] w-[60vh] rounded-full bg-accent/15 blur-[130px]" />
        <div className="absolute left-[-10%] top-[30%] h-[45vh] w-[45vh] rounded-full bg-violet/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),rgba(91,140,255,0.08),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-page flex items-center pb-14 pt-24 sm:pt-28 lg:min-h-[100svh] lg:pb-12 lg:pt-28">
        <div className="grid w-full grid-cols-1 items-center gap-9 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---------- Copy ---------- */}
          <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10">
            <motion.p
              initial="hidden"
              animate={show}
              variants={rise}
              transition={{ duration: 0.8, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1.5 pl-3 pr-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-fg-muted"
            >
              <MapPin aria-hidden className="size-3.5 text-accent-soft" />
              {profile.location}
            </motion.p>

            <h1 id="hero-title" className="mt-6">
              <span className="sr-only">
                {profile.name}, {profile.title}
              </span>
              <span
                aria-hidden
                className="block text-[clamp(3rem,min(6.2vw,10svh),5.75rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
              >
                {[profile.firstName, profile.lastName].map((word, i) => (
                  <span key={word} className="block overflow-y-clip whitespace-nowrap pb-[0.05em]">
                    <motion.span
                      className="block"
                      initial="hidden"
                      animate={show}
                      variants={{ hidden: { y: "105%" }, show: { y: 0 } }}
                      transition={{ duration: 1.1, delay: 0.08 + i * 0.09, ease }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
              <motion.span
                aria-hidden
                initial="hidden"
                animate={show}
                variants={rise}
                transition={{ duration: 0.9, delay: 0.3, ease }}
                className="mt-4 flex items-center gap-4"
              >
                <span className="h-px w-10 bg-gradient-to-r from-accent to-violet" />
                <span className="bg-gradient-to-r from-accent-soft via-accent to-violet bg-clip-text text-[clamp(1.6rem,2.8vw,2.5rem)] font-semibold tracking-[-0.03em] text-transparent">
                  {profile.title}
                </span>
              </motion.span>
            </h1>

            <motion.p
              initial="hidden"
              animate={show}
              variants={rise}
              transition={{ duration: 0.9, delay: 0.42, ease }}
              className="mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-fg-subtle"
            >
              {profile.positioning.slice(1).map((item, i) => (
                <span key={item} className="whitespace-nowrap">
                  {i > 0 && <span aria-hidden className="mr-3">·</span>}
                  {item}
                </span>
              ))}
            </motion.p>

            <motion.p
              initial="hidden"
              animate={show}
              variants={rise}
              transition={{ duration: 0.9, delay: 0.5, ease }}
              className="mt-5 max-w-[32rem] text-pretty text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              I build modern websites and practical AI-powered solutions, from WordPress and Shopify
              builds to AI tools, chatbots and automation.
            </motion.p>

            <motion.div
              initial="hidden"
              animate={show}
              variants={rise}
              transition={{ duration: 0.9, delay: 0.6, ease }}
              className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center"
            >
              <Button href="#projects" size="lg" className="px-4 sm:px-6">
                View Projects
              </Button>
              <Button href="#contact" size="lg" variant="secondary" className="px-4 sm:px-6">
                Contact Me
              </Button>
            </motion.div>

            <motion.dl
              initial="hidden"
              animate={show}
              variants={rise}
              transition={{ duration: 0.9, delay: 0.72, ease }}
              className="mt-8 grid max-w-[32rem] grid-cols-3 border-t border-line pt-6 sm:mt-10"
            >
              {facts.map((f, i) => (
                <div key={f.value} className={i > 0 ? "border-l border-line pl-4 sm:pl-6" : "pr-4"}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="text-lg font-semibold tracking-[-0.03em] text-fg sm:text-xl">{f.value}</dd>
                  <dd className="mt-0.5 text-xs text-fg-subtle sm:text-sm">{f.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* ---------- Portrait ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={introDone ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.2, delay: 0.15, ease }}
            className="relative order-first mx-auto w-full max-w-[34rem] lg:order-none lg:max-w-none"
          >
            <div className="relative h-[22rem] overflow-hidden rounded-[2rem] border border-line-strong bg-gradient-to-b from-ink-800 via-ink-900 to-ink-950 sm:h-[34rem] lg:h-[min(70svh,42rem)] lg:min-h-[30rem]">
              <div aria-hidden className="hairline-grid absolute inset-0 opacity-70 [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
              <div aria-hidden className="absolute left-1/2 top-[22%] h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-accent/25 blur-[80px]" />
              <div aria-hidden className="absolute inset-x-6 top-6 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fg-subtle sm:inset-x-8 sm:top-8">
                <span>{profile.initials} / Portfolio</span>
                <span>2026</span>
              </div>

              <motion.div style={{ x: portraitX, y: portraitY }} className="absolute inset-x-0 bottom-0 top-[8%]">
                <Image
                  src="/images/zubair-portrait.webp"
                  alt="Portrait of Muhammad Zubair in a dark suit and tie"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 34rem"
                  className="object-contain object-bottom"
                />
              </motion.div>

              <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/90 to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={introDone ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.9, delay: 0.95, ease }}
                className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl border border-line-strong bg-ink-900/70 p-4 backdrop-blur-xl sm:inset-x-6 sm:bottom-6"
              >
                <div className="min-w-0">
                  <p className="eyebrow flex items-center gap-2 !text-[0.68rem]">
                    <span className="pulse-dot size-1.5 rounded-full bg-emerald-400" />
                    Currently
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-fg">{profile.currentRole.title}</p>
                </div>
                <p className="text-sm text-fg-muted">{profile.currentRole.company}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
