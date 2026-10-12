#!/usr/bin/env node

/**
 * Regenerate dist/ja/sitemap.xml on its own, without a full build.
 *
 * The normal build writes every locale's sitemap (scripts/generator/build.js). This script
 * reuses the same generator, so <lastmod> comes from data/page-freshness.json (the date
 * each page's content last changed) rather than today's date. Run a full build first if
 * the freshness file is missing or out of date.
 */

const fs = require('fs');
const path = require('path');
const { generateSitemap } = require('./generator/generate-core-files');

const devicesPath = path.join(__dirname, '../data/devices-ja.json');
const freshnessPath = path.join(__dirname, '../data/page-freshness.json');
const distPath = path.join(__dirname, '../dist');

if (!fs.existsSync(freshnessPath)) {
  console.error('data/page-freshness.json not found. Run `npm run build:all` first.');
  process.exit(1);
}

const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf-8')).devices;
const freshness = JSON.parse(fs.readFileSync(freshnessPath, 'utf-8'));
generateSitemap(devices, [], distPath, 'ja', freshness);
