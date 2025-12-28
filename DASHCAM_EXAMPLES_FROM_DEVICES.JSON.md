# Dashcam Entry Examples from devices.json

Here are 3-4 complete dashcam entries from the English dataset to use as templates for adding Japanese market dashcams:

---

## Example 1: VIOFO A229 Duo (Dual-channel dashcam)

```json
{
  "id": "viofo-a229-duo",
  "name": "VIOFO A229 Duo",
  "category": "Action Cameras",
  "slug": "viofo-a229-duo",
  "searchTerms": [
    "viofo a229 sd card",
    "viofo a229 duo microsd",
    "a229 dash cam storage"
  ],
  "sdCard": {
    "type": "High Endurance microSD",
    "minSpeed": "U3 / V30",
    "minWriteSpeed": "30 MB/s",
    "recommendedCapacity": [
      "128GB",
      "256GB"
    ],
    "maxCapacity": "512GB"
  },
  "whySpecs": "The VIOFO A229 Duo records dual-channel 2K video continuously in loop mode. VIOFO officially recommends U3/V30 High Endurance cards to handle the high bitrate and constant rewriting. Non-endurance cards will fail within months; High Endurance cards are rated for years of 24/7 recording.",
  "recommendedBrands": [
    {
      "id": "sandisk-max-endurance"
    },
    {
      "id": "samsung-pro-endurance"
    }
  ],
  "faq": [
    {
      "q": "What capacity should I use for the VIOFO A229?",
      "a": "<b>128GB to 256GB is recommended for the A229 Duo.</b> A 128GB card provides approximately 10-12 hours of dual-channel recording before loop overwrite begins. For longer retention, use 256GB for 20-24 hours of footage."
    },
    {
      "q": "Can I use a non-endurance SD card instead of High Endurance?",
      "a": "<b>No, absolutely not.</b> VIOFO explicitly warns that non-endurance cards will fail quickly due to constant rewriting. Always use High Endurance cards (SanDisk MAX Endurance or Samsung PRO Endurance) to prevent data loss and card failure."
    }
  ],
  "relatedDevices": [
    "nextbase-622gw",
    "wyze-cam-v3",
    "eufy-solocam-s340"
  ],
  "notes": "One of the most popular dual-channel dash cams. VIOFO official documentation specifies U3/V30 High Endurance cards. Very high search volume for 'VIOFO A229 SD card'."
}
```

---

## Example 2: Nextbase 622GW (4K dashcam)

```json
{
  "id": "nextbase-622gw",
  "name": "Nextbase 622GW",
  "category": "Action Cameras",
  "slug": "nextbase-622gw",
  "searchTerms": [
    "nextbase 622gw sd card",
    "nextbase 622 microsd",
    "622gw dash cam storage"
  ],
  "sdCard": {
    "type": "High Endurance microSD",
    "minSpeed": "U3 / Class 10",
    "minWriteSpeed": "30 MB/s",
    "recommendedCapacity": [
      "64GB",
      "128GB",
      "256GB"
    ],
    "maxCapacity": "256GB"
  },
  "whySpecs": "The Nextbase 622GW records 4K video at 30fps with image stabilization. Nextbase officially recommends U3 High Endurance cards (specifically SanDisk MAX Endurance or Samsung PRO Endurance) for reliable continuous recording. The 4K bitrate demands fast write speeds and endurance ratings.",
  "recommendedBrands": [
    {
      "id": "sandisk-max-endurance"
    },
    {
      "id": "samsung-pro-endurance"
    }
  ],
  "faq": [
    {
      "q": "Does the Nextbase 622GW come with an SD card?",
      "a": "<b>No, SD cards are sold separately.</b> Nextbase strongly recommends purchasing a High Endurance card (U3 rated) from their approved list. Using non-approved cards can void your warranty if card failure causes issues."
    },
    {
      "q": "What's the best capacity for 4K recording?",
      "a": "<b>128GB is the sweet spot for most users.</b> A 128GB High Endurance card stores approximately 6-8 hours of 4K footage before loop recording begins. For maximum retention, use 256GB for 12-16 hours of recording."
    }
  ],
  "relatedDevices": [
    "viofo-a229-duo",
    "wyze-cam-v3",
    "eufy-solocam-s340"
  ],
  "notes": "Premium UK dash cam brand with strong search volume. Nextbase official support specifically lists approved High Endurance cards and warns against using non-endurance cards. 256GB is official maximum tested capacity."
}
```

---

## Example 3: Garmin Dash Cam Mini 2 (Compact 1080p dashcam)

```json
{
  "id": "garmin-dash-cam-mini-2",
  "name": "Garmin Dash Cam Mini 2",
  "category": "Dash Cams",
  "slug": "garmin-dash-cam-mini-2",
  "searchTerms": [
    "garmin dash cam mini 2 sd card",
    "garmin mini 2 microsd",
    "garmin dash cam card"
  ],
  "sdCard": {
    "type": "High Endurance microSD",
    "minSpeed": "U3 / Class 10",
    "minWriteSpeed": "10 MB/s",
    "recommendedCapacity": [
      "64GB",
      "128GB",
      "256GB"
    ],
    "maxCapacity": "512GB"
  },
  "whySpecs": "Dash cams constantly rewrite data, which destroys non-endurance cards. A High Endurance card is mandatory. Garmin requires Class 10 minimum, but U3 is recommended for stable 1080p recording and reliability.",
  "recommendedBrands": [
    {
      "id": "sandisk-max-endurance"
    },
    {
      "id": "samsung-pro-endurance"
    }
  ],
  "faq": [
    {
      "q": "Why do I need a 'High Endurance' card for my Garmin?",
      "a": "<b>Because non-endurance cards will fail.</b> Dash cams record in a continuous loop, writing and rewriting data constantly. This intense workload wears out standard cards quickly. High Endurance cards are specifically designed for this and last many times longer."
    }
  ],
  "relatedDevices": [
    "viofo-a229-duo",
    "nextbase-622gw"
  ],
  "notes": "A best-selling compact dash cam. Garmin officially supports up to 512GB."
}
```

---

## Example 4: Wyze Cam v3 (Security camera - also records continuously)

```json
{
  "id": "wyze-cam-v3",
  "name": "Wyze Cam v3",
  "category": "Security Cameras",
  "slug": "wyze-cam-v3",
  "searchTerms": [
    "wyze cam v3 sd card",
    "wyze v3 microsd",
    "wyze cam storage"
  ],
  "sdCard": {
    "type": "microSD (FAT32 or exFAT)",
    "minSpeed": "Class 10 / U1",
    "minWriteSpeed": "10 MB/s",
    "recommendedCapacity": [
      "32GB",
      "64GB",
      "128GB"
    ],
    "maxCapacity": "256GB"
  },
  "whySpecs": "Wyze Cam v3 records continuous video locally to a microSD card. Wyze officially supports and has tested cards up to 256GB. A Class 10 card is the minimum for reliable recording; High Endurance cards are strongly recommended for 24/7 recording to prevent premature failure.",
  "recommendedBrands": [
    {
      "id": "sandisk-max-endurance"
    },
    {
      "id": "samsung-pro-endurance"
    }
  ],
  "faq": [
    {
      "q": "Do I need a special SD card for security cameras?",
      "a": "<b>Yes, always use a High Endurance microSD card for security cameras.</b> Non-endurance cards are not built for constant rewriting and will fail quickly with 24/7 recording. High Endurance cards are specifically designed for this workload and last much longer."
    },
    {
      "q": "What capacity should I get for continuous recording?",
      "a": "<b>64GB to 128GB is ideal for most users.</b> A 64GB card stores approximately 1-2 weeks of continuous video on standard settings. Heavy users or those wanting longer retention should opt for 128GB or 256GB."
    }
  ],
  "relatedDevices": [
    "viofo-a229-duo",
    "nextbase-622gw",
    "eufy-solocam-s340"
  ],
  "notes": "Extremely popular budget security camera with massive search volume. Wyze official documentation confirms microSD support up to 256GB (tested). Requires FAT32 for 32GB or smaller, exFAT for 64GB+."
}
```

---

## Key Patterns for Dashcam Entries

1. **Category**: Can be "Action Cameras", "Dash Cams", or "Security Cameras" (for continuous recording devices)
2. **sdCard Type**: Usually "High Endurance microSD" (critical for dashcams with constant rewriting)
3. **minSpeed**: Typically U3/V30 (30 MB/s sustained write) for dashcams
4. **recommendedBrands**: Almost always SanDisk MAX Endurance + Samsung PRO Endurance
5. **whySpecs**: Emphasize continuous loop recording, heat tolerance, card wear from rewriting
6. **FAQ**: Address:
   - Why High Endurance is mandatory
   - Capacity recommendations for different use cases
   - Loop recording behavior
7. **relatedDevices**: Cross-reference other dashcams, security cameras
8. **notes**: Search volume, official support, max capacity info

---

## For Japanese Dashcams (Comtec, Yupiteru, Kenwood)

When creating entries, consider:
- Comtec ZDR035: 50-60% market share, #1 best-seller
- Yupiteru WDT510c: Amazon Japan best-seller
- Kenwood models: Strong audio/video quality reputation
- All require High Endurance cards for heat resistance in Japanese summers
- Include parking mode specs (24/7 recording = heat stress)
- Mention "aori-unten" (road rage) cultural context in Japanese market
