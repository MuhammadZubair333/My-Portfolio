"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { BuildIt, createBuildRefs, updateBuild } from "./BuildIt";
import { clamp01, frameRect, layoutFor, phases, smooth, type Layout } from "./geometry";
import { PlaygroundScene } from "./scene";

const STEPS = ["Zoom", "Build", "Control"];

const isEmpty = (p: number) => (p > 0.37 && p < 0.64) || p > 0.97;

/**
 * INTERACTIVE PLAYGROUND
 * A tall section with a sticky, full-screen stage. Scroll position is read as
 * progress (0..1); nothing intercepts or snaps the scroll.
 */
export function InteractivePlayground() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildRefs = useRef(createBuildRefs());
  const ui = useRef<Record<string, HTMLElement | null>>({});
  const [layout, setLayout] = useState<Layout>("wide");
  const layoutRef = useRef<Layout>("wide");
  const forceRef = useRef(false);

  const bind = (key: string) => (el: HTMLElement | null) => {
    ui.current[key] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedMq.matches;
    let scene: PlaygroundScene | null = null;
    let raf = 0;
    let running = false;
    let smoothP = 0;
    let lastDom = -1;
    let lastCanvasP = -1;
    let idleTick = 0;
    let W = 0;
    let H = 0;
    let frame = frameRect(1, 1, "wide");

    const readProgress = () => {
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return total > 0 ? clamp01(-r.top / total) : 0;
    };

    const setUi = (key: string, o: number, y = 0) => {
      const el = ui.current[key];
      if (!el) return;
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o < 0.005 ? "hidden" : "visible";
      if (y) el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
      else el.style.transform = "";
    };

    const updateOverlay = (p: number) => {
      const { z, b, c, f } = phases(p);
      setUi("intro", 1 - smooth(p, 0.015, 0.05));
      setUi("cap1", smooth(z, 0.03, 0.08) * (1 - smooth(z, 0.3, 0.4)));
      setUi("cap2", smooth(b, 0.03, 0.08) * (1 - smooth(b, 0.3, 0.4)));
      setUi("statement", smooth(b, 0.87, 0.95) * (1 - smooth(c, 0.02, 0.08)), (1 - smooth(b, 0.87, 0.95)) * 10);
      setUi("cap3", smooth(c, 0.2, 0.27) * (1 - smooth(c, 0.46, 0.56)));
      const finalIn = smooth(f, 0.38, 0.58);
      setUi("final", finalIn, (1 - finalIn) * 14);
      setUi("finalSub", smooth(f, 0.52, 0.72));
      setUi("indicator", smooth(p, 0.01, 0.04) * (1 - smooth(p, 0.88, 0.92)));
      setUi("skip", 1 - smooth(p, 0.84, 0.9));

      const step = p < 0.34 ? 0 : p < 0.64 ? 1 : 2;
      const idx = ui.current.stepIndex;
      const name = ui.current.stepName;
      if (idx && idx.textContent !== `0${step + 1}`) idx.textContent = `0${step + 1}`;
      if (name && name.textContent !== STEPS[step]) name.textContent = STEPS[step];
      [z, b, c].forEach((v, i) => {
        const bar = ui.current[`bar${i}`];
        if (bar) bar.style.transform = `scaleX(${v.toFixed(3)})`;
      });
    };

    const render = (p: number, t: number, force = false) => {
      // The canvas is empty during Build It and the finale: clear it once, then leave it alone.
      const canvasEmpty = isEmpty(p);
      const moving = Math.abs(p - lastCanvasP) > 0.00005;
      if (force || (canvasEmpty ? moving && lastCanvasP >= 0 && !isEmpty(lastCanvasP) : moving || idleTick++ % 2 === 0)) {
        scene?.draw(p, t, reduced);
      }
      lastCanvasP = p;
      if (forceRef.current || Math.abs(p - lastDom) > 0.00005) {
        forceRef.current = false;
        lastDom = p;
        const { b, c } = phases(p);
        updateBuild(buildRefs.current, layoutRef.current, frame, b, c, { reduced, lite: W < 1024 });
        updateOverlay(p);
      }
    };

    const resize = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      const next = layoutFor(W, H);
      if (next !== layoutRef.current) {
        layoutRef.current = next;
        setLayout(next);
      }
      frame = frameRect(W, H, next);
      const fe = buildRefs.current.frame;
      if (fe) {
        fe.style.left = `${frame.x}px`;
        fe.style.top = `${frame.y}px`;
        fe.style.width = `${frame.w}px`;
        fe.style.height = `${frame.h}px`;
      }
      if (scene) {
        const count = W < 640 ? 64 : W < 1024 ? 100 : 150;
        scene.configure(W, H, Math.min(window.devicePixelRatio || 1, 1.5), next, count);
      }
      lastDom = -1;
      render(smoothP, performance.now() / 1000, true);
    };

    const tick = (now: number) => {
      const target = readProgress();
      // Ease small moves; jump on big ones (nav links, fast flings) so stages never replay in fast-forward.
      if (Math.abs(target - smoothP) > 0.12) smoothP = target;
      else smoothP += (target - smoothP) * 0.14;
      if (Math.abs(target - smoothP) < 0.0002) smoothP = target;
      render(smoothP, now / 1000);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      if (!scene) {
        scene = new PlaygroundScene(canvas);
        resize();
      }
      smoothP = readProgress();
      if (reduced) {
        render(smoothP, 0, true);
        window.addEventListener("scroll", onScrollReduced, { passive: true });
      } else {
        raf = requestAnimationFrame(tick);
      }
      running = true;
    };

    const stop = () => {
      if (!running) return;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollReduced);
      running = false;
    };

    // Reduced motion: no loop, no easing lag. Redraw only when the page scrolls.
    const onScrollReduced = () => {
      smoothP = readProgress();
      render(smoothP, 0);
    };

    // Only animate while the section is on screen.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: "100px 0px",
    });
    io.observe(section);

    const ro = new ResizeObserver(() => resize());
    ro.observe(stage);

    const onMotionChange = () => {
      reduced = reducedMq.matches;
      stop();
      start();
    };
    reducedMq.addEventListener("change", onMotionChange);

    // Keep the layout frame in sync after React swaps wide/tall blocks.
    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      reducedMq.removeEventListener("change", onMotionChange);
    };
  }, []);

  // After a layout switch React re-creates the blocks; re-apply the frame box.
  useEffect(() => {
    const stage = stageRef.current;
    const fe = buildRefs.current.frame;
    if (!stage || !fe) return;
    const f = frameRect(stage.clientWidth, stage.clientHeight, layout);
    fe.style.left = `${f.x}px`;
    fe.style.top = `${f.y}px`;
    fe.style.width = `${f.w}px`;
    fe.style.height = `${f.h}px`;
    forceRef.current = true;
    window.dispatchEvent(new Event("scroll"));
  }, [layout]);

  const caption = "pointer-events-none absolute inset-x-0 bottom-[13%] px-5 text-center opacity-0 sm:bottom-[8%]";

  return (
    <section
      id="playground"
      ref={sectionRef}
      aria-labelledby="playground-title"
      className="relative h-[560vh] md:h-[680vh] motion-reduce:h-[400vh]"
    >
      <p className="sr-only">
        A scroll-driven animation in three parts. Zoom into the world: a single point grows into a network that
        becomes code and then an interface. Build it: scattered components align into a finished interface. Scroll
        to control: the interface becomes a small world where a point travels between nodes as you scroll.
      </p>

      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink-950">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(91,140,255,0.06),transparent_70%)]" />
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        <BuildIt layout={layout} refs={buildRefs.current} />

        {/* Intro */}
        <div ref={bind("intro")} className="pointer-events-none absolute inset-x-0 top-[24%] px-5 text-center">
          <h2 id="playground-title" className="eyebrow !text-[0.72rem] !text-accent-soft">
            Interactive Playground
          </h2>
          <p className="mt-3 text-sm text-fg-subtle">Scroll slowly. Everything here responds to you.</p>
        </div>

        {/* Step indicator */}
        <div
          ref={bind("indicator")}
          aria-hidden
          className="pointer-events-none absolute left-5 top-20 flex items-center gap-3 opacity-0 sm:left-8 sm:top-24"
        >
          <span className="font-mono text-[0.7rem] tracking-[0.14em] text-fg-muted">
            <span ref={bind("stepIndex")}>01</span> / 03 ·{" "}
            <span ref={bind("stepName")} className="uppercase text-fg">
              Zoom
            </span>
          </span>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[2px] w-5 overflow-hidden rounded-full bg-white/10">
                <span ref={bind(`bar${i}`)} className="block h-full w-full origin-left scale-x-0 bg-accent" />
              </span>
            ))}
          </span>
        </div>

        {/* Stage captions */}
        {[
          ["cap1", "01 / 03", "Zoom into the world"],
          ["cap2", "02 / 03", "Build it"],
          ["cap3", "03 / 03", "Scroll to control"],
        ].map(([key, num, label]) => (
          <div key={key} ref={bind(key)} className={caption}>
            <p className="font-mono text-[0.68rem] tracking-[0.2em] text-accent-soft">{num}</p>
            <p className="mt-2 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-fg sm:text-sm sm:tracking-[0.32em]">{label}</p>
          </div>
        ))}

        <p
          ref={bind("statement")}
          className="pointer-events-none absolute inset-x-0 bottom-[13%] px-8 text-center font-mono text-[0.78rem] uppercase leading-relaxed tracking-[0.18em] text-fg opacity-0 sm:bottom-[8%] sm:px-5 sm:text-sm sm:tracking-[0.3em]"
        >
          Ideas become something real.
        </p>

        {/* Finale */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-5 text-center">
          <div>
            <p
              ref={bind("final")}
              className="text-[2.6rem] font-semibold leading-none tracking-[-0.045em] opacity-0 sm:text-6xl lg:text-7xl"
            >
              YOU MADE IT<span className="text-accent">.</span>
            </p>
            <p ref={bind("finalSub")} className="mt-5 text-base text-fg-muted opacity-0 sm:text-lg">
              That&apos;s the kind of experience I like to build.
            </p>
          </div>
        </div>

        <a
          ref={bind("skip")}
          href="#contact"
          aria-label="Skip the playground"
          className="absolute bottom-5 left-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-subtle transition-colors hover:border-line-strong hover:text-fg sm:bottom-6 sm:left-8"
        >
          Skip
          <ArrowDown aria-hidden className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
