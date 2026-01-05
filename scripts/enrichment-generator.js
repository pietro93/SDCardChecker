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

Generate a CONCISE, PRACTICAL explanation (2-3 sentences max) for an affiliate card that:
1. Focuses on the USER BENEFIT or REAL-WORLD IMPACT of using the recommended spec
2. Uses completely different angle/wording than the whySpecs provided
3. Is direct, actionable, and fits in a small card (no jargon)
4. Does NOT contradict or repeat the whySpecs
5. Is written in present tense, conversational tone

Example format: "Using [spec] ensures smooth recording without drops. This means you'll capture every moment without technical hiccups."

Output ONLY the explanation text, no quotes, no bullet points. Just 2-3 sentences.`;

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
    console.error(`  ❌ Error generating for ${device.name}:`, error.message);
    return null;
  }
}

/**
 * Main enrichment pipeline
 */
async function enrichDevices() {
  console.log('🚀 Starting Device Enrichment Generation...\n');

  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not found in .env file');
    process.exit(1);
  }

  // Initialize Groq client now that we have the API key
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const devices = loadDevices();
  let cache = loadOrCreateCache();
  let enrichmentData = {};
  let processed = 0;
  let cached = 0;

  console.log(`📊 Found ${devices.length} devices to enrich\n`);

  // Process each device
  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];
    const deviceKey = `${device.category}:${device.slug}`;
    const progress = `[${i + 1}/${devices.length}]`;

    // Check cache first
    if (cache[deviceKey]) {
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

  console.log(`\n✅ Enrichment Complete!`);
  console.log(`📝 Processed: ${processed} new | Cached: ${cached} | Total: ${processed + cached}`);
  console.log(`💾 Saved to: ${ENRICHMENT_OUTPUT}`);
  console.log(`💿 Cache saved to: ${CACHE_FILE}`);
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Run
enrichDevices();
