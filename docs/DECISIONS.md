# Decisions

Append-only log so context survives across sessions. Two sections:

- **Decided** — locked choices, with date + why + what we rejected.
- **Open / Deferred** — choices deliberately *not* made yet. The agent should consult this and avoid silently picking; pull options up to "Decided" only when actually chosen.

Format each entry: `### [short title] — YYYY-MM-DD`

---

## Decided

### Stack: Astro + Tailwind, static — 2026-06-14
Personal portfolio is content-heavy and low-interactivity. Astro ships near-zero JS by default and Tailwind keeps styling token-driven. **Rejected:** Next.js (heavier than needed for a static portfolio), plain HTML/CSS (loses content collections + componentization).

### Aesthetic: clean / minimal — 2026-06-14
Whitespace-led, near-monochrome + one accent, type-driven. See `DESIGN_SYSTEM.md`. **Rejected:** bold/expressive and editorial directions.

### Content via Astro Content Collections — 2026-06-14
Projects and writing as Markdown/MDX, not hardcoded. Keeps content editable without touching templates.

### Site sections / IA: Home + Work + Writing + About — 2026-06-14
Writing/blog is **in at launch** (not deferred). Launch IA: Home, Work, Writing, About. **Rejected:** minimum-viable Home+Work+About only (Soumyo wants writing surfaced from day one). Contact remains a mailto in the footer, not its own section (see Open).

### Accent color: blue `#1F54E6` (light) / `#5B86FF` (dark) — 2026-06-14
Single accent. Originally `#2F6BFF` (light), but it measured 4.4988:1 on white — 0.001 below the WCAG AA 4.5:1 bar for body-size links, and AA is a stated project requirement. Darkened the light accent to `#1F54E6` (6.05:1) rather than introduce a second blue, keeping the "one accent" rule. Hover `#163CAE`. Dark accent `#5B86FF` (5.9:1) unchanged. The flow-field "stellar blue" streaks and the favicon use this same accent token. **Rejected:** keeping `#2F6BFF` (fails AA), or adding a separate darker link color (would mean two blues). Still swappable later if it reads too cool against real content.

### Dark mode at launch (toggle + system default) — 2026-06-14
Ship light **and** dark from day one with a user toggle, defaulting to system preference and persisting choice. Tokens already define both palettes. **Rejected:** light-only-first, system-only-no-toggle. Implication: the toggle needs the one piece of client JS we'll allow, plus an inline no-flash script in `<head>`.

### Build approach: shell-first with placeholders — 2026-06-14
Scaffold structure, layout, and components against the design system using realistic placeholder content; swap in Soumyo's real bio/projects/copy later. **Rejected:** blocking the build on final content. Risk accepted: minor layout rework when real copy lands.

### Tailwind v4 (CSS-first tokens) — 2026-06-14
The Astro Tailwind integration installs Tailwind v4 (`@tailwindcss/vite`), which is CSS-first: design tokens live in `src/styles/global.css` under `@theme` and there is no `tailwind.config.mjs`. This fits the "tokens defined once → CSS variables" principle better than v3. **Rejected:** pinning Tailwind v3 to keep the `tailwind.config.mjs` the older docs referenced. Docs (ARCHITECTURE, DESIGN_SYSTEM) updated to match.

### Hero ambient motion: flow field — 2026-06-14 (supersedes the dot-field choice)
Particles drift continuously along an evolving noise **flow field** behind the hero; near the cursor they are pushed away and **swirl** (radial + tangential force). Rendered as short **line streaks** (not dots), with ~1/3 of them in **stellar blue** (the `accent` token — `#2F6BFF`/`#5B86FF`) and the rest faint muted-gray; streak alpha rises with speed. Canvas-based, single rAF loop. **Why the change:** the earlier reactive dot grid (brightness-only) tested as too tame / not captivating; the flow field is more organic and clearly "shows mouse activity" (the original ask). **Non-negotiables (unchanged):** disabled under `prefers-reduced-motion` (renders one static frame of streaks, no rAF/listeners), GPU-cheap (canvas 2d, capped DPR, particle count scales with area and is capped, paused via IntersectionObserver off-screen), theme-aware (re-reads `--color-accent`/`--color-text-muted` on toggle). **Mobile:** no cursor, but the field keeps drifting on its own so it still reads as alive. **Implementation:** `src/scripts/flowField.ts` (pure `flowAngle()` unit-tested) + `src/components/FlowField.astro`; replaces the removed `dotField.ts`/`DotField.astro`. Stays the second (and only other) piece of client JS after the theme toggle. **Rejected:** reactive dot grid (too tame), magnetic-displacement grid, ripple, ambient glow, drifting blob (all considered; magnetic & ripple were live-prototyped alongside flow before this pick).

### Identity: Sundharesan Kumaresan — 2026-06-14
The site is Sundharesan Kumaresan's personal portfolio. The earlier "Soumyo — Oogway Labs" was incorrect placeholder identity and has been removed site-wide (header, footer, titles, meta, OG, About, and placeholder copy). Contact email: sundharesansk11@gmail.com.

### Aesthetic pivot: minimal base + editorial layer — 2026-06-14
Supersedes the earlier "Aesthetic: clean/minimal — Rejected: editorial" decision. Keep the minimal whitespace base, but add an editorial/newspaper layer: serif display (Playfair Display) for headings + hero name, kicker eyebrows, datelines, hairline rules, and a full-bleed cover hero (photo + dark scrim + flow-field "extended dots" overlay + name). Not full newspaper (no multi-column body, no drop caps on content). **Why:** owner wants a newspaper/article feel with a photo hero; the minimal base keeps it from becoming busy.

### Editorial serif: Playfair Display — 2026-06-14
Resolves the previously-open "Typography — exact families". Self-hosted via @fontsource/playfair-display as `--font-serif`. **Rejected:** Newsreader (more sober) and Fraunces (more boutique) — owner chose Playfair's magazine-cover elegance.

### Hero: full-bleed cover (photo + name overlay + flow field) — 2026-06-14
Home hero is a full-bleed ~82vh cover: placeholder photo (`/public/hero-placeholder.jpg`, swap later) + dark scrim + the flow field (onPhoto variant, light dots) + name in Playfair + kicker/dateline. **Rejected:** masthead and portrait-split layouts (live-mocked alongside cover).

### Aesthetic pivot: Vogue/magazine editorial — 2026-06-14
Supersedes the "minimal base + editorial layer" (cards) direction. New system: black/white Didone display type at extreme scale, full-bleed full-colour photography, NO cards/boxes/borders/rounded corners, asymmetric flush-left composition, and a single stellar-blue spot colour threaded throughout (monogram dot, work nº, links, hairline rules, drop caps). Both light & dark kept. **Why:** owner wants a Vogue-cover / magazine feel — image-led, free-flowing, no uniform grid of boxes. Reference: Wix "Street Artist Portfolio (Industrial)". **Rejected:** industrial-grotesque type voice (chose Didone), pure B&W with no accent (chose the stellar-blue thread), functional contact form (mailto only — needs backend).

### Display type: Playfair Display (Didone) — 2026-06-14
Playfair Display (already self-hosted) is the Didone display voice (name, section titles, work/post titles, drop caps); Inter for body/nav/kickers/datelines. **Rejected:** Bodoni Moda (truer Vogue hairlines) — Playfair is sufficient and already loaded; swappable later.

### Stellar-blue spot colour — 2026-06-14
`--color-stellar: #5B86FF` plus the AA accent `#1F54E6` (light) / `#5B86FF` (dark). The one editorial spot colour throughout: monogram dot, nº numbering, links, hairline rules, drop caps, datelines. Photographs carry all other colour.

### Motion: CSS parallax (flow field removed) — 2026-06-14
Replaced the flow-field canvas with pure-CSS parallax (`background-attachment: fixed`) on full-bleed photo bands (hero, work entries, work-detail cover, about portrait). Zero new JS (only the theme toggle remains). Static on mobile/iOS (acceptable). The flow-field code was removed (in git history).

### No boxes / full-bleed; contact = mailto — 2026-06-14
Removed `ProjectCard` and all card/box/border/shadow/rounded chrome; work & writing are full-bleed/flush-left editorial entries; links underline-only. Contact is a bold serif "Get in touch →" mailto in the footer (functional form deferred — needs backend).

### Publication IA: Home · Now/Work · Writing · Reading · Ambitions · About — 2026-06-15
Expanded from 4 sections to a full publication (per `docs/plan-and-todo.md`). Home = thin threshold + "Inside this edition" teaser index. Now/Work = role feature (not a project list). Writing = four lenses (Economics/Philosophy/Technical/Theatrical) + a being-written desk. Reading = scatter gallery grouped by "what each opened." Ambitions = a "forming" op-ed (agri-fintech thesis, other ideas, Social Writing manifesto). About = long-read. Contact stays footer-wide (now with social links).

### Projects gallery retired — 2026-06-15
Removed the `projects` collection, the `/work/[slug]` route, and `WorkEntry`/`ProjectCard`. Now/Work is a confidentiality-safe role feature instead. **Why:** owner's plan + Oogway confidentiality (no client/project names by default).

### Identity: Oogway Labs is the employer — 2026-06-15
Sundharesan is "AI engineer at Oogway Labs · writer · founder-in-waiting." Oogway Labs appears as his **employer** in content (Now/Work, identity line, About), NOT as the masthead. Reconciles the earlier scrub of "Soumyo — Oogway Labs," which was wrong only in the name.

### Rotating cube ≡ menu — 2026-06-15
A global ≡ overlay with a 3D CSS cube (6 faces = the 6 destinations), slow auto-spin (static under prefers-reduced-motion), Escape/backdrop close + focus management, and a plain text nav list as the accessible fallback (alongside the header's text nav). `CubeMenu.astro` + `src/scripts/cube.ts`.

### Modern ↔ Evening edition toggle — 2026-06-15
A reading-mode toggle scoped to Writing pages, a separate axis from the global light/dark theme. Evening = atmospheric dark-warm reading mode (deep `#0E0E12` ground, warm paper text, serif body, larger blue drop cap) via `[data-edition="evening"] .writing-page` overrides + a no-flash inline read. `EditionToggle.astro` + `src/scripts/edition.ts`. Third piece of client JS (after theme toggle + cube).

### Third theme: cream (warm day mode) — 2026-06-15
Added a third theme alongside light + dark: "cream" — a warm beige/day palette (ground #F3EBDD, warm dark-brown text #3B342B, warm hairlines) inspired by a soft warm reference illustration. Keeps the stellar-blue accent for thread consistency. Implemented via a `.theme-cream` class (the `.dark` class stays so Tailwind `dark:` variants keep working). The theme control is now a 3-state cycle (light → dark → cream). `data-edition` (Modern/Evening on Writing) remains a separate axis.

---

## Open / Deferred

These are intentionally undecided. Don't lock them in without confirming.

### Hosting / deploy target
Vercel vs Netlify vs Cloudflare Pages — all fine for static Astro. **Open:** pick when we're ready to deploy.

### Domain
**Open:** which domain (oogwaylabs subdomain, personal domain, etc.)?

### Analytics
**Open:** none, or a privacy-friendly option (Plausible/Umami) later.

### Contact mechanism
**Open:** mailto link vs. a form (form needs a serverless endpoint / form service).
