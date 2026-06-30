# iyal Standalone Page Design

## Goal

Create a standalone `/iyal` page for the active farmer capital network research/product flow. The page should make clear that `iyal` is real work in validation, not a hypothetical item parked under "To."

## Brand Treatment

- The product/research name is always written as `iyal`, lowercase.
- The `iyal` wordmark uses the Sacramento font.
- The `iyal` wordmark is blue using the existing stellar/accent colour system.
- The rest of the page stays inside the site's editorial system: no cards, no rounded panels, no shadows, no extra accent colours.

## Route And IA

- Add `src/pages/iyal.astro`, served at `/iyal`.
- Add a persistent `iyal` wordmark link beside `SK.` in the global header.
- Do not list `iyal` inside `/to`; that section remains for future/forming work.
- Do not add `iyal` to the cube menu yet. Keep the cube focused on the publication sections.

## Content

Use the supplied `iyal` content as the source of truth, edited into a crisp editorial page:

- Hero: `iyal` wordmark, research/product descriptor, and the agriculture coordination thesis.
- Sections: what it is, why it matters, current validation, what we are exploring, principles, questions, long-term vision, and contribute.
- CTA: mailto link for people connected to agriculture to share perspective.

## Implementation Notes

- Add `@fontsource/sacramento`.
- Import Sacramento in `src/styles/global.css` and expose `--font-script`.
- Keep layout static and Astro-only.
- Verification: `npm test`, `ASTRO_TELEMETRY_DISABLED=1 npm run build`, and browser inspection of `/iyal` and `/to`.
