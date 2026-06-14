# Vogue Editorial Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rebuild the presentation layer into a Vogue/magazine editorial system — Didone display type, full-bleed full-colour photography, no boxes/cards, a stellar-blue spot colour throughout, CSS parallax, light+dark. Content/infra (Astro 6, collections, identity, a11y) untouched. See spec `docs/superpowers/specs/2026-06-14-vogue-editorial-redesign-design.md`.

**Tech Stack:** Astro 6.4, Tailwind v4 (`@theme` in global.css), Playfair Display + Inter (already self-hosted), vitest, Pillow (placeholder images).

**Branch:** `main`. Git identity is repo-local (Sundharesan Kumaresan / sundharesansk11@gmail.com). Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

## File Structure
```
src/styles/global.css        # + --color-stellar; .dropcap; editorial base
public/img/hero.jpg          # NEW placeholder photos (hero, projects, about)
public/img/atlas.jpg public/img/ledger.jpg public/img/grove.jpg public/img/about.jpg
src/content/projects/*.md    # set cover: /img/<slug>.jpg
src/components/Monogram.astro   # NEW SK. mark (blue dot)
src/components/ParallaxHero.astro # NEW full-bleed bg-fixed hero + name
src/components/WorkEntry.astro    # NEW asymmetric full-bleed project entry
src/components/Figure.astro       # NEW full-bleed article image
src/components/Header.astro        # rebuild: masthead monogram, overlay-on-hero option
src/components/Footer.astro        # rebuild: editorial mailto block
src/components/Prose.astro         # restyle: serif headings, blue drop cap, links
src/components/Kicker.astro        # keep (already exists)
src/layouts/BaseLayout.astro       # + heroOverlay prop
src/pages/index.astro              # rebuild: ParallaxHero + WorkEntry list
src/pages/work/index.astro         # rebuild: WorkEntry list
src/pages/work/[slug].astro        # rebuild: full-bleed cover + Prose + Figure
src/pages/writing/index.astro      # rebuild: editorial contents list
src/pages/writing/[slug].astro     # rebuild: drop-cap article
src/pages/about.astro              # rebuild: portrait spread + pull quote
REMOVE: src/components/ProjectCard.astro, src/components/Hero.astro,
        src/components/FlowField.astro, src/scripts/flowField.ts, tests/flowField.test.ts
docs/                              # CLAUDE.md, DESIGN_SYSTEM, DECISIONS, ARCHITECTURE
```

---

### Task 1: Tokens + editorial base CSS
**Files:** Modify `src/styles/global.css`.
- [ ] Add inside `@theme` (below `--color-accent-hover`): `--color-stellar: #5B86FF;`
- [ ] Append at end of file:
```css
/* Editorial base */
.dropcap > p:first-of-type::first-letter {
  font-family: var(--font-serif);
  font-weight: 700;
  float: left;
  font-size: 3.4em;
  line-height: 0.74;
  margin: 0.04em 0.1em 0 0;
  color: var(--color-stellar);
}
.u-underline { text-decoration: underline; text-decoration-color: var(--color-accent); text-underline-offset: 3px; }
```
- [ ] `npm run build` passes. Commit: `feat: stellar token + editorial base css (dropcap)`.

### Task 2: Placeholder photographs
**Files:** Create `public/img/{hero,atlas,ledger,grove,about}.jpg` via Pillow.
- [ ] Generate 5 distinct editorial placeholders (varied duotone gradients + small "placeholder" label): hero 2000×1500 (deep charcoal/blue), atlas/ledger/grove 1600×1100 (each a different muted hue), about 1300×1600 portrait. Verify each `file` shows JPEG + dims. Commit: `chore: editorial placeholder photographs`.

### Task 3: Wire project covers
**Files:** Modify `src/content/projects/{atlas,ledger,grove}.md`.
- [ ] Add/normalize `cover: /img/<slug>.jpg` to each project's frontmatter. `npm run build` passes (schema allows optional `cover`). Commit: `content: set project cover images`.

### Task 4: Monogram component
**Files:** Create `src/components/Monogram.astro`.
```astro
---
interface Props { tone?: "light" | "ink"; size?: string; }
const { tone = "ink", size = "1.4rem" } = Astro.props;
---
<a href="/" class:list={["font-serif font-bold leading-none", tone === "light" ? "text-white" : "text-text"]} style={`font-size:${size}`} aria-label="Sundharesan Kumaresan — home">SK<span class="text-stellar">.</span></a>
```
- [ ] Build passes. Commit: `feat: SK monogram component`.

### Task 5: BaseLayout heroOverlay + Header + Footer rebuild
**Files:** Modify `BaseLayout.astro`, `Header.astro`, `Footer.astro`.
- [ ] BaseLayout: add `heroOverlay?: boolean` prop, pass to `<Header heroOverlay={heroOverlay} />`.
- [ ] Header: masthead. When `heroOverlay`: `absolute inset-x-0 top-0 z-50` + light tone (monogram tone="light", nav text-white). Else: `sticky top-0 z-50 bg-bg` + ink tone. Nav = Work · Writing · About (Inter, `text-xs uppercase tracking-[0.16em]`), keep ThemeToggle, keep mobile two-row. Monogram replaces text logo.
- [ ] Footer: editorial contact — `font-serif` "Get in touch" (clamp 2–3.5rem), underlined `mailto:sundharesansk11@gmail.com` (stellar underline), small colophon "© {year} Sundharesan Kumaresan", a stellar-blue hairline rule on top.
- [ ] Build passes. Commit: `feat: masthead header + editorial footer + heroOverlay`.

### Task 6: ParallaxHero, WorkEntry, Figure components
**Files:** Create the three.
- [ ] `ParallaxHero.astro`: full-bleed `bg-fixed bg-cover bg-center` with a baked-in gradient scrim over `image`, `min-h-[92vh]`, name "Sundharesan Kumaresan" in Playfair `clamp(2.8rem,10vw,7rem)` flush bottom-left over a `max-w-[1100px]` inner column, kicker above (Inter uppercase tracking, white/80).
- [ ] `WorkEntry.astro` (props href,title,summary,index,image,date): two-column `md:grid-cols-2`, image side is `bg-fixed bg-cover` `h-[44vw] max-h-[520px] min-h-[260px]`, text side has blue `nº NN`, Playfair title `clamp(2rem,4.5vw,3.4rem)` (hover→accent), summary + ` — {year}`. Alternate image left/right by `index % 2` (image gets `md:order-last` on odd). Whole entry is an `<a>`. No box/border.
- [ ] `Figure.astro` (props src,caption?): full-bleed `-mx-[50vw] w-screen` image `max-h-[80vh] object-cover`, optional muted caption centered in the `max-w-[1100px]` column.
- [ ] Build passes (not yet used). Commit: `feat: ParallaxHero, WorkEntry, Figure components`.

### Task 7: Prose restyle (drop cap + editorial)
**Files:** Modify `Prose.astro`.
- [ ] Keep the `max-w: var(--measure)` wrapper but add `class="dropcap"` so the global `.dropcap` rule applies the blue drop cap to the first paragraph. Headings → `font-serif`. Links → underline with stellar colour. Slightly larger body (`text-lg` leading-relaxed).
- [ ] Build passes. Commit: `feat: editorial Prose (blue drop cap, serif headings)`.

### Task 8: Home rebuild
**Files:** Modify `src/pages/index.astro`.
- [ ] Use `BaseLayout` with `heroOverlay`, `<ParallaxHero image="/img/hero.jpg" />`, then a "Selected work" editorial section: heading (Playfair) + the featured projects mapped to `<WorkEntry>` (index 1..n, image from `p.data.cover`), then an "All work →" editorial link. Remove the old grid/ProjectCard. Keep `id="main-content"` on `main`.
- [ ] Build passes; featured Atlas+Ledger render as WorkEntries with covers. Commit: `feat: home — parallax hero + editorial work entries`.

### Task 9: Work index rebuild
**Files:** Modify `src/pages/work/index.astro`.
- [ ] Kicker + giant Playfair "Work"; all projects (newest first) as alternating `<WorkEntry>` (index by position). No grid. Commit: `feat: work index — editorial entries`.

### Task 10: Work detail rebuild
**Files:** Modify `src/pages/work/[slug].astro`.
- [ ] Full-bleed `bg-fixed` cover (`project.data.cover`) with the Playfair title overlaid (huge) + blue dateline; then `<Prose>` body (drop cap) using `render(project)`; "← Work" link; show `project.data.url` as an underlined "Visit ↗". Commit: `feat: work detail — cover spread + drop-cap article`.

### Task 11: Writing index rebuild
**Files:** Modify `src/pages/writing/index.astro`.
- [ ] Kicker + giant Playfair "Writing"; posts (non-draft, newest) as a flush-left **contents list**: each row = blue `nº NN` + Playfair title (clamp) + dateline + one-line description, separated by stellar-blue hairlines (`border-t border-accent/40` or a thin rule). No boxes. Commit: `feat: writing index — editorial contents list`.

### Task 12: Writing detail rebuild
**Files:** Modify `src/pages/writing/[slug].astro`.
- [ ] Kicker "Essay"; huge Playfair title; blue dateline; `<Prose>` (drop cap) via `render(post)`; "← Writing" link. Commit: `feat: writing detail — drop-cap article`.

### Task 13: About rebuild
**Files:** Modify `src/pages/about.astro`.
- [ ] Magazine spread: a large portrait (`/img/about.jpg`, `bg-fixed` or `<img>`) beside Playfair "Sundharesan Kumaresan" + bio column; a Playfair **pull quote** with a stellar-blue left rule; asymmetric, no boxes. Commit: `feat: about — portrait spread + pull quote`.

### Task 14: Remove dead components + flow field
**Files:** Delete `ProjectCard.astro`, `Hero.astro`, `FlowField.astro`, `src/scripts/flowField.ts`, `tests/flowField.test.ts`.
- [ ] `grep -rn "ProjectCard\|FlowField\|flowField" src tests` → empty (fix any stragglers). `npm test` (theme tests pass; 3 tests). `npm run build` passes. Commit: `chore: remove cards + flow field (superseded by editorial redesign)`.

### Task 15: Docs update
**Files:** `CLAUDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`.
- [ ] CLAUDE.md aesthetic line → Vogue editorial. DESIGN_SYSTEM → replace patterns with the Vogue system (display clamp scale, mono+photo+stellar-blue, full-bleed/no-box, monogram, parallax, drop cap, work entry, contents list, pull quote; mark cards removed). DECISIONS → add Decided entries (Vogue pivot supersedes editorial-blend; Didone/Playfair; stellar-blue spot; full-bleed/no-box; CSS parallax + flow field removed; contact=mailto). ARCHITECTURE → update components + `/public/img`. Commit: `docs: record Vogue editorial redesign`.

### Task 16: Visual verification + tuning (controller)
- [ ] Restart dev server; screenshot every screen (home, work, work detail, writing, writing detail, about) in light + dark, desktop + mobile. Verify: no boxes, Didone titles, stellar-blue thread present + AA, full-bleed photos + hero parallax, drop caps, pull quote, no horizontal scroll. Tune scrim/clamp/spacing live. Commit any tuning.

## Self-Review
Spec coverage: type/colour/no-box (T1,4-13), placeholders (T2,3), monogram (T4), header/footer (T5), hero/work/figure (T6), prose dropcap (T7), all 6 screens (T8-13), removal (T14), docs (T15), verify (T16). Stellar-blue appears in monogram dot (T4), work index nº (T6/9), drop cap (T1/7), links (T1), datelines (T10-12), footer rule (T5). Parallax via bg-fixed (T6). No placeholders-in-plan; exact code for the critical components is provided; page code supplied at dispatch. Type consistency: Monogram `text-stellar` ← `--color-stellar` (T1); WorkEntry props match Home/Work usage; covers wired in T3 used by T6/8/9/10.
