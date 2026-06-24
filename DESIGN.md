---
name: Sundharesan Kumaresan
description: A magazine whose only subject is one person, set in black-and-white Didone editorial dress with a single stellar-blue spot colour.
colors:
  stellar: "#5B86FF"
  accent: "#1F54E6"
  accent-hover: "#163CAE"
  ink: "#16161A"
  muted: "#6B6B73"
  bg: "#FFFFFF"
  surface: "#F7F7F5"
  border: "#E6E6E3"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(3rem, 9vw, 7rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "normal"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.8rem, 5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.05
  body:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.18em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
spacing:
  measure: "68ch"
components:
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.ink}"
  link-inline:
    textColor: "{colors.accent}"
  index-row:
    textColor: "{colors.ink}"
    padding: "2rem 0"
---

# Design System: Sundharesan Kumaresan

## 1. Overview

**Creative North Star: "A Magazine of One"**

This is a personal portfolio dressed as an editorial publication whose only subject is one person. It borrows the grammar of a fashion magazine, black-and-white Didone display type at extreme scale, flush-left asymmetric composition, full-bleed photography where a photo earns its place, generous whitespace, and threads a single stellar-blue spot colour through the whole thing like a signature. The feeling is confident, dry, and human: a publication put together by someone who knows the work is good and refuses to be pompous about it.

It rejects the entire visual language of the personal-website default. No grid of project cards, no skills bars, no "passionate developer" hero. No SaaS landing scaffolding (hero-metric blocks, gradient CTAs, feature grids, "trusted by" logos). No flashy scroll-jacking or motion that performs instead of serves. And critically, nothing that implies its owner is a designer, illustrator, or visual artist: imagery is photographic or typographic, never decorative craft.

Depth comes from type scale, hairline rules, and whitespace, not from boxes, cards, or shadows. The page is a composition, not a container of widgets.

**Key Characteristics:**
- Black-and-white editorial base, one stellar-blue spot colour, nothing else
- Didone (Playfair Display) display type, flush-left, set large
- No boxes, no cards, no decorative shadows; hairline rules and whitespace do the work
- Three maintained themes (light, dark, cream/day) at AA contrast
- Honesty as a design value: empty states are shown empty, never faked

## 2. Colors

A monochrome black-and-white system carrying exactly one chromatic voice: stellar blue.

### Primary
- **Stellar Blue** (#5B86FF): The single spot colour, used sparingly as signature: the monogram dot, hairline marks (the To header line, the scroll-progress bar), the drop cap, large display emphasis, and any kicker set over a dark photo hero (where the bright blue is the legible choice). Its rarity is the entire point.
- **Link Accent** (#1F54E6 light & cream / #5B86FF dark): The deeper, AA-safe blue. Carries all small interactive and label text on light and cream backgrounds, inline links, kickers, section tags, Nº indices, datelines, where #5B86FF would fail contrast. In dark mode accent and stellar converge on #5B86FF, so dark mode is visually unchanged. Hover deepens to #163CAE (light).

### Neutral
- **Ink** (#16161A light / #EDEDED dark / #3B342B cream): Primary text.
- **Muted** (#6B6B73 light / #9A9AA2 dark / #756B5B cream): Secondary text, kickers, datelines, captions. Verify it clears 4.5:1 on its background.
- **Background** (#FFFFFF light / #0B0B0C dark / #F3EBDD cream): Page surface.
- **Surface** (#F7F7F5 light / #161617 dark / #EAE0CF cream): Rare raised tone; mostly unused by doctrine.
- **Border** (#E6E6E3 light / #26262A dark / #DCD0BD cream): Hairline rules and dividers only.

### Named Rules
**The One Voice Rule.** Stellar blue appears on a small fraction of any screen. It is a signature, not a palette. If a screen has stellar in three or more roles at once, cut one.

**The Black-and-White Rule.** The base is genuinely monochrome. Colour beyond the single blue is forbidden; warmth and mood are carried by photography and type, never by tinting the neutrals.

**The Legible Blue Rule.** Small text is never #5B86FF on a light or cream background (it fails AA at 3.3:1 and 2.8:1). Small blue text uses the accent (#1F54E6, AA-safe); #5B86FF is reserved for large display, non-text marks, and text over dark backgrounds.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body / Label Font:** Inter Variable (with system-ui, sans-serif fallback)

**Character:** A high-contrast Didone serif set against a clean grotesque sans. The pairing is pure editorial: the serif shouts the headlines, the sans handles everything that has to be read or scanned. Contrast on a serif-vs-sans axis, never two similar families.

### Hierarchy
- **Display** (600, clamp up to 7rem on most pages, 0.9 line-height): Page titles and the home name. Flush-left, set large.
- **Headline** (600, clamp(1.8rem, 5vw, 3rem), 1.05): Section titles, standfirsts, pull-lines.
- **Body** (400, 1.0-1.25rem, 1.7 line-height): Prose. Measure capped at 60-68ch.
- **Label / Kicker** (400, 0.8rem, 0.18em tracking, uppercase): The masthead label row, section tags, datelines. The one sanctioned uppercase element.

### Named Rules
**The Masthead Rule.** Most section pages open with one masthead unit: a grey hairline rule, a label row (descriptor left, stellar tag right), then the oversized serif title. It is a deliberate brand system, not a per-section eyebrow. (Now/Work and Modelling vary it; To replaces it with the title joined by a stellar line to "Forming".)

**The No-Em-Dash Rule.** Em-dashes appear nowhere on the site, including in published fiction. Use commas, colons, parentheses, or full stops. Hyphens in compounds are fine.

## 4. Elevation

Flat by doctrine. The system uses no card shadows and no decorative depth. The single defined shadow token (`--shadow-soft: 0 1px 3px rgb(0 0 0 / 0.06)`) is essentially unused. Depth and separation are conveyed entirely by hairline borders, whitespace, and type scale, plus one piece of literal depth: the full-bleed photo heroes (Now/Work, Home) which use a dark gradient scrim and CSS parallax (`background-attachment: fixed`).

### Named Rules
**The Flat Rule.** Surfaces are flat at rest and flat on hover. If a thing needs to feel separated, use a hairline rule or more whitespace, never a shadow or a card.

### Scrims & Overlays
Dark overlays are intentional system values (not palette drift): the photo-hero gradient scrim (`rgba(0,0,0,.72 / .42 / .22)`), the modal backdrop (`rgba(0,0,0,0.5)`), and the cube faces (`rgba(14,14,20,0.66)`, `rgba(10,10,14,0.7)`). They sit outside the monochrome token palette by design, for text-over-photo legibility and modal dimming.

## 5. Components

The component set is deliberately tiny. This is a publication, not an app: there are no buttons-as-CTAs, no input fields, no cards.

### Navigation
- **Style:** Inter, uppercase, 0.16em tracking, small. Default muted (#6B6B73), hover/active ink. Active page carries `aria-current`.
- **Hover:** an underline draws in left-to-right (`.u-draw`, a 1px accent line scaling on hover), with a reduced-motion fallback.
- **Mobile:** the text nav is hidden; navigation is the rotating-cube drawer only (the `≡` trigger opens a right-side panel). The 3D cube is hidden below the `sm` breakpoint, leaving a clean text list of Home + six sections.

### Links (inline)
- **Style:** Accent blue (#1F54E6), no underline at rest; the `.u-draw` underline animates in on hover/focus. Visible focus ring everywhere (2px accent outline, 2px offset).

### Index Row (signature component)
- The contents index, the writing-lens cards, and the To ambition cards are all the same pattern: a full-width link row separated by a top/bottom hairline, with a flush-left serif title, a right-aligned stellar tag or `Nº` index, and a one-line muted teaser. Hover shifts the title to accent. No background, no border beyond the hairline, no card.

### Empty Frame (signature component)
- The Modelling page's honest placeholder: a 4:5 hairline-bordered rectangle with a small stellar corner mark and the label "No photo yet". A component that exists to be honest about absence rather than fake content.

### Theme toggle
- A small bordered icon button cycling light → dark → cream, persisted to `localStorage`, with no-flash inline scripts that set the theme class before first paint.

## 6. Do's and Don'ts

### Do:
- **Do** keep stellar blue to a small fraction of any screen (The One Voice Rule). Monogram dot, tags, index numbers, drop caps, one rule.
- **Do** compose flush-left and asymmetric, with large Didone titles and generous whitespace.
- **Do** convey depth with hairline rules and space, and reserve full-bleed photography for pages where the image is the point (Now/Work, Home, eventually Modelling).
- **Do** write in a casual, dry, first-person voice. Concrete over generic, voice over polish.
- **Do** show empty states empty (the Modelling "No photo yet" frame) before ever faking content.
- **Do** ship a `prefers-reduced-motion` alternative for every animation and hold AA contrast across all three themes.

### Don't:
- **Don't** build a generic dev-portfolio template: no project-card grids, skills bars, "passionate developer" copy, or tech-logo soup.
- **Don't** reach for SaaS-landing scaffolding: no hero-metric blocks, gradient CTAs, feature grids, or "trusted by" logos.
- **Don't** add flashy or gratuitous motion: no scroll-jacking, no effects that perform instead of serve.
- **Don't** imply visual-artist identity: no doodles-as-identity, no borrowed film stills as a mood board, no illustration framing. He is an engineer who writes, not a designer.
- **Don't** use boxes, cards, or decorative shadows. Nested cards are always wrong here; so is one card.
- **Don't** use em-dashes anywhere, including fiction.
- **Don't** tint the neutrals toward warm or cool "for mood"; the base is genuinely black-and-white.
