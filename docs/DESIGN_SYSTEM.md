# Design System

The spine of the site. Every UI choice traces back here. Aesthetic: **clean / minimal** — whitespace does the work, color is restrained, typography carries the personality.

> Tokens are declared once in `src/styles/global.css` under the `@theme` block (Tailwind v4, CSS-first). Tailwind generates utilities from them automatically — there is no `tailwind.config.mjs`. When you add a token, add it to `@theme` in `global.css`; the utility is immediately available.

## Principles

1. **Whitespace over decoration.** If a divider, box, or shadow can be replaced by space, replace it.
2. **One accent, used sparingly.** Color draws the eye; reserve it for what matters (links, the single primary action).
3. **Type is the design.** A tight type scale and good rhythm beat any ornament.
4. **Consistency over cleverness.** Reuse patterns; no one-off styling.
5. **Earn every element.** If removing it doesn't hurt, remove it.

## Color tokens

Neutral-led, near-monochrome, with one accent. Tuned for AA contrast.

| Token            | Light       | Dark        | Use |
|------------------|-------------|-------------|-----|
| `bg`             | `#FFFFFF`   | `#0B0B0C`   | page background |
| `surface`        | `#F7F7F5`   | `#161617`   | subtle cards/sections |
| `text`           | `#16161A`   | `#EDEDED`   | primary text |
| `text-muted`     | `#6B6B73`   | `#9A9AA2`   | secondary text, captions |
| `border`         | `#E6E6E3`   | `#26262A`   | hairlines, dividers |
| `accent`         | `#2F6BFF`   | `#5B86FF`   | links, primary action |
| `accent-hover`   | `#1F54E6`   | `#7CA0FF`   | hover state |

Rules: body text on `bg` only. `text-muted` never for primary reading content. Accent never as a large fill — it's a highlight, not a background.

## Typography

- **Sans (UI + body):** Inter (or system stack fallback: `ui-sans-serif, system-ui, …`)
- **Optional display:** keep to one weight contrast; no more than 2 families total.

Type scale (rem, ~1.25 ratio):

| Token   | Size    | Line height | Use |
|---------|---------|-------------|-----|
| `xs`    | 0.8     | 1.5         | captions, meta |
| `sm`    | 0.9     | 1.6         | secondary |
| `base`  | 1.0     | 1.7         | body |
| `lg`    | 1.25    | 1.5         | lead paragraph |
| `xl`    | 1.6     | 1.3         | section heading |
| `2xl`   | 2.1     | 1.2         | page title |
| `3xl`   | 2.8     | 1.1         | hero |

Weights: 400 body, 500 emphasis, 600 headings. Avoid 700+ (too loud for minimal). Body measure: max ~68ch.

## Spacing

4px base scale: `1=4 2=8 3=12 4=16 6=24 8=32 12=48 16=64 24=96 32=128`.
Section vertical rhythm: 96–128px between major sections on desktop, 48–64px on mobile. Be generous — whitespace is the aesthetic.

## Radius & elevation

- Radius: `sm=6px`, `md=10px`, `lg=16px`. Default to `md`.
- Shadows: avoid by default. Prefer a 1px `border` hairline. Use at most one soft shadow (`0 1px 3px rgba(0,0,0,.06)`) for genuinely floating elements.

## Motion

- Subtle and fast: 150–250ms, ease-out. Fade/translate a few px on entrance.
- Respect `prefers-reduced-motion` — disable non-essential motion.

## Component patterns

- **Buttons:** primary = solid `accent` text-on-accent; secondary = `border` + `text`. One primary per view.
- **Links:** `accent`, underline on hover (or persistent subtle underline). Visible focus ring always.
- **Cards (project tiles):** hairline border, `md` radius, generous padding, no shadow. Hover: border darkens slightly, subtle lift.
- **Layout:** single centered column, max-width ~720px for prose, ~1100px for galleries. Consistent horizontal gutter.

## Do / Don't

| Do | Don't |
|----|-------|
| Lean on whitespace and hairlines | Add boxes, shadows, gradients to fill space |
| Use the one accent for emphasis | Introduce a second accent color |
| Keep to the type scale | Pick arbitrary font sizes |
| Left-align long text | Center long paragraphs |
| Reuse existing components | Create one-off styled variants |
