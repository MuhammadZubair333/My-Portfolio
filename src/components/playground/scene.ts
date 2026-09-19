import {
  BLOCKS,
  WORLD,
  frameRatio,
  frameRect,
  makeTokens,
  perimeterPoints,
  phases,
  rng,
  COLORS,
  SAMPLES,
  type Layout,
  type PathSample,
  type Rect,
  type Token,
} from "./geometry";
import { drawZoom } from "./ZoomWorld";
import { drawControl } from "./ScrollControl";


/** A pre-rendered soft glow, drawn with drawImage instead of costly shadowBlur. */
function makeGlow() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(190,210,255,0.85)");
  grad.addColorStop(0.45, `rgba(${COLORS.accent},0.25)`);
  grad.addColorStop(1, `rgba(${COLORS.accent},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return c;
}


export type SceneState = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  layout: Layout;
  frame: Rect;
  glow: HTMLCanvasElement;
  n: number;
  /** 3D cloud positions + projected screen positions (reused every frame). */
  cloud: Float32Array;
  proj: Float32Array;
  pairs: Uint16Array;
  stagger: Float32Array;
  tokens: Token[];
  outline: { x: number; y: number }[];
  /** Ambient dust for the control world: x, y, depth. */
  dust: Float32Array;
  /** Per path segment (4): straight + detour samples, normalised coords. */
  straight: PathSample[];
  detour: PathSample[];
};


/** Evenly re-sample a Catmull-Rom curve through `pts` by arc length. */
function sampleCurve(pts: [number, number][], W: number, H: number): PathSample {
  const dense: { x: number; y: number }[] = [];
  const P = [pts[0], ...pts, pts[pts.length - 1]];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    for (let s = 0; s < 20; s++) {
      const t = s / 20;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      dense.push({ x: f(p0[0], p1[0], p2[0], p3[0]), y: f(p0[1], p1[1], p2[1], p3[1]) });
    }
  }
  dense.push({ x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] });
  // arc-length (in pixels so the aspect ratio is respected)
  const acc = [0];
  for (let i = 1; i < dense.length; i++) {
    acc.push(acc[i - 1] + Math.hypot((dense[i].x - dense[i - 1].x) * W, (dense[i].y - dense[i - 1].y) * H));
  }
  const total = acc[acc.length - 1] || 1;
  const out: PathSample = [];
  let j = 0;
  for (let s = 0; s <= SAMPLES; s++) {
    const d = (s / SAMPLES) * total;
    while (j < acc.length - 2 && acc[j + 1] < d) j++;
    const span = acc[j + 1] - acc[j] || 1;
    const t = (d - acc[j]) / span;
    out.push({ x: dense[j].x + (dense[j + 1].x - dense[j].x) * t, y: dense[j].y + (dense[j + 1].y - dense[j].y) * t });
  }
  return out;
}


export class PlaygroundScene {
  private s: SceneState | null = null;
  private key = "";

  constructor(private canvas: HTMLCanvasElement) {}

  configure(W: number, H: number, dpr: number, layout: Layout, n: number) {
    const canvas = this.canvas;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const key = `${layout}:${n}`;
    const geometryChanged = key !== this.key;
    this.key = key;

    const prev = this.s;
    const frame = frameRect(W, H, layout);
    const world = WORLD[layout];
    const segPts = (i: number, withDetour: boolean): [number, number][] =>
      withDetour && i === 2
        ? [world.nodes[2], ...world.detour, world.nodes[3]]
        : [world.nodes[i], world.nodes[i + 1]];

    const base =
      prev && !geometryChanged
        ? prev
        : (() => {
            const rand = rng(7);
            const cloud = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) {
              const u = rand() * 2 - 1;
              const th = rand() * Math.PI * 2;
              const r = 0.35 + 0.65 * Math.cbrt(rand());
              const sq = Math.sqrt(1 - u * u);
              cloud[i * 3] = r * sq * Math.cos(th);
              cloud[i * 3 + 1] = r * u * 0.8;
              cloud[i * 3 + 2] = r * sq * Math.sin(th);
            }
            // two nearest neighbours per particle -> network edges
            const pairs: number[] = [];
            const seen = new Set<number>();
            for (let i = 0; i < n; i++) {
              const best: [number, number][] = [];
              for (let j = 0; j < n; j++) {
                if (i === j) continue;
                const d =
                  (cloud[i * 3] - cloud[j * 3]) ** 2 +
                  (cloud[i * 3 + 1] - cloud[j * 3 + 1]) ** 2 +
                  (cloud[i * 3 + 2] - cloud[j * 3 + 2]) ** 2;
                best.push([d, j]);
              }
              best.sort((a, b) => a[0] - b[0]);
              for (const [, j] of best.slice(0, 2)) {
                const k = i < j ? i * 1000 + j : j * 1000 + i;
                if (!seen.has(k)) {
                  seen.add(k);
                  pairs.push(i, j);
                }
              }
            }
            const stagger = new Float32Array(n);
            const dust = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) {
              stagger[i] = ((i * 7) % 17) / 17;
              dust[i * 3] = rand();
              dust[i * 3 + 1] = rand();
              dust[i * 3 + 2] = 0.3 + rand() * 0.7;
            }
            return {
              n,
              cloud,
              proj: new Float32Array(n * 4),
              pairs: new Uint16Array(pairs),
              stagger,
              dust,
              tokens: makeTokens(n, layout, rand),
              outline: perimeterPoints(n, BLOCKS[layout], frameRatio(layout)),
              glow: prev?.glow ?? makeGlow(),
            };
          })();

    this.s = {
      ...base,
      ctx,
      W,
      H,
      layout,
      frame,
      straight: [0, 1, 2, 3].map((i) => sampleCurve(segPts(i, false), W, H)),
      detour: [0, 1, 2, 3].map((i) => sampleCurve(segPts(i, true), W, H)),
    };
  }

  draw(p: number, t: number, reduced: boolean) {
    const s = this.s;
    if (!s) return;
    s.ctx.clearRect(0, 0, s.W, s.H);
    const ph = phases(p);
    if (p < 0.37) drawZoom(s, ph.z, ph.b, t, reduced);
    if (p > 0.64) drawControl(s, ph.c, ph.f, t, reduced);
  }
}
