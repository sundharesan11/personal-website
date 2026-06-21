const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Pure: position of seed i in a phyllotaxis spiral (relative to centre). */
export function phyllotaxis(i: number, scale: number, rotation: number): { x: number; y: number; r: number } {
  const a = i * GOLDEN + rotation;
  const r = scale * Math.sqrt(i);
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, r };
}

interface RGB { r: number; g: number; b: number; }
function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v || "5b86ff", 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function initSunflower(canvas: HTMLCanvasElement, opts: { count?: number } = {}): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const N = opts.count ?? 260;
  let w = 0, h = 0, cx = 0, cy = 0, scale = 0, rot = 0, t = 0, raf = 0, running = false;
  const cssVar = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n);
  let accent = hexToRgb(cssVar("--color-accent") || "#5B86FF");
  let muted = hexToRgb(cssVar("--color-text-muted") || "#9A9AA2");
  const readColors = () => { accent = hexToRgb(cssVar("--color-accent") || "#5B86FF"); muted = hexToRgb(cssVar("--color-text-muted") || "#9A9AA2"); };
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2; cy = h / 2; scale = (Math.min(w, h) / 2) / Math.sqrt(N);
  }
  function draw() {
    ctx!.clearRect(0, 0, w, h);
    const R = (Math.min(w, h) / 2) * 0.94;
    const breathe = 1 + 0.03 * Math.sin(t);
    // petals: two offset rings of radial blades
    const rings = [
      { n: 30, dist: 0.66, len: 0.34, wid: 0.055, off: 0 },
      { n: 30, dist: 0.56, len: 0.27, wid: 0.05, off: Math.PI / 30 },
    ];
    for (const ring of rings) {
      for (let k = 0; k < ring.n; k++) {
        const a = rot + ring.off + (k / ring.n) * Math.PI * 2;
        const d = R * ring.dist * breathe;
        const blue = k % 5 === 0;
        const c = blue ? accent : muted;
        ctx!.save();
        ctx!.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d);
        ctx!.rotate(a);
        ctx!.beginPath();
        ctx!.ellipse(0, 0, R * ring.len, R * ring.wid, 0, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${blue ? 0.28 : 0.17})`;
        ctx!.fill();
        ctx!.restore();
      }
    }
    // seed head: phyllotaxis disc, denser + brighter toward the centre
    const discR = R * 0.42;
    const discScale = (discR * breathe) / Math.sqrt(N);
    for (let i = 0; i < N; i++) {
      const p = phyllotaxis(i, discScale, rot * 1.4);
      const f = i / N;
      const c = i % 4 === 0 ? accent : muted;
      ctx!.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.2 + (1 - f) * 0.28})`;
      ctx!.beginPath();
      ctx!.arc(cx + p.x, cy + p.y, 0.8 + (1 - f) * 1.7, 0, Math.PI * 2);
      ctx!.fill();
    }
  }
  function frame() { rot += 0.0016; t += 0.012; draw(); raf = requestAnimationFrame(frame); }
  function start() { if (running || reduce.matches) return; running = true; if (!raf) raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  const onResize = () => { resize(); draw(); };
  window.addEventListener("resize", onResize, { passive: true });
  const mo = new MutationObserver(() => { readColors(); draw(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); else stop(); }, { threshold: 0 });
  resize(); readColors();
  if (reduce.matches) draw(); else io.observe(canvas);
  return () => { stop(); io.disconnect(); mo.disconnect(); window.removeEventListener("resize", onResize); };
}
