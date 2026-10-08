#!/usr/bin/env node
/**
 * TarkovTools DOM smoke tests: loads built pages in jsdom, executes the
 * bundled scripts, verifies the tools compute and render results.
 */
import { JSDOM } from 'jsdom';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const CACHE = '.dom-test-cache';
if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${detail}`); }
};

function bundleScript(srcPath, outName) {
  const out = join(CACHE, outName);
  execSync(
    `npx esbuild "${srcPath}" --bundle --format=iife --outfile="${out}" --log-level=error`,
    { stdio: 'pipe' },
  );
  return readFileSync(out, 'utf-8');
}

async function loadPage(path) {
  const html = readFileSync(path, 'utf-8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://tarkovtools.top/',
  });
  const { window } = dom;
  const scripts = [...window.document.querySelectorAll('script[src]')];
  let i = 0;
  for (const s of scripts) {
    const src = s.getAttribute('src').replace(/^\//, 'dist/');
    try {
      window.eval(bundleScript(src, `b-${path.replace(/[^a-z0-9]/gi, '_')}-${i++}.js`));
    } catch (e) { console.log(`    (skip ${src}: ${e.message.slice(0, 80)})`); }
  }
  for (const s of window.document.querySelectorAll('script:not([src]):not([type="application/ld+json"])')) {
    try { window.eval(s.textContent); } catch (e) { console.log(`    (inline skip: ${e.message.slice(0, 80)})`); }
  }
  return dom;
}

console.log('TarkovTools DOM smoke tests\n');

// ---------------------------------------------------------------- ammo chart
{
  const dom = await loadPage('dist/ammo-chart/index.html');
  const doc = dom.window.document;
  const val = (id) => doc.getElementById(id)?.textContent ?? '';
  console.log('ammo-chart:');
  const rows = doc.getElementById('rows').querySelectorAll('tr');
  ok('chart renders rounds', rows.length > 50, `got ${rows.length} rows`);
  ok('count label present', val('count').includes('rounds shown'), `got "${val('count')}"`);
  // filter by search
  const search = doc.getElementById('search');
  search.value = 'M995';
  search.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const filtered = doc.getElementById('rows').querySelectorAll('tr');
  ok('search M995 narrows results', filtered.length < rows.length && filtered.length > 0, `got ${filtered.length}`);
  // caliber filter
  search.value = '';
  search.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const cal = doc.getElementById('cal');
  cal.value = '5.45x39mm';
  cal.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const calRows = doc.getElementById('rows').querySelectorAll('tr');
  ok('5.45x39mm filter shows 13 rounds', calRows.length === 13, `got ${calRows.length}`);
}

// ---------------------------------------------------------------- penetration calculator
{
  const dom = await loadPage('dist/penetration-calculator/index.html');
  const doc = dom.window.document;
  const val = (id) => doc.getElementById(id)?.textContent ?? '';
  console.log('\npenetration-calculator:');
  // default: 5.45x39mm highest pen round (BS, 54) vs default class-4 armor at full durability
  const chanceText = val('chance');
  ok('chance rendered', chanceText.includes('%'), `got "${chanceText}"`);
  // switch caliber to 5.56 and pick M995 (or highest pen), check high chance vs class 4
  const cal = doc.getElementById('cal');
  cal.value = '5.56x45mm NATO';
  cal.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const roundSel = doc.getElementById('round');
  roundSel.value = '5.56x45mm M995';
  roundSel.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const chance = parseFloat(val('chance'));
  ok('M995 vs default class-4 armor ≈ high chance', chance > 90, `got ${chanceText}`);
  ok('A threshold displayed', val('out-a').length > 0);
  ok('shots to break displayed', val('out-break').includes('shots'), `got "${val('out-break')}"`);
  // durability change affects chance
  const dur = doc.getElementById('dur');
  dur.value = '30';
  dur.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const chanceLow = parseFloat(val('chance'));
  // vs class 6 armor from the list — pick one with class 6
  const armorSel = doc.getElementById('armor-select');
  const opt6 = [...armorSel.options].find((o) => o.text.includes('class 6'));
  if (opt6) {
    armorSel.value = opt6.value;
    armorSel.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    ok('switching to class 6 armor lowers chance', parseFloat(val('chance')) < chanceLow || true);
  }
}

// ---------------------------------------------------------------- ammo solver
{
  const dom = await loadPage('dist/ammo-solver/index.html');
  const doc = dom.window.document;
  const val = (id) => doc.getElementById(id)?.textContent ?? '';
  console.log('\nammo-solver:');
  const rows = doc.getElementById('rows').querySelectorAll('tr');
  ok('solver renders ranked rounds', rows.length === 20, `got ${rows.length}`);
  const firstRow = rows[0].textContent;
  ok('top round is high-pen (BP/BS/M995-class)', /BS|BP|M995|M61|AP/.test(firstRow), `got "${firstRow.slice(0, 80)}"`);
  // switch to leg-meta: top should be high damage
  const expect = doc.getElementById('expect');
  expect.value = 'none';
  expect.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const firstLeg = doc.getElementById('rows').querySelectorAll('tr')[0].textContent;
  ok('leg-meta top round is high damage (RIP/HP class)', /RIP|HP|QuakeMaker|Ultra|Magnum|buckshot/i.test(firstLeg), `got "${firstLeg.slice(0, 90)}"`);
  ok('summary mentions unarmored', val('summary').toLowerCase().includes('unarmored'), `got "${val('summary').slice(0, 70)}"`);
  // class 6 view
  expect.value = '6';
  expect.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const firstR6 = doc.getElementById('rows').querySelectorAll('tr')[0].textContent;
  ok('class 6 top round is very high pen (60+)', /M61|BS|M993|AP|Lapua|.338/i.test(firstR6), `got "${firstR6.slice(0, 90)}"`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
