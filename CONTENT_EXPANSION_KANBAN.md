# Content Expansion Kanban — Gaming Handhelds

**Created:** 2026-06-18
**Trigger:** Site exited Google sandbox, first real revenue (€147.85 / 30 days). Gaming Handhelds is the 3rd largest category (24 devices) but punches above its weight in the top-50 pages report (Retroid Pocket 6 #2, Miyoo Mini Plus #6, Lenovo Legion Go S #8, Steam Deck #37, ASUS ROG Ally X #47, Analogue Pocket #35).
**Goal context:** Current run-rate ≈ $0.91/device/month average across 163 devices. Reaching $500/mo at a flat rate implies ~551 devices — but revenue is concentrated, not flat, so the better lever is adding devices in categories that already over-index on traffic (this one).

Verified against `data/categories/gaming-handhelds.json` on 2026-06-18 — **none of the 9 devices below currently exist in the dataset.**

---

## 🔴 Backlog (not started)

### High priority — fresh hardware, low competition window
- [x] **ASUS ROG Xbox Ally X** — Shipped as `rog-xbox-ally-x` (new slug — the spec's suggested slug `asus-rog-ally-x` was already taken by the existing 2024 ROG Ally X device, so this is a distinct page). Content centers on the thermal-redesign fix narrative as planned. UHS-II recommendations: Lexar Professional Gold (1800x), SanDisk Extreme (massive capacity), official SanDisk ROG Ally card.
- [x] **Lenovo Legion Go 2** — Shipped as `lenovo-legion-go-gen-2`. OLED/AAA storage-deficit narrative, UHS-II recommendations filtered to 1TB+ (Lexar Professional Gold, Samsung PRO Plus, SanDisk Extreme).
- [x] **MSI Claw 8 EX AI+** — Shipped as `msi-claw-8-ex-ai-plus`. Intel Arc XeSS asset-streaming/stutter narrative, A2-rated picks (SanDisk Extreme, Lexar Play, Kingston Canvas Go Plus). No dedicated product photo exists yet — uses the generic gaming-handheld placeholder image.
- [ ] **OneXPlayer 3** — Same Computex first-mover logic as above. No existing template device for this brand — will need a fresh entry.

### Medium priority — established niche, steady demand
- [ ] **Anbernic RG35XX SP** — GBA SP-style clamshell, dual microSD. Distinct from `anbernic-rg35xx-plus` (different form factor/SKU) — don't conflate, needs its own page for the "best SD card setup" query cluster.
- [ ] **Anbernic RG406H / RG406V** — Mid-range PS2/GameCube emulation default. Key differentiator: needs explicit guidance on 256GB–512GB high-capacity recommendations (ISOs are large) — this is the angle most existing Anbernic pages don't emphasize as strongly.
- [ ] **TrimUI Brick / Brick Pro** — Sub-$100 entry point, trending hard. Content angle: card is doing double duty (custom firmware flash target like CrossMix-OS + storage) — FAQ should cover flashing, not just storage.
- [ ] **Ayn Odin 3 / Odin 2 Portal** — Premium Android emulation tier, users buy higher-tier/more expensive cards. Good candidate for steering toward higher-margin affiliate picks (UHS-II / A2, not budget tier).

### Lower priority — niche but worth a page
- [ ] **Anbernic RG Cube** — Unique 1:1 aspect ratio, smaller dedicated community, lower search volume than the above but still a content gap.

---

## 🟡 Ready for build (spec drafted, awaiting JSON entry)
*(none yet — move items here once specs/FAQs are drafted)*

## 🟢 In Progress
*(none yet)*

## ✅ Done
- [x] **ASUS ROG Xbox Ally X** (`rog-xbox-ally-x`)
- [x] **Lenovo Legion Go 2** (`lenovo-legion-go-gen-2`)
- [x] **MSI Claw 8 EX AI+** (`msi-claw-8-ex-ai-plus`)

*(3/9 shipped — verified via `npm run build:site` + `npm run stats`, Gaming Handhelds now at 27 devices)*

---

## Notes on sequencing
1. Ship the **Computex/first-mover** devices (ROG Xbox Ally X, Legion Go 2, MSI Claw 8 EX AI+, OneXPlayer 3) first — search-volume window for "new hardware + SD card" queries is time-sensitive and closes once tech blogs catch up.
2. The Anbernic/TrimUI/Ayn devices have durable, non-time-sensitive demand — sequence these second, no rush.
3. After this batch (9 devices), re-run `npm run stats` to confirm category count, then revisit GA top-pages report to see whether new pages crack the top 50 and whether Gaming Handhelds' share of traffic grows disproportionately to its share of the catalog — that's the signal this category deserves further investment vs. spreading effort to other categories.
