# Architecture

How the site is structured. Update when structure changes.

## Planned tree

```
/
├── CLAUDE.md
├── docs/                  # context files (this folder)
├── astro.config.mjs
├── tsconfig.json
├── public/                # static assets served as-is (favicon, og image, fonts)
│   └── img/               # placeholder photographs (hero, atlas, ledger, grove, about) — swap for real shots
└── src/
    ├── content.config.ts  # collection schemas (zod) — Astro v5 location
    ├── content/           # Astro Content Collections
    │   ├── projects/      # one .md/.mdx per project
    │   └── writing/       # blog posts
    ├── components/        # small composable .astro components (no cards — editorial entries only)
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Monogram.astro     # SK. brand mark; trailing dot is stellar-blue
    │   ├── ParallaxHero.astro # full-bleed CSS parallax cover hero (photo + scrim + name)
    │   ├── WorkEntry.astro    # alternating full-bleed photo + serif title + blue nº + dateline
    │   ├── Figure.astro       # full-bleed photograph wrapper (no borders/rounded corners)
    │   ├── Kicker.astro       # editorial eyebrow label (uppercase, letter-spaced)
    │   ├── ThemeToggle.astro
    │   └── Prose.astro    # styled long-form wrapper
    │   # REMOVED: Hero.astro, FlowField.astro, ProjectCard.astro
    ├── layouts/
    │   └── BaseLayout.astro   # <head>, fonts, meta, slots
    ├── pages/             # file-based routing
    │   ├── index.astro        # Home
    │   ├── work/
    │   │   ├── index.astro     # project list
    │   │   └── [slug].astro    # project detail (from content)
    │   ├── about.astro
    │   └── writing/
    │       ├── index.astro     # post list
    │       └── [slug].astro    # post detail (from content)
    ├── scripts/
    │   └── theme.ts       # dark-mode toggle logic (only JS in the project; flowField.ts removed)
    │   # REMOVED: flowField.ts
    └── styles/
        └── global.css     # @theme tokens (Tailwind v4), base resets, font import
```

## Routing

File-based via `src/pages`. Dynamic project pages generated from the `projects` content collection via `getStaticPaths`.

## Content model (draft)

`projects` frontmatter: `title`, `summary`, `date`, `tags[]`, `cover?`, `url?`, `featured?`.
`writing` frontmatter (if used): `title`, `description`, `date`, `draft?`.

Schemas enforced in `src/content.config.ts` with zod so content stays consistent.

## Styling flow

Tailwind v4 (CSS-first): tokens are defined once in `src/styles/global.css` under an `@theme` block. Tailwind reads `@theme` and auto-generates utilities from those variables — there is no `tailwind.config.mjs`. Components use Tailwind utility classes (`text-accent`, `bg-surface`, etc.) that map directly to the `@theme` tokens. No raw hex/px in components.

## Motion

CSS parallax only (`background-attachment: fixed` via Tailwind `bg-fixed`) on full-bleed photo bands (hero, work entries, work-detail cover, about portrait). No canvas or JS animation — the flow-field canvas was removed. The only client JS remaining is the theme toggle. Static on mobile/iOS (acceptable; `bg-fixed` degrades gracefully).

## Data flow

Fully static. No runtime data fetching at launch. Everything resolved at build time from content collections.
