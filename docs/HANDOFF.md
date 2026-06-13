# Handoff

Status as of 2026-06-14. Read this + `CLAUDE.md` + the rest of `docs/` before starting.

## Where we are
Context scaffolding is complete. No application code exists yet — Astro has **not** been initialized.

Files present:
- `CLAUDE.md` — root context (stack, commands, conventions, working agreement)
- `docs/DESIGN_SYSTEM.md` — tokens, type, spacing, components, do/don't
- `docs/DECISIONS.md` — Decided + Open/Deferred
- `docs/ARCHITECTURE.md` — planned tree, routing, content model
- `docs/ROADMAP.md` — phased plan (we're at Phase 0)

## Next steps (Phase 0 → 1)
1. Confirm the Open/Deferred decisions worth resolving now (IA/sections, dark mode, accent color).
2. `npm create astro@latest .` (empty/minimal template) + add Tailwind.
3. Wire `DESIGN_SYSTEM.md` tokens into `tailwind.config.mjs` + `src/styles/global.css`.
4. Build `BaseLayout`, `Header`, `Footer`. Light mode first.
5. Home → Work (content collection) → About. Seed 2–3 real projects.

## Follow the working agreement
Plan before building, log every non-trivial choice in `docs/DECISIONS.md`, and run the screenshot → critique → refine loop after UI work.

## Open question still pending
Soumyo mentioned a pre-existing section plan that never made it into the folder. If it surfaces, fold it into `ROADMAP.md` and `DECISIONS.md` before scaffolding pages.
