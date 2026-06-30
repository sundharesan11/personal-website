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
    │   ├── writing/       # blog posts (lens, status, featured, cover fields added)
    │   └── reading/       # reading entries (new collection)
    │   # REMOVED: projects/ collection
    ├── components/        # small composable .astro components (no cards — editorial entries only)
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Monogram.astro     # SK. brand mark; trailing dot is stellar-blue
    │   ├── FixedPhotoHero.astro # frame-clipped fixed portrait for Home
    │   ├── ParallaxHero.astro # legacy split photo hero (kept until unused cleanup)
    │   ├── Figure.astro       # full-bleed photograph wrapper (no borders/rounded corners)
    │   ├── Kicker.astro       # editorial eyebrow label (uppercase, letter-spaced)
    │   ├── ThemeToggle.astro
    │   ├── Prose.astro        # styled long-form wrapper
    │   ├── CubeMenu.astro     # rotating-cube ≡ overlay menu (6 faces = 6 destinations)
    │   ├── EditionToggle.astro # Modern↔Evening reading-mode toggle (Writing pages only)
    │   ├── FactsRail.astro    # sidebar facts/pull-quotes rail
    │   └── TeaserIndex.astro  # "Inside this edition" teaser index (Home)
    │   # REMOVED: Hero.astro, FlowField.astro, ProjectCard.astro, WorkEntry.astro
    ├── layouts/
    │   └── BaseLayout.astro   # <head>, fonts, meta, slots
    ├── pages/             # file-based routing
    │   ├── index.astro        # Home (threshold + teaser index)
    │   ├── work/
    │   │   └── index.astro    # Now/Work — single role feature page
    │   ├── writing/
    │   │   ├── index.astro    # Writing index — four lenses + being-written desk
    │   │   └── [slug].astro   # Post detail (from content)
    │   ├── reading.astro      # Reading — scatter gallery grouped by "what each opened"
    │   ├── iyal.astro         # Standalone active farmer-capital-network research/product page
    │   ├── contact.astro      # General Web3Forms contact page
    │   ├── ambitions.astro    # Ambitions — "forming" op-ed
    │   └── about.astro
    ├── scripts/
    │   ├── theme.ts       # dark-mode toggle logic
    │   ├── cube.ts        # cube menu: auto-spin, Escape/backdrop close, focus management
    │   └── edition.ts     # edition toggle: Modern↔Evening reading mode, no-flash inline read
    │   # REMOVED: flowField.ts
    └── styles/
        └── global.css     # @theme tokens (Tailwind v4), base resets, font import
```

## Routing

File-based via `src/pages`. Routes: `/` (Home), `/work` (Now/Work role feature), `/writing` (Writing index), `/writing/[slug]` (post detail from `writing` collection), `/reading` (scatter gallery), `/iyal` (active farmer-capital-network research/product page), `/contact` (general Web3Forms contact page), `/ambitions` (forming op-ed), `/about`. The `/work/[slug]` project detail route was REMOVED along with the `projects` collection.

## Content model

`writing` frontmatter: `title`, `description`, `date`, `draft?`, `lens` (Economics | Philosophy | Technical | Theatrical), `status` (published | being-written), `featured?`, `cover?`.
`reading` frontmatter: `title`, `author`, `date`, `what_it_opened`, `cover?`, `notes?`.

Schemas enforced in `src/content.config.ts` with zod so content stays consistent. The `projects` collection and its schema were REMOVED.

`gallery` collection (`src/content/gallery/*.md`) powers Home's Frames (kind: frame) and Sketchbook (kind: doodle). To add one: drop an image in `public/img/home/` and create a markdown file with frontmatter `kind`, `image`, `caption`, optional `credit`/`link`, and `order`.

## Styling flow

Tailwind v4 (CSS-first): tokens are defined once in `src/styles/global.css` under an `@theme` block. Tailwind reads `@theme` and auto-generates utilities from those variables — there is no `tailwind.config.mjs`. Components use Tailwind utility classes (`text-accent`, `bg-surface`, etc.) that map directly to the `@theme` tokens. No raw hex/px in components.

Special brand exception: `/iyal` uses `--font-script` (Sacramento via Fontsource) for the lowercase blue `iyal` wordmark only.

## Motion

CSS-only photo motion. Home uses `FixedPhotoHero.astro`: a frame-clipped fixed background on the portrait side of the hero, so the image stays visually fixed while scrolling but only paints inside the frame. The Home image side is wider than the text side and anchors the image right so the full portrait fits. About keeps its earlier two-column editorial portrait frame with the real image ratio. Both use `/img/hero-crop.jpeg` with full-image containment rather than the old zoomed PNG crop. Other photo bands may use CSS parallax (`background-attachment: fixed` via Tailwind `bg-fixed`). No canvas or JS animation — the flow-field canvas was removed. Three pieces of client JS: `theme.ts` (dark-mode toggle), `cube.ts` (rotating-cube ≡ menu, slow auto-spin, static under `prefers-reduced-motion`), and `edition.ts` (Modern↔Evening edition toggle, Writing pages only, no-flash inline read).

## Data flow

Fully static. No runtime data fetching at launch. Everything resolved at build time from content collections.
