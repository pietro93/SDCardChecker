#!/usr/bin/env node

/**
 * SD Card Enrichment Generator (Optimized)
 * Uses Groq AI to generate rich descriptions, use cases, best-for categories,
 * and alternative comparisons for SD cards in a SINGLE call per card
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Groq = require('groq-sdk').default || require('groq-sdk');

let groq;

// File paths
const SDCARDS_FILE = path.join(__dirname, '../data/sdcards.json');
const ENRICHMENT_OUTPUT = path.join(__dirname, '../data/sdcard-enrichment.json');
const CACHE_FILE = path.join(__dirname, '.sdcard-enrichment-cache.json');

// Load SD cards data
function loadSDCards() {
  const data = fs.readFileSync(SDCARDS_FILE, 'utf8');
  const parsed = JSON.parse(data);
  return parsed.sdcards || [];
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
 * Generate all enrichment fields in a SINGLE API call (much more efficient)
 */
async function generateEnrichment(card) {
  const prompt = `You are a technical writer specializing in SD cards. Analyze this card and respond with ONLY valid JSON.

Card: ${card.name}
Type: ${card.type}
Specs: Read ${card.specs.readSpeed}, Write ${card.specs.writeSpeed}
Speed Class: ${card.specs.speedClass}
App Performance: ${card.specs.appPerformance}
Price Tier: ${card.priceTier}
Existing Pro: "${card.pros}"

Generate JSON with these fields (MUST be valid JSON):
- richDescription: 3-4 sentence paragraph explaining real-world value
- useCase: 10-15 word phrase for primary target user
- bestFor: Array of 2-4 device categories (choose from: "Action Cameras", "Gaming Handhelds", "Drones", "Smartphones & Tablets", "Mirrorless Cameras", "DSLR Cameras", "Dash Cams", "Security Cameras", "8K Cameras")
- alternatives: 2-3 sentence comparison narrative vs competitors

Example JSON structure:
{
  "richDescription": "SanDisk Extreme is the industry workhorse...",
  "useCase": "Content creators, gamers, videographers",
  "bestFor": ["Action Cameras", "Gaming Handhelds"],
  "alternatives": "Choose Extreme over..."
}

Output ONLY the JSON object, no markdown, no code blocks.`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = response.choices[0].message.content.trim();
    return JSON.parse(text);
  } catch (error) {
    console.error(`  ❌ Error generating enrichment for ${card.name}:`, error.message);
    return null;
  }
}

/**
 * Main enrichment pipeline
 */
async function enrichCards() {
  console.log('🚀 Starting SD Card Enrichment Generation...\n');

  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not found in .env file');
    process.exit(1);
  }

  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const cards = loadSDCards();
  let cache = loadOrCreateCache();
  let enrichmentData = {};
  let processed = 0;
  let cached = 0;
  let failed = 0;

  console.log(`📊 Found ${cards.length} SD cards to enrich\n`);

  // Process each card
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const cardKey = card.id;
    const progress = `[${i + 1}/${cards.length}]`;

    // Check cache first
    if (cache[cardKey]) {
      cached++;
      continue;
    }

    // Rate limiting: delay between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));

    process.stdout.write(`\r${progress} Processing: ${card.name.substring(0, 35).padEnd(35)}`);

    const enrichment = await generateEnrichment(card);

    if (enrichment && enrichment.richDescription && enrichment.useCase) {
      enrichmentData[cardKey] = {
        id: card.id,
        name: card.name,
        richDescription: enrichment.richDescription,
        useCase: enrichment.useCase,
        bestFor: enrichment.bestFor || [],
        alternatives: enrichment.alternatives || '',
        generatedAt: new Date().toISOString(),
      };

      cache[cardKey] = enrichmentData[cardKey];
      processed++;
    } else {
      failed++;
    }

    // Save cache periodically
    if ((processed + cached + failed) % 3 === 0) {
      saveCache(cache);
    }
  }

  console.log(''); // New line after progress

  // Save enrichment data
  fs.writeFileSync(ENRICHMENT_OUTPUT, JSON.stringify(enrichmentData, null, 2));
  saveCache(cache);

  console.log(`\n✅ SD Card Enrichment Complete!`);
  console.log(`📝 Processed: ${processed} new | Cached: ${cached} | Failed: ${failed} | Total: ${processed + cached}`);
  console.log(`💾 Saved to: ${ENRICHMENT_OUTPUT}`);
  console.log(`💿 Cache saved to: ${CACHE_FILE}`);

  // Print sample output
  if (processed > 0) {
    const firstNewCard = Object.values(enrichmentData)[0];
    if (firstNewCard) {
      console.log(`\n📋 Sample output (${firstNewCard.name}):`);
      console.log(JSON.stringify(firstNewCard, null, 2));
    }
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

enrichCards();
