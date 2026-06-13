// src/scripts/flowField.ts

/** Pure: flow direction (radians) at a point and time. Layered sines approximate an evolving curl/noise field. Deterministic. */
export function flowAngle(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.0016 + t) +
    Math.cos(y * 0.0018 - t) +
    Math.sin((x + y) * 0.0011 + t * 1.3)
  ) * Math.PI;
}

export interface FlowFieldOptions {
  count?: number;
  speed?: number;
  blueRatio?: number;
  cursorRadius?: number;
  trail?: number;
  variant?: "muted" | "onPhoto";
}

/** Pure: deterministic pseudo-random in [0,1) from a particle index. */
export function randFromIndex(i: number): number {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface RGB { r: number; g: number; b: number; }
function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v || "5b86ff", 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function initFlowField(canvas: HTMLCanvasElement, opts: FlowFieldOptions = {}): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const speed = opts.speed ?? 0.85;
  const blueRatio = opts.blueRatio ?? 0.4;
  const cursorR = opts.cursorRadius ?? 160;
  const trail = opts.trail ?? 5;
  const variant = opts.variant ?? "muted";

  let w = 0, h = 0, count = 0;
  let particles: { x: number; y: number; blue: boolean; size: number; spd: number }[] = [];
  let mx = -9999, my = -9999, active = false, T = 0, raf = 0, running = false;

  const cssVar = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n);
  let blue = hexToRgb(cssVar("--color-accent") || "#5B86FF");
  let muted = hexToRgb(cssVar("--color-text-muted") || "#9A9AA2");
  const readColors = () => {
    blue = hexToRgb(cssVar("--color-accent") || "#5B86FF");
    muted = variant === "onPhoto"
      ? { r: 235, g: 236, b: 240 }
      : hexToRgb(cssVar("--color-text-muted") || "#9A9AA2");
  };

  const blueEvery = Math.max(1, Math.round(1 / blueRatio));

  function seed() {
    count = opts.count ?? Math.min(420, Math.round((w * h) / 2400));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: randFromIndex(i * 2) * w,
        y: randFromIndex(i * 2 + 1) * h,
        blue: i % blueEvery === 0,
        size: 0.8 + randFromIndex(i + 100) * 1.6,
        spd: 0.7 + randFromIndex(i + 7) * 0.7,
      });
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function step() {
    ctx!.clearRect(0, 0, w, h);
    for (const p of particles) {
      const jitter = (randFromIndex(Math.floor(T * 60) + p.size * 100) - 0.5) * 0.5;
      const a = flowAngle(p.x, p.y, T) + jitter;
      let vx = Math.cos(a) * speed * p.spd;
      let vy = Math.sin(a) * speed * p.spd;
      if (active) {
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < cursorR) {
          const f = 1 - d / cursorR;
          const ux = dx / (d || 1), uy = dy / (d || 1);
          vx += ux * f * 2.6 - uy * f * 2.2;
          vy += uy * f * 2.6 + ux * f * 2.2;
        }
      }
      p.x += vx; p.y += vy;
      if (p.x < 0) p.x += w; else if (p.x > w) p.x -= w;
      if (p.y < 0) p.y += h; else if (p.y > h) p.y -= h;

      const sp = Math.min(1, Math.hypot(vx, vy) / (speed * 4));
      const c = p.blue ? blue : muted;
      const headA = (p.blue ? 0.7 : 0.5) + sp * 0.3;
      const tailA = headA * 0.28;
      ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${tailA})`;
      ctx!.lineWidth = p.size;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(p.x - vx * trail, p.y - vy * trail);
      ctx!.lineTo(p.x, p.y);
      ctx!.stroke();
      ctx!.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${headA})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size * (p.blue ? 1.15 : 1), 0, Math.PI * 2);
      ctx!.fill();
    }
  }

  function frame() {
    raf = 0;
    T += 0.0028;
    step();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce.matches) return;
    running = true;
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  function onMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left; my = e.clientY - rect.top; active = true;
  }
  const onLeave = () => { active = false; };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave, { passive: true });
  const onResize = () => resize();
  window.addEventListener("resize", onResize, { passive: true });

  const mo = new MutationObserver(readColors);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start(); else stop();
  }, { threshold: 0 });

  resize(); readColors();
  if (reduce.matches) { T = 0; step(); } else { io.observe(canvas); }

  return () => {
    stop(); io.disconnect(); mo.disconnect();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onResize);
  };
}
