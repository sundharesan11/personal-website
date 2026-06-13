# Editorial Blend + Cover Hero — Design Spec

**Date:** 2026-06-14
**Status:** Approved (pending user review of this doc)
**Supersedes:** parts of the original "clean/minimal" aesthetic decision — see Identity & Doc changes.

## Summary

Evolve the existing minimal portfolio into a **minimal base with an editorial (newspaper) layer**, and replace the placeholder hero with a **full-bleed cover hero**: a photo, a dark scrim, the reactive flow-field animation layered over it (reworked to "extended dots, more random"), and the owner's name in serif with an editorial kicker + dateline. Also corrects the site identity from the wrong "Soumyo — Oogway Labs" to **Sundharesan Kumaresan**.

This is a redesign on top of the completed foundation (branch `build/foundation`). Structure, content collections, theming, routing, a11y, and the build/test pipeline are unchanged; they inherit the new serif headings and editorial touches.

## Locked decisions

- **Site owner / identity:** Sundharesan Kumaresan (the earlier "Soumyo — Oogway Labs" was wrong). Drop "Oogway Labs" branding.
- **Contact email:** `sundharesansk11@gmail.com` (footer mailto).
- **Editorial serif:** Playfair Display, self-hosted via `@fontsource/playfair-display`, as `--font-serif`.
- **Editorial reach:** headings + datelines **site-wide** (serif headings everywhere + kicker labels + datelines + hairline rules). Body/UI stays Inter. Not full multi-column-newspaper.
- **Hero:** cover overlay (option A) — full-bleed photo + dark scrim + flow field + name overlay + kicker/dateline.
- **Hero photo:** a generated placeholder image committed to `/public` (editorial/dark, no licensing concerns); user swaps the real photo at the same path later.
- **Animation:** keep the flow field, layered over the hero photo, reworked to **extended dots** (dots with a short trail) and **more random** (per-particle size/speed/jitter). All prior guarantees kept (reduced-motion off, IntersectionObserver pause, theme-aware, cursor swirl).

## 1. Type system (tokens)

- Install `@fontsource/playfair-display` (variable if available); `@import` it in `global.css` after the Inter import.
- Set `--font-serif: "Playfair Display", ui-serif, Georgia, serif;` in the `@theme` block. Tailwind v4 generates `font-serif` from it.
- Inter (`--font-sans`) remains the default applied on `html`.
- **Serif is applied to:** hero name; all page titles (`h1` on Work/Writing/About + work/post detail titles); section headings (`h2` like "Selected work"); project/post card titles (`h3`) — apply `font-serif` to these.
- **Inter stays for:** body copy, nav, buttons, captions, tags, datelines/kickers (small UI text reads better in sans).

## 2. Cover hero (Home only)

Replaces the current `<section class="relative overflow-hidden py-24">` hero in `src/pages/index.astro`.

**Structure (back-to-front layers):**
1. Full-bleed `<section>` — breaks out of the centered `max-w-[1100px]` column to span the viewport width; height ~`80vh` (min-height ~520px; `70vh` on mobile). Use a full-bleed technique (e.g. `relative left-1/2 -translate-x-1/2 w-screen` or a dedicated full-width wrapper) and `overflow-hidden`.
2. **Photo** — `<img>` (or background) of `/hero-placeholder.webp` (or `.jpg`), `object-cover`, absolute inset-0. `alt=""` (decorative; the name is real text). Real photo swaps at this path.
3. **Scrim** — an absolute gradient overlay for legibility: stronger toward the bottom-left where the name sits. Light mode and dark mode use slightly different scrim opacity so text contrast holds in both (the photo is the same; the scrim adapts).
4. **Flow field** — the existing canvas component, absolute inset-0, above the scrim, below the text (`z` ordering). Tuned to read over a dark scrim (lighter dot colors + stellar blue).
5. **Overlay content** (top `z`, real DOM text):
   - Top row: kicker left ("Selected work"), dateline right ("Portfolio — 2026"). Small Inter, letter-spaced, light color over scrim.
   - Bottom-left block: name "Sundharesan Kumaresan" in Playfair, large (responsive `text-3xl`→bigger on desktop, e.g. a `clamp()`), light color; a hairline rule; a one-line serif/sans subhead ("Designer & builder — quiet, considered software." placeholder copy).

**Accessibility:** the name is real `<h1>` text (not baked into the image); photo `alt=""`; flow-field canvas `aria-hidden`; text contrast against the scrim verified AA in both themes.

Below the hero, the page returns to the normal centered column for "Selected work" (unchanged grid), so the full-bleed hero is the only edge-to-edge element.

## 3. Flow-field rework (`src/scripts/flowField.ts`)

- **Render as extended dots:** instead of a line streak from `(p-v*trail)` to `p`, draw a small filled **dot** at `p` plus a short faded trail (either a short line with low alpha + a dot head, or 2–3 fading dots along the recent path). Net look: a moving dot with a slight comet tail.
- **More random:** give each particle a stable random `size` (e.g. 0.8–2.2px), a random `speedMul` (e.g. 0.7–1.4), and small per-frame jitter on the angle, so the field looks less uniform/mechanical.
- **Over-image legibility:** since it now sits over a dark scrim, bias dot colors lighter (light/white for the muted set, stellar blue for the accent set) and tune alpha so dots read on the photo without fighting the name. (When the component is reused elsewhere on a plain bg, a prop/option controls light-vs-muted base — keep the component configurable.)
- **Unchanged:** pure `flowAngle()` (still unit-tested), reduced-motion static frame, IntersectionObserver pause, theme-aware token re-read, cursor swirl (radial + tangential), DPR cap, single rAF.
- Pure helpers stay testable; add a unit test for any new pure helper (e.g. a deterministic per-index random or a `dotTrail` length function) if introduced.

## 4. Editorial touches (site-wide)

- **Serif headings** (section 1) on all pages.
- **Kicker label:** a small Inter, letter-spaced, muted label above each page `h1` (e.g. "Work", pages get a kicker like "Portfolio —" or a section eyebrow). Reusable snippet/component (e.g. `Kicker.astro` or a shared class).
- **Datelines:** the Writing index + post already show dates; restyle them as editorial datelines (small caps-ish letter-spacing, muted). Work detail can show the project date as a dateline too.
- **Hairline rules:** use the existing `border` token as section dividers / under kickers, sparingly. No heavy rules.
- **Footer:** becomes a light masthead-style line — "Sundharesan Kumaresan" + the mailto, optional "Personal portfolio — 2026". Keep minimal.
- Restraint clause: editorial is a thin layer over the minimal base. No multi-column body, no drop caps on content (that was "full newspaper", not chosen).

## 5. Identity cleanup (replace everywhere)

Replace "Soumyo" / "Soumyo — Oogway Labs" / "Oogway Labs" with "Sundharesan Kumaresan" (or just the name; drop Oogway Labs) in:
- `src/components/Header.astro` logo
- `src/components/Footer.astro` (copyright + change mailto to `sundharesansk11@gmail.com`)
- `src/layouts/BaseLayout.astro` default `description`
- Every page `<title>` (`— Soumyo` → `— Sundharesan Kumaresan`)
- `src/pages/about.astro` placeholder bio copy
- OG/Twitter defaults + the OG card image text (regenerate the placeholder `og-default.png` with the correct name)
- `astro.config.mjs` `site` stays the `example.com` placeholder (domain still open)

## 6. Doc updates

- `CLAUDE.md`: "personal portfolio site for Soumyo (Oogway Labs)" → "...for Sundharesan Kumaresan"; update the aesthetic line from pure "clean/minimal" to "minimal base + editorial layer".
- `docs/DESIGN_SYSTEM.md`: add `--font-serif` (Playfair Display) and the serif-usage rule; add the editorial patterns (kicker, dateline, cover hero, hairline rules); soften the "no decoration" language to allow the editorial layer while keeping the restraint principles.
- `docs/DECISIONS.md`: add Decided entries — identity correction (Sundharesan Kumaresan), editorial-blend pivot (supersedes the "rejected editorial" decision, with why), Playfair Display, cover hero + flow-field-over-photo, contact email. Move "Typography — exact families" from Open to Decided.
- `docs/ARCHITECTURE.md`: note the new hero asset (`/public` photo placeholder) + any new component (`Kicker.astro`).

## 7. Out of scope / unchanged

- Content collections, schemas, routing, theme toggle, dark mode, responsive nav, skip link / a11y structure, unit-test setup. They inherit serif headings + kickers but keep their structure.
- No multi-column article layouts, no drop caps on body content, no header-overlapping-hero (header stays in normal flow above the hero for v1 — overlay-header is a possible later enhancement).
- Real photo, real bio/project/writing copy, domain — still placeholders / open.

## 8. Verification

- `npm run build` passes; `npm test` passes (flow-field pure-fn tests still green; add tests for any new pure helper).
- Visual loop (controller): screenshot Home hero in light + dark, desktop + mobile — confirm name legibility over the scrim/photo (AA), flow-field dots read as extended dots and feel random, kicker/dateline placement, serif headings across pages. Tune scrim/dot alpha live.
- Confirm no "Soumyo"/"Oogway" strings remain (`grep -ri "soumyo\|oogway" src public` → empty).

## Open / deferred (carried)

- Real hero photo (swap at the placeholder path).
- Real bio/project/writing content.
- Domain + hosting (set real `site`).
- Header-overlay-on-cover as a possible later enhancement.
