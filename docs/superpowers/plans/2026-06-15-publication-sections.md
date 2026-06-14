# Publication Sections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Expand to the full publication (Home · Now/Work · Writing · Reading · Ambitions · About + footer Contact), add the rotating-cube ≡ menu and the Modern↔Evening Edition toggle (Writing), retire the projects gallery. All placeholder copy. See spec `docs/superpowers/specs/2026-06-15-publication-sections-design.md`.

**Stack:** Astro 6.4, Tailwind v4 (`@theme` in global.css), Playfair Display + Inter, content collections. Branch `main`. Identity repo-local. Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

Design system in play: Didone display (font-serif) at clamp() sizes, Inter (font-sans) small, stellar-blue accent (`text-stellar`/`border-stellar`, `--color-stellar`), full-bleed/no-box, light+dark. `Kicker.astro` (text, tone) exists; `Prose.astro` (dropcap) exists; `Monogram.astro`, `ThemeToggle.astro` exist; `.dropcap` global rule exists.

---

## Batch 1 — content model + retire projects
- [ ] `src/content.config.ts`: extend `writing` schema with `lens: z.enum(["economics","philosophy","technical","theatrical"])`, `status: z.enum(["published","writing"]).default("published")`, `featured: z.boolean().default(false)`, `cover: z.string().optional()`. Add a `reading` collection (glob `./src/content/reading`): `{ title, author, note, status: z.enum(["read","on-deck"]), opened: z.string(), cover: z.string().optional(), link: z.string().optional(), order: z.number().default(0) }`. Remove the `projects` collection definition.
- [ ] Remove projects: `git rm -r src/content/projects src/pages/work/[slug].astro src/components/WorkEntry.astro`.
- [ ] Update existing writing post `src/content/writing/on-minimal-interfaces.md` frontmatter: add `lens: technical`, `status: published`, `featured: true`. Seed 3 more writing placeholders across lenses (economics, philosophy, theatrical) — 2 published + 1 `status: writing` (desk). Seed 4 reading placeholders under 2 `opened` groups.
- [ ] `npm run build` passes. Commit "feat: publication content model (writing lenses/status, reading); retire projects".

## Batch 2 — cube menu + header/footer/baselayout
- [ ] `src/scripts/cube.ts`: export `initCube()` — wires the `#cube-trigger` button to open/close `#cube-menu` overlay (toggle `hidden`/`aria-expanded`), Escape + backdrop close, move focus to the close button on open & restore on close. No rotation logic needed (CSS handles spin); just open/close + focus + reduced-motion class. Keep it small.
- [ ] `src/components/CubeMenu.astro`: a fixed overlay `#cube-menu` (hidden by default) with a dark backdrop; a CSS 3D cube (`transform-style:preserve-3d`, 6 faces each an `<a>` to Home/Work/Writing/Reading/Ambitions/About, slow `@keyframes` rotate via a scoped `<style>`); a close `<button>`; and a plain `<ul>` nav list of the same links below the cube (the accessible fallback). Reduced-motion: `@media (prefers-reduced-motion: reduce)` stops the spin. Include the `<script>` importing initCube.
- [ ] `src/components/Header.astro`: expand nav links to Now/Work(`/work`,"Now / Work"), Writing, Reading, Ambitions, About; add a `≡` `#cube-trigger` button (aria-controls, aria-expanded=false, aria-label) next to ThemeToggle. Keep responsive two-row + heroOverlay tones.
- [ ] `src/components/Footer.astro`: add a row of social links — GitHub · LinkedIn · X (placeholder href `#`), stellar-blue `u-underline`, plus the existing mailto.
- [ ] `src/layouts/BaseLayout.astro`: render `<CubeMenu />` once before `</body>`; add the edition no-flash inline script in `<head>` (reads `localStorage("edition")`, sets `data-edition` on `<html>`, default "modern").
- [ ] Build passes; cube overlay present in output. Commit "feat: rotating cube menu + expanded nav + social footer".

## Batch 3 — edition toggle + writing rework
- [ ] `src/scripts/edition.ts`: export `initEdition(button)` — toggles `data-edition` between "modern"/"evening" on `document.documentElement`, persists in `localStorage("edition")`, updates the button label/pressed state.
- [ ] `src/components/EditionToggle.astro`: a small control (two-state button or segmented) "Edition — Modern / Evening"; `<script>` imports initEdition. Reads current `data-edition` on load.
- [ ] `src/styles/global.css`: append `[data-edition="evening"]` overrides scoped to a `.writing-page` wrapper — deep ground `#0E0E12`, warm text `#E8E4DA`, serif body for `.prose-custom` (font-serif), larger leading, a bigger blue drop cap. (Modern = default, no override.) Ensure AA.
- [ ] `src/pages/writing/index.astro`: wrap in `.writing-page`; Kicker + Didone "Writing" + `<EditionToggle />`; a featured block (first `featured` post: image/title/dek); essays grouped by lens (Economics/Philosophy/Technical/Theatrical) as editorial contents lists (blue nº, Didone title, dateline, dek, hairline rules) filtering `status:published`; a "Being written" desk section listing `status:writing` posts with a status tag instead of a date.
- [ ] `src/pages/writing/[slug].astro`: wrap in `.writing-page`; add `<EditionToggle />` near the header; rest as the existing drop-cap article.
- [ ] Build passes. Commit "feat: Modern/Evening edition toggle + four-lens writing index".

## Batch 4 — Now/Work + Home teaser + About
- [ ] `src/components/FactsRail.astro` (props: items: {label,value}[]) — small stellar-blue labels + values, flush list.
- [ ] `src/pages/work/index.astro`: REPLACE the projects list with the Now/Work feature — Kicker "The present", Didone title "Now", one full-bleed/`bg-fixed` placeholder image (`/img/work.jpg` — generate or reuse), 2 placeholder paragraphs (Oogway Labs, applied AI, safe register), and `<FactsRail items={[{Role},{What I build},{How I work}]} />`.
- [ ] `src/components/TeaserIndex.astro` (props: items: {href,label,hook,n}[]) — "Inside this edition": flush-left rows, blue nº, Didone title, one-line hook, hairline rules.
- [ ] `src/pages/index.astro`: after the hero, add a short intro + a Didone **standfirst** line, then `<TeaserIndex>` with 4 hooks (Now/Work, Writing, Reading, Ambitions). Remove the old "Selected work"/WorkEntry block.
- [ ] `src/pages/about.astro`: expand to the long-read — portrait (`/img/about.jpg`) + Didone name, the fairness-&-legibility through-line in `Prose` (a couple of placeholder paragraphs), keep the pull quote, add contact pointers (email/GitHub/LinkedIn).
- [ ] Generate `public/img/work.jpg` placeholder (Pillow) if reused path needed. Build passes. Commit "feat: Now/Work feature, Home inside-this-edition, About long-read".

## Batch 5 — Reading + Ambitions
- [ ] `src/pages/reading/index.astro`: Kicker "The reading room" + Didone "Reading". Pull `reading` collection; group by `opened`. Render each group as a **scatter** (asymmetric: alternating left/right offsets / varied margins, NOT a uniform grid) of entries — Didone title + author + honest note + a `read`/`on-deck` tag (stellar-blue for on-deck). Clickable when `link` present.
- [ ] `src/pages/ambitions.astro`: Kicker "The future desk" + a stellar-blue **"forming — intentions, not yet built"** notice; Didone "Ambitions"; the agri-fintech thesis (Didone subheads + Prose: problem → why → shape, placeholder); an "Other ideas" flush list (placeholder); a "Social Writing" manifesto block. All placeholder, clearly labelled.
- [ ] Build passes; `/reading` + `/ambitions` generated. Commit "feat: Reading scatter gallery + Ambitions op-ed".

## Batch 6 — docs
- [ ] Update `CLAUDE.md` (IA line → the 7-section publication), `docs/ARCHITECTURE.md` (routes/components/collections/scripts; projects removed; cube+edition added), `docs/DECISIONS.md` (append: publication IA; cube menu; Modern/Evening edition; projects retired; Oogway = employer not masthead), `docs/ROADMAP.md` (sections + pointer to `docs/plan-and-todo.md` for owner to-do). Build passes. Commit "docs: record publication sections expansion".

## Verification (controller)
- [ ] Restart dev server; screenshot Home, Now/Work, Writing (Modern + Evening), Reading, Ambitions, About in light + dark, desktop + mobile. Open the cube menu (spin + Escape + keyboard). Confirm: no boxes, Didone titles, stellar-blue thread, full-bleed photos, no horizontal scroll, AA in Evening. Tune + commit.

## Self-review
Covers all spec sections: content model (B1), cube (B2), edition+writing (B3), Now/Work+Home+About (B4), Reading+Ambitions (B5), docs (B6). Projects retirement in B1. Identity (Oogway=employer) in copy + docs. Stellar-blue thread via teaser nº, facts labels, status tags, drop caps, social links. New JS: cube.ts, edition.ts (+ existing theme.ts). Accessibility: cube focus/Escape/list-fallback, edition/theme no-flash, AA Evening.
