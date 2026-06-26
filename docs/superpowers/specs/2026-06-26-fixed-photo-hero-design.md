# Fixed-photo hero reveal — design

**Date:** 2026-06-26
**Status:** Approved (pending spec review)
**Pages:** Home (`/`), About (`/about`)

## What we're building

A scroll effect on the Home and About heroes where the **portrait photo stays
fixed** while the page content scrolls up and **over** it. The technical name is
a **fixed-background reveal** — the degenerate case of parallax where the
background's scroll velocity is exactly zero.

The hero keeps its current **two-column composition** (text left, photo right).
On scroll:

- the **left column** (name, kicker, bio) **scrolls away** with the page,
- the **photo holds**, pinned to the viewport,
- the content below **rises and covers** the photo (opaque), then the page
  continues normally.

This is "variant 2" from brainstorming: only the photo is fixed; the name
scrolls.

## The mechanic — pure CSS, no JavaScript

No scroll listeners, no `client:*` directives. Three stacked layers:

1. **Page background** — `--color-bg` on `<html>`, as today (bottom of the stack).
2. **The photo** — a `position: fixed` element pinned to the top. It sits
   *above* the page background but *below* the content (`z-index` between them).
   - Desktop: occupies the right half of the viewport (the hero's right column),
     `height: 100vh` (or the hero height), `object-fit: cover`.
   - Mobile: full-bleed (`100vw`) — see Responsive below.
3. **The content** — normal document flow with an **opaque `bg-bg` background**,
   sitting above the photo (`z-index` higher than the photo).
   - The hero's **left column has a transparent background** so the fixed photo
     shows through on the right.
   - A **spacer** reserves the hero's vertical space (since the fixed photo is
     out of flow) so layout doesn't jump.
   - Everything **below the hero is opaque** (`bg-bg`), so as it scrolls up it
     covers the photo. Once covered, the photo is simply behind opaque content.

Because the photo is `position: fixed`, it never moves — the page slides over it.
There is no "release"; the photo stays fixed but becomes hidden behind the
opaque content that has scrolled over it.

### Layering summary (z-index, low → high)

| Layer | Element | Background | z-index |
|-------|---------|-----------|---------|
| Page | `<html>` | `--color-bg` (opaque) | auto |
| Photo | fixed `<img>` wrapper | the image | `0` (above page bg) |
| Hero left column | name / kicker / bio | **transparent** | `1` |
| Body content | sections below hero | `bg-bg` (**opaque**) | `1` |

The hero left column and body content share the same stacking context above the
photo; the body's opaque background is what covers the photo on scroll.

## Component

Create one reusable component: **`src/components/FixedPhotoHero.astro`**.

- **Props:** `image: string`, `alt: string`, optional `objectPosition` (default
  `center 22%`, matching today's hero).
- **Slot:** default `<slot />` for the left-column content.
- **Renders:**
  - the fixed photo layer,
  - the hero region: left column (slot, transparent) + right-column spacer that
    reserves the photo's width on desktop,
  - leaves the rest of the page (passed as normal page content after the
    component) to scroll over the fixed photo.

This replaces the current `src/components/ParallaxHero.astro`. Home and About
each pass their own left-column markup into the slot:

- **Home:** kicker (`AI engineer · writer · Oogway Labs`) + name + (optional bio
  lines), exactly the current `ParallaxHero` left column.
- **About:** the top bar (`The long version` / `AI engineer · writer`) + name +
  the intro sentence. The long-form `<Prose>` and the rest follow as page
  content that scrolls over the photo.

`ParallaxHero.astro` is deleted once both pages migrate. (`index.astro` imports
`ParallaxHero`; `about.astro` currently inlines its image and header — both move
to `FixedPhotoHero`.)

## Responsive

- **Desktop (`md+`):** two-column. Photo fixed to the right half; left column
  scrolls over the page background; body content covers the photo.
- **Mobile (`< md`):** **full-bleed fixed photo.** The photo pins full-width
  behind a transparent hero zone (name over / below it as today's order), and
  the name + body content scroll up and over it. Effect is preserved on phones.
  - iOS Safari note: use a `position: fixed` element, **not**
    `background-attachment: fixed` (which is janky/unsupported on iOS). Verify in
    the preview at mobile width.

## Accessibility & motion

- **`prefers-reduced-motion`:** **keep the reveal.** The photo is fixed but
  nothing auto-animates — it only moves in response to the user's own scroll, so
  it is not a true animation. No special fallback.
- Semantic structure unchanged: `<h1>` for the name, real `<img>` with `alt`,
  visible focus states preserved. The fixed photo is decorative-but-meaningful
  (the portrait) and keeps its descriptive `alt`.
- Contrast: the name sits on `--color-bg` (left column over page background), not
  on the photo, so existing AA contrast is preserved. No text-over-photo.

## Design tokens

No new tokens. Uses existing `--color-bg` (opaque cover layer), the type classes
(`t-head`, etc.), and existing spacing utilities. No hardcoded colors.

## Out of scope

- Parallax with non-zero velocity (the photo does not move slower/faster — it is
  fully fixed).
- Applying the effect to other pages (Work, Writing, Reading, To, Modelling).
- Any change to the cube menu, header, or footer behavior.

## Verification

After build, in the preview (`preview_start` → screenshot/scroll):

1. Desktop: photo stays fixed on the right while the left column scrolls away and
   body content rises over the photo.
2. Mobile width (`preview_resize`): full-bleed fixed photo, content scrolls over.
3. Dark + cream themes: the opaque cover layer uses the correct `--color-bg` per
   theme (no photo bleeding through covered content).
4. No layout jump at the hero boundary (spacer reserves space correctly).
5. No console errors; no client JS shipped for this feature.
