# Nintendo Branded Cards & Switch 2 Implementation

## Changes Made

### 1. New SanDisk Nintendo-Branded microSD Cards (sdcards.json)

Added 10 new officially licensed SanDisk cards for Nintendo Switch:

1. **sandisk-nintendo-zelda-microsd** - Legend of Zelda Tears of the Kingdom (64GB-1TB)
2. **sandisk-nintendo-pokemon-gengar-microsd** - Pokémon Gengar (512GB)
3. **sandisk-nintendo-pokemon-snorlax-microsd** - Pokémon Snorlax (1TB)
4. **sandisk-nintendo-pokemon-pikachu-microsd** - Pokémon Pikachu (256GB)
5. **sandisk-nintendo-yoshi-microsd** - Yoshi Edition (64GB-128GB)
6. **sandisk-nintendo-animal-crossing-microsd** - Animal Crossing Leaf (256GB-512GB)
7. **sandisk-nintendo-mario-mushroom-microsd** - Super Mario Mushroom (64GB-256GB)
8. **sandisk-nintendo-mario-star-microsd** - Super Mario Super Star (128GB-256GB)
9. **sandisk-nintendo-fortnite-cuddle-microsd** - Fortnite Cuddle Team Leader (128GB)
10. **sandisk-nintendo-fortnite-skull-microsd** - Fortnite Skull Trooper (256GB)

**Specifications:**
- All cards: UHS-I, V30, A1 rated
- Read speeds: Up to 100 MB/s
- Write speeds: Up to 90 MB/s
- Image path: `/img/cards/nintendo-switch/`
- Tier: Recommended (Premium price tier)

**Important Note:** These are UHS-I only cards. They work in Nintendo Switch 2 for legacy games but will NOT utilize SD Express speeds due to their UHS-I architecture limitation.

---

### 2. Standalone Nintendo Switch Device Entries (devices.json)

#### Updated Nintendo Switch (Original)
- Made entry completely standalone
- Removed references to "the original Switch" when describing OLED/Lite
- Updated minSpeed from "Class 10 / U1" to "Class 10 / UHS-I"
- Updated recommendedCapacity to 128GB-512GB (realistic for digital gaming)
- Enhanced whySpecs to explain UHS-I ceiling and why expensive cards don't help
- Updated recommended brands to include new Nintendo-branded cards
- New FAQs addressing capacity and speed myths

#### Updated Nintendo Switch OLED
- Made entry completely standalone
- Added distinction about 64GB internal storage driving higher capacity purchases
- Updated minSpeed to "Class 10 / UHS-I"
- Updated recommendedCapacity to 256GB-1TB (higher than Switch due to OLED screen encouraging downloads)
- New FAQ specifically about UHS-II cards not being beneficial
- Updated recommended brands to include Pokémon Snorlax and Zelda cards

#### Updated Nintendo Switch Lite
- Made entry completely standalone
- Emphasized portable nature and reliability needs for travel
- Updated minSpeed to "Class 10 / UHS-I"
- Updated recommendedBrands to use Nintendo-branded cards
- New FAQ about capacity recommendations for Lite users

---

### 3. NEW: Nintendo Switch 2 Entry (devices.json)

**Full entry for next-generation console:**

**Key Details:**
- Supports both **microSD (backward compatible)** and **SD Express (new)**
- minSpeed: UHS-I for backward compat / SD Express Recommended
- Recommended Capacities: 512GB-2TB
- Max Capacity: 2TB+ (SDUC theoretical)

**whySpecs Highlights:**
- SD Express enables speeds up to 985 MB/s (vs UHS-I's 104 MB/s)
- Backward compatible with all original Switch microSD cards
- Switch 2-optimized games may require SD Express for optimal performance
- V60 or faster cards recommended for next-gen titles

**FAQs Included:**
1. Backward compatibility with original Switch cards
2. Whether Switch 2 games require SD Express
3. Compatibility of official Nintendo-branded microSD cards (clarifying UHS-I limitation)

**Related Devices:** Links to all original Switch models

---

## Architecture Notes

### Standalone Device Entries
Each Nintendo Switch entry now includes:
- Complete spec information independent of other models
- Dedicated whySpecs explaining hardware limitations
- Recommendations reflecting each model's actual use case
- Hardware interface explanations (UHS-I ceiling, why UHS-II doesn't help)

### Nintendo-Branded Card Compatibility
- **Original Switch/Lite/OLED:** Full speed performance (UHS-I)
- **Switch 2:** Backward compatible but limited to UHS-I speeds
  - Cards will work for legacy games
  - Won't access SD Express performance
  - This is a hardware limitation, not a card issue

### Card Type Consistency
All Nintendo-branded cards use:
- Type: microSD
- UHS: UHS-I
- Speed Class: V30
- App Performance: A1
- Tier: Recommended

---

## Search Terms Added

Switch entries now include more specific search terms:
- "switch sd card"
- "switch storage"
- "switch memory card"
- "switch lite storage"
- "switch oled storage"
- "sd express switch 2"
- "switch 2 storage"

---

## Image Files Required

Ensure these image files exist in `/img/cards/nintendo-switch/`:
```
sandisk-zelda.webp
sandisk-pokemon-gengar.webp
sandisk-pokemon-snorlax.webp
sandisk-pokemon-pikachu.webp
sandisk-yoshi.webp
sandisk-animal-crossing.webp
sandisk-mario-mushroom.webp
sandisk-mario-star.webp
sandisk-fortnite-cuddle.webp
sandisk-fortnite-skull.webp
```

---

## Status

✓ sdcards.json - Updated with 10 new Nintendo-branded cards
✓ devices.json - Updated 3 existing Switch entries + added Switch 2
✓ JSON validation - Both files validated with no errors
✓ Card compatibility documented throughout
✓ Backward compatibility clearly explained in Switch 2 FAQs
