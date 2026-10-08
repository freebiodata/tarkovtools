/**
 * TarkovTools ballistics math.
 *
 * Penetration model: the community-datamined formula, cross-validated in
 * independent open-source projects (bugybon/TarkovBallisticsSimulator and
 * josliang/interactiveMap: identical implementation):
 *
 *   A = (121 - 5000 / (45 + 2 × durabilityPercent)) × armorClass / 10
 *
 *   if A - 15 < pen < A:  chance = 0.4 × (A - pen - 15)² / 100
 *   if pen >= A:          chance = (100 + pen / (0.9A - pen)) / 100
 *   else:                 chance = 0
 *
 * Where durabilityPercent is 0-100 (remaining durability ratio × 100).
 * NOTE: this is the widely-used approximation of in-game behavior, not a
 * byte-perfect simulation. Published limitations on the methodology page.
 */

export interface PenetrationResult {
  /** 0-100 percent chance to penetrate */
  chance: number;
  /** A-threshold for this armor state (diagnostic) */
  factorA: number;
  /** Shots needed (expected) to wear through, using armor damage */
  approxShotsToBreak: number | null;
  /** Damage multiplier if penetrating (from the same model) */
  penetratingDamageMult: number;
}

/** remaining = current/max durability in [0,1] -> percent 0-100 */
export function durabilityPercent(current: number, max: number): number {
  if (!(max > 0)) return 0;
  return Math.max(0, Math.min(100, (current / max) * 100));
}

export function factorA(armorClass: number, durPercent: number): number {
  const d = Math.max(0, Math.min(100, durPercent));
  return (121 - 5000 / (45 + d * 2)) * armorClass * 0.1;
}

/** Community-formula penetration chance in percent (0-100). */
export function penetrationChance(armorClass: number, pen: number, durPercent: number): number {
  if (durPercent <= 0) return 100; // broken armor
  const d = Math.max(0, Math.min(100, durPercent));
  const a = factorA(armorClass, d);
  if (a <= pen) {
    const frac = (100 + pen / (0.9 * a - pen)) / 100;
    return Math.min(100, Math.max(0, frac * 100));
  }
  if (a - 15 < pen && pen < a) {
    const frac = (0.4 * Math.pow(a - pen - 15, 2)) / 100;
    return Math.min(100, Math.max(0, frac * 100));
  }
  return 0;
}

/**
 * Damage reduction when penetrating: median(0.6, pen/(A+12), 1) per the same
 * community model. This is the damage multiplier (higher = less reduction).
 */
export function penetratingDamageMult(pen: number, armorClass: number, durPercent: number): number {
  const a = factorA(armorClass, durPercent);
  const arr = [0.6, pen / (a + 12), 1].sort((x, y) => x - y);
  return arr[1];
}

/**
 * Expected shots to break armor (rough): armor takes average damage per shot
 * until durability hits 0. Uses the community model's armor-damage estimate:
 *   clamp01(pen/armorClass × 10, 0.5..1.1) × pen × (armorDmg% / 100) × destructibility
 */
export function armorDamagePerShot(
  pen: number,
  armorClass: number,
  armorDmgPercent: number,
  material: string,
  didPenetrate: boolean,
): number {
  const destr = DESTRUCTIBILITY[material] ?? 0.5;
  const clamp = didPenetrate
    ? clampRange((pen / armorClass) * 10, 0.5, 0.9)
    : clampRange((pen / armorClass) * 10, 0.6, 1.1);
  const raw = pen * (armorDmgPercent / 100) * clamp * destr;
  return Math.max(raw, 1);
}

export const DESTRUCTIBILITY: Record<string, number> = {
  Aramid: 0.1875,
  UHMWPE: 0.3375,
  Combined: 0.375,
  Titan: 0.4125,
  Aluminium: 0.45,
  ArmoredSteel: 0.525,
  Ceramic: 0.55,
  Glass: 0.6,
};

function clampRange(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}

/** Full solver result for a round vs an armor state. */
export function solve(
  round: { dmg: number; pen: number; armor: number },
  armor: { cls: number; durability: number; material: string },
  currentDurability: number,
): PenetrationResult & { expectedShots: number | null } {
  const dp = durabilityPercent(currentDurability, armor.durability);
  const chance = penetrationChance(armor.cls, round.pen, dp);
  const mult = penetratingDamageMult(round.pen, armor.cls, dp);
  // expected shots to break: simulate wearing down
  let dur = currentDurability;
  let shots = 0;
  const maxShots = 60;
  while (dur > 0 && shots < maxShots) {
    const dpi = durabilityPercent(dur, armor.durability);
    const ch = penetrationChance(armor.cls, round.pen, dpi) / 100;
    const dmg = armorDamagePerShot(round.pen, armor.cls, round.armor, armor.material, ch >= 0.5);
    dur -= dmg;
    shots += 1;
  }
  return {
    chance: Math.round(chance * 10) / 10,
    factorA: Math.round(factorA(armor.cls, dp) * 10) / 10,
    approxShotsToBreak: shots >= maxShots ? null : shots,
    penetratingDamageMult: mult,
    expectedShots: shots >= maxShots ? null : shots,
  };
}

/** Damage after armor interaction for one hit (expected value). */
export function expectedDamage(
  round: { dmg: number; pen: number },
  armor: { cls: number; durability: number; material: string },
  currentDurability: number,
  bluntThroughputPercent = 20,
): number {
  const dp = durabilityPercent(currentDurability, armor.durability);
  const ch = penetrationChance(armor.cls, round.pen, dp) / 100;
  const penMult = penetratingDamageMult(round.pen, armor.cls, dp);
  const penDamage = round.dmg * penMult;
  // blunt: small fraction through, community rough model: median(0.2, 1-0.03*(A-pen), 1) × blunt%
  const a = factorA(armor.cls, dp);
  const arr = [0.2, 1 - 0.03 * (a - round.pen), 1].sort((x, y) => x - y);
  const bluntMult = arr[1];
  const bluntDamage = (bluntThroughputPercent / 100) * bluntMult * round.dmg;
  return penDamage * ch + bluntDamage * (1 - ch);
}

export function fmtPct(n: number): string {
  return `${n.toFixed(0)}%`;
}
