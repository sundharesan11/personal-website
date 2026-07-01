# AGENTS.md

Root context for Codex and other coding agents working on this project. Keep this file **lean** because it loads every turn. Detail lives in `docs/`; this is a map, not the territory.

## What this is

A personal portfolio site for Sundharesan Kumaresan. Aesthetic: **Vogue/magazine editorial** — black-and-white Didone display type at extreme scale, full-bleed full-colour photography, no boxes or cards, asymmetric flush-left composition, and a single **stellar-blue** spot colour threaded throughout (monogram dot, index numbers, links, rules, drop caps). Light + dark. Content-first. Structured as a publication: Home (threshold) · Now/Work (role feature) · Writing (three live lenses + a being-written desk, with a Modern↔Evening edition toggle) · Reading (scatter gallery) · To (future desk, with `/ambitions` as an alias) · About (long-read), with Contact in the footer/cube menu and a rotating-cube ≡ menu. Owner: Sundharesan Kumaresan, AI engineer at Oogway Labs (employer, not the masthead).

## Stack

- **Astro** + **Tailwind CSS**
- Static output (SSG), deployable to any static host (Vercel/Netlify/Cloudflare Pages)
- TypeScript where it earns its keep; no heavy client JS unless a feature needs it

## Commands

```bash
npm install        # install deps
npm run dev        # local dev server
npm run build      # production build -> ./dist
npm run preview    # preview the build
```

## Codex operating loop

1. Start by reading the relevant docs, especially `docs/DESIGN_SYSTEM.md`, `docs/VOICE.md`, `docs/ARCHITECTURE.md`, and `docs/DECISIONS.md`.
2. For non-trivial UI or feature work, state the approach before building. Keep the plan short and concrete.
3. Make scoped changes that follow existing Astro component patterns. Prefer content collections for copy/content over hardcoded page data.
4. After UI changes, run a tight visual loop: start the dev server, inspect the page, screenshot or otherwise verify the result, then refine.
5. Before calling work done, run the smallest meaningful verification, usually `npm run build` and `npm test` when scripts or behavior changed.

## Conventions

- **Design tokens are law.** Never hardcode colors, spacing, or font sizes. Use the tokens in `docs/DESIGN_SYSTEM.md`, implemented in `src/styles/global.css` under `@theme`. If a value is not a token, add it to the system first.
- Components are small, composable `.astro` files. Reach for client JS only when interaction demands it (`client:*` directives, sparingly).
- Content (copy, projects, posts) lives in Markdown/MDX via Astro Content Collections, not hardcoded in templates.
- Accessibility is a requirement, not a pass: semantic HTML, visible focus states, AA contrast.
- Keep it boring and consistent. Minimal design dies by a thousand one-off exceptions.

## Codex guardrails

- Use `rg` / `rg --files` for repo search.
- Use `apply_patch` for manual edits.
- Do not overwrite or revert user changes unless explicitly asked.
- Do not introduce card chrome, rounded images, shadows, extra accent colours, or one-off decorative styling.
- Do not add global dependencies unless the feature clearly needs them.
- If a design token is missing, add it in `src/styles/global.css` under `@theme` and document the choice.
- Keep copy in the voice from `docs/VOICE.md`: first person, concrete, crisp, dry-witted where it earns it.
- Avoid em dashes in site copy.

## Working agreement (read before non-trivial work)

1. **Check `docs/DESIGN_SYSTEM.md`** before building any UI.
2. **Log decisions** in `docs/DECISIONS.md` — every non-trivial choice. Use the *Open / Deferred* section to park things deliberately left undecided rather than silently picking.
3. **Plan before building.** For new sections/features, propose an approach first.
4. **Tight visual loop.** After building UI, screenshot → critique → refine.

## Docs index

- `docs/VOICE.md` — site voice & character (ALL copy in this register: casual, dry-witted, storyteller)
- `docs/DESIGN_SYSTEM.md` — tokens, type, spacing, components, do/don't
- `docs/DECISIONS.md` — decision log (Decided + Open/Deferred)
- `docs/ARCHITECTURE.md` — structure, routing, content model
- `docs/ROADMAP.md` — phases and status
