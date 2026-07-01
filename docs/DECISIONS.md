# Decisions

Append-only log so context survives across sessions. Two sections:

- **Decided** — locked choices, with date + why + what we rejected.
- **Open / Deferred** — choices deliberately *not* made yet. The agent should consult this and avoid silently picking; pull options up to "Decided" only when actually chosen.

Format each entry: `### [short title] — YYYY-MM-DD`

---

## Decided

### Floating glass topbar — 2026-07-01
The header uses a macOS-style glassmorphism pill: transparent outer header, translucent blurred pill, soft hairline border, and no heavy shadow. This is the only sanctioned rounded/floating navigation surface because the owner explicitly chose it over the stricter full-width editorial glass treatment. **Rejected:** keeping the solid topbar, using a full-width glass strip, or adding heavy shadow/card chrome.

### Improvement layer from Impeccable audit — 2026-07-01
The audit backlog is being implemented in three ordered passes: responsive fit plus IA drift, iyal copy and positioning, then navigation/contact trust. `To` remains the public nav label while `/ambitions` becomes an alias to the same future-desk surface. `iyal` stays masthead-level as a sister brand, but now needs clearer accessible context and grounded field-note copy to earn that prominence. **Rejected:** renaming `To` back to Ambitions, demoting iyal into a normal project entry, or turning the improvements into a broader redesign.

### Progressive reveal and static form fallbacks — 2026-07-01
Reveal motion is progressive: content is visible by default, and JavaScript opts pages into reveal animation with a `js-reveal` class. Contact and iyal keep Web3Forms for static submissions, but render mailto fallback states when `PUBLIC_WEB3FORMS_ACCESS_KEY` is absent and include small expectation-setting copy when the forms are live. **Rejected:** hiding content until JS runs, adding a backend form handler, or adding heavy CTA/form chrome.

### Responsive text-fit utilities — 2026-07-01
The site now has small global text-fit utilities for long editorial labels, display headlines, and prose containers that risk mobile clipping. These are guardrails for the existing publication system, not a new component style. Cream theme muted text was darkened to keep small text at AA contrast. **Rejected:** globally hiding horizontal overflow as the primary fix, shrinking all display type, or adding page-specific one-off hacks.

### Waste management joins the To desk — 2026-07-01
The `/to` index now includes a Waste Management entry with a dedicated `/to/waste-management` page. It is framed as a civic infrastructure interest rather than an active venture: cleaner tier 1 and tier 2 cities and towns, better waste-worker conditions, and waste handling as a prior action item in development. **Why:** the owner wants this recorded as meaningful future work without overclaiming current execution. **Rejected:** presenting it as a launched product, using generic sustainability copy, or making it a visual/marketing section outside the existing To pattern.

### Home frame-clipped fixed portrait, About editorial frame — 2026-07-01
Home uses a frame-clipped fixed background on the portrait side of the hero: the image stays visually fixed while the page scrolls, but it is only painted inside the image frame, so forced scroll and page-edge pull do not reveal it behind unrelated content. The Home image side is wider than the text side and anchors the image to the right so the full portrait fits inside the frame. About intentionally keeps its earlier two-column editorial portrait frame instead of replicating the Home hero behavior, but uses the real image ratio so the full portrait is visible. Both use `/img/hero-crop.jpeg` and preserve the full image instead of zooming or cropping it. **Why:** the previous viewport-fixed layer leaked during pull/force scroll; the sticky replacement made the image scroll too much; the narrow frame clipped the portrait. **Rejected:** sharing the Home reveal on About, keeping the previous zoom/crop treatment, and keeping a permanent viewport-fixed image layer.

### Codex guidance lives in AGENTS.md — 2026-07-01
Codex should use the repo-root `AGENTS.md` as its durable project instruction file instead of a global user skill. **Why:** the guidance is project-specific, versioned with the site, and mirrors `CLAUDE.md` while adding Codex operating guardrails. **Rejected:** creating a global `~/.codex/skills` skill for this repo, which would not travel with the repository.

### iyal standalone page and wordmark — 2026-07-01
`iyal` is an active farmer capital network research/product flow, not a future-desk item. It gets a standalone `/iyal` page and a persistent top-header wordmark link beside `SK.`. The name is always rendered lowercase as `iyal`; the wordmark uses Sacramento and the existing blue accent/stellar colour. **Rejected:** keeping it only under `/to/agri-fintech`, listing it inside `/to`, or introducing a new brand colour outside the one-accent system.

### Contact forms use Web3Forms — 2026-07-01
The `/iyal` contribution section and `/contact` page use embedded Web3Forms static forms instead of mailto-only CTAs. `/iyal` is a field-note form for agriculture, capital, logistics, policy, and field operations context. `/contact` is the broad front door for work, writing, iyal, modelling, speaking, collaboration, and strange ideas worth discussing. Both read the access key from `PUBLIC_WEB3FORMS_ACCESS_KEY` so the key stays out of source. The footer headline routes to `/contact`; the cube menu includes Contact as an accessible fallback destination, while the already-dense masthead stays unchanged. **Rejected:** pushing readers through prescribed prompt lists, adding a custom backend before validation needs one, or adding Contact to the masthead.

### Brand blue: #0057B8 — 2026-07-01
The site blue is now `#0057B8` for light and cream themes. Dark mode uses the AA-safe tint `#6BB6FF` so blue links, rules, and wordmarks remain readable on `#0B0B0C`. **Rejected:** the too-dark `#011F4B`, which did not visibly read as blue in the UI, and `#2552B4`, which leaned too violet.

### Stack: Astro + Tailwind, static — 2026-06-14
Personal portfolio is content-heavy and low-interactivity. Astro ships near-zero JS by default and Tailwind keeps styling token-driven. **Rejected:** Next.js (heavier than needed for a static portfolio), plain HTML/CSS (loses content collections + componentization).

### Aesthetic: clean / minimal — 2026-06-14
Whitespace-led, near-monochrome + one accent, type-driven. See `DESIGN_SYSTEM.md`. **Rejected:** bold/expressive and editorial directions.

### Content via Astro Content Collections — 2026-06-14
Projects and writing as Markdown/MDX, not hardcoded. Keeps content editable without touching templates.

### Site sections / IA: Home + Work + Writing + About — 2026-06-14
Writing/blog is **in at launch** (not deferred). Launch IA: Home, Work, Writing, About. **Rejected:** minimum-viable Home+Work+About only (the owner wants writing surfaced from day one). Contact remains a mailto in the footer, not its own section (superseded by the later Web3Forms plus mail fallback decision).

### Accent color: blue `#0057B8` — 2026-06-14, updated 2026-07-01
Single accent. The active light/cream brand blue is now `#0057B8`. Dark mode uses the AA-safe tint `#6BB6FF` because `#0057B8` is not readable enough on `#0B0B0C`. **Rejected:** the previous brighter stellar blue, the too-dark `#011F4B`, violet-leaning `#2552B4`, and applying dark blues unchanged in dark mode where they fail contrast.

### Dark mode at launch (toggle + light default) — 2026-06-14
Ship light **and** dark from day one with a user toggle, defaulting to light on first visit and persisting explicit choices. Tokens already define both palettes. **Rejected:** system-default-first and system-only-no-toggle. Implication: the toggle needs the one piece of client JS we'll allow, plus an inline no-flash script in `<head>`.

### Build approach: shell-first with placeholders — 2026-06-14
Scaffold structure, layout, and components against the design system using realistic placeholder content; swap in Sundharesan's final bio/projects/copy later. **Rejected:** blocking the build on final content. Risk accepted: minor layout rework when real copy lands.

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

### Blue spot colour — 2026-06-14, updated 2026-07-01
`--color-stellar: #0057B8` plus the AA accent `#0057B8` (light/cream) / `#6BB6FF` (dark). The one editorial spot colour throughout: monogram dot, nº numbering, links, hairline rules, drop caps, datelines. Photographs carry all other colour.

### Motion: CSS parallax (flow field removed) — 2026-06-14
Replaced the flow-field canvas with pure-CSS parallax (`background-attachment: fixed`) on full-bleed photo bands (hero, work entries, work-detail cover, about portrait). Zero new JS (only the theme toggle remains). Static on mobile/iOS (acceptable). The flow-field code was removed (in git history).

### No boxes / full-bleed; contact = mailto — 2026-06-14
Removed `ProjectCard` and all card/box/border/shadow/rounded chrome; work & writing are full-bleed/flush-left editorial entries; links underline-only. Contact is a bold serif "Get in touch →" mailto in the footer (functional form deferred — needs backend).

### Publication IA: Home · Now/Work · Writing · Reading · Ambitions · About — 2026-06-15
Expanded from 4 sections to a full publication (per `docs/plan-and-todo.md`). Home = thin threshold + "Inside this edition" teaser index. Now/Work = role feature (not a project list). Writing originally planned four lenses, now superseded by three live lenses until Philosophy has real content. Reading = scatter gallery grouped by "what each opened." Ambitions became the `/ambitions` alias for the `To` future desk. About = long-read. Contact stays footer-wide and in the cube menu.

### Projects gallery retired — 2026-06-15
Removed the `projects` collection, the `/work/[slug]` route, and `WorkEntry`/`ProjectCard`. Now/Work is a confidentiality-safe role feature instead. **Why:** owner's plan + Oogway confidentiality (no client/project names by default).

### Identity: Oogway Labs is the employer — 2026-06-15
Sundharesan is "AI engineer at Oogway Labs · writer · founder-in-waiting." Oogway Labs appears as his **employer** in content (Now/Work, identity line, About), NOT as the masthead. Reconciles the earlier scrub of "Soumyo — Oogway Labs," which was wrong only in the name.

### Rotating cube ≡ menu — 2026-06-15
A global ≡ overlay with a 3D CSS cube (6 faces = the 6 destinations), slow auto-spin (static under prefers-reduced-motion), Escape/backdrop close + focus management, and a plain text nav list as the accessible fallback (alongside the header's text nav). `CubeMenu.astro` + `src/scripts/cube.ts`.

### Modern ↔ Evening edition toggle — 2026-06-15
A reading-mode toggle scoped to Writing pages, a separate axis from the global light/dark theme. Evening = atmospheric dark-warm reading mode (deep `#0E0E12` ground, warm paper text, serif body, larger blue drop cap) via `[data-edition="evening"] .writing-page` overrides + a no-flash inline read. `EditionToggle.astro` + `src/scripts/edition.ts`. Third piece of client JS (after theme toggle + cube).

### Third theme: cream (warm day mode) — 2026-06-15
Added a third theme alongside light + dark: "cream" — a warm beige/day palette (ground #F3EBDD, warm dark-brown text #3B342B, warm hairlines) inspired by a soft warm reference illustration. Keeps the stellar-blue accent for thread consistency. Implemented via a `.theme-cream` class (the `.dark` class stays so Tailwind `dark:` variants keep working). The theme control is now a 3-state cycle (light → cream → dark). `data-edition` (Modern/Evening on Writing) remains a separate axis.

---

## Open / Deferred

These are intentionally undecided. Don't lock them in without confirming.

### Hosting / deploy target
Vercel vs Netlify vs Cloudflare Pages — all fine for static Astro. **Open:** pick when we're ready to deploy.

### Domain
**Open:** which domain (oogwaylabs subdomain, personal domain, etc.)?

### Analytics
**Open:** none, or a privacy-friendly option (Plausible/Umami) later.

### Contact delivery quality
**Open:** whether Web3Forms is reliable enough after real submissions, or whether the site needs a first-party serverless handler later. The current decision is Web3Forms plus visible mail fallback.
