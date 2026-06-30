# iyal Standalone Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/iyal` page for the active farmer capital network research/product flow.

**Architecture:** Add one static Astro page, reuse the existing BaseLayout and editorial patterns, add a single font token for the approved Sacramento wordmark, and link the page from `/to`.

**Tech Stack:** Astro, Tailwind CSS v4 CSS-first tokens, Fontsource, static SSG.

## Global Constraints

- `iyal` is always lowercase.
- The `iyal` wordmark uses Sacramento and blue.
- Do not add cards, rounded panels, shadows, canvas, or extra accent colours.
- Add `iyal` beside `SK.` in the global header.
- Do not list `iyal` inside `/to`.
- Do not add `iyal` to the cube menu in this pass.
- Contact CTA uses the existing email address: `sundharesansk11@gmail.com`.

---

### Task 1: Add Sacramento As A Design Token

**Files:**
- Modify: `src/styles/global.css`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `--font-script`, available to Astro/Tailwind utility classes as `font-script`.

- [x] **Step 1: Install dependency**

Run: `npm install @fontsource/sacramento`

Expected: `@fontsource/sacramento` appears in `dependencies`.

- [x] **Step 2: Import the font and expose token**

Add `@import "@fontsource/sacramento/400.css";` to `src/styles/global.css`.

Add `--font-script: "Sacramento", cursive;` inside the `@theme` block.

- [x] **Step 3: Verify token compiles**

Run: `ASTRO_TELEMETRY_DISABLED=1 npm run build`

Expected: build completes with `/iyal` included after Task 2.

### Task 2: Build The Standalone Page

**Files:**
- Create: `src/pages/iyal.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `font-script`, `text-accent`, existing editorial spacing utilities.
- Produces: route `/iyal`.

- [x] **Step 1: Create the Astro page**

Create `src/pages/iyal.astro` with structured arrays for exploration themes, principles, questions, and contributor types.

- [x] **Step 2: Add hero and body sections**

Render the lowercase blue Sacramento `iyal` wordmark, agriculture coordination thesis, validation-first sections, and mailto CTA.

- [x] **Step 3: Keep page static**

No client script, form backend, or runtime data fetching.

### Task 3: Promote iyal To The Header

**Files:**
- Modify: `src/pages/to/index.astro`
- Modify: `src/components/Header.astro`

**Interfaces:**
- Consumes: `/iyal` route and `font-script`.
- Produces: top-header `iyal` link beside `SK.`.

- [x] **Step 1: Add `iyal` to the header**

Add a blue Sacramento `iyal` link beside `SK.` with `href="/iyal"`.

- [x] **Step 2: Remove `iyal` from `/to`**

Keep `/to` focused on future/forming items only.

### Task 4: Update Project Docs And Verify

**Files:**
- Modify: `docs/DECISIONS.md`
- Modify: `docs/ARCHITECTURE.md`

**Interfaces:**
- Produces: durable context for future agents.

- [x] **Step 1: Log the `iyal` decision**

Add a `Decided` entry documenting `/iyal`, lowercase naming, Sacramento, and blue wordmark.

- [x] **Step 2: Update architecture routes**

Add `/iyal` to the route list.

- [x] **Step 3: Run verification**

Run:

```bash
npm test
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

Expected: tests pass and the build includes `/iyal/index.html`.
