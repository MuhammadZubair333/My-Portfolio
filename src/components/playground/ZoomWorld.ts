import { BLOCKS, COLORS, easeInOut, lerp, seg, smooth } from "./geometry";
import type { SceneState } from "./scene";

const TOKEN_TONES = [
  `rgba(${COLORS.muted},A)`,
  `rgba(${COLORS.accentSoft},A)`,
  `rgba(${COLORS.violet},A)`,
  `rgba(${COLORS.fg},A)`,
];

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(w, h) / 2;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
  else ctx.rect(x - w / 2, y - h / 2, w, h);
  ctx.fill();
}

/**
 * 01 · ZOOM INTO THE WORLD
 * z: 0..1 progress of this experience. b: progress of the next one (for the hand-off).
 *
 * One set of particles morphs through every stage:
 * point -> particles -> network -> code tokens -> interface outline.
 */
export function drawZoom(s: SceneState, z: number, b: number, t: number, reduced: boolean) {
  const { ctx, W, H, frame: F, n, cloud, proj, pairs, stagger, tokens, outline, glow } = s;
  const handoff = 1 - seg(b, 0, 0.1); // DOM interface takes over in Build It
  if (handoff <= 0) return;

  const cx = F.x + F.w / 2;
  const cy = F.y + F.h / 2;
  const mobile = W < 640;

  const spread = easeInOut(seg(z, 0.1, 0.34)); // point -> cloud
  const network = smooth(z, 0.3, 0.46) * (1 - smooth(z, 0.54, 0.66));

  /* ---- 1. the single glowing point ---- */
  const pointAlpha = 1 - smooth(z, 0.12, 0.26);
  if (pointAlpha > 0) {
    const pulse = reduced ? 1 : 1 + Math.sin(t * 2.2) * 0.08;
    const size = lerp(26, 70, seg(z, 0, 0.14)) * pulse;
    ctx.globalAlpha = pointAlpha;
    ctx.drawImage(glow, cx - size / 2, cy - size / 2, size, size);
    ctx.globalAlpha = 1;
  }

  /* ---- 2. project the cloud (rotating, camera moving forward) ---- */
  const angle = reduced ? 0.6 : 0.4 + z * 1.4 + t * 0.05;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const cam = reduced ? 3 : lerp(3.3, 2.05, smooth(z, 0.26, 0.6));
  const R = Math.min(W, H) * (mobile ? 0.5 : 0.44) * spread;
  for (let i = 0; i < n; i++) {
    const x = cloud[i * 3];
    const y = cloud[i * 3 + 1];
    const zz = cloud[i * 3 + 2];
    const xr = x * cos + zz * sin;
    const zr = -x * sin + zz * cos;
    const k = 1.9 / (cam - zr);
    proj[i * 4] = cx + xr * R * k;
    proj[i * 4 + 1] = cy + y * R * k;
    proj[i * 4 + 2] = k; // depth scale
    proj[i * 4 + 3] = Math.min(1, 0.25 + k * 0.55); // depth alpha
  }

  /* ---- 3. network edges ---- */
  if (network > 0.01) {
    // Edges are batched into 4 depth buckets: 4 stroke calls instead of hundreds.
    ctx.lineWidth = 1;
    const BUCKETS = 4;
    for (let bucket = 0; bucket < BUCKETS; bucket++) {
      const lo = bucket / BUCKETS;
      const hi = (bucket + 1) / BUCKETS;
      ctx.beginPath();
      let any = false;
      for (let e = 0; e < pairs.length; e += 2) {
        const i = pairs[e];
        const j = pairs[e + 1];
        const d = Math.min(proj[i * 4 + 3], proj[j * 4 + 3]);
        if (d < lo || (d >= hi && bucket < BUCKETS - 1)) continue;
        ctx.moveTo(proj[i * 4], proj[i * 4 + 1]);
        ctx.lineTo(proj[j * 4], proj[j * 4 + 1]);
        any = true;
      }
      if (!any) continue;
      const a = network * 0.32 * ((lo + hi) / 2) * handoff;
      ctx.strokeStyle = `rgba(${COLORS.accentSoft},${a.toFixed(3)})`;
      ctx.stroke();
    }
  }

  /* ---- 4. particles morphing into code, then into the interface outline ---- */
  const appear = smooth(z, 0.1, 0.2);
  if (appear > 0) {
    for (let i = 0; i < n; i++) {
      const d = stagger[i];
      const eCode = easeInOut(seg(z, 0.52 + d * 0.1, 0.68 + d * 0.1));
      const eUi = easeInOut(seg(z, 0.76 + d * 0.08, 0.9 + d * 0.06));
      const tok = tokens[i];
      const o = outline[i];

      const tx = F.x + tok.x * F.w;
      const ty = F.y + tok.y * F.h;
      const x = lerp(lerp(proj[i * 4], tx, eCode), F.x + o.x * F.w, eUi);
      const y = lerp(lerp(proj[i * 4 + 1], ty, eCode), F.y + o.y * F.h, eUi);

      const dot = (mobile ? 1.6 : 1.9) * (0.7 + proj[i * 4 + 2] * 0.6);
      const w = lerp(lerp(dot * 2, tok.len * F.w, eCode), 2.4, eUi);
      const h = lerp(lerp(dot * 2, 3.4, eCode), 2.4, eUi);
      const a = appear * handoff * lerp(proj[i * 4 + 3], 0.9, Math.max(eCode, eUi));

      ctx.fillStyle =
        eUi > 0.5
          ? `rgba(${COLORS.accentSoft},${a.toFixed(3)})`
          : eCode > 0.5
            ? TOKEN_TONES[tok.tone].replace("A", (a * 0.85).toFixed(3))
            : `rgba(205,214,255,${a.toFixed(3)})`;
      pill(ctx, x, y, w, h);
    }
  }

  /* ---- 5. the interface stabilises: frame + block outlines ---- */
  const frameIn = smooth(z, 0.86, 1) * handoff;
  if (frameIn > 0) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(255,255,255,${(0.16 * frameIn).toFixed(3)})`;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(F.x, F.y, F.w, F.h, 22);
    else ctx.rect(F.x, F.y, F.w, F.h);
    ctx.stroke();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = `rgba(255,255,255,${(0.28 * frameIn).toFixed(3)})`;
    for (const bl of BLOCKS[s.layout]) {
      ctx.beginPath();
      const bx = F.x + bl.x * F.w;
      const by = F.y + bl.y * F.h;
      if (ctx.roundRect) ctx.roundRect(bx, by, bl.w * F.w, bl.h * F.h, 12);
      else ctx.rect(bx, by, bl.w * F.w, bl.h * F.h);
      ctx.stroke();
    }
    ctx.restore();
  }
}
