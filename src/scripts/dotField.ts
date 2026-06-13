// src/scripts/dotField.ts

/** Pure: how strongly a dot at `distance` px from the cursor lights up (0..1). Smoothstep for an organic ease. */
export function dotIntensity(distance: number, radius: number): number {
  if (distance >= radius) return 0;
  const t = 1 - distance / radius; // 1 at cursor, 0 at edge
  return t * t * (3 - 2 * t);      // smoothstep
}

export interface DotFieldOptions {
  gap?: number;       // px between dots
  radius?: number;    // px influence radius around cursor
  baseAlpha?: number; // resting dot opacity (0..1)
  dotSize?: number;   // base dot radius (px)
}

interface RGB { r: number; g: number; b: number; }

function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v || "999999", 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Mount the reactive dot field on a canvas. Returns a cleanup function. */
export function initDotField(canvas: HTMLCanvasElement, opts: DotFieldOptions = {}): () => void {
  const gap = opts.gap ?? 28;
  const radius = opts.radius ?? 120;
  const baseAlpha = opts.baseAlpha ?? 0.16;
  const dotSize = opts.dotSize ?? 1.4;

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let w = 0, h = 0, cols = 0, rows = 0;
  let mouse = { x: -9999, y: -9999 };
  let raf = 0;
  let running = false;

  const cssVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name);
  let base = hexToRgb(cssVar("--color-text-muted"));
  let accent = hexToRgb(cssVar("--color-accent"));
  const readColors = () => {
    base = hexToRgb(cssVar("--color-text-muted"));
    accent = hexToRgb(cssVar("--color-accent"));
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / gap);
    rows = Math.ceil(h / gap);
  }

  function draw() {
    raf = 0;
    ctx!.clearRect(0, 0, w, h);
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * gap, y = j * gap;
        const t = dotIntensity(Math.hypot(x - mouse.x, y - mouse.y), radius);
        const r = (base.r + (accent.r - base.r) * t) | 0;
        const g = (base.g + (accent.g - base.g) * t) | 0;
        const b = (base.b + (accent.b - base.b) * t) | 0;
        const a = baseAlpha + t * (0.9 - baseAlpha);
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx!.arc(x, y, dotSize * (1 + t * 1.6), 0, Math.PI * 2);
        ctx!.fill();
      }
    }
  }

  const request = () => { if (!raf) raf = requestAnimationFrame(draw); };

  function onMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    request();
  }
  const onLeave = () => { mouse = { x: -9999, y: -9999 }; request(); };

  function start() {
    if (running) return;
    running = true;
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
  }
  function stop() {
    running = false;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerleave", onLeave);
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  // Pause interactivity when the hero is scrolled out of view (battery/perf).
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !reduce.matches) start();
    else stop();
  }, { threshold: 0 });

  const onResize = () => { resize(); request(); };
  window.addEventListener("resize", onResize, { passive: true });

  // Re-read tokens when the theme class flips so colors track the palette.
  const mo = new MutationObserver(() => { readColors(); request(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // Initial paint (also the final state for reduced-motion: a static faint grid).
  resize(); readColors(); draw();
  io.observe(canvas);

  return () => {
    stop(); io.disconnect(); mo.disconnect();
    window.removeEventListener("resize", onResize);
  };
}
