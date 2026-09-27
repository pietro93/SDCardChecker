#!/usr/bin/env node
/**
 * lint-copy.js
 * Flags AI-slop writing patterns in English site copy.
 * Rules come from BRANDING_UX_UI_GUIDE.md > Writing Rules.
 *
 * Usage:
 *   node scripts/lint-copy.js                 # summary by file
 *   node scripts/lint-copy.js --verbose       # every hit
 *   node scripts/lint-copy.js --file data/categories/drones.json --verbose
 *   node scripts/lint-copy.js --rule em-dash  # only one rule
 *
 * English only. Localized files (-ja, -de, -fr, -it, categories-xx) are skipped.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const JSON_SOURCES = [
  'data/categories',
  'data/sdcards.json',
  'data/sdcard-enrichment.json',
  'data/device-enrichment.json',
  'data/calculator-content.json',
  'data/sdCardReaders.json',
  'data/strings/en.json',
  'data/cars-navigation.json',
  'src/data/calculators.json',
];

const HTML_SOURCES = ['src/templates'];

// JS files whose template strings are English page copy.
const TEXT_SOURCES = ['scripts/generator/generateFAQs.js'];

const LOCALE_RE = /-(ja|de|fr|it)\.(html|json)$/;

// Keys that hold machine values, not copy.
const SKIP_KEYS = new Set([
  'id', 'slug', 'imageUrl', 'image', 'url', 'amazonUrl', 'asin', 'searchTerms',
  'category', 'type', 'notes', 'minSpeed', 'minWriteSpeed', 'maxCapacity', 'href', 'icon',
]);

const w = (words) => new RegExp(`\\b(${words.join('|')})\\b`, 'i');

const RULES = [
  { id: 'em-dash', re: /—/ },
  { id: 'spaced-en-dash', re: / – / },
  { id: 'not-x-y', re: /\b(not just|isn't just|aren't just|not only|more than just|it's not about)\b/i },
  // "genuine" is allowed: on this site it means "not counterfeit".
  { id: 'sincerity', re: w(['actually', 'honestly', 'to be honest', 'genuinely', 'truly']) },
  { id: 'hedge', re: w(['really', 'in fact', 'notably', 'simply', 'essentially', 'basically', 'literally']) },
  { id: 'ai-vocab', re: w(['delve', 'delves', 'navigate', 'navigating', 'the landscape', 'landscape of','leverage', 'leverages', 'leveraging', 'robust', 'seamless', 'seamlessly', 'unlock', 'unlocks', 'elevate', 'elevates', 'empower', 'empowers', 'journey', 'game-changer', 'game changer', 'cutting-edge', 'cutting edge', 'next-level', 'supercharge', 'effortless', 'effortlessly', 'hassle-free', 'peace of mind', 'unleash', 'harness', 'realm', 'tapestry', 'testament', 'boasts', 'in today\'s', 'whether you\'re', 'look no further', 'take it to the next level']) },
  { id: 'copula-dodge', re: /\b(serves as|stands as|acts as)\b/i },
  { id: 'signpost', re: /\b(this (page|guide) (covers|explains)|below you'll find|as mentioned (above|earlier)|here's how it works|let's break it down|it's worth noting|it's important to (note|understand)|in this guide)\b/i },
  { id: 'stall-opener', re: /\b(the short version|here's the thing|at the end of the day|that said|simply put|the truth is|to be clear|the bottom line)\b/i },
  { id: 'closing-moral', re: /, (ensuring|highlighting|making it (ideal|perfect)|providing you)\b/i },
  { id: 'fake-range', re: /\bfrom (beginners|casual \w+|hobbyists|amateurs) to (pros|professionals|experts)\b/i },
  { id: 'reassurance', re: /\b(don't worry|no worries|rest assured|worry-free|no pressure)\b/i },
  { id: 'hype', re: w(['perfect', 'ideal', 'ultimate', 'must-have', 'amazing', 'incredible', 'stunning', 'blazing', 'lightning-fast', 'best-in-class', 'unparalleled', 'unmatched']) },
  // "Canvas Go! Plus" is a product name.
  { id: 'exclamation', re: /(?<!\bGo)(?<=[a-z])!(\s|$|<)/i },
  { id: 'uk-spelling', re: /\b(\w+(ise|ised|ising|isation)|colour\w*|favour\w*|behaviour\w*|flavour\w*|honour\w*|centre|metre|litre|grey|licence|catalogue)\b/i,
    // exceptions ending in -ise that are US-correct
    allow: /\b(\w*(advertis\w*|exercis\w*|Heise|surpris\w*|compris\w*|supervis\w*|improvis\w*|noise|rise|wise|promise|premise|expertise|exercise|advise|advised|advising|revise|revised|devise|surprise|surprised|comprise|compromise|enterprise|franchise|supervise|televise|improvise|disguise|merchandise|precise|concise|raise|raised|raising|praise|cruise|poise|bruise|chaise|otherwise|likewise|clockwise|paradise|arise|arising|arised|demise|incise|excise|despise|anise|mise|Denise|Louise|Eloise|Aise)\b)/i },
];

function listFiles(p, exts) {
  const abs = path.join(ROOT, p);
  if (!fs.existsSync(abs)) return [];
  const st = fs.statSync(abs);
  if (st.isFile()) return [p];
  return fs.readdirSync(abs).flatMap((f) => {
    const rel = path.join(p, f).replace(/\\/g, '/');
    const s = fs.statSync(path.join(ROOT, rel));
    if (s.isDirectory()) return listFiles(rel, exts);
    return exts.some((e) => f.endsWith(e)) && !LOCALE_RE.test(f) ? [rel] : [];
  });
}

function walk(node, trail, out) {
  if (typeof node === 'string') {
    out.push({ where: trail.join('.'), text: node });
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, trail.concat(i), out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (SKIP_KEYS.has(k)) continue;
      const label = k === 'name' || k === 'id' ? k : k;
      walk(v, trail.concat(node.id && trail.length <= 1 ? `${node.id}:${label}` : label), out);
    }
  }
}

function htmlStrings(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8')
    // Blank out non-copy blocks but keep their newlines so reported line numbers stay right.
    .replace(/<script[\s\S]*?<\/script>/gi, (m) => (/application\/ld\+json/.test(m) ? m : m.replace(/[^\n]/g, '')))
    .replace(/<style[\s\S]*?<\/style>/gi, (m) => m.replace(/[^\n]/g, ''));
  // Keep copy that lives in attributes (meta description, og:*, alt, title) before stripping tags.
  const ATTR = /\b(?:content|alt|title|aria-label|placeholder)="([^"]*)"/g;
  return src.split(/\r?\n/).map((line, i) => ({
    where: `L${i + 1}`,
    text: [...line.matchAll(ATTR)].map((m) => m[1]).join(' ') + ' ' + line.replace(/<[^>]+>/g, ' '),
  }));
}

function check(text) {
  const hits = [];
  for (const r of RULES) {
    if (!r.re.test(text)) continue;
    if (r.allow) {
      const m = text.match(new RegExp(r.re.source, 'gi')) || [];
      if (m.every((x) => r.allow.test(x))) continue;
    }
    hits.push(r.id);
  }
  return hits;
}

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const onlyFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;
const onlyRule = args.includes('--rule') ? args[args.indexOf('--rule') + 1] : null;

const files = [
  ...JSON_SOURCES.flatMap((p) => listFiles(p, ['.json'])),
  ...HTML_SOURCES.flatMap((p) => listFiles(p, ['.html'])),
  ...TEXT_SOURCES,
].filter((f) => !onlyFile || f === onlyFile.replace(/\\/g, '/'));

const totals = {};
let grand = 0;
for (const f of files) {
  const strings = f.endsWith('.json')
    ? (() => { const o = []; walk(JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')), [], o); return o; })()
    : htmlStrings(f);
  const fileHits = [];
  for (const s of strings) {
    const hits = check(s.text).filter((h) => !onlyRule || h === onlyRule);
    if (hits.length) fileHits.push({ ...s, hits });
  }
  if (!fileHits.length) continue;
  const byRule = {};
  fileHits.forEach((h) => h.hits.forEach((r) => { byRule[r] = (byRule[r] || 0) + 1; totals[r] = (totals[r] || 0) + 1; grand++; }));
  console.log(`\n${f}  (${fileHits.length} strings)  ${Object.entries(byRule).map(([k, v]) => `${k}:${v}`).join(' ')}`);
  if (verbose) {
    fileHits.forEach((h) => console.log(`  [${h.hits.join(',')}] ${h.where}: ${h.text.trim().slice(0, 220)}`));
  }
}
console.log(`\nTotal hits: ${grand}`);
console.log(Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
process.exitCode = grand ? 1 : 0;
