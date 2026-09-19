/**
 * Shared geometry + timeline for the Interactive Playground.
 * All layout values are normalised (0..1) so the canvas and the DOM
 * always agree on where things are, at any screen size.
 */

/* ---------- math helpers ---------- */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (v: number, a: number, b: number) => {
  const t = seg(v, a, b);
  return t * t * (3 - 2 * t);
};
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Deterministic RNG so the scene looks identical on every visit. */
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- timeline ---------- */
/** Section scroll progress (0..1) split into the three experiences + finale. */
export function phases(p: number) {
  return {
    z: seg(p, 0, 0.34), // 01 Zoom into the world
    b: seg(p, 0.34, 0.64), // 02 Build it
    c: seg(p, 0.64, 0.9), // 03 Scroll to control
    f: seg(p, 0.9, 1), // You made it
  };
}

/* ---------- interface layout ---------- */
export type Layout = "wide" | "tall";

export type BlockKind = "nav" | "title" | "text" | "button" | "media" | "card";

export type Block = {
  id: string;
  kind: BlockKind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Where the block floats while the interface is "unfinished" (frame units). */
  dx: number;
  dy: number;
  rot: number;
  /** Appears a moment later than the rest ("components appear"). */
  late?: boolean;
};

export const BLOCKS: Record<Layout, Block[]> = {
  wide: [
    { id: "nav", kind: "nav", x: 0.04, y: 0.05, w: 0.92, h: 0.09, dx: 0.02, dy: -0.32, rot: -3 },
    { id: "title", kind: "title", x: 0.04, y: 0.21, w: 0.45, h: 0.2, dx: -0.3, dy: -0.12, rot: -6 },
    { id: "text", kind: "text", x: 0.04, y: 0.46, w: 0.38, h: 0.12, dx: -0.24, dy: 0.12, rot: 5, late: true },
    { id: "button", kind: "button", x: 0.04, y: 0.63, w: 0.17, h: 0.07, dx: -0.36, dy: 0.3, rot: 12, late: true },
    { id: "media", kind: "media", x: 0.55, y: 0.21, w: 0.41, h: 0.49, dx: 0.32, dy: -0.18, rot: 6 },
    { id: "card1", kind: "card", x: 0.04, y: 0.77, w: 0.29, h: 0.18, dx: -0.18, dy: 0.4, rot: -8 },
    { id: "card2", kind: "card", x: 0.355, y: 0.77, w: 0.29, h: 0.18, dx: 0.04, dy: 0.46, rot: 4, late: true },
    { id: "card3", kind: "card", x: 0.67, y: 0.77, w: 0.29, h: 0.18, dx: 0.3, dy: 0.36, rot: 9 },
  ],
  tall: [
    { id: "nav", kind: "nav", x: 0.06, y: 0.03, w: 0.88, h: 0.06, dx: 0.04, dy: -0.12, rot: -3 },
    { id: "title", kind: "title", x: 0.06, y: 0.13, w: 0.88, h: 0.13, dx: -0.22, dy: -0.06, rot: -4 },
    { id: "text", kind: "text", x: 0.06, y: 0.29, w: 0.7, h: 0.07, dx: 0.2, dy: 0.02, rot: 4, late: true },
    { id: "button", kind: "button", x: 0.06, y: 0.39, w: 0.42, h: 0.045, dx: -0.24, dy: 0.06, rot: 8, late: true },
    { id: "media", kind: "media", x: 0.06, y: 0.47, w: 0.88, h: 0.23, dx: 0.2, dy: 0.04, rot: 4 },
    { id: "card1", kind: "card", x: 0.06, y: 0.73, w: 0.42, h: 0.11, dx: -0.22, dy: 0.1, rot: -6 },
    { id: "card2", kind: "card", x: 0.52, y: 0.73, w: 0.42, h: 0.11, dx: 0.22, dy: 0.12, rot: 5, late: true },
    { id: "card3", kind: "card", x: 0.06, y: 0.87, w: 0.88, h: 0.09, dx: 0.04, dy: 0.14, rot: -3 },
  ],
};

/** Data-flow connections drawn between blocks once they align. */
export const LINKS: Record<Layout, [string, string][]> = {
  wide: [
    ["title", "media"],
    ["button", "card1"],
    ["text", "card2"],
    ["media", "card3"],
  ],
  tall: [
    ["title", "text"],
    ["button", "media"],
    ["media", "card2"],
    ["card1", "card3"],
  ],
};

/** Blocks that collapse into the five world nodes (in path order). */
export const NODE_BLOCKS = ["title", "text", "media", "card1", "card3"];

/** Frame height / width. */
const FRAME_RATIO: Record<Layout, number> = { wide: 0.625, tall: 1.72 };

export const layoutFor = (w: number, h: number): Layout => (w / h < 0.8 ? "tall" : "wide");

export type Rect = { x: number; y: number; w: number; h: number };

/** Pixel rect of the interface frame inside the stage. */
export function frameRect(W: number, H: number, layout: Layout): Rect {
  const ratio = FRAME_RATIO[layout];
  let w: number;
  let h: number;
  if (layout === "wide") {
    w = Math.min(W * 0.74, 980);
    h = w * ratio;
    if (h > H * 0.58) {
      h = H * 0.58;
      w = h / ratio;
    }
  } else {
    h = Math.min(H * 0.6, 620);
    w = h / ratio;
    if (w > W * 0.82) {
      w = W * 0.82;
      h = w * ratio;
    }
  }
  return { x: (W - w) / 2, y: (H - h) / 2 - H * 0.015, w, h };
}

/** Grid lines = every distinct block edge, so the grid is exactly what things snap to. */
export function gridLines(blocks: Block[]) {
  const uniq = (vals: number[]) =>
    vals
      .sort((a, b) => a - b)
      .filter((v, i, arr) => i === 0 || v - arr[i - 1] > 0.012);
  return {
    xs: uniq(blocks.flatMap((b) => [b.x, b.x + b.w])),
    ys: uniq(blocks.flatMap((b) => [b.y, b.y + b.h])),
  };
}

/* ---------- particle targets ---------- */
export type Token = { x: number; y: number; len: number; tone: 0 | 1 | 2 | 3 };

/** Rows of rounded "code" tokens, indented like real source (frame units). */
export function makeTokens(n: number, layout: Layout, rand: () => number): Token[] {
  const rows: Omit<Token, "y">[][] = [];
  const indents = [0, 1, 2, 2, 1, 2, 3, 1, 0, 1];
  const [minLen, maxLen, gap, step] =
    layout === "wide" ? [0.03, 0.13, 0.016, 0.045] : [0.08, 0.26, 0.03, 0.08];
  let count = 0;
  while (count < n) {
    const row: Omit<Token, "y">[] = [];
    let x = 0.08 + indents[rows.length % indents.length] * step;
    const perRow = (layout === "wide" ? 2 : 1) + Math.floor(rand() * (layout === "wide" ? 5 : 3));
    for (let k = 0; k < perRow && count < n; k++) {
      const len = minLen + rand() * (maxLen - minLen);
      if (x + len > 0.93 && k > 0) break;
      const tone: Token["tone"] = k === 0 ? (rand() < 0.5 ? 1 : 3) : rand() < 0.15 ? 2 : 0;
      row.push({ x: x + len / 2, len, tone });
      x += len + gap;
      count++;
    }
    rows.push(row);
  }
  const top = 0.1;
  const bottom = 0.9;
  return rows.flatMap((row, i) =>
    row.map((t) => ({ ...t, y: top + ((i + 0.5) * (bottom - top)) / rows.length })),
  );
}

/** Points spread evenly along every block outline (frame units). */
export function perimeterPoints(n: number, blocks: Block[], ratio: number) {
  const lens = blocks.map((b) => 2 * (b.w + b.h * ratio));
  const total = lens.reduce((a, b) => a + b, 0);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    let d = ((i + 0.5) / n) * total;
    let k = 0;
    while (d > lens[k] && k < blocks.length - 1) d -= lens[k++];
    const b = blocks[k];
    const hw = b.w;
    const hh = b.h * ratio;
    // walk the rectangle: top, right, bottom, left
    if (d < hw) pts.push({ x: b.x + d, y: b.y });
    else if (d < hw + hh) pts.push({ x: b.x + b.w, y: b.y + (d - hw) / ratio });
    else if (d < 2 * hw + hh) pts.push({ x: b.x + b.w - (d - hw - hh), y: b.y + b.h });
    else pts.push({ x: b.x, y: b.y + b.h - (d - 2 * hw - hh) / ratio });
  }
  return pts;
}

export const frameRatio = (layout: Layout) => FRAME_RATIO[layout];

/* ---------- control world ---------- */
export type World = {
  nodes: [number, number][];
  obstacle: { x: number; y: number; w: number; h: number };
  /** Extra waypoints between node 2 and node 3 once the obstacle appears. */
  detour: [number, number][];
};

export const WORLD: Record<Layout, World> = {
  wide: {
    nodes: [
      [0.14, 0.62],
      [0.32, 0.36],
      [0.5, 0.6],
      [0.68, 0.34],
      [0.86, 0.56],
    ],
    obstacle: { x: 0.59, y: 0.5, w: 0.012, h: 0.24 },
    detour: [
      [0.555, 0.31],
      [0.625, 0.27],
    ],
  },
  tall: {
    nodes: [
      [0.28, 0.22],
      [0.72, 0.32],
      [0.32, 0.45],
      [0.7, 0.63],
      [0.38, 0.8],
    ],
    obstacle: { x: 0.5, y: 0.535, w: 0.36, h: 0.008 },
    detour: [
      [0.78, 0.47],
      [0.82, 0.57],
    ],
  },
};

/* ---------- shared drawing constants ---------- */
export const COLORS = {
  accent: "91,140,255",
  accentSoft: "143,176,255",
  violet: "139,123,255",
  fg: "238,240,244",
  muted: "163,169,182",
};

export type PathSample = { x: number; y: number }[];
export const SAMPLES = 48;

export function samplePath(path: PathSample, t: number) {
  const f = Math.min(Math.max(t, 0), 1) * SAMPLES;
  const i = Math.min(Math.floor(f), SAMPLES - 1);
  const k = f - i;
  return { x: path[i].x + (path[i + 1].x - path[i].x) * k, y: path[i].y + (path[i + 1].y - path[i].y) * k };
}
