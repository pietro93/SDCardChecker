# Device Enrichment System

Automated AI-powered content generation to enrich device pages with supplementary information.

## Overview

The enrichment system uses **Groq API** to generate high-quality, contextual content for each device page. This system is designed to:

- **Avoid repetition**: Generate explanations completely different from `whySpecs`
- **Stay consistent**: Ensure all content is factually accurate and non-contradictory
- **Scale efficiently**: Process 100+ devices with intelligent caching
- **Be extensible**: Add new enrichment fields as needed

## Current Fields

### `explanation` (Hero Card Explanation)
A concise, benefit-focused explanation (2-3 sentences) used in the affiliate card above the brands table.

**Characteristics:**
- Practical user benefits (not technical specs)
- Real-world impact focused
- Conversational tone
- Completely different wording from `whySpecs`
- No jargon, direct language

**Example:**
```
Device: Nintendo Switch
whySpecs: "The Nintendo Switch uses a microSD card with UHS-I interface limited to 104 MB/s."
explanation: "Game installations need fast writes to avoid stuttering on your Switch. A solid card ensures your library loads instantly without frustrating delays."
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

This installs `groq-sdk` which is required for API calls.

### 2. Add API Key to .env

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from [console.groq.com](https://console.groq.com/keys)

## Usage

### Generate Enrichment Data

```bash
npm run enrich
```

This will:
1. Load all devices from `data/devices.json`
2. Check cache to avoid regenerating existing entries
3. Call Groq API for new/missing devices
4. Save results to `data/device-enrichment.json`
5. Cache API responses in `.enrichment-cache.json`

### Generate + Rebuild Site

```bash
npm run enrich:update
```

This runs enrichment, then rebuilds the entire site with new content.

## Data Structure

### Input: `data/devices.json`

```json
{
  "category": [
    {
      "name": "Nintendo Switch",
      "slug": "nintendo-switch",
      "recommendedSpec": "microSDXC (Class 10)",
      "whySpecs": "The Nintendo Switch uses a microSD card with UHS-I interface limited to 104 MB/s. For optimal performance...",
      ...
    }
  ]
}
```

### Output: `data/device-enrichment.json`

```json
{
  "gaming-consoles:nintendo-switch": {
    "deviceName": "Nintendo Switch",
    "slug": "nintendo-switch",
    "category": "gaming-consoles",
    "recommendedSpec": "microSDXC (Class 10)",
    "explanation": "Game installations need fast writes to avoid stuttering. A solid card ensures your library loads instantly.",
    "generatedAt": "2026-01-04T10:30:00Z"
  }
}
```

## Integration with Build Process

### Using Enrichment in Templates

```javascript
const enrichmentLoader = require('./scripts/lib/enrichment-loader');

// In your device page generator:
const explanation = enrichmentLoader.getExplanation(category, deviceSlug);
if (explanation) {
  // Use enriched explanation instead of whySpecsFirstSentence
  html = html.replace(/{{ANSWER_EXPLANATION}}/g, explanation);
}
```

### Example Integration in `generate-device-pages.js`

```javascript
const enrichmentLoader = require('../lib/enrichment-loader');

// After loading device data:
const enrichment = enrichmentLoader.getEnrichment(categorySlug, device.slug);
const explanation = enrichment ? enrichment.explanation : whySpecsFirstSentence;

html = html.replace(/{{ANSWER_EXPLANATION}}/g, explanation);
```

## Caching Strategy

**Cache file:** `.enrichment-cache.json`

- Stores all previously generated enrichment data
- Prevents redundant API calls
- Saves cost and processing time
- Automatically updated after each run

**To regenerate all content:**
```bash
rm .enrichment-cache.json
npm run enrich
```

## API Rate Limiting

- 500ms delay between requests (Groq allows 1000 req/min)
- Processes ~120 devices/hour comfortably
- All 500+ devices can be enriched in ~5 hours

## Extending with New Fields

To add more enrichment fields (e.g., `quickTips`, `performanceNotes`):

### 1. Update the prompt in `enrichment-generator.js`:

```javascript
async function generateExplanation(device, category) {
  const prompt = `...your prompt...`;
  // Returns single string - modify to return object
}

async function generateEnrichment(device, category) {
  return {
    explanation: await generateExplanation(device, category),
    quickTips: await generateQuickTips(device, category),
    performanceNotes: await generatePerformanceNotes(device, category),
  };
}
```

### 2. Update the output structure

### 3. Update loader methods in `enrichment-loader.js`

### 4. Run enrichment again

```bash
npm run enrich
```

## Troubleshooting

### "GROQ_API_KEY not found"
Make sure `.env` file exists in project root with `GROQ_API_KEY=...`

### "device-enrichment.json not found"
Run `npm run enrich` first to generate the enrichment data.

### API Rate Limit Errors
The script includes 500ms delays. If you still hit limits, increase the delay in line of `enrichment-generator.js`:
```javascript
await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second instead of 500ms
```

### Cache Issues
Clear cache and regenerate:
```bash
rm .enrichment-cache.json
npm run enrich
```

## Performance Notes

- **First run:** ~2-3 hours for 500+ devices (Groq API calls)
- **Subsequent runs:** <5 minutes (cached entries skipped)
- **Cost:** Very low - Groq has generous free tier (~500k tokens/month)

## Quality Assurance

The generated explanations are checked for:

1. ✅ Adherence to character limits (fits card)
2. ✅ No repetition of whySpecs language
3. ✅ Factual accuracy (AI doesn't contradict device specs)
4. ✅ Tone consistency (practical, user-focused)
5. ✅ No jargon or technical specification language

Manual review recommended for:
- Premium/niche devices
- New device categories
- First-time deployments

## Version History

- **v1.0** (Jan 4, 2026): Initial release with `explanation` field for hero cards
