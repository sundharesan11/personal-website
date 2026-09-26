# Reading recommendations design

**Date:** 2026-07-11  
**Status:** Approved for implementation planning

## Goal

Turn Reading into a curated two-way page: distinguish books Sundharesan has read from books he intends to read, and let readers privately recommend a book without making the page feel like a public submission feed.

## Content structure

The existing `reading` collection remains the source of truth. Its current statuses gain clearer presentation semantics:

- `read`: appears in the **Read** section, grouped by the question or idea in `opened`; these entries may include Sundharesan's note and the question the book left behind.
- `on-deck`: appears in the **To Read** section; these entries show title and author without language that implies the book has already been read.

No new status or collection is needed. The page-level book count includes both sections, while each section states its own count.

## Page composition

The existing Reading masthead and editorial voice stay intact. Below it:

1. **Read** preserves the current asymmetric scatter treatment and question-based groups.
2. **To Read** follows as a quieter editorial list separated by whitespace and a hairline rule, not cards or a uniform grid.
3. **Recommend a book** closes the reading content before the existing progression link to Writing.

The sunflower remains a desktop-side visual accent. The layout must retain readable source order on mobile and must not depend on JavaScript for the book lists.

## Private recommendation form

The form submits privately through the same Web3Forms integration already used by Contact.

Required fields:

- Book title
- Why it is worth reading

Optional identity fields:

- Name
- Email

Name and email sit inside a native disclosure labelled **Want a reply?** so readers can recommend anonymously without seeing unnecessary fields first. These values are sent only with the private submission and never rendered publicly.

The form also includes the Web3Forms access key, a Reading-specific subject, site attribution, and the existing hidden bot-check field. Labels remain visible, fields reuse `EditorialField.astro`, keyboard focus is visible, and native required/email validation remains enabled.

## Submission and fallback behaviour

When `PUBLIC_WEB3FORMS_ACCESS_KEY` is configured, the form posts to Web3Forms. Submission success and service errors use Web3Forms' hosted response flow for this first version, avoiding new client JavaScript or a custom backend.

When the key is absent, the page does not render a broken form. It presents a concise email fallback with a prefilled recommendation subject and asks for the same title-and-reason information.

Recommendations are editorial input, not automatic content. Sundharesan reviews each privately and manually adds accepted books to the `reading` collection as `on-deck`.

## Voice and visual treatment

Copy remains first-person, concise, and lightly dry. The invitation should feel like asking a well-read friend, not opening a support ticket. Styling uses existing typography, spacing, border, and accent tokens. No cards, rounded containers, shadows, second accent colour, or new design tokens are introduced.

## Components and boundaries

- `src/pages/reading/index.astro`: separates collection entries, renders the three page sections, and chooses form versus fallback based on configuration.
- `src/components/EditorialField.astro`: reused unchanged unless a test exposes an accessibility gap required by this form.
- `src/content.config.ts`: remains unchanged because `read | on-deck` already models the requirement.
- Documentation: update Architecture and Decisions after implementation to record the private recommendation workflow and the public meaning of both statuses.

No database, moderation interface, public recommendation feed, or new dependency is in scope.

## Testing and verification

Automated tests should establish that:

- `read` and `on-deck` entries are rendered in distinct labelled sections.
- Read entries retain their question-based grouping.
- The configured state renders a private POST form with required title/reason, optional disclosed identity fields, bot protection, and Reading-specific metadata.
- The unconfigured state renders the email fallback and no unusable submit form.
- Documentation reflects the final content and submission model.

Implementation follows a red-green-refactor cycle for each behaviour. Final verification includes the focused tests, the full test suite, `npm run build`, and browser inspection at desktop and mobile widths in the available themes.

## Success criteria

A visitor can immediately tell what Sundharesan has read and what he plans to read, can privately recommend a title with minimal effort, can remain anonymous, and never mistakes a recommendation for automatically published content.
