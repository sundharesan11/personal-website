# Editorial Blend + Cover Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the finished minimal portfolio into a minimal-base-plus-editorial-layer site with a full-bleed cover hero (placeholder photo + dark scrim + flow-field "extended dots" over it + name overlay + kicker/dateline), serif headings site-wide, and the correct identity (Sundharesan Kumaresan, not Soumyo).

**Architecture:** Builds on branch `build/foundation` (Astro 6, Tailwind v4 CSS-first, content collections). Adds Playfair Display as `--font-serif`, a generated placeholder hero image in `/public`, a reworked `flowField.ts` (dots+trail, randomized, light-over-photo via options), a new full-bleed hero in `index.astro`, a reusable `Kicker.astro`, and an identity/serif sweep across components and pages. Strict TDD on pure functions; build-pass + screenshot loop everywhere else.

**Tech Stack:** Astro 6.4, Tailwind v4.3 (`@theme` in `global.css`), `@fontsource/playfair-display`, `@fontsource-variable/inter`, vitest, Pillow (placeholder image generation).

---

## Context the executor needs

- Tokens live ONLY in `src/styles/global.css` under `@theme` (Tailwind v4 — no tailwind.config). Inter is `--font-sans` and applied on `html`.
- Content collections use the **Content Layer API**: entries keyed by `entry.id`, render via `import { render } from "astro:content"`.
- The flow field is `src/scripts/flowField.ts` (pure `flowAngle()` is unit-tested in `tests/flowField.test.ts`) + `src/components/FlowField.astro` (canvas `#flow-field`). It currently draws **line streaks**; this plan changes it to **dots with a short trail**, adds per-particle randomness, and adds a `variant: "muted" | "onPhoto"` option so it can render light over a dark photo.
- The accent token is `#1F54E6` (light) / `#5B86FF` (dark) — AA-compliant; do not revert to `#2F6BFF`.
- Commit messages end with the Co-Authored-By trailer used throughout this branch:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Stay on branch `build/foundation`. Git identity is set repo-locally (Sundharesan Kumaresan / sundharesansk11@gmail.com) — do not change it.

## File Structure

```
src/styles/global.css            # + Playfair import + --font-serif token + scrim/hero helpers if needed
src/scripts/flowField.ts         # reworked: dots+trail, randomness, variant option; pure helpers stay testable
tests/flowField.test.ts          # + tests for new pure helper(s)
src/components/FlowField.astro    # pass variant="onPhoto" when used in the hero
src/components/Hero.astro         # NEW: the full-bleed cover hero (photo+scrim+flowfield+overlay)
src/components/Kicker.astro       # NEW: small letter-spaced eyebrow label (reused on every page)
src/components/Header.astro       # identity: logo text
src/components/Footer.astro       # identity: name + mailto
src/layouts/BaseLayout.astro      # identity: default description; (head already has OG)
src/pages/index.astro             # use <Hero/>; serif section headings; kicker
src/pages/work/index.astro        # kicker + serif headings
src/pages/work/[slug].astro       # kicker + serif title + dateline
src/pages/writing/index.astro     # kicker + serif title + dateline styling
src/pages/writing/[slug].astro    # kicker + serif title + dateline
src/pages/about.astro             # kicker + serif title + identity copy
public/hero-placeholder.jpg       # NEW: generated placeholder photo (swap later)
public/og-default.png             # regenerate with correct name
docs/…                            # CLAUDE.md, DESIGN_SYSTEM, DECISIONS, ARCHITECTURE updates
```

---

### Task 1: Add Playfair Display serif token

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Install the font**

Run:
```bash
npm install @fontsource/playfair-display
```
Expected: package added.

- [ ] **Step 2: Import it and add the token**

In `src/styles/global.css`, add the import directly AFTER the existing `@import "@fontsource-variable/inter";` line (both font imports stay at the very top, after `@import "tailwindcss";`):
```css
@import "@fontsource/playfair-display/400.css";
@import "@fontsource/playfair-display/500.css";
@import "@fontsource/playfair-display/600.css";
@import "@fontsource/playfair-display/700.css";
```
Then inside the `@theme { … }` block, directly below the `--font-sans:` line, add:
```css
  --font-serif: "Playfair Display", ui-serif, Georgia, "Times New Roman", serif;
```

- [ ] **Step 3: Verify the utility compiles**

Run: `npm run build`
Expected: passes. (Confirms `font-serif` generates and the imports resolve.)

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css package.json package-lock.json
git commit -m "feat: add Playfair Display serif token (--font-serif)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Generate the placeholder hero photo

**Files:**
- Create: `public/hero-placeholder.jpg`

- [ ] **Step 1: Generate a 1600×2000 portrait-orientation editorial placeholder**

Use Python3 + Pillow. The image should read as an intentional placeholder, not broken: a dark charcoal (#1A1A1C) background with a subtle lighter vignette/centered soft ellipse and the small caption text "photo placeholder" low-center in a muted gray. Portrait-ish (taller than wide) so it crops well in a wide hero via object-cover. Save as JPEG quality ~85 to `public/hero-placeholder.jpg`.

Run a script equivalent to:
```bash
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFont
W,H=1600,2000
img=Image.new("RGB",(W,H),(26,26,28))
d=ImageDraw.Draw(img)
for i in range(8):
    a=10+i*2
    d.ellipse([W*0.5-500+i*30,H*0.42-500+i*30,W*0.5+500-i*30,H*0.42+500-i*30],outline=(40+i*3,40+i*3,44+i*3))
try:
    f=ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf",36)
except: f=ImageFont.load_default()
t="photo placeholder"
tb=d.textbbox((0,0),t,font=f); tw=tb[2]-tb[0]
d.text(((W-tw)/2,H*0.8),t,fill=(120,120,126),font=f)
img.save("public/hero-placeholder.jpg",quality=85)
print("ok")
PY
```
If Pillow is unavailable, install it (`python3 -m pip install --user pillow`) or fall back to a solid dark #1A1A1C JPEG of the same dimensions via a stdlib encoder. Report which path you used.

- [ ] **Step 2: Verify the image**

Run: `file public/hero-placeholder.jpg`
Expected: `JPEG image data, … 1600x2000` (or your fallback dims), non-trivial size.

- [ ] **Step 3: Commit**

```bash
git add public/hero-placeholder.jpg
git commit -m "chore: add placeholder hero photo (swap for real later)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Rework the flow field — dots + trail + randomness + variant (TDD)

**Files:**
- Modify: `src/scripts/flowField.ts`
- Modify: `tests/flowField.test.ts`

- [ ] **Step 1: Write a failing test for a new pure helper `randFromIndex`**

Add to `tests/flowField.test.ts`:
```ts
import { dotIntensity as _ignore } from "../src/scripts/flowField"; // remove if not present
```
(If that import errors because `dotIntensity` no longer exists, omit it.) Add this block:
```ts
import { randFromIndex } from "../src/scripts/flowField";

describe("randFromIndex", () => {
  it("is deterministic for the same index", () => {
    expect(randFromIndex(7)).toBe(randFromIndex(7));
  });
  it("returns a value in [0,1)", () => {
    for (const i of [0, 1, 5, 42, 199]) {
      const v = randFromIndex(i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it("varies across indices", () => {
    expect(randFromIndex(1)).not.toBe(randFromIndex(2));
  });
});
```

- [ ] **Step 2: Run tests, confirm the new block fails**

Run: `npm test`
Expected: FAIL — `randFromIndex` not exported. (Existing `flowAngle` tests still pass.)

- [ ] **Step 3: Implement the rework in `src/scripts/flowField.ts`**

Keep `flowAngle` exactly as-is. Add the pure helper and update the renderer. Replace the file's body (everything from `export interface FlowFieldOptions` onward) with:
```ts
export interface FlowFieldOptions {
  count?: number;
  speed?: number;
  blueRatio?: number;
  cursorRadius?: number;
  trail?: number;          // dot-trail length in frames of velocity
  variant?: "muted" | "onPhoto"; // onPhoto = light dots for over a dark photo
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
    // onPhoto: ignore the theme muted, always light dots so they read over the dark photo
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
        size: 0.8 + randFromIndex(i + 100) * 1.6,   // 0.8..2.4 px
        spd: 0.7 + randFromIndex(i + 7) * 0.7,        // 0.7..1.4 speed multiplier
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
      // short faded trail (extended dot)
      ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${tailA})`;
      ctx!.lineWidth = p.size;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(p.x - vx * trail, p.y - vy * trail);
      ctx!.lineTo(p.x, p.y);
      ctx!.stroke();
      // dot head
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
```
Keep the existing `flowAngle` export above this block unchanged.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS — `flowAngle` (3) + `randFromIndex` (3) green.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add src/scripts/flowField.ts tests/flowField.test.ts
git commit -m "feat: flow field as randomized extended dots with onPhoto variant

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: FlowField component accepts a variant prop

**Files:**
- Modify: `src/components/FlowField.astro`

- [ ] **Step 1: Add a `variant` prop and pass it through**

Replace `src/components/FlowField.astro` with:
```astro
---
// src/components/FlowField.astro
// Decorative motion: randomized "extended dots" drifting along a flow field,
// swirling away from the cursor. variant="onPhoto" renders light dots for use
// over a dark hero photo. aria-hidden + pointer-events-none.
interface Props { variant?: "muted" | "onPhoto"; }
const { variant = "muted" } = Astro.props;
---
<canvas
  id="flow-field"
  data-variant={variant}
  aria-hidden="true"
  class="pointer-events-none absolute inset-0 -z-0 h-full w-full"
></canvas>
<script>
  import { initFlowField } from "../scripts/flowField";
  const canvas = document.getElementById("flow-field");
  if (canvas instanceof HTMLCanvasElement) {
    const variant = canvas.dataset.variant === "onPhoto" ? "onPhoto" : "muted";
    initFlowField(canvas, { variant });
  }
</script>
```
Note: z-index is `-z-0` here; the Hero (Task 5) controls stacking with explicit z layers. (On the non-hero use it would sit behind content; in the hero we place it between scrim and text.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/FlowField.astro
git commit -m "feat: FlowField variant prop (muted | onPhoto)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Kicker component (reusable editorial eyebrow)

**Files:**
- Create: `src/components/Kicker.astro`

- [ ] **Step 1: Write the component**

```astro
---
// src/components/Kicker.astro
// Small letter-spaced eyebrow label used above page titles and in the hero.
interface Props { text: string; tone?: "default" | "onPhoto"; }
const { text, tone = "default" } = Astro.props;
const color = tone === "onPhoto" ? "text-white/80" : "text-text-muted";
---
<span class={`block text-xs uppercase tracking-[0.14em] ${color}`}>{text}</span>
```
Note: this is the one intentional uppercase in the system — an editorial kicker convention (small, letter-spaced). It is decorative labeling, not body copy.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: passes (component not yet used — confirms it compiles).

- [ ] **Step 3: Commit**

```bash
git add src/components/Kicker.astro
git commit -m "feat: Kicker editorial eyebrow component

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Cover hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Write the full-bleed cover hero**

```astro
---
// src/components/Hero.astro
// Full-bleed cover: photo + dark scrim + flow field (onPhoto) + name overlay.
import FlowField from "./FlowField.astro";
import Kicker from "./Kicker.astro";
---
<section class="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden" style="height: min(82vh, 760px); min-height: 460px;">
  <img src="/hero-placeholder.jpg" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" />
  <div class="absolute inset-0 -z-10" style="background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.30) 100%);"></div>
  <FlowField variant="onPhoto" />

  <div class="relative z-10 mx-auto flex h-full max-w-[1100px] flex-col justify-between px-6 py-10">
    <div class="flex items-center justify-between">
      <Kicker text="Selected work" tone="onPhoto" />
      <Kicker text="Portfolio — 2026" tone="onPhoto" />
    </div>
    <div>
      <h1 class="font-serif font-semibold leading-[1.02] text-white" style="font-size: clamp(2.6rem, 8vw, 5rem);">
        Sundharesan<br />Kumaresan
      </h1>
      <div class="mt-5 max-w-[46ch] border-t border-white/25 pt-4 text-base text-white/85 sm:text-lg">
        Designer &amp; builder — quiet, considered software.
      </div>
    </div>
  </div>
</section>
```
Notes: the `left-1/2 -mx-[50vw] w-screen` pattern makes the section full-bleed even though its parent is a centered column. The flow-field canvas sits at `-z-0` from Task 4, between the scrim (`-z-10`) and the overlay content (`z-10`). Photo at `-z-20`. The overlay re-centers its inner content to the `max-w-[1100px]` column.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: passes (component compiles; used in Task 7).

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: full-bleed cover hero (photo + scrim + flow field + name)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Use the hero on Home + serif section headings

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the old hero section, keep the featured grid**

Rewrite `src/pages/index.astro` to:
```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ProjectCard from "../components/ProjectCard.astro";
import Hero from "../components/Hero.astro";
import { getCollection } from "astro:content";

const featured = (await getCollection("projects"))
  .filter((p) => p.data.featured)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Sundharesan Kumaresan">
  <Hero />
  <main id="main-content" class="mx-auto max-w-[1100px] px-6">
    <section class="py-16">
      <div class="mb-8 flex items-baseline justify-between border-b border-border pb-3">
        <h2 class="font-serif text-xl font-semibold">Selected work</h2>
        <a href="/work" class="text-sm text-accent hover:underline underline-offset-4">All work →</a>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        {featured.map((p) => (
          <ProjectCard href={`/work/${p.id}`} title={p.data.title} summary={p.data.summary} tags={p.data.tags} />
        ))}
      </div>
    </section>
  </main>
</BaseLayout>
```
Note: `<Hero />` is placed OUTSIDE `<main>`'s centered column so it can go full-bleed (the hero handles its own width). `main` keeps `id="main-content"` for the skip link.

- [ ] **Step 2: Build + verify featured cards still render**

Run: `npm run build`
Expected: passes; dist/index.html contains "Atlas" + "Ledger", hero `<img src="/hero-placeholder.jpg">`, and `<h1>` text "Sundharesan".

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: home uses cover hero; serif section heading

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: ProjectCard title → serif

**Files:**
- Modify: `src/components/ProjectCard.astro`

- [ ] **Step 1: Make the card title serif**

In `src/components/ProjectCard.astro`, change the `<h3>` class from:
```
class="text-lg font-medium text-text"
```
to:
```
class="font-serif text-lg font-medium text-text"
```

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add src/components/ProjectCard.astro
git commit -m "feat: serif project-card titles

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Work pages — kicker, serif titles, dateline

**Files:**
- Modify: `src/pages/work/index.astro`, `src/pages/work/[slug].astro`

- [ ] **Step 1: Work index — add kicker + serif h1**

In `src/pages/work/index.astro`, add the import `import Kicker from "../../components/Kicker.astro";`, and replace the header block:
```astro
    <h1 class="text-2xl font-semibold">Work</h1>
    <p class="mt-3 max-w-[60ch] text-text-muted">Selected projects.</p>
```
with:
```astro
    <Kicker text="Portfolio" />
    <h1 class="mt-2 font-serif text-2xl font-semibold">Work</h1>
    <p class="mt-3 max-w-[60ch] text-text-muted">Selected projects.</p>
```

- [ ] **Step 2: Work detail — kicker + serif title + dateline**

In `src/pages/work/[slug].astro`, add `import Kicker from "../../components/Kicker.astro";`, and replace the `<header>` block:
```astro
    <header class="mx-auto mt-6" style="max-width: var(--measure)">
      <h1 class="text-2xl font-semibold">{project.data.title}</h1>
      <p class="mt-3 text-lg text-text-muted">{project.data.summary}</p>
```
with:
```astro
    <header class="mx-auto mt-6" style="max-width: var(--measure)">
      <Kicker text="Project" />
      <h1 class="mt-2 font-serif text-2xl font-semibold">{project.data.title}</h1>
      <p class="mt-2 text-sm uppercase tracking-[0.12em] text-text-muted">
        {project.data.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
      </p>
      <p class="mt-3 text-lg text-text-muted">{project.data.summary}</p>
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/pages/work/index.astro "src/pages/work/[slug].astro"
git commit -m "feat: editorial treatment on work pages (kicker, serif, dateline)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Writing pages — kicker, serif titles, dateline styling

**Files:**
- Modify: `src/pages/writing/index.astro`, `src/pages/writing/[slug].astro`

- [ ] **Step 1: Writing index — kicker + serif h1; keep the list**

In `src/pages/writing/index.astro`, add `import Kicker from "../../components/Kicker.astro";` and replace:
```astro
    <h1 class="text-2xl font-semibold">Writing</h1>
```
with:
```astro
    <Kicker text="Notes" />
    <h1 class="mt-2 font-serif text-2xl font-semibold">Writing</h1>
```
Also make each post title serif: change the title span class `class="text-text group-hover:text-accent"` to `class="font-serif text-text group-hover:text-accent"`.

- [ ] **Step 2: Writing detail — kicker + serif title + dateline**

In `src/pages/writing/[slug].astro`, add `import Kicker from "../../components/Kicker.astro";` and replace the `<header>` block:
```astro
    <header class="mt-6">
      <h1 class="text-2xl font-semibold">{post.data.title}</h1>
      <time class="mt-2 block text-sm text-text-muted">{fmt(post.data.date)}</time>
    </header>
```
with:
```astro
    <header class="mt-6">
      <Kicker text="Essay" />
      <h1 class="mt-2 font-serif text-2xl font-semibold">{post.data.title}</h1>
      <time class="mt-3 block text-sm uppercase tracking-[0.12em] text-text-muted">{fmt(post.data.date)}</time>
    </header>
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/pages/writing/index.astro "src/pages/writing/[slug].astro"
git commit -m "feat: editorial treatment on writing pages

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: About — kicker, serif title, identity copy

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Rewrite About with editorial heading + correct identity**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Prose from "../components/Prose.astro";
import Kicker from "../components/Kicker.astro";
---
<BaseLayout title="About — Sundharesan Kumaresan">
  <main id="main-content" class="mx-auto max-w-[1100px] px-6 py-16">
    <div class="mx-auto" style="max-width: var(--measure)">
      <Kicker text="About" />
      <h1 class="mt-2 font-serif text-2xl font-semibold">Sundharesan Kumaresan</h1>
    </div>
    <Prose>
      <p>
        Placeholder bio. Sundharesan is a designer &amp; builder of quiet, considered
        software — replace this with the real story: background, what he cares about,
        how to work with him.
      </p>
      <p>Replace with a second paragraph of real biography.</p>
    </Prose>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add src/pages/about.astro
git commit -m "feat: about page editorial heading + correct identity

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Identity sweep — header, footer, layout default

**Files:**
- Modify: `src/components/Header.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Header logo**

In `src/components/Header.astro`, change the logo link text from `Soumyo` to `Sundharesan Kumaresan`, and make it serif. The logo anchor:
```astro
    <a href="/" class="font-medium text-text sm:mr-auto">Soumyo</a>
```
becomes:
```astro
    <a href="/" class="font-serif text-base font-semibold text-text sm:mr-auto">Sundharesan Kumaresan</a>
```

- [ ] **Step 2: Footer**

In `src/components/Footer.astro`, change the copyright and mailto:
```astro
    <p class="text-sm text-text-muted">© {year} Soumyo · Oogway Labs</p>
    <a
      href="mailto:soumyo@oogwaylabs.com"
      class="text-sm text-accent underline-offset-4 hover:underline"
    >soumyo@oogwaylabs.com</a>
```
becomes:
```astro
    <p class="text-sm text-text-muted">© {year} Sundharesan Kumaresan · Personal portfolio</p>
    <a
      href="mailto:sundharesansk11@gmail.com"
      class="text-sm text-accent underline-offset-4 hover:underline"
    >sundharesansk11@gmail.com</a>
```

- [ ] **Step 3: BaseLayout default description**

In `src/layouts/BaseLayout.astro`, change the default in the destructuring:
```astro
const { title, description = "Soumyo — Oogway Labs" } = Astro.props;
```
to:
```astro
const { title, description = "Sundharesan Kumaresan — designer & builder" } = Astro.props;
```

- [ ] **Step 4: Verify no stale identity strings remain in source**

Run:
```bash
grep -rin "soumyo\|oogway" src
```
Expected: NO matches.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/components/Header.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: identity sweep -> Sundharesan Kumaresan; contact email

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Regenerate the OG social card with the correct name

**Files:**
- Modify: `public/og-default.png`

- [ ] **Step 1: Regenerate the 1200×630 card**

Use Python3 + Pillow: dark `#0B0B0C` background, "Sundharesan Kumaresan" large (serif if a serif TTF is available on the system, else default), a smaller "Designer & builder" beneath, and a `#5B86FF` accent rule. Save to `public/og-default.png`.
```bash
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFont
W,H=1200,630
img=Image.new("RGB",(W,H),(11,11,12)); d=ImageDraw.Draw(img)
def font(paths,sz):
    for p in paths:
        try: return ImageFont.truetype(p,sz)
        except: pass
    return ImageFont.load_default()
big=font(["/System/Library/Fonts/Supplemental/Georgia.ttf","/Library/Fonts/Georgia.ttf"],84)
small=font(["/System/Library/Fonts/Supplemental/Arial.ttf"],34)
d.text((80,250),"Sundharesan Kumaresan",fill=(237,237,237),font=big)
d.rectangle([80,360,200,364],fill=(91,134,255))
d.text((80,390),"Designer & builder — quiet, considered software.",fill=(154,154,162),font=small)
img.save("public/og-default.png"); print("ok")
PY
```
If Pillow/fonts are unavailable, fall back to a solid `#0B0B0C` card with the name in the default font. Report which path you used.

- [ ] **Step 2: Verify**

Run: `file public/og-default.png`
Expected: `PNG image data, 1200 x 630`.

- [ ] **Step 3: Commit**

```bash
git add public/og-default.png
git commit -m "chore: regenerate OG card with correct name

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Doc updates (CLAUDE.md, DESIGN_SYSTEM, DECISIONS, ARCHITECTURE)

**Files:**
- Modify: `CLAUDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`

- [ ] **Step 1: CLAUDE.md**

In `CLAUDE.md`, change the "What this is" line from "A personal portfolio site for Soumyo (Oogway Labs). Aesthetic: clean / minimal …" to: "A personal portfolio site for Sundharesan Kumaresan. Aesthetic: minimal base with an editorial (newspaper) layer — generous whitespace and restrained palette, with serif display type, kickers, datelines, and a full-bleed cover hero."

- [ ] **Step 2: DESIGN_SYSTEM.md**

Add to the Typography section: "Serif (display): Playfair Display via `--font-serif` — used for the hero name and all headings (h1/h2/h3, card/post titles). Inter stays for body, nav, UI, kickers, datelines." Add an "Editorial patterns" subsection documenting: kicker (small, uppercase, `tracking-[0.14em]`, the one allowed uppercase), dateline (uppercase tracked small caps on dates), hairline rules under section headings, and the full-bleed cover hero (photo + scrim + flow field overlay). Soften the "Don't add decoration" line to "Editorial elements (serif, kickers, rules, cover hero) are the sanctioned layer; beyond them, the restraint rules still hold."

- [ ] **Step 3: DECISIONS.md — add Decided entries**

Append under `## Decided`:
```markdown
### Identity: Sundharesan Kumaresan — 2026-06-14
The site is Sundharesan Kumaresan's personal portfolio. The earlier "Soumyo — Oogway Labs" was incorrect placeholder identity and has been removed site-wide. Contact email: sundharesansk11@gmail.com.

### Aesthetic pivot: minimal base + editorial layer — 2026-06-14
Supersedes the earlier "Rejected: editorial" decision. Keep the minimal whitespace base, but add an editorial/newspaper layer: serif display (Playfair Display) for headings + hero name, kicker eyebrows, datelines, hairline rules, and a full-bleed cover hero (photo + dark scrim + flow-field "extended dots" overlay + name). Not full newspaper (no multi-column body, no drop caps on content). **Why:** owner wants a newspaper/article feel with a photo hero; the minimal base keeps it from becoming busy.

### Editorial serif: Playfair Display — 2026-06-14
Resolves the previously-open "Typography — exact families". Self-hosted via @fontsource/playfair-display as `--font-serif`. **Rejected:** Newsreader (more sober) and Fraunces (more boutique) — owner chose Playfair's magazine-cover elegance.

### Hero: full-bleed cover (photo + name overlay + flow field) — 2026-06-14
Home hero is a full-bleed ~82vh cover: placeholder photo (`/public/hero-placeholder.jpg`, swap later) + dark scrim + the flow field (onPhoto variant, light dots) + name in Playfair + kicker/dateline. **Rejected:** masthead and portrait-split layouts (live-mocked alongside cover).
```
Then remove the "Typography — exact families" entry from `## Open / Deferred` (now decided).

- [ ] **Step 4: ARCHITECTURE.md**

Add to the components list: `Hero.astro` (full-bleed cover) and `Kicker.astro` (editorial eyebrow); note `public/hero-placeholder.jpg` as the swappable hero asset.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add CLAUDE.md docs/DESIGN_SYSTEM.md docs/DECISIONS.md docs/ARCHITECTURE.md
git commit -m "docs: record editorial pivot, identity, serif, cover hero

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: Visual verification + tuning (controller)

**Files:** any of `Hero.astro`, `flowField.ts`, `global.css` as needed.

- [ ] **Step 1: Screenshot the Home hero** in light + dark, desktop + mobile (restart the dev server first so content/config is fresh).
- [ ] **Step 2: Verify** — name legibility over the scrim (AA in both themes), the flow-field dots read as randomized extended dots and are visible over the photo, kicker/dateline placement, serif headings across all pages, full-bleed hero spans the viewport with no horizontal scrollbar.
- [ ] **Step 3: Tune** scrim opacity / dot alpha / `count` / `clamp()` name size live until it reads well; re-screenshot.
- [ ] **Step 4: Confirm** no horizontal overflow from the `w-screen` hero (check `document.documentElement.scrollWidth === clientWidth`).
- [ ] **Step 5: Build + commit any tuning**

```bash
npm run build
git add -A
git commit -m "polish: tune cover hero scrim + flow-field over photo

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review (completed by plan author)

**Spec coverage:** §1 type system → Task 1, 8, 9–12 (serif application); §2 cover hero → Tasks 5,6,7; §3 flow-field rework → Tasks 3,4; §4 editorial touches → Tasks 5,9,10,11; §5 identity cleanup → Tasks 11,12,13; §6 doc updates → Task 14; §8 verification → Task 15. All covered.

**Placeholder scan:** no "TBD/handle edge cases/write tests for the above"; every code step shows full code or exact diffs; image-gen steps include runnable scripts + fallbacks.

**Type consistency:** `FlowFieldOptions` gains `trail` + `variant`; `initFlowField(canvas, { variant })` call in `FlowField.astro` (Task 4) matches the new signature (Task 3). `randFromIndex` exported (Task 3) + tested (Task 3). `flowAngle` unchanged. `Kicker.astro` props `{text, tone}` used consistently in Tasks 6,9,10,11. Hero uses `FlowField variant="onPhoto"` matching Task 4's prop. Identity grep gate (Task 12 Step 4) enforces §5 completeness.

**Known risk:** the full-bleed `left-1/2 -mx-[50vw] w-screen` trick can introduce a horizontal scrollbar if a scrollbar gutter exists; Task 15 Step 4 explicitly checks `scrollWidth === clientWidth` and tuning can switch to a `100vw`-with-`overflow-x-clip`-on-body approach if needed.
