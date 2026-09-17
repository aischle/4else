#!/usr/bin/env node
/* ============================================================
   4else — translation integrity check
   ------------------------------------------------------------
   German (de) is the source. Every other message file present
   in messages/ must carry exactly the same keys, the same
   rich-text tags and the same ICU placeholders. German itself
   is checked for Swiss orthography.

   Run: npm run check:i18n
   ============================================================ */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'messages');
const load = (l) => JSON.parse(readFileSync(join(dir, `${l}.json`), 'utf8'));

const SOURCE = 'de';
const TARGETS = readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .filter((l) => l !== SOURCE);

/* Strings that must never appear in German output. */
const BANNED_DE = [
  [/ß/, 'sharp s — Switzerland writes "ss"'],
  [/\[(DE|TODO)\]/, 'placeholder left in the copy'],
];

const flatten = (obj, prefix = '') =>
  Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flatten(v, key));
    else acc[key] = v;
    return acc;
  }, {});

const tags = (s) => (String(s).match(/<\/?[a-zA-Z]+>/g) ?? []).sort().join(',');
const icu  = (s) => (String(s).match(/\{[a-zA-Z]+\}/g) ?? []).sort().join(',');

const source = flatten(load(SOURCE));
const failures = [];
const fail = (locale, key, msg) => failures.push(`${locale}  ${key}\n      ${msg}`);

for (const [key, value] of Object.entries(source)) {
  for (const [pattern, msg] of BANNED_DE) {
    if (pattern.test(String(value))) fail(SOURCE, key, msg);
  }
}

for (const locale of TARGETS) {
  const target = flatten(load(locale));

  for (const key of Object.keys(source)) {
    if (!(key in target)) { fail(locale, key, 'missing key'); continue; }
    const de = source[key];
    const tr = target[key];
    if (tags(de) !== tags(tr)) fail(locale, key, `rich-text tags differ — de[${tags(de)}] ${locale}[${tags(tr)}]`);
    if (icu(de) !== icu(tr))   fail(locale, key, `ICU placeholders differ — de[${icu(de)}] ${locale}[${icu(tr)}]`);
  }

  for (const key of Object.keys(target)) {
    if (!(key in source)) fail(locale, key, 'key not present in the German source');
  }
}

if (failures.length) {
  console.error(`\ni18n check failed — ${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ${f}`);
  console.error('');
  process.exit(1);
}

console.log(`i18n check passed — ${Object.keys(source).length} keys × ${1 + TARGETS.length} locale(s).`);
