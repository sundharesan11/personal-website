# plan-and-todo.md — Section Plan & Your Personal To-Do

> Your companion to the spec files (`context.md`, `design.md`, `stack.md`, `writing-system.md`).
> **Part 1** = every section and what goes in it. **Part 2** = what only *you* can do, in order.

---

# PART 1 — Sections & their content

The site is one publication: a front page that opens into department pages. Present (what is) and future (what's forming) are kept clearly separate.

### Home — the threshold  · *magazine merged-type hero + index*
- Your name + one-line identity ("AI engineer at Oogway Labs · writer · founder-in-waiting").
- A portrait-merged hero, 2–3 sentence intro, one curiosity-gap standfirst.
- "Inside this edition" — 3–4 teaser links to other pages, phrased as hooks.
- *Keep thin. No metrics, no bio, no lead story.*

### Now / Work — the present  · *editorial feature spread*
- Your role and craft at **Oogway Labs** (applied AI: reliability, evals, guardrails).
- One strong image; 2 short paragraphs; a facts rail (Role · What I build · How I work).
- *Confidentiality-safe register by default: no client names unless cleared.*

### Writing — four lenses, one curiosity  · *editorial index + Edition toggle*
- A featured piece (image + headline + dek).
- All essays/stories grouped by **Economics · Philosophy · Technical/AI · Theatrical**.
- The **being-written desk** (3–4 in-progress titles with status tags).
- Carries the Modern ↔ Evening edition toggle.

### Reading — the reading room  · *clickable scatter gallery*
- Books grouped by **what each opened up** (not by genre).
- Each: short honest note + read / on-deck tag.

### Ambitions — the future desk  · *magazine-scale op-ed*
- Mandatory "intentions, not yet built" notice.
- The **agri-fintech venture as a thesis** (problem → why it matters → rough shape).
- **Other ideas** listed plainly.
- **Social Writing** manifesto (thinking-in-public). *No metrics; dateline reads "forming."*

### About — the long version  · *merged-type portrait + long-read*
- Full narrative connecting builder + writer (through-line: *fairness & legibility — who a system sees, who it leaves out*).
- A pull quote; career history folded in as biography; contact pointers.

### Contact — *footer, site-wide*
- Email + the 1–2 platforms you actually use (+ company later). No separate page.

### ≡ Menu — *the rotating cube, global overlay*
- Decorative navigation behind the `≡`. A plain text nav always works alongside it.

---

# PART 2 — Your to-do (in order)

## A. Decisions to make first (these unblock the build)
- [ ] **Oogway confidentiality:** what can you say publicly? Can you name projects/clients, or only describe the kind of work? *(Decides how concrete Now/Work can be.)*
- [ ] **Do any essays exist yet?** If yes → Writing launches with published + being-written. If no → launch honestly with the desk leading.
- [ ] **Edition toggle reach:** literary pages only (recommended), Home-only Easter egg, or persistent everywhere.
- [ ] **Cube menu:** keep it as the `≡` menu, or drop it for a plain nav?
- [ ] **Photography reality:** do you have / will you shoot dark-subject hero portraits? If not → use the editorial hero fallback for Home & About.
- [ ] **Cadence:** is "1 essay/month + 1 reading note/week" realistic? Adjust the number in `writing-system.md` if not.

## B. Copy only you can write (priority order — these make it *you*)
- [ ] **Home** — true one-liner + intro standfirst *(highest leverage; sets the whole voice)*
- [ ] **About** — the real through-line, in your voice
- [ ] **Ambitions** — the real agri-fintech thesis
- [ ] **Now/Work** — role + craft description (safe register)
- [ ] **Social Writing** — the manifesto draft (what it means, why, where it stands)
- [ ] **Writing** — list pieces: which are published vs being-written; real titles + one-line deks
- [ ] **Reading** — real titles, grouped by "what it opened," each with an honest note
- [ ] **Other ideas** — the plain list for Ambitions

## C. Assets to gather
- [ ] **Domain name** (yourname.com or similar) — buy it
- [ ] **Hero portraits** — dark subject on light ground, high contrast (Home + About)
- [ ] **Now/Work image** — workspace / a system / environmental portrait
- [ ] **Reading set** — consistent book spines/covers, same tonal treatment
- [ ] **Featured-essay images** (1 per featured piece)
- [ ] **OG card image** (1200×630, masthead-style) + favicon
- [ ] **Contact details** — email + GitHub + LinkedIn/X handles to link

## D. Build & launch
- [ ] Hand the agent all four spec files
- [ ] Confirm it uses **latest stable** versions (don't pin to anything in `stack.md`)
- [ ] Set up hosting (Cloudflare Pages / Netlify) + connect domain
- [ ] Pick a newsletter tool *(if doing the list)* — owned list, not platform-locked
- [ ] (Optional) cookieless analytics (Plausible / Cloudflare)
- [ ] Walk the **acceptance checklist** in `stack.md` §6 before calling it done
- [ ] Validate JSON-LD; confirm sitemap, RSS, llms.txt are live

## E. Ongoing (after launch)
- [ ] Follow the **per-essay ritual** (`writing-system.md` §10) within 48h of each piece
- [ ] Hold the **cadence** (§11); ship the weekly reading note even in a slow month
- [ ] Groom the **desk** monthly — move stale items, promote the next piece
- [ ] Publish canonical-first, then syndicate (newsletter → LinkedIn → X → optional Medium import with canonical link)

---

### The single most important thing
The site can be built, but it only becomes *yours* when the placeholder copy is replaced. **Start with the three in section B: Home one-liner, About through-line, Ambitions thesis.** Everything else inherits their voice.
