# Vogue Editorial Redesign — Design Spec

**Date:** 2026-06-14
**Status:** Approved (auto-approved per session goal)
**Supersedes:** the "editorial-blend" cards-on-minimal direction. This is a full presentation-layer rebuild.

## Summary

Rebuild the portfolio's look into a **Vogue/magazine editorial** system: black-and-white **Didone** type at extreme scale, **full-bleed full-colour photography**, asymmetric flush-left composition, and **no cards/boxes/borders/rounded corners** anywhere. A single **stellar-blue spot colour** threads through every page (monogram dot, index numbers, links, hairline rules, drop caps). Both light and dark themes remain (toggle kept). Motion is **pure-CSS parallax** on full-bleed photos; the flow-field animation is removed. Astro 6 + content collections + identity (Sundharesan Kumaresan) + a11y are untouched underneath.

Reference studied: Wix "Street Artist Portfolio (Industrial)" — monogram masthead, full-bleed photography, huge grotesque titles, underline-only forms, stark grounds, vast negative space. We adopt its *structure* (full-bleed, no boxes, scale contrast, monogram) with a **Didone (Vogue) type voice** instead of grotesque, plus a stellar-blue accent.

## Locked decisions (recommended defaults, per goal)

- **Display type:** Playfair Display (already self-hosted; Didone family) for all display — name, section titles, work/post titles, drop caps. Inter for body, nav, kickers, datelines, meta. (Not switching to Bodoni Moda — Playfair is sufficient and already loaded.)
- **Colour system:** ink = black/white (theme-dependent); photographs carry colour; **stellar blue** is the one accent, used throughout. Accent token stays `#1F54E6` (light, AA for small text) / `#5B86FF` (dark); the brighter `#5B86FF` may be used for large/decorative blue moments in light mode too.
- **Themes:** keep light + dark with the existing toggle + no-flash script. The dark-ground hero photo reads in both; editorial sections invert ground with theme.
- **Layout:** full-bleed, asymmetric, flush-left, generous negative space. **No** cards, borders, shadows, rounded corners. Hairline rules (stellar blue or border token) only where editorially meaningful.
- **Motion:** pure-CSS parallax via `bg-fixed` (`background-attachment: fixed`) on full-bleed photo bands (hero + work entries). Zero new JS. Static on mobile/iOS (acceptable). The only client JS remains the theme toggle.
- **Contact:** a bold editorial mailto block (big "Get in touch" + underlined email). A functional form is out of scope (needs a backend/serverless).
- **Imagery:** generated **placeholder photographs** committed to `/public` (hero, one per project, an About portrait, optional writing cover), swappable at the same paths. Real photography later.
- **Removed:** `ProjectCard.astro` (boxes), `Hero.astro` (cover/flow-field), `FlowField.astro`, `src/scripts/flowField.ts`, `tests/flowField.test.ts`. Kept in git history. `theme.ts` + its tests stay.

## Type & token system (`src/styles/global.css`)

- Keep `--font-sans` (Inter) and `--font-serif` (Playfair Display).
- Add a **display scale** for the magazine sizes (huge): introduce utility-friendly tokens or rely on `clamp()` inline. Define a `--display` clamp helper pattern in docs; in markup use `clamp()` for hero/section titles (e.g. name `clamp(2.6rem, 9vw, 6.5rem)`, section title `clamp(2.4rem, 7vw, 5rem)`, work title `clamp(2rem, 4vw, 3.25rem)`).
- Colour tokens: keep `--color-bg/surface/text/text-muted/border`; keep `--color-accent` (stellar blue) `#1F54E6`/`#5B86FF`, `--color-accent-hover`. Add `--color-stellar: #5B86FF` for the bright decorative blue used in both themes (monogram dot, large numerals).
- Retire card/shadow usage: remove `--shadow-soft` reliance; no component should use shadows or rounded corners (radius tokens may remain but go unused on editorial surfaces).
- Add base editorial CSS: links default to underlined ink with stellar-blue on hover (or stellar-blue underline); a `.parallax` helper = `bg-fixed bg-cover bg-center`; a `.dropcap` first-letter rule (serif, large, stellar blue).

## Components

- **Header** → magazine masthead: monogram `SK` (Playfair) + a stellar-blue dot, top-left; nav top-right (Work · Writing · About), Inter small, letter-spaced; theme toggle. Transparent over the hero on Home (light text), solid on inner pages. Sticky.
- **Footer** → editorial contact: large Playfair "Get in touch", underlined `sundharesansk11@gmail.com`, small colophon (© year · Sundharesan Kumaresan), stellar-blue hairline.
- **Monogram.astro** (NEW) → the `SK.` mark with blue dot, reused in header + section corners.
- **Kicker.astro** (keep) → small uppercase letter-spaced label; gains an optional stellar-blue variant.
- **WorkEntry.astro** (NEW) → a full-bleed asymmetric project entry: large `bg-fixed` photo on one side, big Playfair title + stellar-blue index (`nº 01`) + blurb + dateline on the other; alternates image left/right by index parity. No box.
- **Figure.astro** (NEW) → full-bleed image with an optional small caption; used in article bodies.
- **Prose.astro** (restyle) → editorial article body: generous measure, serif headings, **drop cap** (stellar blue) on the first paragraph, full-bleed `Figure` support.
- **ParallaxHero.astro** (NEW) → full-bleed `bg-fixed` photo hero + scrim + monogram + huge Playfair name + kicker/dateline. Replaces the removed cover `Hero.astro`.

## Pages

1. **Home** (`index.astro`) — `ParallaxHero` (name) → "Selected work" editorial: `WorkEntry` list (featured projects, alternating), each full-bleed with parallax photo + serif title + blue index. A closing "All work →" editorial link. No grid of cards.
2. **Work index** (`work/index.astro`) — giant Playfair "Work" + kicker; all projects as `WorkEntry` rows (alternating), newest first.
3. **Work detail** (`work/[slug].astro`) — full-bleed `bg-fixed` cover photo with the title overlaid (Playfair, huge) + dateline; then `Prose` body (drop cap) with `Figure` images; "← Work" editorial back link.
4. **Writing index** (`writing/index.astro`) — Playfair "Writing" + kicker; a **contents list**: each post a flush-left row with a blue `nº`, big Playfair title, dateline, one-line description, separated by stellar-blue hairlines. No boxes.
5. **Writing detail** (`writing/[slug].astro`) — Playfair title (huge), dateline, `Prose` with blue drop cap; "← Writing" back link.
6. **About** (`about.astro`) — magazine spread: large portrait photo (one side) + Playfair "Sundharesan Kumaresan" + bio in a column + a Playfair **pull quote** with a stellar-blue rule. Asymmetric.
7. **Contact** — folded into the footer (editorial mailto block); no separate page/route.

All pages: monogram masthead header + editorial footer via `BaseLayout`. Titles in Playfair, body in Inter, stellar-blue accents throughout, full-bleed imagery, no boxes.

## Identity & content

- Keep "Sundharesan Kumaresan" everywhere (already swept). Page `<title>`s unchanged in identity.
- Placeholder copy stays (clearly labelled). Project frontmatter already has `cover?` — populate each project's `cover` with its generated placeholder image path so `WorkEntry` and detail covers resolve. Add a `cover` to the writing post too (schema already optional for projects; for writing, add an optional `cover` to the schema if needed for the post hero — OR writing uses no cover image, just type; **decision:** writing stays type-only, no cover, to differentiate from work).

## Motion & accessibility

- Parallax = `bg-fixed`; no JS. Respect `prefers-reduced-motion` by not relying on motion for meaning (parallax is decorative; fine if static).
- Maintain: semantic headings (one `h1`/page), skip link + `#main-content`, visible focus rings, AA contrast (blue-on-white small text uses `#1F54E6`; white-on-photo uses a scrim verified AA; large blue can be `#5B86FF`). Photos decorative → `alt=""`; real content images later get real alt.
- Keep dark/light no-flash toggle.

## Out of scope / deferred

- Real photography (swap placeholders), real bio/project/writing copy.
- Functional contact form (needs backend).
- Domain + hosting (`site` still `example.com`).
- Truer Vogue face (Bodoni Moda) — possible later font swap.
- JS-driven scroll parallax / reveal animations — only if pure-CSS proves insufficient.

## Doc updates (part of the build)

- `CLAUDE.md` aesthetic line → "Vogue/magazine editorial: Didone display, full-bleed colour photography, no boxes, stellar-blue spot colour, light+dark."
- `docs/DESIGN_SYSTEM.md` → replace the editorial-blend patterns with the Vogue system (display scale, mono+photo+stellar-blue, full-bleed/no-box rules, monogram, parallax, drop cap, work entry, editorial list, pull quote). Mark cards as removed.
- `docs/DECISIONS.md` → new Decided entries: Vogue editorial pivot (supersedes editorial-blend), Didone voice (Playfair), stellar-blue spot colour, full-bleed/no-box, CSS parallax (flow field removed), contact = mailto.
- `docs/ARCHITECTURE.md` → update components (remove ProjectCard/Hero/FlowField; add Monogram/WorkEntry/Figure/ParallaxHero), note `/public` placeholder images.

## Verification

- `npm run build` passes; `npm test` passes (theme tests; flow-field tests removed).
- Visual loop (controller): every screen in light + dark, desktop + mobile — confirm no boxes/cards remain, Didone titles render, stellar-blue thread is present and AA-legible, full-bleed photos + hero parallax read, no horizontal scroll, drop caps + pull quote land.
- `grep -rin "ProjectCard\|flowField\|FlowField" src` → empty.
