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
- [x] **OneXPlayer 3** — Shipped as `onexplayer-3`. Intel Arc G3 Extreme / 8.8" 144Hz AMOLED narrative, A2/V30 picks (SanDisk Extreme Pro V60, Samsung PRO Plus). No dedicated product photo yet — uses the generic placeholder.

### Medium priority — established niche, steady demand
- [x] **Anbernic RG35XX SP** — Shipped as `anbernic-rg35xx-sp`. Dual-slot setup narrative (Slot 1 OS / Slot 2 ROMs), distinct page from `anbernic-rg35xx-plus`.
- [x] **Anbernic RG406H / RG406V** — Shipped as `anbernic-rg406v-rg406h`. Android 13 / PS2-GameCube emulation narrative, A2-enforced picks (Samsung PRO Plus, SanDisk Extreme), 256GB-512GB capacity guidance.
- [x] **TrimUI Brick / Brick Pro** — Shipped as `trimui-brick`. Custom-firmware-flash narrative (CrossMix-OS), A1/A2 picks (SanDisk Ultra, Samsung EVO Select, Kingston Canvas Select), 64GB/128GB dual-pack guidance.
- [x] **Ayn Odin 3 / Odin 2 Portal** — Shipped as `ayn-odin-3-odin-2-portal`. Premium Android emulation tier, steered toward higher-margin A2/V30 picks (SanDisk Extreme, Samsung PRO Plus, Lexar Professional 1000x), 512GB-1TB guidance.

### Lower priority — niche but worth a page
- [x] **Anbernic RG Cube** — Shipped as `anbernic-rg-cube`. 1:1 square-screen DS/3DS narrative, retro-purist reliability-over-capacity picks (SanDisk Ultra, Samsung EVO Select, Kingston Canvas Go Plus), 128GB sweet spot.

---

## 🟡 Ready for build (spec drafted, awaiting JSON entry)
*(none yet — move items here once specs/FAQs are drafted)*

## 🟢 In Progress
*(none yet)*

## ✅ Done
- [x] **ASUS ROG Xbox Ally X** (`rog-xbox-ally-x`)
- [x] **Lenovo Legion Go 2** (`lenovo-legion-go-gen-2`)
- [x] **MSI Claw 8 EX AI+** (`msi-claw-8-ex-ai-plus`)
- [x] **OneXPlayer 3** (`onexplayer-3`)
- [x] **Anbernic RG35XX SP** (`anbernic-rg35xx-sp`)
- [x] **Anbernic RG406H / RG406V** (`anbernic-rg406v-rg406h`)
- [x] **TrimUI Brick** (`trimui-brick`)
- [x] **AYN Odin 3 / Odin 2 Portal** (`ayn-odin-3-odin-2-portal`)
- [x] **Anbernic RG Cube** (`anbernic-rg-cube`)

*(9/9 shipped — verified via `npm run build:all` + `npm run stats`, Gaming Handhelds now at 33 devices)*

---

## 🖼️ Hero image status

Checked `imageUrl` field for all 9 shipped devices on 2026-06-19. None of these have a *dedicated* photo shot specifically for the device — two reuse a real photo of a closely related predecessor, seven fall back to the generic placeholder.

### Shipped — needs a proper hero
- [ ] **OneXPlayer 3** (`onexplayer-3`) — using generic placeholder (`gaming-handheld-console-placeholder.webp`). **Recommend high priority.** First page on the site for this brand, and it's the flagship first-mover device for the whole batch — visually distinctive 8.8" AMOLED slab, worth a real shot.
- [ ] **Anbernic RG35XX SP** (`anbernic-rg35xx-sp`) — using generic placeholder. **Recommend high priority.** Clamshell GBA SP homage is visually unique vs. every other slab-style handheld already on the site (including other Anbernic pages) — the generic placeholder actively undersells what makes this device distinct, and "what does it look like" is part of the search intent.
- [ ] **Anbernic RG Cube** (`anbernic-rg-cube`) — using generic placeholder. **Recommend high priority.** The 1:1 square-screen form factor is highly distinctive and the placeholder is especially misleading here — confirmed via search there's no existing AYN/Anbernic photo on the site to borrow from.
- [ ] **TrimUI Brick** (`trimui-brick`) — using generic placeholder. **Recommend medium priority.** Distinct boxy "brick" shape with no predecessor photo on the site to reuse; budget-conscious audience may care less about visuals than spec accuracy.
- [ ] **MSI Claw 8 EX AI+** (`msi-claw-8-ex-ai-plus`) — using generic placeholder. **Recommend medium priority.** High-profile Computex device, but visually a fairly standard slab handheld — placeholder is a tolerable stopgap.
- [ ] **AYN Odin 3 / Odin 2 Portal** (`ayn-odin-3-odin-2-portal`) — using generic placeholder. **Recommend medium priority.** Confirmed no existing AYN Odin photo on the site to borrow from; premium-tier device where visual credibility matters for the higher-margin affiliate pitch.
- [ ] **Anbernic RG406H / RG406V** (`anbernic-rg406v-rg406h`) — using generic placeholder. **Recommend low priority.** Visually generic Anbernic slab form factor, similar enough to other Anbernic devices already pictured elsewhere on the site that the placeholder isn't actively misleading.

### Shipped — acceptable stopgap (reused predecessor photo, not a placeholder)
- [x] **ASUS ROG Xbox Ally X** (`rog-xbox-ally-x`) — reuses `asus-rog-ally.webp` (original Ally photo). Low priority to replace: this is a redesign of the same chassis, so the photo is visually close to accurate, just not 100% exact (Xbox branding/colorway differs).
- [x] **Lenovo Legion Go 2** (`lenovo-legion-go-gen-2`) — reuses `lenovo-legion-go.webp` (Gen 1 photo). Low priority to replace: same reasoning, same chassis family, OLED panel differences aren't visible at thumbnail size anyway.

**Overall recommendation:** prioritize sourcing real photos for OneXPlayer 3, Anbernic RG35XX SP, and Anbernic RG Cube first (all visually distinctive, all flagged high above). The two "reused predecessor photo" cases and the Claw/RG406 placeholders aren't urgent.

---

## Notes on sequencing
1. Ship the **Computex/first-mover** devices (ROG Xbox Ally X, Legion Go 2, MSI Claw 8 EX AI+, OneXPlayer 3) first — search-volume window for "new hardware + SD card" queries is time-sensitive and closes once tech blogs catch up. ✅ Done.
2. The Anbernic/TrimUI/Ayn devices have durable, non-time-sensitive demand — sequence these second, no rush. ✅ Done — all 5 shipped (RG35XX SP, RG406H/V, TrimUI Brick, Ayn Odin 3/Odin 2 Portal, RG Cube).
3. **Batch complete (9/9 devices, 2026-06-19).** Gaming Handhelds is now at 33 devices (verified via `npm run stats`). Next: revisit GA top-pages report to see whether new pages crack the top 50 and whether Gaming Handhelds' share of traffic grows disproportionately to its share of the catalog — that's the signal this category deserves further investment vs. spreading effort to other categories.
