#!/usr/bin/env node

/**
 * Device Enrichment Generator
 * Uses Groq AI to generate supplementary content for device pages
 * Generates rich explanations that complement (not repeat) whySpecs
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Groq = require('groq-sdk').default || require('groq-sdk');

// Initialize Groq client (do this after checking API key)
let groq;

// File paths
const DEVICES_FILE = path.join(__dirname, '../data/devices.json');
const ENRICHMENT_OUTPUT = path.join(__dirname, '../data/device-enrichment.json');
const CACHE_FILE = path.join(__dirname, '.enrichment-cache.json');

// Load existing data
function loadDevices() {
  const data = fs.readFileSync(DEVICES_FILE, 'utf8');
  const parsed = JSON.parse(data);
  // Handle both array and object with devices array
  return Array.isArray(parsed) ? parsed : parsed.devices || [];
}

function loadOrCreateCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Generate enriched explanation using Groq
 * Creates a concise, practical benefit-focused explanation
 * Different from whySpecs to avoid repetition
 */
async function generateExplanation(device, category) {
  const prompt = `You are a tech content writer specializing in SD card recommendations.

Device: ${device.name}
Category: ${category}
Recommended Spec: ${device.sdCard?.type || 'microSD'}
Current explanation (whySpecs): "${device.whySpecs}"

Write 1-2 sentences that answer "what card does this device need?" with a fact the whySpecs doesn't state: the device's top bitrate converted to MB/s, how many hours a common capacity holds, the slot's bus (UHS-I/UHS-II/Express), internal storage, or a known quirk.

Rules (BRANDING_UX_UI_GUIDE.md, Writing Rules):
- Lead with the answer. Numbers over adjectives.
- No em dashes, no exclamation marks, no questions.
- Banned words: ensure, seamless, stunning, perfect, ideal, hassle-free, peace of mind, effortless, unlock, elevate, journey, capture every moment, whether you're, actually, really, truly.
- No closing clause that restates the benefit ("..., so you never miss a moment").
- Only state specs you are certain of. If unsure, restate the card format and speed class plainly.

Example: "The Mini 4K records 4K/30 at up to 100 Mbps, about 12.5 MB/s, well inside a V30 card's 30 MB/s floor. DJI caps the slot at 256GB."

Output only the sentences, no quotes. Run scripts/lint-copy.js on the result and review it by hand before publishing.`;

  try {
    if (!groq) {
      throw new Error('Groq client not initialized');
    }
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`  Error generating for ${device.name}:`, error.message);
    return null;
  }
}

/**
 * Main enrichment pipeline
 */
async function enrichDevices() {
  console.log('Starting Device Enrichment Generation...\n');

  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY not found in .env file');
    process.exit(1);
  }

  // Initialize Groq client now that we have the API key
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const devices = loadDevices();
  let cache = loadOrCreateCache();
  // Start from the existing file so a run only adds missing devices. Entries with
  // reviewedAt were rewritten by hand to BRANDING_UX_UI_GUIDE.md § Writing Rules
  // and must never be regenerated.
  let enrichmentData = fs.existsSync(ENRICHMENT_OUTPUT)
    ? JSON.parse(fs.readFileSync(ENRICHMENT_OUTPUT, 'utf8'))
    : {};
  let processed = 0;
  let cached = 0;

  console.log(`Found ${devices.length} devices to enrich\n`);

  // Process each device
  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];
    const deviceKey = `${device.category}:${device.slug}`;
    const progress = `[${i + 1}/${devices.length}]`;

    // Keep existing and hand-reviewed entries; check cache next
    if (enrichmentData[deviceKey] || cache[deviceKey]) {
      cached++;
      continue;
    }

    // Rate limiting: small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));

    process.stdout.write(`\r${progress} Processing: ${device.name.substring(0, 35).padEnd(35)}`);

    const explanation = await generateExplanation(device, device.category);

    if (explanation) {
      enrichmentData[deviceKey] = {
        deviceName: device.name,
        slug: device.slug,
        category: device.category,
        explanation: explanation,
        generatedAt: new Date().toISOString(),
      };

      cache[deviceKey] = enrichmentData[deviceKey];
      processed++;
    }

    // Save cache periodically (every 10 devices)
    if ((processed + cached) % 10 === 0) {
      saveCache(cache);
    }
  }

  console.log(''); // New line after progress

  // Save enrichment data
  fs.writeFileSync(ENRICHMENT_OUTPUT, JSON.stringify(enrichmentData, null, 2));
  saveCache(cache);

  console.log(`\nEnrichment Complete!`);
  console.log(`Processed: ${processed} new | Cached: ${cached} | Total: ${processed + cached}`);
  console.log(`Saved to: ${ENRICHMENT_OUTPUT}`);
  console.log(`Cache saved to: ${CACHE_FILE}`);
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Run
enrichDevices();
