import { BLOCKS, COLORS, NODE_BLOCKS, WORLD, clamp01, easeInOut, lerp, samplePath, seg, smooth } from "./geometry";
import type { SceneState } from "./scene";

/**
 * 03 · SCROLL TO CONTROL
 * c: progress of this experience, f: progress of the finale.
 *
 * The finished interface collapses into five nodes; a glowing object then
 * travels between them as the visitor scrolls, re-routes around an obstacle,
 * activates each node, and the world resolves back into a single point.
 */
export function drawControl(s: SceneState, c: number, f: number, t: number, reduced: boolean) {
  const { ctx, W, H, frame: F, layout, glow, dust, n, straight, detour } = s;
  const world = WORLD[layout];
  const mobile = W < 640;
  const cx = W / 2;
  const cy = H / 2;

  /* ---- timeline ---- */
  const nodesIn = smooth(c, 0.06, 0.16);
  const travel = easeInOut(seg(c, 0.1, 0.26)); // nodes spread from the interface into the world
  const envIn = smooth(c, 0.08, 0.22);
  const pathDraw = seg(c, 0.24, 0.34);
  const objectIn = smooth(c, 0.26, 0.31);
  const u = 4 * seg(c, 0.3, 0.82); // object position along the 4 path segments
  const obstacleIn = smooth(c, 0.36, 0.44);
  const reroute = easeInOut(seg(c, 0.4, 0.48));
  const envShift = easeInOut(seg(c, 0.66, 0.8)); // dust re-forms into an ordered lattice
  const dissolve = smooth(c, 0.68, 0.78);
  const settle = easeInOut(seg(c, 0.84, 0.97)); // clean final state
  const converge = easeInOut(seg(f, 0, 0.35));
  const fadeAll = 1 - smooth(f, 0.4, 0.6);
  if (fadeAll <= 0) return;

  /* ---- node positions ---- */
  const gap = layout === "wide" ? 0.09 : 0.16;
  const nodes = NODE_BLOCKS.map((id, i) => {
    const b = BLOCKS[layout].find((bl) => bl.id === id)!;
    const sx = F.x + (b.x + b.w / 2) * F.w;
    const sy = F.y + (b.y + b.h / 2) * F.h;
    let x = lerp(sx, world.nodes[i][0] * W, travel);
    let y = lerp(sy, world.nodes[i][1] * H, travel);
    x = lerp(x, W * (0.5 + (i - 2) * gap), settle);
    y = lerp(y, cy, settle);
    return { x: lerp(x, cx, converge), y: lerp(y, cy, converge) };
  });

  const pathPoint = (v: number) => {
    const i = Math.min(3, Math.floor(v));
    const local = v - i;
    const a = samplePath(straight[i], local);
    const b = samplePath(detour[i], local);
    return { x: lerp(a.x, b.x, reroute) * W, y: lerp(a.y, b.y, reroute) * H };
  };

  /* ---- ambient environment: drifting dust that becomes an ordered lattice ---- */
  const dustA = envIn * (1 - settle * 0.7) * fadeAll * (1 - converge);
  if (dustA > 0.01) {
    const cols = Math.max(4, Math.round(Math.sqrt((n * W) / H)));
    const rows = Math.ceil(n / cols);
    for (let i = 0; i < n; i++) {
      const depth = dust[i * 3 + 2];
      const drift = reduced ? 0 : c * 0.35 * depth + t * 0.004 * depth;
      const fx = (((dust[i * 3] - drift) % 1) + 1) % 1;
      const lx = ((i % cols) + 0.5) / cols;
      const ly = (Math.floor(i / cols) + 0.5) / rows;
      const x = lerp(fx, lx, envShift) * W;
      const y = lerp(dust[i * 3 + 1], ly, envShift) * H;
      const a = dustA * lerp(0.15 + depth * 0.35, 0.22, envShift);
      ctx.fillStyle = `rgba(${COLORS.accentSoft},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, lerp(0.6 + depth, 1.1, envShift), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const pathA = (1 - settle) * fadeAll;

  /* ---- obstacle ---- */
  const ob = world.obstacle;
  const obA = obstacleIn * (1 - dissolve) * pathA;
  if (obA > 0.01) {
    const vertical = ob.h > ob.w;
    const ox = ob.x * W;
    const oy = ob.y * H;
    const len = (vertical ? ob.h * H : ob.w * W) * obstacleIn;
    const pieces = 8;
    ctx.fillStyle = `rgba(255,255,255,${(0.55 * obA).toFixed(3)})`;
    for (let k = 0; k < pieces; k++) {
      // splits apart and scatters while dissolving
      const off = (k - (pieces - 1) / 2) / pieces;
      const spread = 1 + dissolve * 0.8;
      const jitter = dissolve * 18 * Math.sin(k * 2.3);
      const pl = (len / pieces) * (1 - dissolve * 0.5);
      const px = vertical ? ox + jitter : ox + off * len * spread;
      const py = vertical ? oy + off * len * spread : oy + jitter;
      ctx.beginPath();
      if (vertical) ctx.roundRect?.(px - 2.5, py - pl / 2, 5, pl - 2, 2.5);
      else ctx.roundRect?.(px - pl / 2, py - 2.5, pl - 2, 5, 2.5);
      ctx.fill();
    }
  }

  /* ---- planned route (dashed) + travelled route (solid) ---- */
  if (pathA > 0.01 && pathDraw > 0) {
    const planned = 4 * pathDraw;
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 7]);
    ctx.strokeStyle = `rgba(255,255,255,${(0.28 * pathA).toFixed(3)})`;
    ctx.beginPath();
    for (let v = 0; v <= planned + 1e-6; v += 0.025) {
      const p = pathPoint(Math.min(v, 3.9999));
      if (v === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    if (u > 0) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(${COLORS.accent},${(0.85 * pathA).toFixed(3)})`;
      ctx.beginPath();
      for (let v = 0; v <= u + 1e-6; v += 0.02) {
        const p = pathPoint(Math.min(v, 3.9999));
        if (v === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ---- links between activated nodes (constellation -> clean line) ---- */
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    const linked = settle > 0 ? 1 : clamp01((u - (i + 1)) * 3) * envShift;
    const a = Math.max(linked * 0.35, settle * 0.5) * fadeAll * nodesIn;
    if (a < 0.01) continue;
    ctx.strokeStyle = `rgba(${COLORS.accentSoft},${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(nodes[i].x, nodes[i].y);
    ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
    ctx.stroke();
  }

  /* ---- nodes ---- */
  const r = mobile ? 5 : 6;
  nodes.forEach((p, i) => {
    const active = clamp01((u - i) * 5 + 0.0001) * objectIn;
    const a = nodesIn * fadeAll;
    if (a < 0.01) return;
    // activation ring
    if (active > 0 && active < 1 && !reduced) {
      ctx.strokeStyle = `rgba(${COLORS.accentSoft},${((1 - active) * 0.7 * a).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + active * 22, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = active >= 1 ? `rgba(${COLORS.accent},${a.toFixed(3)})` : `rgba(10,12,18,${a.toFixed(3)})`;
    ctx.strokeStyle = active >= 1 ? `rgba(${COLORS.accentSoft},${a.toFixed(3)})` : `rgba(255,255,255,${(0.45 * a).toFixed(3)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  /* ---- the object ---- */
  if (objectIn > 0) {
    let pos = u > 0 ? pathPoint(Math.min(u, 3.9999)) : { x: nodes[0].x, y: nodes[0].y };
    if (u >= 4) pos = { x: nodes[4].x, y: nodes[4].y };
    // follows the final node through settle + converge
    pos = { x: lerp(pos.x, nodes[4].x, settle), y: lerp(pos.y, nodes[4].y, settle) };
    pos = { x: lerp(pos.x, cx, converge), y: lerp(pos.y, cy, converge) };
    const bob = reduced ? 0 : Math.sin(t * 2) * 1.5 * (1 - settle);

    // short fading trail
    if (!reduced && u > 0.02 && settle < 1) {
      for (let k = 1; k <= 6; k++) {
        const tp = pathPoint(Math.max(0, Math.min(u, 3.9999) - k * 0.035));
        ctx.fillStyle = `rgba(${COLORS.accentSoft},${((0.3 - k * 0.045) * objectIn * (1 - settle)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 3.2 - k * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const size = lerp(46, 64, converge) * objectIn;
    ctx.globalAlpha = fadeAll;
    ctx.drawImage(glow, pos.x - size / 2, pos.y + bob - size / 2, size, size);
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(255,255,255,${fadeAll.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y + bob, 3.6 * objectIn, 0, Math.PI * 2);
    ctx.fill();
  }
}
