# CLAUDE.md

Root context for this project. Keep this file **lean** — it loads every turn. Detail lives in `docs/`; this is a map, not the territory.

## What this is

A personal portfolio site for Sundharesan Kumaresan. Aesthetic: **minimal base with an editorial (newspaper) layer** — generous whitespace and a restrained palette, with serif display type (Playfair Display), kicker eyebrows, datelines, hairline rules, and a full-bleed cover hero. Content-first.

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

## Conventions

- **Design tokens are law.** Never hardcode colors, spacing, or font sizes — use the tokens in `docs/DESIGN_SYSTEM.md` (mirrored in `tailwind.config`). If a value isn't a token, add it to the system first.
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

- `docs/DESIGN_SYSTEM.md` — tokens, type, spacing, components, do/don't
- `docs/DECISIONS.md` — decision log (Decided + Open/Deferred)
- `docs/ARCHITECTURE.md` — structure, routing, content model
- `docs/ROADMAP.md` — phases and status
