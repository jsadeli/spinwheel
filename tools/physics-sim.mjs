/**
 * Headless Monte Carlo for the wheel physics.
 *
 * The wheel decides the winner by where it physically stops, so a bug here is a rigged
 * wheel rather than a visual glitch. This harness is the gate: it chi-square tests the
 * landing distribution against the item weights, measures how often the flapper's final
 * stall lands on a segment boundary, and checks that every spin terminates.
 *
 * Usage: node tools/physics-sim.mjs [--spins N] [--only NAME]
 */

import { WheelPhysics, buildPins, PHYSICS } from "../scripts/physics.js";

const TAU = Math.PI * 2;

/** @param {number} a @param {number} b @returns {number} */
const arg = (flag, dflt) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? dflt : Number(process.argv[i + 1]);
};
const onlyName = (() => {
  const i = process.argv.indexOf("--only");
  return i === -1 ? null : process.argv[i + 1];
})();

const SPINS = arg("--spins", 20000);

/** Deterministic, fast PRNG so runs are reproducible. @param {number} a @returns {() => number} */
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Mirrors calculateWinner() in index.html: the resting angle maps to the segment that
 * contains it, walking cumulative weighted slice angles.
 * @param {number} theta @param {number[]} weights @returns {number}
 */
const winnerOf = (theta, weights) => {
  let eff = (TAU - (theta % TAU)) % TAU;
  if (eff < 0) eff += TAU;
  const total = weights.reduce((s, w) => s + w, 0);
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    const slice = (weights[i] / total) * TAU;
    if (eff >= acc && eff < acc + slice) return i;
    acc += slice;
  }
  return weights.length - 1;
};

/** Upper-tail chi-square p-value via a Wilson-Hilferty normal approximation. */
const chiSquareP = (chi2, df) => {
  if (df <= 0) return 1;
  const z = (Math.cbrt(chi2 / df) - (1 - 2 / (9 * df))) / Math.sqrt(2 / (9 * df));
  return 0.5 * erfc(z / Math.SQRT2);
};
const erfc = (x) => {
  const z = Math.abs(x);
  const t = 1 / (1 + z / 2);
  const r =
    t *
    Math.exp(
      -z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
      t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
      t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? r : 2 - r;
};

/**
 * @param {{name: string, weights: number[], preset?: number, tension?: string}} cfg
 * @param {number} spins
 */
const run = (cfg, spins) => {
  const weights = cfg.weights;
  const items = weights.map((w, i) => ({ text: "i" + i, weight: w }));
  const counts = new Array(weights.length).fill(0);

  let durSum = 0;
  let durMin = Infinity;
  let durMax = 0;
  let revSum = 0;
  let boundaryFinal = 0;
  let reversedSpins = 0;
  let noSettle = 0;
  let maxSubsteps = 0;

  const rng = mulberry32(0xc0ffee);
  const skin = cfg.skin || {};
  const phys = new WheelPhysics({
    items,
    preset: cfg.preset || 10000,
    tension: cfg.tension || "normal",
    skinTensionMul: skin.tensionMul,
    skinMassMul: skin.massMul,
    skinDampingMul: skin.dampingMul,
    rng,
  });

  for (let s = 0; s < spins; s++) {
    phys.theta = rng() * TAU;
    phys.omega = 0;
    phys.phi = 0;
    phys.phiDot = 0;
    phys.contact = true;
    phys.settled = false;

    const power = 0.35 + rng() * 0.65;
    const startTheta = phys.theta;
    phys.launch(power);

    let t = 0;
    let steps = 0;
    let sawReverse = false;
    let unwrapped = 0;
    let prev = startTheta;

    while (!phys.settled && t < PHYSICS.MAX_SPIN_TIME) {
      const { settled } = phys.step(1 / 60);
      if (phys.omega < -0.05) sawReverse = true;
      let d = phys.theta - prev;
      if (d > Math.PI) d -= TAU;
      if (d < -Math.PI) d += TAU;
      unwrapped += d;
      prev = phys.theta;
      t += 1 / 60;
      steps++;
      if (settled) break;
    }

    if (!phys.settled) noSettle++;
    maxSubsteps = Math.max(maxSubsteps, steps);

    durSum += t;
    durMin = Math.min(durMin, t);
    durMax = Math.max(durMax, t);
    revSum += Math.abs(unwrapped) / TAU;
    if (sawReverse) reversedSpins++;
    if (phys.lastCrestWasBoundary) boundaryFinal++;

    counts[winnerOf(phys.theta, weights)]++;
  }

  const total = weights.reduce((a, b) => a + b, 0);
  let chi2 = 0;
  let zeroBuckets = 0;
  for (let i = 0; i < weights.length; i++) {
    const exp = (weights[i] / total) * spins;
    if (counts[i] === 0) zeroBuckets++;
    chi2 += ((counts[i] - exp) * (counts[i] - exp)) / exp;
  }
  const df = weights.length - 1;
  // Chi-square is unreliable below ~5 expected observations per bucket; report it as
  // undersampled rather than letting a thin run masquerade as a fairness failure.
  const minExpected = (Math.min(...weights) / total) * spins;
  const undersampled = minExpected < 5;
  const p = undersampled ? NaN : chiSquareP(chi2, df);

  const pins = buildPins(items);
  const worst = weights
    .map((w, i) => ({ i, obs: counts[i] / spins, exp: w / total }))
    .map((r) => ({ ...r, rel: r.exp > 0 ? (r.obs - r.exp) / r.exp : 0 }))
    .sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel))[0];

  // `worst` is a maximum over many thin buckets, so it looks alarming even on a perfectly
  // fair wheel: with N buckets the largest of N normal deviates sits around sqrt(2 ln N)
  // standard deviations out. Printing that floor next to it stops sampling scatter from
  // being read as bias -- which is a mistake worth making only once.
  const noiseFloor =
    minExpected > 0 ? Math.sqrt(2 * Math.log(Math.max(weights.length, 2))) / Math.sqrt(minExpected) : 0;

  return {
    name: cfg.name,
    pins: pins.count,
    ratio: pins.pitchRatio,
    perSeg: (pins.count / weights.length).toFixed(1),
    dur: (durSum / spins).toFixed(2),
    durRange: durMin.toFixed(1) + "-" + durMax.toFixed(1),
    revs: (revSum / spins).toFixed(1),
    boundaryPct: ((boundaryFinal / spins) * 100).toFixed(1),
    reversePct: ((reversedSpins / spins) * 100).toFixed(1),
    chi2: chi2.toFixed(1),
    p: undersampled ? "  n/a " : p.toFixed(4),
    undersampled,
    worstRel: (worst.rel * 100).toFixed(1),
    noise: (noiseFloor * 100).toFixed(1),
    zeroBuckets,
    noSettle,
  };
};

const CONFIGS = [
  { name: "uniform-1", weights: [1] },
  { name: "uniform-2", weights: [1, 1] },
  { name: "uniform-3", weights: [1, 1, 1] },
  { name: "uniform-7", weights: Array(7).fill(1) },
  { name: "uniform-13", weights: Array(13).fill(1) },
  { name: "uniform-30", weights: Array(30).fill(1) },
  { name: "uniform-50", weights: Array(50).fill(1) },
  { name: "weighted-3-2-1", weights: [3, 2, 1] },
  { name: "incommensurate-a", weights: [4, 3, 2, 1, 1] },
  { name: "incommensurate-b", weights: [7, 5, 3, 2] },
  { name: "zero-weight", weights: [1, 1, 0] },
  { name: "skew-100-1-1", weights: [100, 1, 1] },
  { name: "skew-50-50-1", weights: [50, 50, 1] },
  { name: "heavy-preset-6", weights: Array(6).fill(1), preset: 20000 },
  { name: "light-preset-6", weights: Array(6).fill(1), preset: 5000 },
  { name: "tension-light-6", weights: Array(6).fill(1), tension: "light" },
  { name: "tension-strong-6", weights: Array(6).fill(1), tension: "strong" },
  { name: "tension-brutal-6", weights: Array(6).fill(1), tension: "brutal" },
  // A cosmetic the player picks must not move their odds, so every skin is gated here
  // rather than asserted in a docstring.
  { name: "skin-sword-7", weights: Array(7).fill(1), skin: { tensionMul: 1.45, massMul: 2.2, dampingMul: 0.8 } },
  { name: "skin-feather-7", weights: Array(7).fill(1), skin: { tensionMul: 0.6, massMul: 0.4, dampingMul: 1.3 } },
  { name: "skin-laser-7", weights: Array(7).fill(1), skin: { tensionMul: 0.35, massMul: 0.15, dampingMul: 2.2 } },
  { name: "skin-sword-brutal-7", weights: Array(7).fill(1), tension: "brutal", skin: { tensionMul: 1.45, massMul: 2.2, dampingMul: 0.8 } },
];

const rows = [];
for (const cfg of CONFIGS) {
  if (onlyName && cfg.name !== onlyName) continue;
  const t0 = Date.now();
  const r = run(cfg, SPINS);
  r.ms = Date.now() - t0;
  rows.push(r);
  console.log(
    r.name.padEnd(18) +
      "pins " + String(r.pins).padStart(3) +
      "  ratio " + r.ratio.toFixed(3) +
      "  dur " + r.dur.padStart(5) + "s (" + r.durRange + ")" +
      "  revs " + r.revs.padStart(5) +
      "  bnd " + r.boundaryPct.padStart(5) + "%" +
      "  rev " + r.reversePct.padStart(5) + "%" +
      "  chi2 " + r.chi2.padStart(7) +
      "  p " + r.p + (r.undersampled ? "" : "") +
      "  worst " + r.worstRel.padStart(6) + "% (noise +/-" + r.noise.padStart(4) + "%)" +
      (r.zeroBuckets ? "  ZERO:" + r.zeroBuckets : "") +
      (r.noSettle ? "  NOSETTLE:" + r.noSettle : "")
  );
}

// Frame pacing must not change the outcome: the fixed-timestep accumulator is the only
// thing standing between a 60 Hz laptop and a 144 Hz monitor disagreeing about a winner.
const determinism = () => {
  const items = Array.from({ length: 8 }, (_, i) => ({ text: "i" + i, weight: 1 + (i % 3) }));
  /** @param {number[]} pacing @returns {number} */
  const finalAngle = (pacing) => {
    const phys = new WheelPhysics({ items, rng: mulberry32(42) });
    phys.theta = 1.234;
    phys.launch(0.8);
    let k = 0;
    while (!phys.settled) phys.step(pacing[k++ % pacing.length]);
    return phys.theta;
  };
  const a = finalAngle([1 / 60]);
  const b = finalAngle([1 / 144]);
  const c = finalAngle([1 / 30, 1 / 240, 1 / 90, 0.04]);
  const spread = Math.max(Math.abs(a - b), Math.abs(a - c));
  console.log(
    "\ndeterminism  60Hz " + a.toFixed(9) + "  144Hz " + b.toFixed(9) + "  jittered " + c.toFixed(9) +
      "  spread " + spread.toExponential(2)
  );
  return spread < 1e-9;
};
const deterministic = onlyName ? true : determinism();

// An undersampled run cannot distinguish "unreachable" from "not drawn yet", so both the
// zero-bucket and the chi-square checks are only meaningful once every bucket is expected
// to be hit at least ~5 times.
const fails = rows.filter(
  (r) =>
    r.noSettle > 0 ||
    r.ratio > 1.02 ||
    (!r.undersampled && (r.zeroBuckets > 0 || Number(r.p) < 0.01))
);
if (!deterministic) console.log("FAIL: frame pacing changed the outcome");
console.log("\n" + (fails.length === 0 && deterministic ? "PASS" : "FAIL: " + fails.map((f) => f.name).join(", ")));
process.exit(fails.length === 0 && deterministic ? 0 : 1);
