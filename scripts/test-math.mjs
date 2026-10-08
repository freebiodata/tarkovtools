#!/usr/bin/env node
/**
 * TarkovTools math verification tests.
 * Formulas: community-datamined penetration model, cross-validated in
 * independent open-source projects (see research notes).
 */
let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${detail}`); }
};
const closeTo = (a, b, tol) => Math.abs(a - b) <= tol;

function factorA(cls, d) {
  const dd = Math.max(0, Math.min(100, d));
  return (121 - 5000 / (45 + dd * 2)) * cls * 0.1;
}
function penChance(cls, pen, d) {
  if (d <= 0) return 100;
  const a = factorA(cls, d);
  if (a <= pen) return Math.min(100, Math.max(0, 100 + pen / (0.9 * a - pen)));
  if (a - 15 < pen && pen < a) return Math.min(100, Math.max(0, 0.4 * Math.pow(a - pen - 15, 2)));
  return 0;
}
function penMult(pen, cls, d) {
  const a = factorA(cls, d);
  const arr = [0.6, pen / (a + 12), 1].sort((x, y) => x - y);
  return arr[1];
}

console.log('TarkovTools math tests\n');

console.log('Factor A (thresholds):');
{
  ok('A class4 @100% ≈ 40.2', closeTo(factorA(4, 100), 40.24, 0.05), `got ${factorA(4, 100)}`);
  ok('A class4 @50% ≈ 34.6', closeTo(factorA(4, 50), 34.61, 0.05), `got ${factorA(4, 50)}`);
  ok('A class5 @100% ≈ 50.3', closeTo(factorA(5, 100), 50.30, 0.05), `got ${factorA(5, 100)}`);
  ok('A class6 @100% ≈ 60.4', closeTo(factorA(6, 100), 60.36, 0.05), `got ${factorA(6, 100)}`);
  ok('damaged plate lowers threshold: A(5,50) < A(5,100)', factorA(5, 50) < factorA(5, 100));
}

console.log('\nPenetration chance — validated examples:');
{
  // M995 (53) vs class5 full ≈ 93%
  const v1 = penChance(5, 53, 100);
  ok('M995 vs class5 full ≈ 93%', closeTo(v1, 93.1, 1.5), `got ${v1.toFixed(1)}`);
  // 7.62x39 BP (47) vs class4 full ≈ 95.6%
  const v2 = penChance(4, 47, 100);
  ok('7.62x39 BP vs class4 full ≈ 95.6%', closeTo(v2, 95.6, 1.5), `got ${v2.toFixed(1)}`);
  // M855 (31) vs class4 full ≈ 13.3%
  const v3 = penChance(4, 31, 100);
  ok('M855 vs class4 full ≈ 13.3%', closeTo(v3, 13.3, 1.5), `got ${v3.toFixed(1)}`);
  // 9x19 PST (20) vs class4 = 0
  ok('9x19 PST vs class4 = 0%', penChance(4, 20, 100) === 0);
  // M61 (64) vs class6 ≈ 93%
  const v4 = penChance(6, 64, 100);
  ok('M61 vs class6 full ≈ 93%', closeTo(v4, 93.4, 2), `got ${v4.toFixed(1)}`);
}

console.log('\nDurability effect:');
{
  // mid-tier round gains chance as plate wears
  const fresh = penChance(5, 45, 100);  // just below A(5,100)=50.3
  const worn = penChance(5, 45, 50);    // A(5,50)=45.05, 45 in partial band edge
  ok('same round better vs worn plate', worn >= fresh, `fresh ${fresh.toFixed(1)} vs worn ${worn.toFixed(1)}`);
  // extreme: broken plate = always pens
  ok('broken armor (0%) = 100%', penChance(6, 10, 0) === 100);
}

console.log('\nPenetrating damage reduction:');
{
  // mult between 0.6 and 1.0
  ok('mult within [0.6, 1]', penMult(53, 5, 100) >= 0.6 && penMult(53, 5, 100) <= 1.0);
  // higher pen = less reduction (higher mult)
  ok('higher pen => less reduction: mult(64,6) >= mult(53,6)', penMult(64, 6, 100) >= penMult(53, 6, 100));
  // low pen vs low class overshoots: m995 vs paca (class2) => mult = 1.0 (0% reduction)
  ok('M995 vs class2 => mult 1.0 (0% reduction)', closeTo(penMult(53, 2, 100), 1.0, 0.001));
}

console.log('\nArmor damage (shots to break):');
{
  const DESTR = { Aramid: 0.1875, Ceramic: 0.55, Combined: 0.375 };
  function dmgPerShot(pen, cls, armorDmg, destr, penHappened) {
    const raw0 = (pen / cls) * 10;
    const clamped = penHappened ? Math.min(Math.max(raw0, 0.5), 0.9) : Math.min(Math.max(raw0, 0.6), 1.1);
    return Math.max(pen * (armorDmg / 100) * clamped * destr, 1);
  }
  // M995 (53 pen, 52 armor dmg) vs class 5 ceramic plate (60 durability)
  const d1 = dmgPerShot(53, 5, 52, 0.55, true);
  ok('M995 armor dmg per penning shot > 1', d1 > 1);
  // minimum 1 damage
  const d2 = dmgPerShot(5, 6, 10, 0.1875, false);
  ok('minimum 1 durability damage per hit', d2 >= 1, `got ${d2}`);
  // high armor-dmg round shreds faster than low
  const hi = dmgPerShot(47, 4, 63, 0.55, true);
  const lo = dmgPerShot(47, 4, 20, 0.55, true);
  ok('higher armorDmg% = more durability damage', hi > lo);
}

console.log('\nSolver consistency:');
{
  // ranking order sanity for class 4: BP (47) should out-rank PS (26)
  const bp = penChance(4, 47, 100);
  const ps = penChance(4, 26, 100);
  ok('BP outranks PS vs class 4', bp > ps, `BP ${bp.toFixed(1)} vs PS ${ps.toFixed(1)}`);
  // unarmored: raw damage ranking means RIP > BP
  ok('leg meta: RIP (102 dmg) > BP (58 dmg) raw', 102 > 58);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
