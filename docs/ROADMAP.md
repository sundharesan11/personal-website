# Roadmap

Status: `[ ]` todo · `[~]` in progress · `[x]` done

## Publication sections — built (placeholder copy) — 2026-06-15

All six publication sections are scaffolded with placeholder copy and real component structure:
- **Home** — threshold page with "Inside this edition" teaser index (`TeaserIndex.astro`)
- **Now/Work** — single role feature page (confidentiality-safe; no client/project names)
- **Writing** — four lenses (Economics · Philosophy · Technical · Theatrical) + being-written desk + Modern↔Evening edition toggle (`EditionToggle.astro` + `src/scripts/edition.ts`)
- **Reading** — scatter gallery grouped by "what each opened" (`reading` content collection)
- **Ambitions** — "forming" op-ed (agri-fintech thesis, other ideas, Social Writing manifesto)
- **About** — long-read format
- **Cube menu** — rotating 3D ≡ overlay linking all six destinations (`CubeMenu.astro` + `src/scripts/cube.ts`)

Owner content/asset work (real copy, photos, writing pieces, reading list) tracked in `docs/plan-and-todo.md` (Part B / C).

## Phase 0 — Context & foundations
- [x] Scaffold context files (CLAUDE.md, docs/)
- [x] Confirm open decisions worth resolving now (IA, dark mode, accent) — see DECISIONS 2026-06-14
- [x] `npm create astro@latest` + add Tailwind (v4, CSS-first — see DECISIONS)
- [x] Wire tokens into `src/styles/global.css` `@theme` (light + dark)
- [x] Theme toggle: no-flash inline script + persisted preference
- [x] BaseLayout + Header (nav + toggle) + Footer (mailto contact)

## Phase 1 — Core pages (placeholder content, shell-first)
- [x] Home (hero, intro, featured work) + reactive flow-field hero motion
- [x] Work index + project detail (content collection)
- [x] Writing index + post detail (content collection)
- [x] About
- [x] Seed 2–3 placeholder projects + 1 placeholder post

## Phase 2 — Polish
- [x] Responsive pass (mobile rhythm, two-row nav)
- [x] Accessibility pass (focus, contrast, semantics, toggle a11y, skip link) — one open AA call: light-accent link contrast (see DECISIONS Open)
- [ ] Design critique pass — use `design-critique` skill
- [x] Meta/OG tags, favicon, social card
- [~] Performance check (Lighthouse) — static + near-zero JS; run Lighthouse in-browser before deploy
- [ ] Swap placeholder content → Soumyo's real bio/projects/copy

## Phase 3 — Optional / later
- [ ] Analytics
- [ ] Contact form (upgrade from mailto)
- [ ] Deploy + custom domain (set real `site` in astro.config.mjs — currently example.com placeholder)

> Decisions about scope live in `docs/DECISIONS.md` (Open / Deferred). Don't expand scope without logging it there.
