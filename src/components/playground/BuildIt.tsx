import type { ReactNode } from "react";
import {
  BLOCKS,
  LINKS,
  easeInOut,
  frameRatio,
  easeOutBack,
  gridLines,
  lerp,
  seg,
  smooth,
  type Block,
  type Layout,
  type Rect,
} from "./geometry";

/** Element handles written to directly each frame (no React re-render per scroll). */
export type BuildRefs = {
  frame: HTMLDivElement | null;
  blocks: (HTMLDivElement | null)[];
  contents: (HTMLDivElement | null)[];
  grid: SVGGElement | null;
  gridLines: (SVGLineElement | null)[];
  links: SVGGElement | null;
  linkPaths: (SVGPathElement | null)[];
  status: HTMLSpanElement | null;
  statusDot: HTMLSpanElement | null;
};

export const createBuildRefs = (): BuildRefs => ({
  frame: null,
  blocks: [],
  contents: [],
  grid: null,
  gridLines: [],
  links: null,
  linkPaths: [],
  status: null,
  statusDot: null,
});

const Bar = ({ w, className = "bg-white/20", h = "h-1.5" }: { w: string; className?: string; h?: string }) => (
  <span className={`block rounded-full ${h} ${className}`} style={{ width: w }} />
);

function Content({ block, refs }: { block: Block; refs: BuildRefs }): ReactNode {
  switch (block.kind) {
    case "nav":
      return (
        <div className="flex h-full items-center justify-between gap-3 px-[4%]">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent-soft" />
            <Bar w="2.5rem" className="bg-white/50" />
          </span>
          <span className="hidden flex-1 items-center justify-center gap-3 sm:flex">
            <Bar w="2rem" />
            <Bar w="2.4rem" />
            <Bar w="1.8rem" />
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fg-muted">
            <span ref={(el) => void (refs.statusDot = el)} className="size-1.5 rounded-full bg-amber-300" />
            <span ref={(el) => void (refs.status = el)}>Draft</span>
          </span>
        </div>
      );
    case "title":
      return (
        <div className="flex h-full flex-col justify-center gap-[9%] px-[6%]">
          <Bar w="88%" h="h-[18%]" className="bg-gradient-to-r from-accent-soft to-violet" />
          <Bar w="62%" h="h-[18%]" className="bg-white/80" />
        </div>
      );
    case "text":
      return (
        <div className="flex h-full flex-col justify-center gap-[12%] px-[6%]">
          <Bar w="100%" h="h-[12%]" />
          <Bar w="92%" h="h-[12%]" />
          <Bar w="68%" h="h-[12%]" />
        </div>
      );
    case "button":
      return (
        <div className="flex h-full items-center justify-center bg-accent/80">
          <Bar w="45%" h="h-[18%]" className="bg-white/90" />
        </div>
      );
    case "media":
      return (
        <div className="relative h-full overflow-hidden bg-gradient-to-br from-accent/20 via-violet/10 to-transparent">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-x-[6%] bottom-[10%] h-[55%] w-[88%]">
            <polyline
              points="0,52 14,44 28,48 42,30 56,34 70,18 84,22 100,6"
              fill="none"
              stroke="rgb(143 176 255)"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points="0,52 14,44 28,48 42,30 56,34 70,18 84,22 100,6 100,60 0,60"
              fill="rgba(91,140,255,0.12)"
              stroke="none"
            />
          </svg>
          <div className="absolute left-[6%] top-[9%] flex flex-col gap-2">
            <Bar w="4rem" className="bg-white/50" />
            <Bar w="2.6rem" />
          </div>
        </div>
      );
    case "card":
      return (
        <div className="flex h-full items-center gap-[7%] px-[7%]">
          <span className="aspect-square h-[42%] shrink-0 rounded-lg bg-accent/30" />
          <div className="flex flex-1 flex-col gap-2">
            <Bar w="80%" className="bg-white/50" />
            <Bar w="55%" />
          </div>
        </div>
      );
  }
}

/** Anchor-to-anchor curve in the frame's SVG units (1000 wide). */
function linkPath(a: Block, b: Block, ry: number) {
  const horizontal = b.x >= a.x + a.w - 0.01;
  if (horizontal) {
    const x1 = (a.x + a.w) * 1000;
    const y1 = (a.y + a.h / 2) * ry;
    const x2 = b.x * 1000;
    const y2 = (b.y + b.h / 2) * ry;
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }
  const x1 = (a.x + a.w / 2) * 1000;
  const y1 = (a.y + a.h) * ry;
  const x2 = (b.x + b.w / 2) * 1000;
  const y2 = b.y * ry;
  const my = (y1 + y2) / 2;
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
}

export function BuildIt({ layout, refs }: { layout: Layout; refs: BuildRefs }) {
  const blocks = BLOCKS[layout];
  const { xs, ys } = gridLines(blocks);
  const byId = Object.fromEntries(blocks.map((b) => [b.id, b]));
  const ry = 1000 * frameRatio(layout);
  let lineIndex = 0;

  return (
    <div
      ref={(el) => void (refs.frame = el)}
      aria-hidden
      className="pointer-events-none absolute rounded-[22px] border border-white/15 bg-white/[0.015] opacity-0 transition-[border-color,box-shadow] duration-700 data-[state=locked]:border-accent/45 data-[state=locked]:shadow-[0_0_0_1px_rgba(91,140,255,0.15),0_30px_120px_-30px_rgba(91,140,255,0.45)]"
      style={{ visibility: "hidden" }}
    >
      <svg viewBox={`0 0 1000 ${ry}`} className="absolute inset-0 h-full w-full overflow-visible">
        <g ref={(el) => void (refs.grid = el)} stroke="rgba(143,176,255,0.28)" strokeWidth="1">
          {xs.map((x) => {
            const i = lineIndex++;
            return (
              <line
                key={`x${x}`}
                ref={(el) => void (refs.gridLines[i] = el)}
                data-axis="v"
                x1={x * 1000}
                x2={x * 1000}
                y1={0}
                y2={ry}
                strokeDasharray="0 99999"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {ys.map((y) => {
            const i = lineIndex++;
            return (
              <line
                key={`y${y}`}
                ref={(el) => void (refs.gridLines[i] = el)}
                data-axis="h"
                x1={0}
                x2={1000}
                y1={y * ry}
                y2={y * ry}
                strokeDasharray="0 99999"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
        <g ref={(el) => void (refs.links = el)} fill="none" stroke="rgb(143 176 255)" strokeWidth="1.4">
          {LINKS[layout].map(([a, b], i) => (
            <path
              key={`${a}-${b}`}
              ref={(el) => void (refs.linkPaths[i] = el)}
              d={linkPath(byId[a], byId[b], ry)}
              strokeDasharray="0 99999"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>

      {blocks.map((block, i) => (
        <div
          key={block.id}
          ref={(el) => void (refs.blocks[i] = el)}
          data-state="draft"
          className={`absolute overflow-hidden border border-white/25 bg-ink-850/90 opacity-0 transition-[border-color,background-color] duration-500 data-[state=draft]:border-dashed data-[state=locked]:border-white/20 data-[state=locked]:bg-ink-800 ${
            block.kind === "button" ? "rounded-full" : "rounded-xl"
          }`}
          style={{
            left: `${block.x * 100}%`,
            top: `${block.y * 100}%`,
            width: `${block.w * 100}%`,
            height: `${block.h * 100}%`,
            willChange: "transform, opacity",
          }}
        >
          <div ref={(el) => void (refs.contents[i] = el)} className="h-full w-full">
            <Content block={block} refs={refs} />
          </div>
        </div>
      ))}
    </div>
  );
}

const show = (el: HTMLElement | SVGElement | null, o: number) => {
  if (!el) return;
  el.style.opacity = o.toFixed(3);
  // "" (not "visible") so these still inherit `hidden` from the frame when it goes away
  el.style.visibility = o < 0.005 ? "hidden" : "";
};

/**
 * 02 · BUILD IT (+ the collapse into Scroll to Control)
 * b: this experience's progress, c: next experience's progress.
 */
export function updateBuild(
  refs: BuildRefs,
  layout: Layout,
  frame: Rect,
  b: number,
  c: number,
  opts: { reduced: boolean; lite: boolean },
) {
  const blocks = BLOCKS[layout];
  const frameIn = smooth(b, 0, 0.03);
  const collapse = smooth(c, 0.04, 0.12);
  const frameEl = refs.frame;
  if (!frameEl) return;

  const visible = frameIn * (1 - smooth(c, 0.12, 0.17));
  frameEl.style.visibility = visible < 0.005 ? "hidden" : "visible";
  if (visible < 0.005) return;

  // lock-in pulse: a short, satisfying swell when everything snaps together
  const pulse = smooth(b, 0.82, 0.86) * (1 - smooth(b, 0.86, 0.95));
  const locked = b > 0.84;
  frameEl.dataset.state = locked ? "locked" : "open";
  frameEl.style.opacity = (frameIn * (1 - collapse)).toFixed(3);
  frameEl.style.transform = `scale(${1 + pulse * (opts.reduced ? 0 : 0.018)})`;

  const scatter = smooth(b, 0.02, 0.16);
  const mag = opts.reduced ? 0.2 : opts.lite ? 0.7 : 1;
  const n = blocks.length;

  blocks.forEach((bl, k) => {
    const el = refs.blocks[k];
    const content = refs.contents[k];
    if (!el) return;
    const stag = k / (n - 1);
    const assemble = easeOutBack(seg(b, 0.2 + stag * 0.22, 0.5 + stag * 0.24));
    const amt = scatter * (1 - Math.min(assemble, 1)) + (assemble > 1 ? (1 - assemble) * 0.4 : 0);
    const appear = bl.late ? smooth(b, 0.08 + stag * 0.06, 0.2 + stag * 0.06) : smooth(b, 0, 0.04);

    const tx = bl.dx * frame.w * amt * mag;
    const ty = bl.dy * frame.h * amt * mag;
    const rot = opts.reduced ? 0 : bl.rot * Math.max(amt, 0);
    const blur = opts.reduced || opts.lite ? 0 : Math.min(3, Math.max(amt, 0) * 4);

    // collapse each block into a dot at its own centre (the future world node)
    const col = easeInOut(seg(c, k * 0.006, 0.1 + k * 0.006));
    const pxW = bl.w * frame.w;
    const pxH = bl.h * frame.h;
    const sx = lerp(1, 12 / pxW, col);
    const sy = lerp(1, 12 / pxH, col);

    el.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";
    el.style.borderRadius = col > 0 ? `${lerp(bl.kind === "button" ? 50 : 8, 50, col)}%` : "";
    el.style.opacity = (appear * (1 - smooth(c, 0.08, 0.14))).toFixed(3);
    el.dataset.state = locked ? "locked" : b > 0.56 ? "aligned" : "draft";
    if (content) content.style.opacity = ((0.3 + 0.7 * smooth(b, 0.56, 0.8)) * (1 - smooth(c, 0, 0.05))).toFixed(3);
  });

  // grid lines draw in, then soften once the layout locks
  const gridDraw = easeInOut(seg(b, 0.34, 0.6));
  refs.gridLines.forEach((line, i) => {
    if (!line) return;
    const len = line.dataset.axis === "v" ? frame.h : frame.w;
    drawStroke(line, len, clampStagger(gridDraw, i, refs.gridLines.length));
  });
  show(refs.grid, (1 - 0.65 * smooth(b, 0.86, 0.95)) * (1 - collapse));

  // connections establish
  const linkDraw = easeInOut(seg(b, 0.64, 0.8));
  const scale = frame.w / 1000;
  refs.linkPaths.forEach((p, i) => {
    if (!p) return;
    const len = pathLength(p) * scale;
    drawStroke(p, len, clampStagger(linkDraw, i, refs.linkPaths.length));
  });
  show(refs.links, 0.75 * (1 - smooth(c, 0, 0.05)));

  if (refs.status && refs.status.textContent !== (locked ? "Live" : "Draft")) refs.status.textContent = locked ? "Live" : "Draft";
  if (refs.statusDot) {
    const cls = `size-1.5 rounded-full ${locked ? "bg-emerald-400" : "bg-amber-300"}`;
    if (refs.statusDot.className !== cls) refs.statusDot.className = cls;
  }
}

/** Reveal a stroke from its start: `t` of its on-screen length is drawn. */
function drawStroke(el: SVGElement, len: number, t: number) {
  el.style.strokeDasharray = `${(len * t).toFixed(1)} ${(len + 10).toFixed(1)}`;
}

const lengths = new WeakMap<SVGPathElement, number>();
function pathLength(p: SVGPathElement) {
  let l = lengths.get(p);
  if (l === undefined) {
    l = p.getTotalLength();
    lengths.set(p, l);
  }
  return l;
}

/** Slight per-item stagger for line drawing. */
function clampStagger(p: number, i: number, count: number) {
  const d = count > 1 ? (i / (count - 1)) * 0.35 : 0;
  return Math.min(1, Math.max(0, (p - d) / 0.65));
}
