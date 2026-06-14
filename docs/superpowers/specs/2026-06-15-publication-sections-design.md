# Publication Sections — Design Spec

**Date:** 2026-06-15
**Status:** Approved (forks decided by owner)
**Builds on:** the Vogue editorial system (Didone display, full-bleed photography, no boxes, stellar-blue spot colour, light+dark). Source: `docs/plan-and-todo.md` (owner's section plan).

## Summary

Expand the site from 4 sections into a full **publication**: Home · Now/Work · Writing · Reading · Ambitions · About, with site-wide Contact in the footer. Add a **rotating-cube ≡ menu** (global overlay, with a plain-nav fallback) and a **Modern↔Evening Edition toggle** scoped to the literary (Writing) pages. All sections built with clearly-labelled placeholder copy the owner replaces later.

**Identity:** Sundharesan Kumaresan — "AI engineer at Oogway Labs · writer · founder-in-waiting." Oogway Labs is the **employer** (appears in Now/Work + identity line), not the masthead. Masthead stays "SK." / the name.

## Forks (decided)

- **Scope:** all 7 sections now, placeholder copy.
- **Cube menu:** build the rotating-cube ≡ overlay now (+ plain nav alongside, accessible).
- **Edition toggle:** build Modern↔Evening on Writing pages now (separate axis from global light/dark).
- **Now/Work:** role feature only — **retire the projects gallery** (remove `projects` collection usage, `/work/[slug]`, `WorkEntry`, `ProjectCard` already gone; Home's "Selected work" replaced by "Inside this edition").

## Information architecture & routes

| Section | Route | Nav label |
|---|---|---|
| Home | `/` | (monogram = home) |
| Now / Work | `/work` | Now / Work |
| Writing | `/writing` (+ `/writing/[slug]`) | Writing |
| Reading | `/reading` | Reading |
| Ambitions | `/ambitions` | Ambitions |
| About | `/about` | About |
| Contact | footer (site-wide) | — |

Header nav lists all five + the monogram (home) + theme toggle + the **≡ cube trigger**.

## Sections — design

### Home — the threshold
- Split hero (existing): kicker = identity one-liner ("AI engineer at Oogway Labs · writer · founder-in-waiting"); name in Didone; portrait right.
- Below: a 2–3 sentence intro + one **standfirst** (a bold Didone curiosity-gap line).
- **"Inside this edition"** — an editorial index of 3–4 teaser links (Now/Work, Writing, Reading, Ambitions), each a flush-left row with blue `nº`, big Didone title, and a one-line hook. No metrics/bio/lead story. Thin.

### Now / Work — the present (feature spread)
- Page `/work` (single feature, NOT a list). Kicker "The present"; Didone title (e.g. "Now").
- One strong image (placeholder), 2 short paragraphs on craft at Oogway Labs (applied AI: reliability, evals, guardrails).
- A **facts rail** (`FactsRail`): Role · What I build · How I work — small stellar-blue labels with short values, flush-right or as a sidebar column.
- Confidentiality-safe register in the placeholder copy (no client names).

### Writing — four lenses (editorial index + Edition toggle)
- Kicker "Notes"; Didone "Writing"; the **EditionToggle** (Modern / Evening) top-right of the page.
- **Featured piece** (image + Didone headline + dek) when one is `featured`.
- Essays grouped by **lens**: Economics · Philosophy · Technical/AI · Theatrical — each group a labelled section, entries as the editorial contents list (blue `nº`, Didone title, dateline, dek, hairline rules).
- **Being-written desk** — entries with `status: writing`, shown with a "forming / drafting / editing" status tag, dateline reads the status (not a date).
- Content model: `writing` gains `lens` (enum), `status` (published|writing), `featured` (bool), optional `cover`. `description` = the dek.

### Reading — the reading room (scatter gallery)
- New `reading` collection. Kicker "The reading room"; Didone "Reading".
- Books grouped by **what each opened up** (`opened` field), NOT genre. Each group a labelled cluster.
- **Scatter gallery:** an asymmetric, non-grid arrangement — each book = a cover/spine image (placeholder) or title set in Didone, an honest **note**, and a **read / on-deck** tag. Clickable if a link exists. Deliberately irregular placement (varied offsets), no uniform grid.
- Schema: title, author, note, status (read|on-deck), opened (group), optional cover, optional link.

### Ambitions — the future desk (op-ed)
- New page `/ambitions`. Mandatory **"intentions — not yet built"** notice (a stellar-blue dateline reading "forming").
- The **agri-fintech venture as a thesis**: problem → why it matters → rough shape (op-ed-scale long-form, Didone headings + prose).
- **Other ideas** — a plain flush-left list (placeholder titles + one-liners).
- **Social Writing manifesto** — a short manifesto block (thinking-in-public), no metrics.

### About — the long version
- Expand existing `/about`: portrait (the real hero photo or a second placeholder) + Didone name; the **through-line** (*fairness & legibility — who a system sees, who it leaves out*); a **pull quote** (have); career history folded in as biography; contact pointers (email, GitHub, LinkedIn/X).

### Contact — footer, site-wide
- Extend the editorial footer: keep "Get in touch →" mailto; add **GitHub · LinkedIn · X** text links (placeholder handles), stellar-blue underlines.

## Special features

### ≡ Rotating cube menu (`CubeMenu.astro` + `src/scripts/cube.ts`)
- A `≡` button in the header (aria-expanded, aria-controls="cube-menu", aria-label "Open menu").
- Opens a full-screen fixed overlay (`#cube-menu`) with a dark backdrop; a **3D CSS cube** centered (`transform-style: preserve-3d`), **6 faces** = the 6 destinations (Home, Now/Work, Writing, Reading, Ambitions, About). Slow auto-rotation (CSS keyframes rotateX/rotateY). Each face is an `<a>`.
- Below the cube: a **plain text list** of the same links — the reliable, accessible nav (cube is the decorative centrepiece).
- Close via an X button, `Escape`, or backdrop click. Move focus into the overlay on open, restore on close; `Escape` always closes.
- `prefers-reduced-motion`: no auto-rotation (static cube), list still works.
- The header's plain text nav remains alongside (plan: "a plain text nav always works alongside it"). The cube is additive delight. This is the 2nd–3rd piece of client JS (theme toggle, cube, edition).

### Modern ↔ Evening Edition toggle (`EditionToggle.astro` + `src/scripts/edition.ts`)
- Only on Writing pages (index + detail). A small control "Edition — Modern / Evening".
- Sets `data-edition="modern|evening"` on `documentElement`, persisted in `localStorage("edition")`, with a no-flash inline read (like theme).
- **Modern** (default) = the normal editorial look (respects the global light/dark theme).
- **Evening** = an atmospheric reading mode for writing pages: forces a deep ground (`#0E0E12`), warm-paper text, **serif body** (Playfair/serif instead of Inter for prose), larger blue drop cap, increased leading, subtle vignette — overriding the page ground. Scoped via `[data-edition="evening"]` CSS rules applied on writing pages only.
- Separate axis from the global light/dark toggle; both can be present on writing pages.

## Content model changes (`src/content.config.ts`)

- `writing` schema += `lens: z.enum(["economics","philosophy","technical","theatrical"])`, `status: z.enum(["published","writing"]).default("published")`, `featured: z.boolean().default(false)`, `cover: z.string().optional()`. (`description` stays = dek.)
- New `reading` collection (glob `src/content/reading`): `{ title, author, note, status: enum(read|on-deck), opened: string, cover?: string, link?: string, order?: number }`.
- `projects` collection: **retired** — remove its content files, the `/work/[slug]` route, and `WorkEntry.astro`. (Keep the collection definition out, or leave empty; remove usages.)

## Components (new / changed)

- New: `CubeMenu.astro`, `EditionToggle.astro`, `FactsRail.astro`, `TeaserIndex.astro` (Inside this edition), `ReadingGallery.astro` (or inline), `Standfirst` (inline).
- New scripts: `src/scripts/cube.ts`, `src/scripts/edition.ts`.
- Changed: `Header.astro` (expanded nav + ≡ trigger), `Footer.astro` (social links), `BaseLayout.astro` (mount CubeMenu once + edition no-flash inline), `index.astro` (TeaserIndex), `writing/index.astro` (lenses + desk + featured + EditionToggle), `writing/[slug].astro` (edition), `about.astro` (long-read), `content.config.ts`.
- Removed: `WorkEntry.astro`, `src/pages/work/[slug].astro`, `src/content/projects/*`.

## Accessibility & motion

- Cube overlay: focus management + Escape + visible focus; plain list is the real nav; reduced-motion disables spin.
- Edition/theme: no-flash inline scripts; AA contrast in every mode (Evening deep ground + warm text verified ≥4.5:1).
- All new type uses the Didone/Inter system; stellar-blue thread continues (teaser `nº`, facts-rail labels, status tags, drop caps, social links).
- Semantic headings (one h1/page), keyboard-operable toggles.

## Out of scope / deferred

- Real copy, real photography (placeholders throughout), real reading/writing entries.
- Domain, hosting, RSS/sitemap/llms.txt, analytics, newsletter (owner's to-do D/E).
- JSON-LD / SEO acceptance checklist (later).

## Doc updates (part of build)

- `CLAUDE.md` (IA line), `docs/ARCHITECTURE.md` (routes/components/collections), `docs/DECISIONS.md` (publication IA, cube menu, edition toggle, projects retired, Oogway = employer), `docs/ROADMAP.md` (sections + owner to-do pointer to `plan-and-todo.md`).

## Verification

- `npm run build` + `npm test` green; every route renders; no `projects`/`WorkEntry` refs remain.
- Visual: each section light + dark, desktop + mobile; cube opens/spins/closes + keyboard; Evening edition on writing reads atmospherically + AA; no horizontal scroll; stellar-blue thread present throughout.
