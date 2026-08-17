# Real-World Evidence Content — Kanban

**Last Updated:** August 17, 2026
**Goal:** Improve CTR on device pages by adding cited, real-world data (third-party benchmarks, field reports) alongside the existing spec-based content. Current CTR is stuck around 0.3-0.4% because answer boxes already satisfy the spec question — this content targets the part of the SERP snippet can't answer.
**Not the goal:** More pages, more devices covered. This is a depth play on existing high-traffic pages, not a pSEO expansion.

---

## Strategy

**Prioritize by (impression volume) × (source availability).** Both matter — a high-traffic device with no real data online isn't worth the research time, and a well-documented device with 10 impressions a week doesn't move the needle.

**Source availability by category (from pilot research):**
| Category | Source quality | Notes |
|---|---|---|
| Cameras (mirrorless/DSLR) | Strong | Dedicated benchmark sites exist (alikgriffin.com, cameramemoryspeed.com covers non-action cameras only) |
| Action cameras | Weak | No dedicated benchmark sites; GoPro forums thin/broken; relies on scattered Reddit/community reports |
| Gaming handhelds | Untested | Likely forum/Reddit-only (r/SteamDeck, GBAtemp) |
| Drones | Untested | Likely forum/Reddit-only |
| Everything else | Untested | Check before committing effort |

**Format:** new `realWorldEvidence` field per device, rendered as a short cited block below `whySpecs`. Copy must follow `BRANDING_UX_UI_GUIDE.md` voice (no em dashes, short direct sentences, no hedging).

**Non-negotiable:** every claim is attributed with an outbound link to the real source. Never present sourced data as first-party testing.

---

## Phase 0 — Pilot (validate the concept)

- [x] Research pass on `nikon-z6-ii` — found real benchmark data (alikgriffin.com, cited by Nikon Rumors), drafted a compliant content block
- [x] Run 2-3 more pilots outside the cameras category (one action camera, one gaming handheld, one drone) — see findings below
- [x] Decide go/no-go per category based on pilot results — **cameras only, everything else no-go for now**

### Pilot findings (Aug 17, 2026)

Piloted the top-impression page in each non-camera category: **DJI Osmo Action 4** (action cam), **Anbernic RG35XX Plus H** (handheld), **DJI Mini 4K** (drone).

- **Action cameras — no-go.** The top-ranking "benchmark" articles (cameraegg.org, alikgriffin.com's own Action 4 page, markus-hagner-photography.com) all read as AI-generated/templated SEO listicles on inspection: vague methodology ("40 hours testing" with no protocol, no raw data or graphs), no named author with real credentials, heavy affiliate-link structure. No independent outlet cites any of them (unlike the Nikon pilot, where alikgriffin.com was cross-validated by a Nikon Rumors citation). No attributable Reddit threads with real URLs surfaced either. Confirms the original hypothesis.
- **Gaming handhelds — no-go.** Only generic "Class 10/U1 is enough" buying-guide content, no per-device data. One secondhand anecdote about post-firmware-update lag/corruption turned up but had no source URL to cite. Not usable.
- **Drones — no-go.** Only generic data-recovery-software marketing sites (Wondershare, Stellar, etc.) with unsourced claims like "a good card eliminates 60% of corruption cases" — the kind of unattributed stat that's a red flag on its own, not a citable source.

**Takeaway:** the pass/fail signal isn't "does a benchmark-shaped page exist" — it's "is that page independently cited by someone with no stake in selling cards." That test passed for `nikon-z6-ii` and failed for all three pilots here. Sticking to the plan: Phase 2 stays cameras-only. Re-attempt the other categories in Phase 4 only if forum/Reddit sourcing (not SEO listicles) turns up something concrete — don't retry the same search pattern expecting a different result.

## Phase 1 — Build the pipeline

- [x] Add `realWorldEvidence` field to device schema (array of `{ claim, sourceName, url }`) — added to `data/categories/cameras.json` (`nikon-z6-ii` is the first live entry)
- [x] Add render block to device page template, below the requirements/whySpecs box — `generateRealWorldEvidence()` in `scripts/generator/generate-device-pages.js`, wired into all 5 locale templates via `{{REAL_WORLD_EVIDENCE}}`. English-only (renders empty for other locales, same pattern as the Amazon badges section); no-op when a device has no `realWorldEvidence` entries, so this is safe to leave in the template for every device.
- [ ] Write the research workflow as a repeatable checklist (search patterns that worked: `"<manufacturer/site> <device> memory card benchmark real"`, checking known benchmark sites directly and verifying they're independently cited elsewhere, not just self-published)

## Phase 2 — First real batch (cameras only, top-impression pages)

Target devices, ranked by GSC impressions (per GSC_ANALYSIS.md, verify current numbers before starting):
- [x] Nikon Z6 II — live (`nikonrumors.com` republished Alik Griffin's UHS-II SD benchmark numbers)
- [x] Sony A6700 (588 impr) — **live**. Alik Griffin's 35-card in-camera benchmark (PNY EliteX-Pro90 V90 fastest, ~220 MB/s) independently corroborated by a real user forum thread on DPReview (non-commercial, converges on the same card/finding). DPReview's bot wall blocked direct page verification; confirmed instead via two independent WebSearch queries surfacing consistent snippets from the same thread.
- [x] Canon G7X Mark III (573 impr) — **skip**. Two candidate primary sources exist (Alik Griffin, Imaging Resource) and both individually pass the single-source bar, but neither is cited by or agrees with an independent second outlet's specific numbers. DPReview's own G7X III review returned 403 on every fetch attempt — worth a follow-up check if that page becomes reachable later.
- [x] Sony ZV-E10 (638 impr) — **skip**. No dedicated benchmark page on alikgriffin.com or cameramemoryspeed.com. memorycard-lab.com has a "Speed Test" page but is itself an affiliate/card-comparison site (fails the independence test) and its concrete number was actually for the ZV-E10 II, a different camera. Sony Rumors forum thread had zero raw data.
- [ ] Next candidates: check GSC_ANALYSIS.md for the next tier of camera impressions not yet attempted (note: file's "Last Updated" is stale — Jan 4, 2026 — re-pull live GSC numbers if available before picking the next batch)

## Phase 3 — Measure before scaling

- [ ] Wait 2-4 weeks after Phase 2 ships, compare CTR on treated pages vs. untreated control pages in the same category
- [ ] Only proceed to Phase 4 if CTR moves — this is not guaranteed to work, don't sink time into full-site coverage on faith

## Phase 4 — Expand (conditional on Phase 3 results)

- [ ] Roll out to remaining cameras
- [ ] Attempt weaker categories (action cams, handhelds, drones) using forum/Reddit sourcing, accept lower hit rate
- [ ] Revisit categories marked "untested" above once real research has been done on them

---

## Open questions

- What's an acceptable research-time budget per device? (Pilot took ~5 searches / several minutes for one good source — need a cutoff so weak-source devices get skipped rather than over-invested in.)
- Should low-source-quality devices get a lighter fallback (e.g. just a "reported by users" line without a full data table) instead of being skipped entirely?
