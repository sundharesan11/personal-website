# Portfolio Foundation & Core Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up Soumyo's Astro + Tailwind portfolio from empty repo to a running, themed, content-driven shell with Home / Work / Writing / About pages, light+dark mode, and placeholder content — ready for real copy.

**Architecture:** Static Astro (SSG), Tailwind v4 (CSS-first tokens), Astro Content Collections (zod-validated) for projects and writing. Two small client scripts — the theme toggle (no-flash + persisted) and the hero dot field (reactive ambient motion). Everything else is zero-JS server-rendered HTML. Design tokens from `docs/DESIGN_SYSTEM.md` are the single source of truth, declared once in `global.css` and consumed as Tailwind utilities.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), `@astrojs/mdx`, TypeScript (strict), zod (bundled with Astro content).

---

## Pre-flight decisions baked into this plan

These were resolved in `docs/DECISIONS.md` (2026-06-14). Listed here so the executor doesn't re-litigate:

- **IA:** Home · Work · Writing · About. Contact = mailto in footer.
- **Accent:** blue `#2F6BFF` / `#5B86FF` (dark).
- **Dark mode:** at launch, toggle + system default, no flash.
- **Content:** shell-first with placeholders.
- **Tailwind:** v4 CSS-first (supersedes `tailwind.config.mjs` references in older docs — Task 16 updates them).
- **Typography exact families:** still OPEN. Plan uses Inter (sans) only. If a display serif is chosen later it's a token swap in `global.css`; do not block on it.

**Definition of "test" for this plan.** A static markup site has little to unit-test. Where real logic exists (theme-toggle behavior, content schema validation), we write actual automated checks. Everywhere else the verification step is **`astro build` must pass with zero errors** plus a **screenshot → critique** visual loop (per the working agreement in `CLAUDE.md`). Every task ends in a commit.

---

## File Structure (what gets created, and why)

```
astro.config.mjs            # Astro config: mdx + tailwind vite plugin
tsconfig.json               # strict TS (from template)
package.json                # deps + scripts
src/
  styles/
    global.css              # @import tailwind; @theme tokens (BOTH palettes); base resets; font-face
  scripts/
    theme.ts                # toggle logic (client JS); unit-tested
    dotField.ts             # hero reactive dot field (client JS); intensity math unit-tested
  layouts/
    BaseLayout.astro        # <head>, meta, fonts, no-flash inline script, slots
  components/
    Header.astro            # site nav + theme toggle button
    Footer.astro            # mailto contact + minimal meta
    ThemeToggle.astro       # button markup; wires to theme.ts
    ProjectCard.astro       # work tile (hairline, md radius, hover lift)
    Prose.astro             # long-form wrapper (max ~68ch, type rhythm)
    DotField.astro          # canvas hero motion; wires to dotField.ts
  content/
    config.ts               # zod schemas for `projects` + `writing`
    projects/               # placeholder .md projects
    writing/                # placeholder .md posts
  pages/
    index.astro             # Home
    work/index.astro        # Work list
    work/[slug].astro       # Project detail
    writing/index.astro     # Writing list
    writing/[slug].astro    # Post detail
    about.astro             # About
public/
  favicon.svg               # placeholder mark
  og-default.png            # placeholder social card (added Task 15)
tests/
  theme.test.ts             # unit test for theme.ts logic
  dotField.test.ts          # unit test for dot intensity falloff
docs/superpowers/plans/     # this plan
```

Design boundaries: tokens live in exactly one file (`global.css`). The only stateful client code lives in exactly one file (`theme.ts`). Content shape is enforced in exactly one file (`content/config.ts`). Pages are thin; reusable markup is in `components/`.

---

## PHASE 0 — Project foundation

### Task 1: Initialize Astro + Tailwind v4 + MDX

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json` (scaffolded), `src/pages/index.astro` (placeholder from template)

- [ ] **Step 1: Scaffold the minimal Astro app into the current directory**

Run (the `.` targets the existing folder; flags make it non-interactive and preserve our `docs/` + `CLAUDE.md`):
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --yes
```
Expected: creates `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/`. If it warns the directory is non-empty, accept continuing — it does not delete `docs/` or `CLAUDE.md`.

- [ ] **Step 2: Add Tailwind v4 and MDX integrations**

Run:
```bash
npx astro add tailwind mdx --yes
```
Expected: installs `@tailwindcss/vite`, `tailwindcss`, `@astrojs/mdx`; edits `astro.config.mjs` to register the Tailwind vite plugin and the mdx integration; creates/points to a global stylesheet. Note: v4 has **no** `tailwind.config.mjs` — config is CSS-first.

- [ ] **Step 3: Install dependencies**

Run:
```bash
npm install
```
Expected: `node_modules/` populated, no peer-dep errors that block build.

- [ ] **Step 4: Verify the dev server boots and build passes**

Run:
```bash
npm run build
```
Expected: `astro build` completes, "Complete!" with at least one page built, zero errors.

- [ ] **Step 5: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Astro + Tailwind v4 + MDX"
```
(Repo isn't initialized yet — `git init` here is correct. If it already exists, drop that part.)

---

### Task 2: Declare design tokens in `global.css` (both palettes)

This is the spine. Tokens mirror `docs/DESIGN_SYSTEM.md` exactly. In Tailwind v4, names under `@theme` auto-generate utilities (e.g. `--color-accent` → `bg-accent`, `text-accent`). Dark values are swapped via a `.dark` class on `<html>`, which the toggle controls.

**Files:**
- Modify: `src/styles/global.css` (replace whatever the integration generated)
- Verify import: `astro.config.mjs` / `BaseLayout` imports this file (done in Task 4)

- [ ] **Step 1: Write `global.css` with full token set, resets, and font-face**

```css
/* src/styles/global.css */
@import "tailwindcss";

/* Dark palette overrides apply when <html class="dark"> is present */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Color — light is the default palette */
  --color-bg: #FFFFFF;
  --color-surface: #F7F7F5;
  --color-text: #16161A;
  --color-text-muted: #6B6B73;
  --color-border: #E6E6E3;
  --color-accent: #2F6BFF;
  --color-accent-hover: #1F54E6;

  /* Type scale (rem) — matches DESIGN_SYSTEM.md */
  --text-xs: 0.8rem;
  --text-xs--line-height: 1.5;
  --text-sm: 0.9rem;
  --text-sm--line-height: 1.6;
  --text-base: 1rem;
  --text-base--line-height: 1.7;
  --text-lg: 1.25rem;
  --text-lg--line-height: 1.5;
  --text-xl: 1.6rem;
  --text-xl--line-height: 1.3;
  --text-2xl: 2.1rem;
  --text-2xl--line-height: 1.2;
  --text-3xl: 2.8rem;
  --text-3xl--line-height: 1.1;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* Font families */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  /* Single allowed soft shadow */
  --shadow-soft: 0 1px 3px rgb(0 0 0 / 0.06);

  /* Content measure */
  --measure: 68ch;
}

/* Dark palette — overrides the color tokens only */
.dark {
  --color-bg: #0B0B0C;
  --color-surface: #161617;
  --color-text: #EDEDED;
  --color-text-muted: #9A9AA2;
  --color-border: #26262A;
  --color-accent: #5B86FF;
  --color-accent-hover: #7CA0FF;
}

/* Base resets / element defaults */
:root { color-scheme: light dark; }

html {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body { margin: 0; }

/* Visible focus ring everywhere — accessibility is a requirement */
:where(a, button, input, textarea, select, [tabindex]):focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Smoke-test that a token utility resolves**

Temporarily edit `src/pages/index.astro` to:
```astro
<html lang="en" class="dark">
  <head><meta charset="utf-8" /></head>
  <body>
    <main class="bg-bg text-text">
      <p class="text-accent text-2xl">token check</p>
    </main>
  </body>
</html>
```

- [ ] **Step 3: Run build to confirm utilities compile**

Run:
```bash
npm run build
```
Expected: build passes. (Visual confirmation happens in Task 4 once BaseLayout imports the stylesheet site-wide.)

- [ ] **Step 4: Revert the smoke-test page**

Restore `src/pages/index.astro` to the template default (Home is built properly in Task 10).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "feat: declare design tokens (light + dark) in global.css"
```

---

### Task 3: Theme toggle logic (`theme.ts`) — TDD

The only stateful client code. Pure, testable functions: resolve the active theme from stored preference + system, and apply it. Logic is unit-tested; DOM wiring is thin.

**Files:**
- Create: `src/scripts/theme.ts`
- Test: `tests/theme.test.ts`
- Add dev dep: `vitest`

- [ ] **Step 1: Add vitest**

Run:
```bash
npm install -D vitest
```
Then add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test**

```ts
// tests/theme.test.ts
import { describe, it, expect } from "vitest";
import { resolveTheme } from "../src/scripts/theme";

describe("resolveTheme", () => {
  it("uses stored preference when present", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });

  it("falls back to system when no stored preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");   // system prefers dark
    expect(resolveTheme(null, false)).toBe("light"); // system prefers light
  });

  it("ignores invalid stored values and uses system", () => {
    expect(resolveTheme("purple", true)).toBe("dark");
  });
});
```

- [ ] **Step 3: Run the test to confirm it fails**

Run:
```bash
npm test
```
Expected: FAIL — `resolveTheme` is not exported / module not found.

- [ ] **Step 4: Implement `theme.ts`**

```ts
// src/scripts/theme.ts
export type Theme = "light" | "dark";
export const STORAGE_KEY = "theme";

/** Pure resolver: stored preference wins, else fall back to system. */
export function resolveTheme(stored: string | null, systemPrefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return systemPrefersDark ? "dark" : "light";
}

/** Apply a theme to the document and persist the explicit choice. */
export function applyTheme(theme: Theme, persist = true): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  if (persist) localStorage.setItem(STORAGE_KEY, theme);
}

/** Read current applied theme from the DOM. */
export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Wire a toggle button. Call once on each page load. */
export function initToggle(button: HTMLElement): void {
  button.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run:
```bash
npm test
```
Expected: PASS — 3 tests green.

- [ ] **Step 6: Commit**

```bash
git add tests/theme.test.ts src/scripts/theme.ts package.json
git commit -m "feat: theme resolver + toggle logic with unit tests"
```

---

### Task 4: BaseLayout (head, meta, fonts, no-flash script, stylesheet)

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}
const { title, description = "Soumyo — Oogway Labs" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Inter via Fontsource is added in Step 2; until then system stack renders -->

    <!-- No-flash: set the theme class BEFORE first paint -->
    <script is:inline>
      (() => {
        try {
          const stored = localStorage.getItem("theme");
          const dark =
            stored === "dark" ||
            (stored !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
          document.documentElement.classList.toggle("dark", dark);
        } catch (_) {}
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Self-host Inter (no external font request)**

Run:
```bash
npm install @fontsource-variable/inter
```
Add to the top of `src/styles/global.css` (after the tailwind import):
```css
@import "@fontsource-variable/inter";
```

- [ ] **Step 3: Use BaseLayout from the Home page as a smoke test**

Replace `src/pages/index.astro`:
```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Soumyo — Oogway Labs">
  <main class="bg-bg text-text min-h-screen px-6 py-24">
    <h1 class="text-3xl font-semibold">Layout works</h1>
    <p class="text-text-muted text-lg mt-4">Token-driven, themed, no-flash.</p>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Run dev server and screenshot to verify no-flash + theming**

Run:
```bash
npm run dev
```
Open the local URL. Verify: page renders with Inter, light by default. Toggle OS dark mode + reload → loads dark with **no white flash**. Take a screenshot of both modes for the visual loop.

- [ ] **Step 5: Run build**

Run: `npm run build` — Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css src/pages/index.astro package.json
git commit -m "feat: BaseLayout with no-flash theme script and self-hosted Inter"
```

---

### Task 5: ThemeToggle + Header (nav)

**Files:**
- Create: `src/components/ThemeToggle.astro`, `src/components/Header.astro`

- [ ] **Step 1: Write ThemeToggle**

```astro
---
// src/components/ThemeToggle.astro
---
<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle color theme"
  class="rounded-md border border-border p-2 text-text-muted transition-colors duration-200 hover:text-text hover:border-text-muted"
>
  <!-- sun (shown in dark) / moon (shown in light) via CSS -->
  <svg class="size-4 hidden dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>
  <svg class="size-4 block dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>
</button>
<script>
  import { initToggle } from "../scripts/theme";
  const btn = document.getElementById("theme-toggle");
  if (btn) initToggle(btn);
</script>
```

- [ ] **Step 2: Write Header**

```astro
---
// src/components/Header.astro
import ThemeToggle from "./ThemeToggle.astro";
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];
const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);
---
<header class="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6">
  <a href="/" class="font-medium text-text">Soumyo</a>
  <nav class="flex items-center gap-6">
    {links.map((l) => (
      <a
        href={l.href}
        aria-current={isActive(l.href) ? "page" : undefined}
        class:list={[
          "text-sm transition-colors duration-200 hover:text-text",
          isActive(l.href) ? "text-text" : "text-text-muted",
        ]}
      >{l.label}</a>
    ))}
    <ThemeToggle />
  </nav>
</header>
```

- [ ] **Step 3: Drop Header into BaseLayout**

In `BaseLayout.astro`, import and render `<Header />` directly above `<slot />` inside `<body>`.

- [ ] **Step 4: Verify in dev + screenshot**

`npm run dev` → confirm nav renders, active link is emphasized, toggle flips theme instantly and persists across reload. Screenshot both themes.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/components/ThemeToggle.astro src/components/Header.astro src/layouts/BaseLayout.astro
git commit -m "feat: header nav with working theme toggle"
```

---

### Task 6: Footer (mailto contact)

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write Footer**

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
---
<footer class="mx-auto mt-24 max-w-[1100px] border-t border-border px-6 py-10">
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-text-muted">© {year} Soumyo · Oogway Labs</p>
    <a
      href="mailto:soumyo@oogwaylabs.com"
      class="text-sm text-accent underline-offset-4 hover:underline"
    >soumyo@oogwaylabs.com</a>
  </div>
</footer>
```

- [ ] **Step 2: Add Footer to BaseLayout** (render directly below `<slot />`).

- [ ] **Step 3: Verify + build**

`npm run dev` to confirm footer renders in both themes; `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: footer with mailto contact"
```

---

## PHASE 1 — Content collections & pages

### Task 7: Content collection schemas — TDD via build

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write the schemas (matches ARCHITECTURE.md content model)**

```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    url: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
```

- [ ] **Step 2: Write one valid + one invalid fixture to prove validation works**

Create `src/content/projects/_schema-check.md` (valid):
```md
---
title: Schema Check
summary: Temporary fixture to verify the projects schema compiles.
date: 2026-06-14
tags: [test]
featured: false
---
Body.
```

- [ ] **Step 3: Run build — schema compiles**

Run: `npm run build`
Expected: PASS, sync of content types succeeds.

- [ ] **Step 4: Prove the schema actually rejects bad data**

Temporarily remove the `summary:` line from `_schema-check.md`, run `npm run build`.
Expected: FAIL with a zod error naming `summary` Required. Then restore the line and delete the fixture file entirely:
```bash
rm src/content/projects/_schema-check.md
```

- [ ] **Step 5: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: zod schemas for projects and writing collections"
```

---

### Task 8: Seed placeholder content

**Files:**
- Create: `src/content/projects/atlas.md`, `src/content/projects/ledger.md`, `src/content/projects/grove.md`
- Create: `src/content/writing/on-minimal-interfaces.md`

- [ ] **Step 1: Write three placeholder projects**

`src/content/projects/atlas.md`:
```md
---
title: Atlas
summary: A spatial knowledge base that turns scattered notes into a navigable map.
date: 2026-04-02
tags: [product, design]
featured: true
url: https://example.com/atlas
---
## Overview
Placeholder copy. Atlas reframes note-taking as wayfinding — replace with the real write-up.

## Role
Design + build. Replace with Soumyo's actual contribution.
```

`src/content/projects/ledger.md`:
```md
---
title: Ledger
summary: Personal finance, reduced to the three numbers that actually matter.
date: 2026-01-18
tags: [product, fintech]
featured: true
---
## Overview
Placeholder copy for Ledger. Swap for the real project narrative.
```

`src/content/projects/grove.md`:
```md
---
title: Grove
summary: A quiet writing surface that gets out of the way.
date: 2025-10-09
tags: [tools]
featured: false
---
## Overview
Placeholder copy for Grove. Replace later.
```

- [ ] **Step 2: Write one placeholder post**

`src/content/writing/on-minimal-interfaces.md`:
```md
---
title: On Minimal Interfaces
description: Why subtraction is the hardest part of interface design.
date: 2026-05-20
draft: false
---
Placeholder essay body. Minimalism is a discipline of removal, not absence — replace with real writing.
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/content/projects src/content/writing
git commit -m "content: seed placeholder projects and one post"
```

---

### Task 9: Reusable components — ProjectCard + Prose

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/Prose.astro`

- [ ] **Step 1: Write ProjectCard (hairline, md radius, hover lift — per DESIGN_SYSTEM.md)**

```astro
---
// src/components/ProjectCard.astro
interface Props {
  href: string;
  title: string;
  summary: string;
  tags?: string[];
}
const { href, title, summary, tags = [] } = Astro.props;
---
<a
  href={href}
  class="group block rounded-md border border-border p-6 transition duration-200 hover:-translate-y-0.5 hover:border-text-muted"
>
  <h3 class="text-lg font-medium text-text">{title}</h3>
  <p class="mt-2 text-sm text-text-muted">{summary}</p>
  {tags.length > 0 && (
    <ul class="mt-4 flex flex-wrap gap-2">
      {tags.map((t) => (
        <li class="text-xs text-text-muted">{t}</li>
      ))}
    </ul>
  )}
</a>
```

- [ ] **Step 2: Write Prose (long-form wrapper, ~68ch measure)**

```astro
---
// src/components/Prose.astro
---
<div class="prose-custom mx-auto" style="max-width: var(--measure)">
  <slot />
</div>
<style is:global>
  .prose-custom { line-height: 1.7; }
  .prose-custom h2 { font-size: var(--text-xl); font-weight: 600; margin: 2.5rem 0 1rem; }
  .prose-custom h3 { font-size: var(--text-lg); font-weight: 600; margin: 2rem 0 0.75rem; }
  .prose-custom p { margin: 1rem 0; }
  .prose-custom a { color: var(--color-accent); text-underline-offset: 4px; }
  .prose-custom a:hover { text-decoration: underline; }
  .prose-custom ul { margin: 1rem 0; padding-left: 1.25rem; list-style: disc; }
</style>
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/components/ProjectCard.astro src/components/Prose.astro
git commit -m "feat: ProjectCard and Prose components"
```

---

### Task 9b: Reactive dot field (hero ambient motion) — TDD on the intensity math

The hero's organic mouse-reactive motion (DECISIONS 2026-06-14). Canvas-based for performance — one `requestAnimationFrame` loop, not a DOM node per dot. The distance→brightness falloff is a pure function, unit-tested. Everything else (canvas sizing, pointer tracking, pause-when-offscreen, theme re-read, reduced-motion guard) is wiring around it.

**Files:**
- Create: `src/scripts/dotField.ts`
- Create: `src/components/DotField.astro`
- Test: `tests/dotField.test.ts`

- [ ] **Step 1: Write the failing test for the falloff math**

```ts
// tests/dotField.test.ts
import { describe, it, expect } from "vitest";
import { dotIntensity } from "../src/scripts/dotField";

describe("dotIntensity", () => {
  it("is 0 at or beyond the influence radius", () => {
    expect(dotIntensity(120, 120)).toBe(0);
    expect(dotIntensity(200, 120)).toBe(0);
  });

  it("is 1 directly under the cursor", () => {
    expect(dotIntensity(0, 120)).toBeCloseTo(1);
  });

  it("uses a smoothstep falloff (0.5 at half radius)", () => {
    expect(dotIntensity(60, 120)).toBeCloseTo(0.5);
  });

  it("decreases monotonically as distance grows", () => {
    expect(dotIntensity(30, 120)).toBeGreaterThan(dotIntensity(90, 120));
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npm test`
Expected: FAIL — `dotIntensity` is not exported / module not found.

- [ ] **Step 3: Implement `dotField.ts`**

```ts
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
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test`
Expected: PASS — all `dotIntensity` tests green (theme tests still pass too).

- [ ] **Step 5: Write the DotField component**

```astro
---
// src/components/DotField.astro
// Decorative hero motion. aria-hidden + pointer-events-none so it never
// interferes with content or assistive tech. Sits behind hero content.
---
<canvas
  id="dot-field"
  aria-hidden="true"
  class="pointer-events-none absolute inset-0 -z-10 h-full w-full"
></canvas>
<script>
  import { initDotField } from "../scripts/dotField";
  const canvas = document.getElementById("dot-field");
  if (canvas instanceof HTMLCanvasElement) initDotField(canvas);
</script>
```

- [ ] **Step 6: Commit** (integration into the hero happens in Task 10)

```bash
git add src/scripts/dotField.ts src/components/DotField.astro tests/dotField.test.ts
git commit -m "feat: reactive hero dot field with unit-tested falloff"
```

---

### Task 10: Home page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write Home (hero + intro + featured work)**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ProjectCard from "../components/ProjectCard.astro";
import DotField from "../components/DotField.astro";
import { getCollection } from "astro:content";

const featured = (await getCollection("projects"))
  .filter((p) => p.data.featured)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Soumyo — Oogway Labs">
  <main class="mx-auto max-w-[1100px] px-6">
    <!-- relative + overflow-hidden contains the absolutely-positioned canvas -->
    <section class="relative overflow-hidden py-24">
      <DotField />
      <div class="relative z-10">
        <h1 class="max-w-[18ch] text-3xl font-semibold leading-tight">
          Building quiet, considered software at Oogway Labs.
        </h1>
        <p class="mt-6 max-w-[60ch] text-lg text-text-muted">
          Placeholder intro. One or two lines on who Soumyo is and what he makes —
          replace with real copy.
        </p>
      </div>
    </section>

    <section class="py-12">
      <div class="mb-8 flex items-baseline justify-between">
        <h2 class="text-xl font-semibold">Selected work</h2>
        <a href="/work" class="text-sm text-accent hover:underline underline-offset-4">All work →</a>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        {featured.map((p) => (
          <ProjectCard href={`/work/${p.slug}`} title={p.data.title} summary={p.data.summary} tags={p.data.tags} />
        ))}
      </div>
    </section>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify + screenshot (visual loop)**

`npm run dev` → check hero rhythm, featured grid, both themes. Move the cursor across the hero: dots should brighten toward accent and scale within ~120px, easing back — subtle, not flashy. Confirm dots sit *behind* the headline (hero text stays crisp and clickable). Toggle theme → dot colors track the palette. Set OS reduced-motion → dots render as a static faint grid with no cursor reaction. Screenshot → critique against `DESIGN_SYSTEM.md` (whitespace generous? one accent? motion subtle enough to be missed until noticed?). Refine `gap`/`radius`/`baseAlpha` if too loud.

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/pages/index.astro
git commit -m "feat: home page with hero and featured work"
```

---

### Task 11: Work index + project detail

**Files:**
- Create: `src/pages/work/index.astro`, `src/pages/work/[slug].astro`

- [ ] **Step 1: Write Work index**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ProjectCard from "../../components/ProjectCard.astro";
import { getCollection } from "astro:content";

const projects = (await getCollection("projects"))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Work — Soumyo">
  <main class="mx-auto max-w-[1100px] px-6 py-16">
    <h1 class="text-2xl font-semibold">Work</h1>
    <p class="mt-3 max-w-[60ch] text-text-muted">Selected projects.</p>
    <div class="mt-10 grid gap-4 sm:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard href={`/work/${p.slug}`} title={p.data.title} summary={p.data.summary} tags={p.data.tags} />
      ))}
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Write project detail with `getStaticPaths`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Prose from "../../components/Prose.astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((p) => ({ params: { slug: p.slug }, props: { project: p } }));
}
const { project } = Astro.props;
const { Content } = await project.render();
---
<BaseLayout title={`${project.data.title} — Soumyo`} description={project.data.summary}>
  <main class="mx-auto max-w-[1100px] px-6 py-16">
    <a href="/work" class="text-sm text-text-muted hover:text-text">← Work</a>
    <header class="mx-auto mt-6" style="max-width: var(--measure)">
      <h1 class="text-2xl font-semibold">{project.data.title}</h1>
      <p class="mt-3 text-lg text-text-muted">{project.data.summary}</p>
      {project.data.url && (
        <a href={project.data.url} class="mt-4 inline-block text-accent hover:underline underline-offset-4">Visit ↗</a>
      )}
    </header>
    <article class="mt-10">
      <Prose><Content /></Prose>
    </article>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify both routes + screenshot**

`npm run dev` → visit `/work` and a detail page. Check both themes, prose measure, back link. Screenshot.

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/pages/work/index.astro src/pages/work/[slug].astro
git commit -m "feat: work index and project detail pages"
```

---

### Task 12: Writing index + post detail

**Files:**
- Create: `src/pages/writing/index.astro`, `src/pages/writing/[slug].astro`

- [ ] **Step 1: Write Writing index (excludes drafts, newest first)**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("writing", ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
const fmt = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
---
<BaseLayout title="Writing — Soumyo">
  <main class="mx-auto max-w-[720px] px-6 py-16">
    <h1 class="text-2xl font-semibold">Writing</h1>
    <ul class="mt-10 divide-y divide-border">
      {posts.map((post) => (
        <li class="py-5">
          <a href={`/writing/${post.slug}`} class="group flex items-baseline justify-between gap-4">
            <span class="text-text group-hover:text-accent">{post.data.title}</span>
            <time class="shrink-0 text-sm text-text-muted">{fmt(post.data.date)}</time>
          </a>
          <p class="mt-1 text-sm text-text-muted">{post.data.description}</p>
        </li>
      ))}
    </ul>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Write post detail**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Prose from "../../components/Prose.astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("writing", ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}
const { post } = Astro.props;
const { Content } = await post.render();
const fmt = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
---
<BaseLayout title={`${post.data.title} — Soumyo`} description={post.data.description}>
  <main class="mx-auto max-w-[720px] px-6 py-16">
    <a href="/writing" class="text-sm text-text-muted hover:text-text">← Writing</a>
    <header class="mt-6">
      <h1 class="text-2xl font-semibold">{post.data.title}</h1>
      <time class="mt-2 block text-sm text-text-muted">{fmt(post.data.date)}</time>
    </header>
    <article class="mt-10"><Prose><Content /></Prose></article>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify + screenshot**, then build + commit:

```bash
npm run build
git add src/pages/writing/index.astro src/pages/writing/[slug].astro
git commit -m "feat: writing index and post detail pages"
```

---

### Task 13: About page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Write About (placeholder bio in Prose)**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Prose from "../components/Prose.astro";
---
<BaseLayout title="About — Soumyo">
  <main class="px-6 py-16">
    <Prose>
      <h1 style="font-size: var(--text-2xl); font-weight:600;">About</h1>
      <p>
        Placeholder bio. Soumyo builds software at Oogway Labs — replace this with
        the real story: background, what he cares about, how to work with him.
      </p>
      <p>Replace with a second paragraph of real biography.</p>
    </Prose>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify + build + commit**

```bash
npm run build
git add src/pages/about.astro
git commit -m "feat: about page"
```

---

## PHASE 2 — Polish

### Task 14: Responsive + visual critique pass

**Files:** any page/component needing adjustment.

- [ ] **Step 1: Screenshot every route at 375px and 1280px** (Home, Work, Work detail, Writing, Writing post, About), both themes.
- [ ] **Step 2: Critique against `DESIGN_SYSTEM.md`** — section rhythm (96–128px desktop / 48–64px mobile), nav wrap on mobile, measure on prose, one-accent rule. Note every deviation.
- [ ] **Step 3:** Optionally invoke the `design:design-critique` skill for a structured pass.
- [ ] **Step 4: Fix deviations**, re-screenshot to confirm.
- [ ] **Step 5: Build + commit**
```bash
npm run build
git add -A
git commit -m "polish: responsive rhythm and visual critique fixes"
```

---

### Task 15: Meta, OG tags, favicon, social card

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`, `public/og-default.png`

- [ ] **Step 1: Add a minimal placeholder `favicon.svg`** (a simple monogram square in `public/`).
- [ ] **Step 2: Add a placeholder `og-default.png`** (1200×630) to `public/`.
- [ ] **Step 3: Extend BaseLayout `<head>`** with Open Graph + Twitter tags driven by `title`/`description` and a canonical URL from `Astro.site`:
```astro
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og-default.png" />
<meta name="twitter:card" content="summary_large_image" />
```
- [ ] **Step 4:** Set `site` in `astro.config.mjs` (placeholder URL until the domain decision is made).
- [ ] **Step 5: Build + commit**
```bash
npm run build
git add -A
git commit -m "feat: meta/OG tags, favicon, placeholder social card"
```

---

### Task 16: Accessibility pass + doc reconciliation

**Files:** components/pages as needed; `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`.

- [ ] **Step 1: Run the `design:accessibility-review` skill** (or manual WCAG AA check): focus visibility on every interactive element, toggle has discernible name, nav landmark + `aria-current`, heading order, AA contrast on `text-muted`.
- [ ] **Step 2: Fix any findings** (e.g. contrast, focus order).
- [ ] **Step 3: Reconcile docs to Tailwind v4 reality.** In `docs/ARCHITECTURE.md` and `docs/DESIGN_SYSTEM.md`, replace `tailwind.config.mjs` references with "tokens live in `src/styles/global.css` under `@theme` (Tailwind v4, CSS-first)." Add a DECISIONS entry dated 2026-06-14 noting the v4 choice and why.
- [ ] **Step 4: Build + commit**
```bash
npm run build
git add -A
git commit -m "a11y: WCAG AA pass; reconcile docs to Tailwind v4"
```

---

### Task 17: Performance check + roadmap update

- [ ] **Step 1: Run `npm run build` then `npm run preview`**, open the preview URL.
- [ ] **Step 2: Run Lighthouse** (Chrome DevTools) on Home and one detail page. Target: Performance/Accessibility/Best-Practices/SEO all ≥ 95. Note that zero-JS pages should trivially hit perf; the toggle script is tiny.
- [ ] **Step 3: Fix any flagged issues** (image dims, missing lang, contrast).
- [ ] **Step 4: Update `docs/ROADMAP.md`** — check off Phase 0 + Phase 1 + completed Phase 2 items.
- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "perf: Lighthouse pass; update roadmap status"
```

---

## Self-Review (completed by plan author)

**Spec coverage** — every locked decision maps to a task: Tailwind v4/tokens (T2), dark-mode toggle + no-flash (T3/T4/T5), reactive hero dot field + reduced-motion/perf guards (T9b, integrated T10), IA Home/Work/Writing/About (T10–T13), mailto contact (T6), content collections (T7/T8), placeholders (T8), accent (T2), accessibility (T2 focus ring + T16), screenshot loop (T4,5,9b,10,11,12,14). Typography-exact-families correctly left OPEN (Inter default, swappable).

**Placeholder scan** — no "TBD/handle edge cases/write tests for the above"; every code step shows complete code; every command shows expected output.

**Type consistency** — `theme.ts` exports (`resolveTheme`, `applyTheme`, `currentTheme`, `initToggle`, `STORAGE_KEY`) are used consistently by ThemeToggle (T5) and the no-flash script reads the same `"theme"` key. `dotField.ts` exports (`dotIntensity`, `initDotField`, `DotFieldOptions`) are consumed by DotField.astro (T9b); the canvas id `dot-field` matches between component and `getElementById`. Schema field names in `content/config.ts` (T7) match frontmatter in T8 and usage in T10–T13 (`title`, `summary`, `date`, `tags`, `url`, `featured`, `description`, `draft`). Slugs via `p.slug` consistent across index + `getStaticPaths`.

**Known risk:** `astro add` / `create astro` interactive prompts can vary by version; if a flag is rejected, fall back to running it interactively and choosing the documented options (minimal template, strict TS, yes to deps).
