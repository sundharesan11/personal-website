# Writing workflow

How to write and publish on this site without opening a code editor. Local-first, no CMS, no database — the repo is the CMS.

## The short version

```bash
npm run new        # scaffold a new writing/reading entry (asks questions, writes correct frontmatter)
# ...write in any editor (Obsidian recommended, see below)
npm run publish    # build gate → commit → push (= deploy once a host is connected)
```

## States a piece moves through

All state lives in frontmatter — no separate draft system:

| Frontmatter | Where it shows |
|---|---|
| `draft: true` | Nowhere. Private, but versioned in git. |
| `status: writing` | The being-written desk: listed on its lens page as "Being written", unclickable, excluded from the "pieces" count (shown as "n forming"). |
| `status: published` | Live: lens page, detail route, next/prev threading, eligible for Home's featured slot. |
| `featured: true` | Also gets the "From this issue" slot on Home (most recent featured wins). |
| `link: https://medium.com/...` | External piece: dateline + "On Medium ↗" on the lens page, no local detail route, body can stay empty. |

To ship a forming piece: flip `status: writing` → `status: published`, bump `date`, run `npm run publish`.

## Writing in Obsidian

1. Open the repo folder (or just `src/content/`) as a vault.
2. Write in `src/content/writing/`. Frontmatter must match the schema in `src/content.config.ts` — scaffold with `npm run new` so it always does.
3. The build is the safety net: a typo'd lens or missing field fails `npm run publish` loudly before anything ships.

Reading entries work the same way in `src/content/reading/` (`note`, `question`, `opened` group, `read`/`on-deck`).

## Publishing

`npm run publish` runs `astro build` first (zod validates every entry), then commits everything with a content-aware message and pushes. If the push fails (offline, no remote), the commit stays local and you push later.

**Deploy:** not wired up yet. When ready: connect the repo to Netlify or Cloudflare Pages (git integration, build command `npm run build`, output `dist/`), set the real domain in `astro.config.mjs` (`site:`), and every `npm run publish` becomes a deploy.

## If this ever feels limiting

The documented upgrade path (see `docs/DECISIONS.md` Open/Deferred) is Sveltia CMS: two static files under `public/admin/` give a browser editor at `/admin` that commits to this repo via GitHub — no SSR, no build changes, deletable in one commit.
