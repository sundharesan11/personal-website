# Design System

The spine of the site. Every UI choice traces back here. Aesthetic: **Vogue/magazine editorial** — image-led, black-and-white Didone display type at extreme scale, no boxes or cards, asymmetric flush-left composition, and a single stellar-blue spot colour.

> Tokens are declared once in `src/styles/global.css` under the `@theme` block (Tailwind v4, CSS-first). Tailwind generates utilities from them automatically — there is no `tailwind.config.mjs`. When you add a token, add it to `@theme` in `global.css`; the utility is immediately available.

## Principles

1. **Image first.** Full-bleed photographs carry all colour; the typography sits over or beside them.
2. **No boxes, no cards.** Borders, shadows, rounded corners, and surface fills are banned. Separation comes from whitespace, hairline rules, and typographic contrast.
3. **One spot colour.** Stellar blue draws the eye — reserve it for the monogram dot, index numbers, links, hairline rules, and drop caps. Never as a fill.
4. **Vast negative space.** The restraint is in the emptiness, not the absence of imagery.
5. **Consistency over cleverness.** Reuse patterns; no one-off styling.
6. **Earn every element.** If removing it doesn't hurt, remove it.

> The Vogue patterns below are the sanctioned layer. Beyond them, the restraint principles above still hold — no decoration that isn't one of these patterns.

## Color tokens

Ink (black/white, theme-dependent) + full-colour photography + a single stellar-blue spot colour. Photographs carry all other colour.

| Token            | Light       | Dark        | Use |
|------------------|-------------|-------------|-----|
| `bg`             | `#FFFFFF`   | `#0B0B0C`   | page background |
| `surface`        | `#F7F7F5`   | `#161617`   | (use sparingly — prefer plain bg) |
| `text`           | `#16161A`   | `#EDEDED`   | primary text |
| `text-muted`     | `#6B6B73`   | `#9A9AA2`   | secondary text, captions, datelines |
| `border`         | `#E6E6E3`   | `#26262A`   | hairline rules only |
| `accent`         | `#0057B8`   | `#6BB6FF`   | blue spot colour (AA) |
| `accent-hover`   | `#00438F`   | `#9CCFFF`   | hover state |

> `--color-stellar: #0057B8` is the spot colour name in light and cream themes. Dark mode uses `#6BB6FF`, an AA-safe tint of the same blue family, because `#0057B8` is too dark on the dark background. Rules: body text on `bg` only. `text-muted` never for primary reading content. Accent (stellar) never as a large fill — it is a highlight, not a background.

Cream theme keeps the same roles with warmer neutrals; `text-muted` is `#685E50` so small editorial labels clear AA contrast on `#F3EBDD`.

## Typography

- **Display (Didone):** Playfair Display via `--font-serif` — the display voice for the name, section titles, work/post titles, and drop caps. Used at **extreme `clamp()` sizes**:
  - Name / hero: `clamp(2.8rem, 10vw, 7rem)`
  - Section title (Work / Writing / About): `clamp(3rem, 9vw, 6rem)`
  - Work / post title: `clamp(2rem, 4.5vw, 3.4rem)`
- **UI + body:** Inter (or `ui-sans-serif, system-ui` fallback) — body copy, nav, kickers (uppercase, letter-spaced), and datelines.
- Keep to one weight contrast per context; no more than 2 families total.

Type scale (rem, ~1.25 ratio):

| Token   | Size    | Line height | Use |
|---------|---------|-------------|-----|
| `xs`    | 0.8     | 1.5         | captions, meta |
| `sm`    | 0.9     | 1.6         | secondary, datelines |
| `base`  | 1.0     | 1.7         | body |
| `lg`    | 1.25    | 1.5         | lead paragraph |
| `xl`    | 1.6     | 1.3         | sub-heading |
| `2xl`   | 2.1     | 1.2         | page title |
| `3xl`   | 2.8     | 1.1         | hero (base; extended via clamp) |

Weights: 400 body, 500 emphasis, 600 headings. Avoid 700+ for body; display headings may use 700 for impact. Body measure: max ~68ch.

## Spacing

4px base scale: `1=4 2=8 3=12 4=16 6=24 8=32 12=48 16=64 24=96 32=128`.
Section vertical rhythm: 96–128px between major sections on desktop, 48–64px on mobile. Be generous — the negative space is the aesthetic.

## Radius & elevation

- **No rounded corners anywhere** in the editorial system (no `rounded-*` on photos, sections, or any UI chrome).
- **No shadows.** The system is flat; separation comes from whitespace and hairline rules.
- Exception: interactive UI micro-elements and the approved macOS-style glass topbar may use radius. The topbar is the only sanctioned floating pill.

## Motion

- CSS parallax (`background-attachment: fixed`) on full-bleed photo bands where used. Static on mobile/iOS is acceptable.
- Subtle micro-interactions: 150–250ms, ease-out. Fade/translate a few px on entrance.
- Respect `prefers-reduced-motion` — disable non-essential motion.
- Client JS is allowed only for narrow enhancements already in use: theme toggle, rotating cube menu, progressive reveal/scroll progress, and the sunflower interaction. Content must remain visible if JavaScript fails.

## Vogue editorial patterns

- **Full-bleed photo bands:** `-mx-[50vw] w-screen` with `bg-fixed` (CSS parallax). No borders, no rounded corners, no shadows. Full-colour photograph fills the band.
- **Monogram (SK.):** Playfair Display, flush-left; the trailing dot is stellar-blue (`text-accent`). Used in the site header/brand.
- **Glass topbar:** The site header is a floating macOS-style glass pill over a transparent sticky/overlay header. It uses blur, translucency, and a hairline border, with no heavy shadow.
- **Parallax hero:** Full-bleed, full-viewport photo band with the name at extreme `clamp()` size in Playfair over a dark scrim, plus kicker eyebrow and dateline.
- **Work entry:** Alternating full-bleed parallax photo + serif title at `clamp(2rem, 4.5vw, 3.4rem)` + stellar-blue `nº` index number + dateline + short description. No cards or borders.
- **Writing contents list:** Flush-left list entries; stellar-blue `nº` index number; Playfair serif title; hairline `border` rule between items. No cards.
- **Drop cap:** First letter of first body paragraph, Playfair Display, stellar-blue (`text-accent`), class `.dropcap`.
- **Pull quote:** Playfair Display italic, stellar-blue left hairline rule (`border-l-2 border-accent`), generous indent.
- **Kicker:** Small uppercase, `tracking-[0.14em]`, Inter — editorial eyebrow label. The one sanctioned uppercase element.
- **Dateline:** Dates rendered small, uppercase, `tracking-[0.12em]`, `text-muted`, Inter.
- **Hairline rules:** `border` token as a 1px divider; used sparingly under section headings and between writing entries.
- **Links:** Underline only (no box); stellar-blue accent (`text-accent underline`). Visible focus ring always.
- **Editorial footer:** Bold serif "Get in touch →" route to `/contact`. Contact and iyal use Web3Forms when configured and show a mail fallback when no `PUBLIC_WEB3FORMS_ACCESS_KEY` is present.

## Removed patterns

- ~~**Cards / ProjectCard:**~~ Removed. No card chrome (borders, shadows, `rounded-*`, surface fills) anywhere.
- ~~**Flow field canvas:**~~ Removed. CSS parallax replaces it.

## Do / Don't

| Do | Don't |
|----|-------|
| Use full-bleed photographs | Add boxes, cards, borders, shadows, or rounded corners |
| Let stellar-blue be the single accent | Introduce a second accent or use stellar as a fill |
| Playfair Display at extreme clamp sizes | Use display type at modest/predictable sizes |
| Vast negative space between sections | Fill whitespace with decoration or extra elements |
| Left-align everything (flush-left composition) | Center headings or long text |
| Reuse the Vogue patterns above | Create one-off styled variants |
| CSS parallax for photo motion | Add JS-driven animation or canvas overlays |
