const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Pure: position of seed i in a phyllotaxis spiral (relative to centre). */
export function phyllotaxis(i: number, scale: number, rotation: number): { x: number; y: number; r: number } {
  const a = i * GOLDEN + rotation;
  const r = scale * Math.sqrt(i);
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, r };
}

interface RGB { r: number; g: number; b: number; }
function hexToRgb(hex: string, fallback: string): RGB {
  const h = (hex.trim() || fallback).replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
const mix = (a: RGB, b: RGB, t: number): RGB => ({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t });
const rgba = (c: RGB, a = 1) => `rgba(${c.r | 0}, ${c.g | 0}, ${c.b | 0}, ${a})`;
/** Deterministic per-petal jitter, so petals don't flicker between frames. */
const jitter = (i: number, s: number) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

/** Lanceolate ray petal along +x, base at the origin, tip at (len, 0). `curl` skews the tip sideways. */
function petalPath(ctx: CanvasRenderingContext2D, len: number, wid: number, curl = 0) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.22, -wid * 1.05, len * 0.72, -wid * (0.95 - curl), len, curl * wid * 0.6);
  ctx.bezierCurveTo(len * 0.72, wid * (0.95 + curl), len * 0.22, wid * 1.05, 0, 0);
  ctx.closePath();
}

export function initSunflower(canvas: HTMLCanvasElement, opts: { count?: number; static?: boolean; initialRotation?: number; rotationSpeed?: number } = {}): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const N = opts.count ?? 340;
  const PETALS = 21;
  // A few front petals take the spot colour, spaced unevenly so they read as picked, not patterned.
  const BLUE_PETALS = new Set([1, 8, 14]);
  let w = 0, h = 0, cx = 0, cy = 0, rot = opts.initialRotation ?? 0, raf = 0, running = false;
  const cssVar = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n);
  let accent: RGB, muted: RGB, bg: RGB, ink: RGB;
  const readColors = () => {
    accent = hexToRgb(cssVar("--color-accent"), "#0057B8");
    muted = hexToRgb(cssVar("--color-text-muted"), "#6B6B73");
    bg = hexToRgb(cssVar("--color-bg"), "#FFFFFF");
    ink = hexToRgb(cssVar("--color-text"), "#16161A");
  };
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2; cy = h / 2;
  }
  // Petals and bracts radiate from the centre, their bases tucked under the disc.
  function radial(a: number, from: number, draw: () => void) {
    ctx!.save();
    ctx!.translate(cx, cy);
    ctx!.rotate(a);
    ctx!.translate(from, 0);
    draw();
    ctx!.restore();
  }
  // Botanical plate: bracts, back + front whorls of ray petals, pollen ring, blue seed head.
  function draw() {
    ctx!.clearRect(0, 0, w, h);
    const size = Math.min(w, h);
    const R = (size / 2) * 0.97;
    const D = R * 0.38;
    const detailed = size > 90;
    const back = mix(muted, bg, 0.12), front = mix(muted, bg, 0.42), rib = mix(muted, bg, 0.05), bract = mix(muted, ink, 0.35);
    const blueFront = mix(accent, bg, 0.3), blueRib = mix(accent, ink, 0.25);
    for (let k = 0; k < PETALS; k++) {
      radial(rot + ((k + 0.25) / PETALS) * Math.PI * 2, D * 0.9, () => {
        petalPath(ctx!, R * 0.26, R * 0.045);
        ctx!.fillStyle = rgba(bract); ctx!.fill();
      });
    }
    for (let k = 0; k < PETALS; k++) {
      radial(rot + ((k + 0.5) / PETALS) * Math.PI * 2, D * 0.82, () => {
        petalPath(ctx!, R * 0.6, R * 0.12, 0.12);
        ctx!.fillStyle = rgba(back); ctx!.fill();
      });
    }
    for (let k = 0; k < PETALS; k++) {
      const len = R * (0.64 + 0.03 * jitter(k, 3));
      const blue = BLUE_PETALS.has(k);
      radial(rot + (k / PETALS) * Math.PI * 2, D * 0.8, () => {
        petalPath(ctx!, len, R * 0.13, -0.08);
        ctx!.fillStyle = rgba(blue ? blueFront : front); ctx!.fill();
        if (!detailed) return;
        ctx!.beginPath();
        ctx!.moveTo(len * 0.08, 0);
        ctx!.quadraticCurveTo(len * 0.5, R * 0.006, len * 0.88, 0);
        ctx!.strokeStyle = rgba(blue ? blueRib : rib, 0.55); ctx!.lineWidth = Math.max(0.5, R * 0.006); ctx!.stroke();
      });
    }
    ctx!.beginPath(); ctx!.arc(cx, cy, D * 1.04, 0, Math.PI * 2); ctx!.fillStyle = rgba(mix(muted, bg, 0.25)); ctx!.fill();
    ctx!.beginPath(); ctx!.arc(cx, cy, D * 0.9, 0, Math.PI * 2); ctx!.fillStyle = rgba(accent); ctx!.fill();
    // seed head: phyllotaxis, a darker core of unopened florets
    const discScale = (D * 0.86) / Math.sqrt(N);
    const seed = mix(accent, bg, 0.45), core = mix(accent, ink, 0.45);
    for (let i = 1; i < N; i++) {
      const p = phyllotaxis(i, discScale, rot * 1.4);
      const f = i / N;
      ctx!.beginPath();
      ctx!.arc(cx + p.x, cy + p.y, Math.max(0.5, discScale * (0.3 + 0.28 * (1 - f))), 0, Math.PI * 2);
      ctx!.fillStyle = rgba(f < 0.18 ? core : seed, 0.9); ctx!.fill();
    }
    if (!detailed) return;
    for (let k = 0; k < 55; k++) {
      const a = rot * 1.4 + k * GOLDEN * 3;
      ctx!.beginPath();
      ctx!.arc(cx + Math.cos(a) * D * 0.97, cy + Math.sin(a) * D * 0.97, R * 0.009, 0, Math.PI * 2);
      ctx!.fillStyle = rgba(muted, 0.8); ctx!.fill();
    }
  }
  function frame() { rot += opts.rotationSpeed ?? 0.0016; draw(); raf = requestAnimationFrame(frame); }
  function start() { if (running || reduce.matches) return; running = true; if (!raf) raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  const onResize = () => { resize(); draw(); };
  window.addEventListener("resize", onResize, { passive: true });
  const mo = new MutationObserver(() => { readColors(); draw(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); else stop(); }, { threshold: 0 });
  readColors(); resize();
  if (opts.static) {
    draw();
    window.removeEventListener("resize", onResize);
    mo.disconnect();
    io.disconnect();
    return () => {};
  }
  if (reduce.matches) draw(); else io.observe(canvas);
  return () => { stop(); io.disconnect(); mo.disconnect(); window.removeEventListener("resize", onResize); };
}
