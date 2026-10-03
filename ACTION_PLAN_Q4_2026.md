# Action Plan: Q4 2026 to Q1 2027

**Created:** October 2, 2026
**Owner:** Pietro (business/accounts) + whoever picks up engineering (see `HANDOFF_SPRINT_1.md`)
**Source:** Business audit run on October 2, 2026 against the repo and the built `dist/` output
**Goal:** Stop revenue leaks, measure what earns, then grow traffic and income beyond "what card for device X" queries.

Status legend: `[ ]` not started, `[~]` in progress, `[x]` done, `[!]` blocked.
Owner tags: **(P)** Pietro, needs account access or a business decision. **(D)** dev work in this repo.

---

## 1. Where the business stands

### What the site is

- Static generator (`scripts/generator/`) builds 1,149 pages into `dist/`.
- Content: 220 devices, 70 cards, 31 readers, 9 calculators, 12 guides, 1 compare tool, 15 car navigation pages.
- Locales: EN (root), JA (`/ja/`), DE, FR, IT (`/de/`, `/fr/`, `/it/`, enabled August 2026, about 199 pages each).
- Launched about November 10, 2025.

### How it earns

| Stream | Status |
|---|---|
| Mediavine Journey display ads + Grow.me | Live on about 1,095 pages via `generateGrowScript()` in `src/templates/components.js` |
| Amazon US Associates `sd-cc-20` | Live, used on EN **and** DE/FR/IT pages |
| Amazon JP Associates `sd-cc-22` | **Not live. Japan earns nothing.** 1,088 amazon.co.jp links currently pay zero |
| Amazon Creator Connections `uproot01-20` | Live on promoted cards (`data/promoted-cards.json`) |

### Traffic (stale: last GSC pull in repo is January 4, 2026)

- About 5,600 impressions/week, CTR 0.3 to 0.4%. Answer boxes satisfy most "what card for X" queries.
- Top countries by impressions: US, UK (about 20% of US), Canada (about 13%), Japan (about 10%).
- Niche pages convert better: Miyoo Mini Plus 2.6%, Retroid Pocket 4 Pro 1.2%, Raspberry Pi 5 1.1%, pro cameras about 1%.
- Mass-market pages (Steam Deck, DJI Mini 4 Pro, Osmo Pocket 3) get high impressions and near-zero clicks.

### Audit findings, ranked by money at stake

| # | Finding | Evidence | Impact |
|---|---|---|---|
| F1 | Non-US visitors earn nothing | DE/FR/IT link to amazon.com with the US tag (about 1,600 links per locale). JA links go to amazon.co.jp with a dead tag. UK/CA/AU visitors on the EN site go to amazon.com | Roughly a third or more of affiliate-eligible traffic is unpaid |
| F2 | No analytics at all | No GA/Plausible/Cloudflare script in `dist/`. `src/js/compare.js:150` and `src/js/calculator-ui.js:364` call `gtag()`, which never loads. The privacy policy says the site uses Google Analytics | Can't tell which pages, slots or cards earn. Every decision below is blind until fixed |
| F3 | UTM params on Amazon links do nothing | `generate-device-pages.js:182` and `:427` append `utm_*` to Amazon URLs. Amazon doesn't report UTMs to Associates | False sense of tracking. Use Associates tracking IDs instead |
| F4 | "(Mapped)" in visible product names | `data/sdcards.json:140,662`, `data/sdcards-ja.json:89,460`. Shows on 246 live pages | Looks broken at the moment of purchase |
| F5 | Product schema claims fixed price + InStock on Amazon *search* URLs | `generateProductSchema()` in `scripts/generator/helpers.js:661`, plus `generate-reader-pages.js:210` and `generate-car-pages.js:155`. 564 offers site-wide | Risk under Google's structured data policies, and prices are stale |
| F6 | Search URLs instead of product URLs | 62 of 70 cards use `amazonSearchUrl`. Only 1 has `amazonDirectUrl` | Extra step before purchase, lower conversion |
| F7 | Affiliate tags hardcoded in about 150 places | `data/sdcards.json` (75), `data/sdcards-ja.json` (37), 10 each in `generate-device-pages.js`, `generate-guides.js`, `generate-resource-pages.js`, 3 in `amazon-badges-generator.js` | Can't switch store or tag per locale or section without a central link builder |
| F8 | About 760 translated templated pages of unproven value | JA had 210 impressions/week, 0 clicks. DE/FR/IT have no data yet | "Scaled content" risk and maintenance cost |
| F9 | Templated FAQ rules produce shaky claims | e.g. Steam Deck "Is V30 required? Yes" and "Not below V30" | Trust and accuracy |
| F11 | About 54 pages run no ads | `card-page.html`, `cards-index.html`, `car-nav.html`, `cars-index.html`, `compare.html` in `src/templates/` lack `{{GROW_SCRIPT}}`: 34 card pages, 15 car pages, compare, 2 indexes | Lost Mediavine revenue on high-intent pages |
| F10 | Repo clutter | About 190 status `.md` files in root, junk files from shell accidents (`console.log(r.name`, `!jaIds.includes(id))`, `$null`, `0])`), `devices.json.bak`, `tmp_onex_home.html` | Slows every maintainer and agent |

---

## 2. Principles

1. **Measure before scaling.** Nothing in Phase 3+ ships until Sprint 1 analytics has 2 to 4 weeks of data.
2. **Trust is the asset.** Sponsored placements stay labeled and separate from editorial picks. No fake first-party testing (see `REAL_WORLD_EVIDENCE_KANBAN.md`).
3. **Depth over page count.** New pages must answer something the answer box can't. No mass pSEO.
4. **Copy follows `BRANDING_UX_UI_GUIDE.md`** and passes `npm run lint:copy`.
5. **Never edit `data/devices.json`** directly. Edit `data/categories/*.json` (see `ADD_A_DEVICE.md`).

---

## 3. Sprint 1: Stop the leaks and start measuring (Oct 2 to Oct 16)

**Why first:** Every later phase depends on knowing what earns, and non-US traffic currently pays nothing. Detailed engineering handoff: `HANDOFF_SPRINT_1.md`.

### Account actions (P)

- [ ] **(P)** Find out why `sd-cc-22` (Amazon JP) isn't live: never approved, rejected, or closed? Amazon closes accounts with no qualifying sales in the first 180 days, and that may be what happened here. Reapply or appeal. Record the outcome in this file.
- [ ] **(P)** Apply to Amazon Associates for UK, CA, DE, FR, IT (and ES if a Spanish locale is ever planned). Each marketplace issues its own tag. Record tags in the table in section 9.
- [ ] **(P)** Once approved, link the accounts to the US account and turn on Amazon OneLink. Check which marketplaces OneLink currently supports. Fallback if coverage is poor: Geniuslink (paid, covers all stores).
- [ ] **(P)** In the US Associates dashboard, create per-section tracking IDs (Amazon allows up to 100): `sdcc-device-20`, `sdcc-card-20`, `sdcc-calc-20`, `sdcc-guide-20`, `sdcc-compare-20`, `sdcc-reader-20`, `sdcc-car-20`. Exact names are up to you; put the final list in section 9.
- [ ] **(P)** Create a GA4 property (privacy policy already says GA). Confirm Mediavine's consent banner covers GA for EU visitors. Hand the measurement ID to dev.
- [ ] **(P)** Pull fresh GSC data (last 3 months, by page, query, country) and update `GSC_ANALYSIS.md`. Export the country split for sizing F1.

### Engineering (D)

- [ ] **(D)** Fix "(Mapped)" names (F4). 15 minutes.
- [ ] **(D)** Add `{{GROW_SCRIPT}}` to the 5 templates that lack it so card, car and compare pages run ads (F11). Check with Pietro that Mediavine is fine with ads on the compare tool.
- [ ] **(D)** Add GA4 site-wide through `generateGrowScript()` (or a sibling `generateAnalyticsScript()`), and verify that the existing `gtag()` calls in `compare.js` and `calculator-ui.js` start firing (F2).
- [ ] **(D)** Add one delegated outbound-click listener that sends `affiliate_click` with `{store, tag, page_type, device, card, slot, locale}` (F2).
- [ ] **(D)** Build a central link builder `scripts/lib/affiliate.js`, config in `data/affiliate-config.json`. Route all generators and data URLs through it. Strip UTMs from Amazon links (F3, F7).
- [ ] **(D)** Per-locale store + tag from config. DE/FR/IT go to amazon.de/.fr/.it once tags exist. Until then they keep amazon.com (no worse than today) (F1).
- [ ] **(D)** Per-section tracking IDs from config (F1, F2).
- [ ] **(D)** Remove or fix the fake `offers` in Product schema (F5).
- [ ] **(D)** Add a build check that fails if any Amazon link in `dist/` lacks a tag or uses a store that doesn't match its locale.

**Done when:** GA4 shows `affiliate_click` events by page type. Zero "(Mapped)" strings in `dist/`. No Product schema with invented prices. Changing a tag means editing one config file.

---

## 4. Sprint 2: Holiday season (Oct 16 to Nov 5, hard deadline)

**Why:** Black Friday is Friday November 27, 2026, Cyber Monday November 30. Pages need to be live and crawled by early November. Steam Deck, Switch 2, drones and action cams are gift-season products.

- [ ] **(D)** `/deals/` hub page plus 4 to 6 category deal pages (gaming handhelds, Switch 2 / microSD Express, drones, action cams, cameras). Content: what a good price per GB looks like for each card tier, which cards to buy at what capacity, what to avoid (fakes). Evergreen URL, refresh copy each sale. No fake "X% off" claims we can't verify live.
- [ ] **(D)** Link deal pages from the home page, relevant category pages and the top 20 device pages during the season.
- [ ] **(P)** Turn on Grow.me email capture (or equivalent) with a "deal alerts" sign-up on deal pages and top device pages.
- [ ] **(P)** Send 2 to 3 deal emails between November 20 and December 2.
- [ ] **(P/D)** Check whether there's an October Amazon Prime event this year and whether a light version of the deals pages can ship for it.

**Done when:** Deal pages are indexed (check GSC URL inspection) by November 10 and the email list is collecting sign-ups.

---

## 5. Phase 3: User value and new search demand (Nov to Dec 2026)

Prioritize by GSC impressions once fresh data is in.

### 5a. Troubleshooting content (main new content line)

People searching for an error have high intent and answer boxes cover them poorly.

- [ ] **(D)** Add a `troubleshooting` field to the device schema (list of `{symptom, cause, fix}`), rendered as a section on the device page.
- [ ] **(D)** Fill it for the top 30 devices by impressions. Sources: manufacturer support pages, release notes. Cite them. No invented fixes.
- [ ] **(D)** Decide if the 5 to 10 biggest error topics deserve standalone pages (e.g. "SD card not recognized on Steam Deck"). Only where search demand is shown in GSC or keyword tools.

### 5b. "How much fits" tables on device pages

- [ ] **(D)** Reuse the calculator engine to render a per-device table: capacity vs hours of footage at the device's main recording modes. Needs bitrate per mode in device data; start with action cams, drones and cameras where `data/calculator-presets.json` already has numbers.
- [ ] **(D)** Test a title variant on 10 pages ("…and how many hours fit") and compare CTR against 10 control pages after 3 weeks.

### 5c. Card vs card comparison pages

- [ ] **(D)** Generate static pages for the top 30 card pairs people actually search (e.g. Samsung EVO Select vs SanDisk Extreme). Pick pairs from keyword data, not all combinations.
- [ ] **(D)** Reuse `generate-compare.js` rendering.

### 5d. Card compatibility checker

- [ ] **(D)** Interactive "Will this card work in my device?" tool on top of existing card and device data. Output: works / works but slower / won't work, with the reason.
- [ ] **(D)** Link it from every device and card page.

### 5e. Fake card hub

- [ ] **(D)** Expand `/guides/is-my-sd-card-fake/` into a step-by-step flow: H2testw (Windows) and F3 (Mac/Linux) instructions, a price sanity check (a 1TB card for $15 is fake), what to do with a fake (return, report).

### 5f. Content accuracy

- [ ] **(D)** Audit the FAQ generator rules (`scripts/generator/generateFAQs*.js`) for blanket claims like "V30 required" that don't fit every device type (F9).
- [ ] **(D)** Add "Last verified: <date>" to device pages, driven by a `lastVerified` field.
- [ ] **(D)** Continue `REAL_WORLD_EVIDENCE_KANBAN.md` Phase 3 (measure CTR on treated pages) once analytics is live.

---

## 6. Phase 4: Traffic beyond Google and new income (Q1 2027)

### Traffic

- [ ] **(D)** Publish the compatibility dataset as open JSON (`/data/compatibility.json`) with a short docs page and a license that requires attribution. Pitch it to subreddit wikis (r/SteamDeck, r/SBCGaming, r/dji, r/gopro) and tech writers. Goal: backlinks.
- [ ] **(D)** Embeddable "card checker" widget (iframe or script) for blogs and forums, with a link back.
- [ ] **(P)** Community presence: answer real questions in the subreddits above, link only when the page is the best answer.
- [ ] **(D)** Track AI referrals (chatgpt.com, perplexity.ai, gemini) in GA4. Keep `llms.txt` current.
- [ ] **(D)** Submit sitemaps to Bing Webmaster Tools and add IndexNow on build.
- [ ] **(P)** Launch calendar for new devices (Nintendo, DJI, GoPro, Valve, Sony, Canon, Fujifilm, Anbernic). Ship device pages around announcement day. This worked for Legion Go S and Switch 2.

### Income

- [ ] **(P)** Apply to B&H Photo and Adorama affiliate programs. Add as a second "buy" option on camera, drone and reader pages.
- [ ] **(P)** Apply to direct brand programs: ProGrade, Lexar, Kingston (formalize the existing Kingston promotion), Samsung if available.
- [ ] **(D)** Adjacent higher-priced products: portable SSD and card reader recommendations on camera and drone pages ("offload in the field").
- [ ] **(P)** Direct sponsorship packages for card brands: labeled "Sponsored" slot, never replaces editorial picks. Write a one-page rate card once traffic justifies it.
- [ ] **(D)** Increase pages per session for Mediavine: link device pages to relevant calculators, troubleshooting and compare pages.

### Product links

- [ ] **(D)** Move the top 20 cards from search URLs to product URLs with `amazonDirectUrl` per marketplace (F6). Once there are enough qualifying sales, use Amazon's product API for real prices and availability.

---

## 7. Platform track (ongoing, low effort)

- [ ] **(D)** Move status/history `.md` files from root into `docs/archive/`. Keep in root: `README.md`, `ADD_A_DEVICE.md`, `BRANDING_UX_UI_GUIDE.md`, `ARCHITECTURE.md`, `DATA_WORKFLOW.md`, this plan, the active handoff, active kanbans (F10).
- [ ] **(D)** Delete junk files: `console.log(r.name`, `!jaIds.includes(id))`, `$null`, `0])`, `data/devices.json.bak`, `tmp_onex_home.html`, `*.log`, `output.txt`. Confirm each is untracked or unused first (F10).
- [ ] **(D)** CI (GitHub Actions): `npm run build:all`, `npm run lint:copy`, `npm run validate:cards`, `npm run check:recs`, `npm run check:locale-drift`, plus the affiliate link check from Sprint 1, on every push.
- [ ] **(P)** Locale decision after 8 weeks of GA4 + GSC data: for each of JA/DE/FR/IT, keep and invest, keep as is, or noindex/prune. Criteria in section 8 (F8).
- [ ] **(D)** Write commit messages that say what changed (many recent commits are `-` or `.`).

---

## 8. KPIs

Baseline gets filled in at the end of Sprint 1, once analytics exists.

| Metric | Source | Baseline | Target (end Q1 2027) |
|---|---|---|---|
| Organic clicks / week | GSC | TBD | 2x baseline |
| Site CTR | GSC | 0.30% (Jan 2026) | 0.6% |
| Affiliate clicks / 1,000 sessions | GA4 `affiliate_click` | TBD | +50% |
| Affiliate revenue / month, by marketplace | Associates dashboards | US only | 4+ marketplaces earning |
| Ad RPM, pages per session | Mediavine | TBD | Pages per session +20% |
| Email subscribers | Grow.me | 0 | 1,000 |
| Referring domains | GSC Links / Ahrefs free | TBD | +30 |

**Locale keep/prune rule (decide ~mid-December):** a locale earns its keep if, over 8 weeks, it gets at least 5% of total organic clicks **or** shows a rising click trend with a working affiliate tag. Otherwise noindex its device pages and keep only home + guides.

---

## 9. Reference: affiliate tags and tracking IDs

Fill in as accounts are approved. This table is the human record; `data/affiliate-config.json` (created in Sprint 1) is the source of truth the build reads.

| Marketplace | Store | Tag | Status |
|---|---|---|---|
| US | amazon.com | `sd-cc-20` | Live |
| US (Creator Connections) | amazon.com | `uproot01-20` | Live |
| Japan | amazon.co.jp | `sd-cc-22` | **Not live** |
| UK | amazon.co.uk | | Not applied |
| Canada | amazon.ca | | Not applied |
| Germany | amazon.de | | Not applied |
| France | amazon.fr | | Not applied |
| Italy | amazon.it | | Not applied |

US section tracking IDs: _to be created (see Sprint 1)_.

---

## 10. Open questions and decisions

- **Why is `sd-cc-22` not live?** The answer decides whether JA stays an affiliate locale or becomes ads-only. (P)
- **GA4 vs a cookie-free tool (Plausible, Cloudflare Web Analytics)?** Recommendation: GA4, because the code already calls `gtag()`, it's free, and the privacy policy already names it. Revisit if consent handling becomes a problem.
- **Keep Product schema at all?** Google needs a real offer, review or rating for Product markup. We have no real price or reviews yet, so the safe default is to drop the `ItemList` of Products and keep FAQ, Article and Breadcrumb schema. Re-add when real prices come from Amazon's product API.
- **Hosting:** both `vercel.json` and a Cloudflare Pages `functions/` folder exist. Confirm which one serves production and remove the other's config.

## 11. Not doing (for now)

- More devices purely to grow page count.
- New locales before the keep/prune decision on existing ones.
- Real-world evidence for action cams, handhelds and drones (pilots failed, see that kanban).
- Paid digital products.
