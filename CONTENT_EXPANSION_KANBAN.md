# Content Expansion Kanban — 2026 New Verticals

**Created:** 2026-06-23
**Trigger:** "2026 Heavy Hitters" batch (previous kanban, archived below) shipped 9/9 devices. Moving on to two **brand-new categories** not currently in `data/categories/` at all — 3D printing/fabrication and music production hardware — both flagged as underserved pain-point niches with strong "failed job / dropped audio" purchase-intent framing.

**Pre-check against existing dataset (2026-06-23):** Verified via `data/categories/` listing (10 existing category files: action-cameras, audio-and-hi-fi, cameras, computing-and-tablets, dash-cams, drones, gaming-handhelds, security-cameras, smartphones, + accessories) and grep of all proposed device names.
- ⚠️ **No 3D-printers category exists.** All 7 proposed devices (Bambu Lab X1-Carbon/P1S/A1, Creality Ender 3 V3/K1 SE, Prusa MK4, Elegoo Neptune 4) confirmed missing.
- ⚠️ **No music-production/synth category exists.** `audio-and-hi-fi.json` only covers consumer DAPs and field recorders (Zoom/Tascam), not samplers/synths. All 6 proposed devices (Akai MPC One+/MPC Live II, Teenage Engineering EP-133/OP-1, Roland SP-404MKII, Elektron Digitakt II) confirmed missing.
- **Scope note:** unlike the last two batches (new devices in existing categories), this batch requires **new category infrastructure** first: a new `data/categories/*.json` file, a registry entry in `scripts/generator/generate-categories-index.js` (`getCategoryDescriptions()` + `getCategoryIcon()`), and a new category icon asset — per category, before any device pages can ship.

---

## 🔴 Backlog (not started)

### New category: 3D Printers & Fabrication — "failed print" pain point
*Rationale: G-code is streamed from the card mid-print; a speed hiccup stalls/corrupts a multi-hour, real-material-cost print. Distinct failure mode from anything currently covered (no other category frames "mid-job corruption destroys $50 of consumables").*

**⚠️ Media-type correction (2026-06-23, verified during build):** the card-speed framing only holds for the genuinely microSD-based printers. Verified that **Creality K1 SE, Prusa MK4, and Elegoo Neptune 4 do NOT print from a microSD card** — they print from a **USB flash drive** (Neptune 4 has a microSD slot but Elegoo hid it; it's firmware-only). The kanban's "K1 SE needs a U3 step-up microSD" premise is factually wrong. These 3 are blocked pending a product-strategy decision (catalog has no USB-flash-drive products to recommend). See 🟢 In Progress / open question below.

- [x] **Stand up the category** — created `data/categories/3d-printers.json`, added "3D Printers & Fabrication" to `getCategoryDescriptions()` / `getCategoryIcon()` in `generate-categories-index.js`, generated `img/brand/icon-3d-printer.webp` (sharp from SVG, matches site flat-icon style). Build verified: EN + JA pages + category index generate cleanly.
- [x] **Bambu Lab X1-Carbon** (`bambu-lab-x1-carbon`) — microSD/FAT32. Reliability/integrity framing over speed; A1/A2 name-brand cards, 32–64GB.
- [x] **Bambu Lab P1S** (`bambu-lab-p1s`) — microSD/FAT32, budget-flagship tier; steered to value cards (SanDisk Ultra / EVO Select).
- [x] **Bambu Lab A1** (`bambu-lab-a1`) — microSD/FAT32, open-frame value tier; value cards, discourages capacity/premium upsell.
- [x] **Creality Ender 3 V3** (`creality-ender-3-v3`) — microSD/FAT32, budget FDM; leads with the real-world "SD card not detected = exFAT formatting" issue. Volume play.
- [ ] ~~**Creality K1 SE**~~ — ❌ **DROPPED: prints from USB flash drive, not microSD.** Replaced (user decision 2026-06-23: swap in genuinely-microSD printers).
- [ ] ~~**Prusa MK4**~~ — ❌ **DROPPED: prints from USB flash drive, not microSD.** Replaced.
- [ ] ~~**Elegoo Neptune 4**~~ — ❌ **DROPPED: prints from USB flash drive (microSD slot hidden/firmware-only).** Replaced.
- [x] **Bambu Lab A1 mini** (`bambu-lab-a1-mini`) — microSD/FAT32 (up to 2TB if formatted on-printer), Class 10/U1 per Bambu wiki. Distinctive angles: on-printer FAT32 format for >32GB, non-hot-swappable slot (safe-eject to avoid corruption).
- [x] **Creality Ender 3 V3 SE** (`creality-ender-3-v3-se`) — ⚠️ uses a **full-size SD card** (+ USB-C), not microSD. Budget best-seller, huge volume; full-size SD card recs, FAT32 'not reading' fix.
- [x] **Creality Ender 3 V3 KE** (`creality-ender-3-v3-ke`) — microSD (+ WiFi/LAN/USB). High-speed Klipper variant; debunks 'faster printer needs faster card'.

### New category: Hardware Synths, Samplers & Drum Machines — "live dropout" pain point
*Rationale: standalone samplers stream multi-GB WAV libraries in real time during live performance; a card stall mid-set causes an audible dropout in front of an audience — a much higher-stakes failure mode than the home-studio framing already covered by `audio-and-hi-fi.json`'s field recorders.*

- [x] **Stand up the category** — ✅ DONE. Decided on a separate `data/categories/music-production.json` (category name **"Music Production"**, slug `music-production`). Registry wired in all 3 generators (`generate-categories-index.js` descriptions EN+JA + icon, `generate-category-pages.js` icon+intro, `generate-category-pages-ja.js` icon+intro) and `helpers.js` device-image fallbacks. Icon `icon-music-production.webp` is a **distinct 256×256 flat MPC/sampler pad-grid icon** (generated from SVG via `sharp`, matching the charcoal/blue/orange palette of the other category icons). Device hero images are placeholder copies (`img/devices/music-production/`).
- [x] **Akai MPC One+** (`akai-mpc-one-plus`) — full-size SD/SDHC/SDXC slot, up to 2TB; U3 sample-streaming framing, exfat/in-device format note.
- [x] **Akai MPC Live II** (`akai-mpc-live-ii`) — anchors the category; battery standalone, streams audio off the card live, strongest dropout narrative; U3/V30 + A2, up to 2TB.
- [x] **Roland SP-404MKII** (`roland-sp-404mkii`) — full-size SD slot, but card is **import/export/backup only (NOT live-streamed** — samples load to internal 16GB), so framed on reliability + correct in-device formatting over speed; 256–512GB safe range.
- [ ] ~~**Teenage Engineering EP-133 KO II**~~ — ❌ **DROPPED: no SD card slot.** 128MB fixed internal storage, samples transferred via USB-C browser tool only. Not buildable on an SD-card site without fabricating specs. (Verified via teenage.engineering + MusicRadar review, 2026-06-23.)
- [ ] ~~**Teenage Engineering OP-1 / OP-1 Field**~~ — ❌ **DROPPED: no SD card slot.** Internal storage only, mounts over USB-C (MTP). (Verified via teenage.engineering + Sound on Sound, 2026-06-23.)
- [ ] ~~**Elektron Digitakt II**~~ — ❌ **DROPPED: no SD card slot.** 20GB internal flash, file transfer over USB only — community has explicitly requested a card slot that doesn't exist. (Verified via CDM/Synthtopia/Elektronauts, 2026-06-23.)

---

## 🟡 Ready for build (spec drafted, awaiting JSON entry)
*(none yet — move items here once specs/FAQs are drafted)*

## 🟢 In Progress
*(none — 3D Printers complete; Music Production at 3/6, see notes there)*

## ✅ Done

### 3D Printers & Fabrication (new category) — shipped 2026-06-23, 7/7
- [x] **Bambu Lab X1-Carbon** (`bambu-lab-x1-carbon`)
- [x] **Bambu Lab P1S** (`bambu-lab-p1s`)
- [x] **Bambu Lab A1** (`bambu-lab-a1`)
- [x] **Bambu Lab A1 mini** (`bambu-lab-a1-mini`)
- [x] **Creality Ender 3 V3** (`creality-ender-3-v3`)
- [x] **Creality Ender 3 V3 SE** (`creality-ender-3-v3-se`) — full-size SD
- [x] **Creality Ender 3 V3 KE** (`creality-ender-3-v3-ke`)

*Category "3D Printers & Fabrication" stood up from scratch: `data/categories/3d-printers.json` + registry (`getCategoryDescriptions()`/`getCategoryIcon()`) + real `img/brand/icon-3d-printer.webp` (generated via sharp from SVG, matches site flat-icon style). Verified via `npm run build:site`: merges 7 devices, generates EN + JA device pages + category landing (7 devices listed), all recommended card IDs resolve (incl. full-size SD IDs for the V3 SE), no new build warnings. Hero images are placeholders pending the image pipeline.*

**3/7 of the originally-proposed devices were dropped** because they print from a **USB flash drive, not an SD card** (K1 SE, Prusa MK4, Neptune 4 — verified during build). Per user decision, replaced 1:1 with genuinely card-based printers (A1 mini, Ender 3 V3 SE [full-size SD], Ender 3 V3 KE). The catalog has no USB-flash-drive SKUs, so a future "best USB drive for 3D printer" sub-vertical would need new products in `data/sdcards.json` first.

### Music Production (new category) — shipped 2026-06-23, 7 devices
**Original batch (3):**
- [x] **Akai MPC Live II** (`akai-mpc-live-ii`)
- [x] **Akai MPC One+** (`akai-mpc-one-plus`)
- [x] **Roland SP-404MKII** (`roland-sp-404mkii`)

**Expansion (4 — high-SEO additions, user-requested, all verified SD-based):**
- [x] **Akai MPC X** (`akai-mpc-x`) — flagship full-size SD, up to 2TB; completes the MPC trio for a tight internal-linking cluster; UHS-II note (slot runs at UHS-I).
- [x] **Polyend Tracker+** (`polyend-tracker-plus`) — microSD, **FAT32-only** (MBR), streams from card; A1/A2 + the "FAT32 = card not recognized" fix as the hook. 128GB tested / 512GB reported.
- [x] **Roland MC-707 Groovebox** (`roland-mc-707`) — SD/SDHC **strict 32GB limit** (no SDXC); reuses the proven Zoom-H1n "why won't my big card work?" template.
- [x] **1010music Blackbox** (`1010music-blackbox`) — microSD, **streams up to 32 voices from the card**; 1010music's own A2/V30 recommendation makes it the strongest "premium card genuinely justified" why-specs page in the batch. Up to 1TB.

*Category "Music Production" stood up from scratch (data file + 3-generator registry + icon + image fallbacks). Verified via `npm run build:site`: merges 7 devices, generates EN + JA device pages + category landing, all recommended card IDs resolve, no new build warnings. relatedDevices weave the 7 into MPC / sampler-groovebox clusters.*

**3 of the originally-proposed music devices were dropped because they have no SD card slot** (EP-133 K.O. II, OP-1/OP-1 Field, Digitakt II — all internal-storage + USB-transfer only). Building SD-card pages for them would be fabricated content. Further SD-based candidates if the category needs more depth: Akai Force, MPC Key 61, older Roland SP-404SX/A, Korg electribe sampler. (Avoid Elektron Octatrack — CompactFlash, not SD.)

**Follow-up (low priority):** real device hero photos (currently placeholders) — same image-pipeline path as the prior batch. (Distinct category icon ✅ done — generated via `sharp` from SVG.)

---

## Notes on sequencing
1. Stand up both category shells first (registry + icon + empty JSON file) since every device in the batch is blocked on this — small one-time cost, unblocks everything else.
2. Within 3D printers: ship Bambu Lab (3 devices) and Creality (2 devices) first — highest search volume, most active 2026 product lines. Prusa MK4 and Elegoo Neptune 4 are durable, non-time-sensitive — no rush.
3. Within music production: ship Akai MPC Live II first — it has the strongest, most distinct pain-point narrative (live performance dropout) and should anchor the category's framing for the rest. Roland SP-404MKII second (highest community search volume). Remaining four in any order.
4. Decide early whether music-production devices get their own category file or a sub-section of `audio-and-hi-fi.json` — recommend a separate file given the sampler/synth audience and failure mode (live performance) are meaningfully different from field-recorder/DAP buyers already in that file.

---

# Archive — 2026 Heavy Hitters Kanban (completed 2026-06-19)

**Created:** 2026-06-19
**Trigger:** Gaming Handhelds batch (previous kanban, archived further below) shipped 9/9 devices. Moved on to four under-covered categories flagged for 2026 hardware: flagship mirrorless cameras, next-gen drones, high-endurance dashcams, and pro audio recorders, plus one single-board-computer gap.

**Pre-check against existing dataset (2026-06-19):** Verified each proposed device against `data/categories/*.json` before adding to backlog.
- ⚠️ **Dropped from backlog:** "360 Action Cameras (Insta360 X4, GoPro Max 2)" — both devices **already exist** in `action-cameras.json`. No page gap here; not added below.
- Confirmed genuinely missing: Sony a1 II, Canon EOS R5 Mark II (cameras.json has the originals, not these), DJI Avata 360 + DJI Neo (drones.json has Avata 2, not these), Viofo T130 Pro + Nextbase iQ 4K (dash-cams.json only has 3 devices total — A229 Pro, 622GW, Tesla/Generic), Raspberry Pi Compute Module 5 (computing-and-tablets.json has Pi 5/4/3/Zero 2W, not CM5), Zoom H4essential + Tascam Portacapture X6 (audio-and-hi-fi.json has Zoom H1n-VP/H6 and Tascam DR-05X, not these).

## ✅ Done
- [x] **Sony a1 II** (`sony-a1-ii`)
- [x] **Canon EOS R5 Mark II** (`canon-eos-r5-mark-ii`)
- [x] **DJI Avata 360** (`dji-avata-360`)
- [x] **DJI Neo** (`dji-neo`)
- [x] **Viofo T130 Pro** (`viofo-t130-pro`)
- [x] **Nextbase iQ 4K** (`nextbase-iq-4k`)
- [x] **Raspberry Pi Compute Module 5** (`raspberry-pi-compute-module-5`)
- [x] **Zoom H4essential** (`zoom-h4essential`)
- [x] **Tascam Portacapture X6** (`tascam-portacapture-x6`)

*(9/9 shipped — verified via `npm run build:all`, all nine pages generate cleanly)*

---

# Archive — Gaming Handhelds Kanban (completed 2026-06-18/19)

**Created:** 2026-06-18
**Trigger:** Site exited Google sandbox, first real revenue (€147.85 / 30 days). Gaming Handhelds is the 3rd largest category (24 devices) but punches above its weight in the top-50 pages report (Retroid Pocket 6 #2, Miyoo Mini Plus #6, Lenovo Legion Go S #8, Steam Deck #37, ASUS ROG Ally X #47, Analogue Pocket #35).
**Goal context:** Current run-rate ≈ $0.91/device/month average across 163 devices. Reaching $500/mo at a flat rate implies ~551 devices — but revenue is concentrated, not flat, so the better lever is adding devices in categories that already over-index on traffic (this one).

Verified against `data/categories/gaming-handhelds.json` on 2026-06-18 — **none of the 9 devices below currently exist in the dataset.**

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

### 🖼️ Hero image status (as of 2026-06-19)
- [ ] **OneXPlayer 3** — generic placeholder, high priority for a real photo.
- [ ] **Anbernic RG35XX SP** — generic placeholder, high priority.
- [ ] **Anbernic RG Cube** — generic placeholder, high priority.
- [ ] **TrimUI Brick** — generic placeholder, medium priority.
- [ ] **MSI Claw 8 EX AI+** — generic placeholder, medium priority.
- [ ] **AYN Odin 3 / Odin 2 Portal** — generic placeholder, medium priority.
- [ ] **Anbernic RG406H / RG406V** — generic placeholder, low priority.
- [x] **ASUS ROG Xbox Ally X** — acceptable stopgap, reuses `asus-rog-ally.webp`.
- [x] **Lenovo Legion Go 2** — acceptable stopgap, reuses `lenovo-legion-go.webp`.
