# CLAUDE.md

Root context for this project. Keep this file **lean** — it loads every turn. Detail lives in `docs/`; this is a map, not the territory.

## What this is

A personal portfolio site for Sundharesan Kumaresan. Aesthetic: **Vogue/magazine editorial** — black-and-white Didone display type at extreme scale, full-bleed full-colour photography, no boxes or cards, asymmetric flush-left composition, and a single **stellar-blue** spot colour threaded throughout (monogram dot, index numbers, links, rules, drop caps). Three themes: light, cream, dark. Content-first. Structured as a publication with one running order: Home (threshold + featured piece) · Now/Work (role feature) · Writing (three lenses + a being-written desk; a fourth lens is parked in DECISIONS) · Reading (scatter gallery) · To (the future desk, incl. iyal, the active research thread) · Modelling · About (long-read), with Contact in the footer and a rotating-cube ≡ menu. Owner: Sundharesan Kumaresan, AI engineer at Oogway Labs (employer, not the masthead).

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
npm run new        # scaffold a writing/reading entry (schema-correct frontmatter)
npm run publish    # build gate -> commit -> push (see docs/WRITING_WORKFLOW.md)
```

## Conventions

- **Design tokens are law.** Never hardcode colors, spacing, font sizes, tracking, or motion values — use the tokens in `docs/DESIGN_SYSTEM.md` (defined in the `@theme` block of `src/styles/global.css`, Tailwind v4 CSS-first). If a value isn't a token, add it to the system first. No inline `style="font-size: …"` in pages.
- Components are small, composable `.astro` files. Reach for client JS only when interaction demands it (`client:*` directives, sparingly).
- Content (copy, projects, posts) lives in Markdown/MDX via Astro Content Collections, not hardcoded in templates.
- Accessibility is a requirement, not a pass: semantic HTML, visible focus states, AA contrast.
- Keep it boring and consistent. Minimal design dies by a thousand one-off exceptions.

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
- `docs/WRITING_WORKFLOW.md` — how to write & publish (npm run new / publish, draft states)
- `docs/ROADMAP.md` — phases and status
