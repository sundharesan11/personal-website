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
  trailLength?: number;
}

interface RGB { r: number; g: number; b: number; }
function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v || "5b86ff", 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Mount the flow field on a canvas. Returns a cleanup function. */
export function initFlowField(canvas: HTMLCanvasElement, opts: FlowFieldOptions = {}): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const speed = opts.speed ?? 0.85;
  const blueRatio = opts.blueRatio ?? 0.4;
  const cursorR = opts.cursorRadius ?? 160;
  const trail = opts.trailLength ?? 9;

  let w = 0, h = 0, count = 0;
  let particles: { x: number; y: number; blue: boolean }[] = [];
  let mx = -9999, my = -9999, active = false, T = 0, raf = 0, running = false;

  const cssVar = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n);
  let blue = hexToRgb(cssVar("--color-accent") || "#5B86FF");
  let muted = hexToRgb(cssVar("--color-text-muted") || "#9A9AA2");
  const readColors = () => {
    blue = hexToRgb(cssVar("--color-accent") || "#5B86FF");
    muted = hexToRgb(cssVar("--color-text-muted") || "#9A9AA2");
  };

  const blueEvery = Math.max(1, Math.round(1 / blueRatio));

  function seed() {
    count = opts.count ?? Math.min(420, Math.round((w * h) / 2400));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, blue: i % blueEvery === 0 });
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
    ctx!.lineCap = "round";
    for (const p of particles) {
      const a = flowAngle(p.x, p.y, T);
      let vx = Math.cos(a) * speed;
      let vy = Math.sin(a) * speed;
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
      const alpha = p.blue ? 0.6 + sp * 0.38 : 0.24 + sp * 0.4;
      ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
      ctx!.lineWidth = p.blue ? 1.5 : 1.1;
      ctx!.beginPath();
      ctx!.moveTo(p.x - vx * trail, p.y - vy * trail);
      ctx!.lineTo(p.x, p.y);
      ctx!.stroke();
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
  if (reduce.matches) {
    T = 0; step();
  } else {
    io.observe(canvas);
  }

  return () => {
    stop(); io.disconnect(); mo.disconnect();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onResize);
  };
}
