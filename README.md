# TarkovTools — Free Tarkov Ammo & Armor Calculators

A dark, tactical-themed static Astro site with 3 free browser-based tools for Escape from Tarkov players:

| Tool | URL | What it does |
|---|---|---|
| Penetration Calculator | `/penetration-calculator/` | Exact pen chance for any round vs any armor (datamined formula) + shots-to-break |
| Ammo Chart | `/ammo-chart/` | 175 rounds across 29 calibers: damage, pen, armor dmg %, speed — filterable |
| Ammo Solver | `/ammo-solver/` | Ranks every round against your expected target armor class; leg-meta mode |

Plus support pages: home, all-tools hub, guide (penetration explained), about, methodology, contact, changelog, HTML sitemap, privacy, terms, 404.

## Data provenance

- **Ammo stats (175 rounds):** Escape from Tarkov Wiki ballistics table, fetched 2026-10-08; spot-validated (BS 45/54, M995 42/53, M80 80/43).
- **Armor (45 body + 38 plates):** tarkovdb.gg armor chart, fetched 2026-10-08.
- **Penetration model:** community-datamined formula, cross-validated in independent open-source projects (identical math found in two unrelated repos).
- Full trail: `research/batch3/worker-tarkov-data.md` (workspace) + site's `/methodology/` page.

**Not affiliated with Battlestate Games** (stated on site).

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to dist/
npm run preview
```

Node 22+ required. No backend, no database.

## Verification

```bash
node scripts/test-math.mjs   # 20 tests (thresholds, pen chance, damage reduction, armor damage)
node scripts/test-dom.mjs    # 14 DOM tests (loads built pages in jsdom, runs the tools)
```

Validated examples the tests enforce: M995 vs class 5 ≈ 93%, 7.62x39 BP vs class 4 ≈ 96%, M855 vs class 4 ≈ 13%.

## Design notes

Distinct visual identity: tactical dark theme (gunmetal + olive + ballistic orange), squared corners, uppercase display type, dense data tables, monospace readouts. Deliberately different from the publisher's other sites. Set in `src/styles/global.css`.

## Structure

```
src/
├── data/ammo.ts         # 175 rounds, 29 calibers (wiki-sourced)
├── data/armor.ts        # 45 body armors + 38 plates (tarkovdb-sourced)
├── lib/ballistics.ts    # Penetration model (mirrors tests)
├── layouts/Base.astro   # SEO head
├── components/          # Header, Footer, Breadcrumbs, Faq, ToolCard, TrustBlock
├── styles/global.css    # Tactical dark theme
└── pages/
scripts/
├── test-math.mjs
├── test-dom.mjs
└── gen-assets.py
```

## Editing guide

- **Add a round**: append to `src/data/ammo.ts` (verify against wiki; note snapshot).
- **Change copy**: per-page in `src/pages/<tool>/index.astro`.
- **Colors**: `src/styles/global.css` at `:root`.
- **Domain change**: `src/data/site.ts` + `astro.config.mjs` + `public/robots.txt`.

## Deploy (Cloudflare Pages)

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output | `dist` |
| Root | *(empty)* |
| Node | 22+ (`NODE_VERSION=22` if needed) |

After deploy: add custom domain `tarkovtools.top`, submit sitemap to Search Console + Bing.

## Accuracy policy

- Every stat traces to a source (wiki/db snapshot, dated).
- The penetration model's limits are published (single-plate, no helmet ricochet, nominal pen).
- Corrections ship with changelog entries; no invented numbers.
