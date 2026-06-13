# Decisions

Append-only log so context survives across sessions. Two sections:

- **Decided** — locked choices, with date + why + what we rejected.
- **Open / Deferred** — choices deliberately *not* made yet. The agent should consult this and avoid silently picking; pull options up to "Decided" only when actually chosen.

Format each entry: `### [short title] — YYYY-MM-DD`

---

## Decided

### Stack: Astro + Tailwind, static — 2026-06-14
Personal portfolio is content-heavy and low-interactivity. Astro ships near-zero JS by default and Tailwind keeps styling token-driven. **Rejected:** Next.js (heavier than needed for a static portfolio), plain HTML/CSS (loses content collections + componentization).

### Aesthetic: clean / minimal — 2026-06-14
Whitespace-led, near-monochrome + one accent, type-driven. See `DESIGN_SYSTEM.md`. **Rejected:** bold/expressive and editorial directions.

### Content via Astro Content Collections — 2026-06-14
Projects and writing as Markdown/MDX, not hardcoded. Keeps content editable without touching templates.

### Site sections / IA: Home + Work + Writing + About — 2026-06-14
Writing/blog is **in at launch** (not deferred). Launch IA: Home, Work, Writing, About. **Rejected:** minimum-viable Home+Work+About only (Soumyo wants writing surfaced from day one). Contact remains a mailto in the footer, not its own section (see Open).

### Accent color: blue `#2F6BFF` — 2026-06-14
Confirmed the default blue as the single accent (light) / `#5B86FF` (dark). One token — swappable later if it reads too cool against real content. **Rejected:** warmer/quieter accent for now.

### Dark mode at launch (toggle + system default) — 2026-06-14
Ship light **and** dark from day one with a user toggle, defaulting to system preference and persisting choice. Tokens already define both palettes. **Rejected:** light-only-first, system-only-no-toggle. Implication: the toggle needs the one piece of client JS we'll allow, plus an inline no-flash script in `<head>`.

### Build approach: shell-first with placeholders — 2026-06-14
Scaffold structure, layout, and components against the design system using realistic placeholder content; swap in Soumyo's real bio/projects/copy later. **Rejected:** blocking the build on final content. Risk accepted: minor layout rework when real copy lands.

### Tailwind v4 (CSS-first tokens) — 2026-06-14
The Astro Tailwind integration installs Tailwind v4 (`@tailwindcss/vite`), which is CSS-first: design tokens live in `src/styles/global.css` under `@theme` and there is no `tailwind.config.mjs`. This fits the "tokens defined once → CSS variables" principle better than v3. **Rejected:** pinning Tailwind v3 to keep the `tailwind.config.mjs` the older docs referenced. Docs (ARCHITECTURE, DESIGN_SYSTEM) updated to match.

### Hero ambient motion: flow field — 2026-06-14 (supersedes the dot-field choice)
Particles drift continuously along an evolving noise **flow field** behind the hero; near the cursor they are pushed away and **swirl** (radial + tangential force). Rendered as short **line streaks** (not dots), with ~1/3 of them in **stellar blue** (the `accent` token — `#2F6BFF`/`#5B86FF`) and the rest faint muted-gray; streak alpha rises with speed. Canvas-based, single rAF loop. **Why the change:** the earlier reactive dot grid (brightness-only) tested as too tame / not captivating; the flow field is more organic and clearly "shows mouse activity" (the original ask). **Non-negotiables (unchanged):** disabled under `prefers-reduced-motion` (renders one static frame of streaks, no rAF/listeners), GPU-cheap (canvas 2d, capped DPR, particle count scales with area and is capped, paused via IntersectionObserver off-screen), theme-aware (re-reads `--color-accent`/`--color-text-muted` on toggle). **Mobile:** no cursor, but the field keeps drifting on its own so it still reads as alive. **Implementation:** `src/scripts/flowField.ts` (pure `flowAngle()` unit-tested) + `src/components/FlowField.astro`; replaces the removed `dotField.ts`/`DotField.astro`. Stays the second (and only other) piece of client JS after the theme toggle. **Rejected:** reactive dot grid (too tame), magnetic-displacement grid, ripple, ambient glow, drifting blob (all considered; magnetic & ripple were live-prototyped alongside flow before this pick).

---

## Open / Deferred

These are intentionally undecided. Don't lock them in without confirming.

### Typography — exact families
`DESIGN_SYSTEM.md` defaults to Inter. **Open:** keep Inter, or pair a display serif (e.g., editorial heading) while staying minimal? Decide once we see the hero.

### Hosting / deploy target
Vercel vs Netlify vs Cloudflare Pages — all fine for static Astro. **Open:** pick when we're ready to deploy.

### Domain
**Open:** which domain (oogwaylabs subdomain, personal domain, etc.)?

### Analytics
**Open:** none, or a privacy-friendly option (Plausible/Umami) later.

### Contact mechanism
**Open:** mailto link vs. a form (form needs a serverless endpoint / form service).
