# Home identity and iyal handoff

## Goal

Make the Home opening identify Sundharesan as a Forward Deployed Engineer at Oogway Labs, without presenting writing as part of the hero identity. Use the empty top-left of the opening for the important `iyal` route while the full navbar is intentionally deferred.

## Design

- Replace the Home hero kicker with `Forward Deployed Engineer · Oogway Labs`.
- Add the existing lowercase blue script `iyal` wordmark as a link to `/iyal` at the top-left of the Home hero text panel.
- Keep the wordmark inside the hero rather than viewport-fixed. It remains present during the opening and scrolls away naturally as the deferred full navbar appears after the photo frame leaves the viewport.
- Reuse the existing script font, accent colour, hover colour, and accessible `iyal` description. Add no new visual tokens or client JavaScript.
- Update the Home page description so metadata agrees with the visible identity.

## Responsive behaviour

The wordmark stays at the top-left of the text panel on desktop and mobile. It participates in normal layout, so it cannot overlap the name, photo, or deferred navbar.

## Verification

- Assert the Home source contains the new role and no longer uses the old AI engineer/writer hero identity.
- Assert the pre-navbar `iyal` wordmark links to `/iyal`.
- Run the focused tests and production build.
- Inspect Home at desktop and mobile widths, checking the opening composition and the navbar handoff.

