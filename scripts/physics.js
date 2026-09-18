/**
 * Rigid-body wheel physics with a spring-loaded flapper escapement.
 *
 * The wheel is a disc with real inertia, Coulomb bearing friction and viscous drag.
 * The flapper is a spring-damper cam follower riding over the pins on the wheel's rim.
 * Because the cam's slope reverses at each pin crest, the flapper brakes the wheel on
 * the way up and pushes it forward on the way down -- so a spin that runs out of energy
 * mid-climb stalls and rolls backward into the previous valley. That rollback is what
 * decides the winner, and it is emergent rather than scripted.
 *
 * A pin only touches the flapper across the arc it is actually drawn across, which is about a
 * degree either side of a crest rather than the whole way to the next pin. Between pins the
 * nose hangs at its rest stop and the wheel runs free, so most spins end coasting in a valley
 * rather than held against a crest -- see {@link WheelPhysics#touchingPin}. Everything the
 * geometry is derived from lives in {@link GEOMETRY}, which is also what draws the wheel.
 *
 * This module is deliberately DOM-free so it can be imported by Node for headless
 * Monte Carlo fairness testing (see tools/physics-sim.mjs).
 *
 * @module physics
 */

const TAU = Math.PI * 2;

/**
 * The drawn geometry of the pin ring and the pointer, in the nominal 500x500 canvas's pixels.
 *
 * The solver and `drawWheel` both quote these, so the cam the flapper rides is the shape the
 * player is actually looking at. They are lengths rather than angles because that is how they
 * are drawn: the contact window and the crest lift are derived from them in {@link buildPins},
 * never tuned on their own. Before this existed the cam spanned the whole gap between pins --
 * five times what a 5 px pin can reach -- so the pointer started swinging a quarter of a segment
 * before anything touched it.
 *
 * Only their ratios matter, so a canvas rendered at any size scales all of them together.
 * @type {Object<string, number>}
 */
export const GEOMETRY = {
  /** Wheel face radius: half the canvas, less the margin the pin ring sits in. */
  WHEEL_RADIUS: 230,
  /** Radius of the circle the pin centres sit on. */
  PIN_RING_RADIUS: 240,
  /** Drawn radius of a pin sitting on a segment boundary. */
  PIN_RADIUS_BOUNDARY: 5,
  /** Drawn radius of a filler pin between two boundaries. */
  PIN_RADIUS_FILLER: 3.5,
  /** Distance from the pointer's nose to the mount it pivots about. */
  POINTER_ARM: 50,
};

/** Integration step for the rendered arm's flex mode, seconds. */
const FLEX_STEP = 0.002;

/**
 * Global physics tuning. Units are radians and seconds throughout; inertia and torque
 * are in arbitrary but self-consistent "game" units -- only their ratios matter.
 * @type {Object<string, number>}
 */
export const PHYSICS = {
  /** Preferred angular spacing between pins (12 degrees). */
  TARGET_PITCH: (12 * Math.PI) / 180,
  /** Hard ceiling on total pins, so a heavily skewed list cannot produce a solid ring. */
  MAX_TOTAL_PINS: 120,
  /**
   * Flapper deflection at a pin crest, for a nominal-pitch gap.
   *
   * Not a free parameter: it is `asin(PIN_RADIUS_BOUNDARY / POINTER_ARM)`, the angle a pin of the
   * drawn size can swing an arm of the drawn length before the nose passes the pin's centre.
   * Raising it past that models a pin bigger than the one on screen.
   */
  CAM_AMPLITUDE: 0.1,
  /**
   * Cam amplitude scales as (gap / TARGET_PITCH) ** GAP_EXPONENT. The exponent controls
   * how a crest's energy barrier grows with its gap, which is what keeps wide segments
   * from being under-represented when the wheel settles.
   */
  GAP_EXPONENT: 1.75,
  /** Smallest amplitude scale a degenerate (very narrow) gap may collapse to. */
  GAP_SCALE_FLOOR: 0.05,
  /**
   * How the whole ring's cam amplitude scales with pin density. At 0.5 the energy a wheel
   * sheds per revolution is independent of how many pins it has, so a densely pinned list
   * spins for about as long as a sparse one instead of stopping dead or coasting forever.
   */
  DENSITY_EXPONENT: 1.25,
  /**
   * Flapper torsion spring constant at nominal tension.
   *
   * Deliberately very weak, for two reasons.
   *
   * The spring sets the energy barrier at a pin crest, and therefore the speed at which the
   * escapement catches the wheel: omega = amp * sqrt(k / I). A stiff spring grabs a wheel
   * that is still visibly turning and halts it, which is what made the stop feel abrupt. At
   * this value capture happens slowly enough to read as coasting to rest.
   *
   * It costs nothing in how the wheel comes to rest off-centre, because the flapper's grip
   * on the pin scales with the same contact force the spring is pulling with: the ratio that
   * decides where it stops depends on CONTACT_GRIP, not on k.
   *
   * It is stiff in absolute terms only because CAM_AMPLITUDE is pinned to the drawn pin size.
   * Capture speed is `amp * sqrt(k / I)`, so shrinking the amplitude by 2.5x and raising k by
   * 6.25x leaves the speed at which the escapement catches the wheel exactly where it was.
   *
   * No wheel runs at this value: it is the base a tension setting multiplies, and every setting
   * is below 1. The capture speed quoted above is what the amplitude retune was built to
   * preserve, but no setting sits on it any more -- the default is 0.2 of this, deliberately
   * slacker. See {@link TENSION_MULTIPLIERS}.
   */
  SPRING_K: 3.90625,
  /**
   * Flapper moment of inertia.
   *
   * Deliberately tiny, and it has to stay that way. It sets how much of the wheel's energy each
   * landing takes, as `J * Ld^2 / (I + J * Ld^2)`: at this value a pin costs the wheel 0.3%, and
   * raising it far enough for the arm's own ringing to be visible (41x, for 8 Hz) takes that to
   * 10%. Pin losses then swamp bearing drag, and since the wheel presets differ *by* their drag,
   * the whole light/normal/heavy setting collapses -- measured, the long preset fell from 17.7s
   * to 7.3s and no drag value brought it back.
   *
   * The arm consequently rings at 51 Hz, well under a frame, so what the pointer is seen doing
   * on the way back to rest is modelled where it belongs: {@link PHYSICS}.FLEX_FREQ.
   */
  FLAPPER_J: 0.00003,
  /**
   * Flapper viscous damping. Scaled to the spring: too much of it relative to k and the
   * damping force alone drives the contact force negative as a pin drops away, so the
   * flapper tears off the cam on most pin passes instead of riding it down.
   *
   * Scaled with SPRING_K to hold the damping ratio `c / (2 * sqrt(k * J))` at 0.13.
   */
  FLAPPER_C: 0.0025,
  /**
   * Wheel viscous drag coefficient.
   *
   * Drag is deliberately dominated by this rather than by Coulomb bearing friction. A
   * constant friction torque decelerates the wheel at a constant rate, so it arrives at
   * zero still visibly moving and simply halts; drag proportional to speed decays
   * exponentially instead, which is what makes a heavy wheel creep to a stop.
   *
   * This is what sets how long the wheel is *visibly* turning, since it is what decays the
   * speed: the visible part of a spin scales as 1/b almost exactly.
   *
   * It was briefly raised to 0.6 to pull a spin's total length back after the contact window
   * narrowed. That was the wrong knob. The narrow window had lengthened the near-motionless
   * creep at the end, not the spinning, and shortening the spinning to compensate cut the
   * visible spin by a quarter -- from 7.0 s to 5.3 s on a full-power Normal spin -- while
   * leaving the total near 12 s. A spin that reads as half as long as it used to be. The creep
   * is OMEGA_EPS's business; this stays where it was tuned for the spin itself.
   */
  VISCOUS_B: 0.46,
  /** Seconds over which launch torque is applied, so the wheel visibly winds up. */
  WIND_UP: 0.18,
  /** Angular velocity reached at full charge, rad/s. */
  OMEGA_MAX: 30,
  /** Fractional spread applied to launch speed each spin. */
  OMEGA_JITTER: 0.12,
  /** Fractional spread applied to spring tension each spin. */
  TENSION_JITTER: 0.06,
  /**
   * Fixed integration timestep, seconds. Frame-rate independence holds exactly at a given
   * step, but the system is chaotic: refining the step changes which segment wins, not just
   * the trajectory. Changing this is a gameplay change, not a performance tweak.
   */
  SUBSTEP: 0.001,
  /** Largest wall-clock delta fed to the integrator in one frame. */
  MAX_DT: 0.05,
  /**
   * How much harder the bearing holds a stationary wheel than a turning one. Static
   * friction exceeds kinetic in any real bearing; modelling them as equal is the
   * simplification, not the other way round.
   *
   * Applies to bearing drag only; most of the holding comes from CONTACT_GRIP.
   */
  STATIC_FRICTION: 1.7,
  /**
   * Holding torque from the flapper tip pressing on a pin, as a multiple of the contact
   * normal force.
   *
   * This is what stops the spring dragging a stopped wheel down to the floor of a valley.
   * It scales with the contact force rather than being a flat amount, which is both more
   * honest -- the flapper grips hardest exactly where it is pressed hardest -- and what
   * lets bearing drag be made small enough for a gentle coast-down without the wheel
   * snapping to centre the moment it stops.
   */
  CONTACT_GRIP: 2.5,
  /**
   * Below this speed the wheel is a candidate for settling. Low on purpose: a coasting
   * wheel spends its last second creeping, and cutting that off early is what turns a
   * coast-down into a halt.
   *
   * It is also the only knob on the dead stretch at the end of a spin, and it is not free.
   * Raising it to 0.04 takes 1.8 s off the total without touching the visible spin at all --
   * but a stall and rollback happen down in exactly the speeds it truncates, and the tension
   * ladder collapses from 3/27/63/84% to 0/8/50/71%. Not worth it: the wheel stopping against
   * a pin is the point of the escapement.
   */
  OMEGA_EPS: 0.008,
  /** How long the wheel must stay below OMEGA_EPS before it counts as settled. */
  SETTLE_TIME: 0.4,
  /** Hard cap on simulated spin length, so a spin can never fail to terminate. */
  MAX_SPIN_TIME: 90,
  /**
   * How far above a pin's crest the flapper may fly before its mounting stops it, as a
   * multiple of the cam amplitude. Without a backstop a weak spring cannot reel the flapper
   * back in after it tears off a pin, and it sails to three times the deflection any pin
   * could have pushed it to, which reads as the pointer flailing loose.
   */
  LIFT_LIMIT: 1.3,
  /**
   * How far the flapper may drive the wheel backwards after a stall, in valley widths,
   * measured from the furthest-forward point the spin reached.
   *
   * The escapement is normally its own backstop: a stall rolls back across the valley it
   * stalled in and the pin behind catches it. Rollback is bimodal, so there is nothing in
   * between -- a spin gives back either that valley, at most 0.96 of one, or it gives back
   * that valley and the one behind it, 1.95, having driven the wheel back *through* the pin
   * that should have caught it. Nothing in the solver bounds the second case; it was bounded
   * by tuning.
   *
   * No setting now on the dial reaches it. Every row of tools/physics-sim.mjs reports `stop
   * 0.0%`, and `back` peaks at 0.96 on the freest-running wheel carrying the stiffest spring
   * -- the `light` preset on `strong`, the corner the gate carries a row for precisely because
   * the tension ladder is otherwise gated on the normal wheel. The 1.95 branch was reached
   * through the `brutal` tension, which the dial no longer offers.
   *
   * So this is a mechanical stop in the sense {@link PHYSICS}.LIFT_LIMIT is one for the
   * flapper, not a tuning knob, and it stays despite never firing: at 1 it is slack on every
   * setting whose escapement is doing its job, and catches only a wheel that has already given
   * back more than the valley it stalled in. What it is slack by is 4% of a valley, so a ladder
   * stiffened at the top or a wheel freed further walks back into the case it bounds. Below
   * 0.96 it lands inside the healthy mode instead of past it: that is a change to how the wheel
   * stops and to the odds, and has to be gated as one.
   */
  REVERSE_LIMIT: 1,
  /**
   * Multiplier from physical flapper deflection to rendered rotation.
   *
   * At 1 the nose travels exactly as far as the pin under it pushed it, which is 5 px and about
   * 5.7 degrees -- honest, and far too small to read as a wheel knocking a pointer about. This
   * sits halfway between that and the 34 degrees it swung before the contact geometry was
   * corrected. The exaggeration is in the swing's depth only: *when* the pointer starts moving
   * is now exactly when a pin covers it, which is the part that looked wrong. Cosmetic either
   * way; it never feeds back into the solver.
   */
  DISPLAY_GAIN: 3.5,
  /**
   * The drawn pointer's own bending mode, in hertz.
   *
   * {@link WheelPhysics}#phi is where the cam puts the *contact point* -- it is a kinematic
   * constraint, so it steps and snaps. A real pointer is an arm on a mount, not a rigid line
   * from the nose to the pivot: it whips past where the cam released it and rings back through
   * rest before settling. That ringing is what this is.
   *
   * It cannot come from the solver's own flapper spring, which sits at 51 Hz -- under one frame,
   * so it renders as nothing at all -- and cannot be slowed without wrecking the escapement (see
   * FLAPPER_J). Output only: the solver never reads it back, so it cannot move a winner.
   */
  FLEX_FREQ: 12,
  /**
   * Damping ratio of that bending mode. At 0.32 the arm overshoots its return to rest by about
   * 30% and is done ringing inside 0.17 s -- one clear swing back rather than a wobble that is
   * still going when the next pin arrives.
   */
  FLEX_DAMPING: 0.32,
  /**
   * Event gating. A settling wheel rocks across a valley floor and the flapper re-seats
   * many times on the same pin, which is physically real but produces hundreds of
   * inaudible events per second. These bound what reaches the audio layer.
   */
  MIN_EVENT_FORCE: 0.035,
  MIN_EVENT_SPEED: 6,
  EVENT_DEBOUNCE: 0.04,
  MAX_EVENTS_PER_STEP: 8,
};

/**
 * Wheel mass presets, keyed by the legacy `spinDuration` values so existing localStorage
 * and the `speed_demon` / `patience_is_a_virtue` achievements keep working.
 *
 * A heavier wheel is harder to get turning and loads its bearing harder, so here it both
 * starts slower and sheds energy faster: heavy is the short spin and light is the long,
 * free-running one. Drag therefore scales faster than inertia across the presets rather
 * than in step with it -- were the two proportional, the ratio governing deceleration would
 * be identical for all three and the setting would do nothing at all.
 *
 * The keys stay 5000/10000/20000 because they are what localStorage holds and what the
 * speed_demon and patience_is_a_virtue achievements compare against; 5000 must stay the
 * short spin.
 * @type {Object<number, {key: number, label: string, inertia: number, coulomb: number, drag: number}>}
 */
export const WHEEL_PRESETS = {
  5000: { key: 5000, label: "heavy", inertia: 2.1, coulomb: 0.012, drag: 6.4 },
  10000: { key: 10000, label: "normal", inertia: 1.0, coulomb: 0.011, drag: 1 },
  20000: { key: 20000, label: "light", inertia: 0.55, coulomb: 0.01, drag: 0.245 },
};

/**
 * Spring tension multipliers applied on top of {@link PHYSICS}.SPRING_K.
 *
 * What the setting actually controls is how often a spin ends by stalling part-way up a pin and
 * being pushed back down, rather than coasting over it. Duration barely moves across the whole
 * range -- under 2% -- and the number of pins struck does not move at all, so a spread that
 * cannot be seen in the rollback rate cannot be seen anywhere.
 *
 * The gate's tension rows run the ladder at 3.8% / 25.9% / 61.8% over 6000 spins on six items,
 * in steps of 22 and 36 points. The steps matter more than the endpoints: an earlier ladder of
 * 0.7 / 1 / 1.5 put the bottom two rungs at 30% and 50%, close enough to be hard to tell apart.
 *
 * Both ends of the dial are walled in, which is why there are three rungs and not five. Above,
 * any value much past 2 runs into the ceiling -- rollback saturates near 100%, so the top cannot
 * separate however hard it is pushed. Below, `normal` already sits under 4% against a floor of
 * 0, so a slacker rung has almost nothing to distinguish itself with and would be a dial
 * position nobody can feel.
 *
 * `normal` is deliberately slack -- the second time the default has been walked down onto what
 * the rung below it used to be. It resolves to well under the spring {@link PHYSICS}.SPRING_K
 * was sized around, which is a choice about how the default wheel should feel rather than a
 * consequence of anything.
 * @type {Object<string, number>}
 */
export const TENSION_MULTIPLIERS = {
  normal: 0.2,
  firm: 0.4,
  strong: 0.9,
};

/**
 * @typedef {Object} WheelItem
 * @property {string} text
 * @property {number} weight
 */

/**
 * @typedef {Object} ImpactEvent
 * @property {number} tSim Seconds since launch, accumulated from the integrator.
 * @property {'engage'|'release'|'seat'} kind
 * @property {number} force Contact normal force at the event.
 * @property {number} vImpact Flapper approach speed at the event, rad/s.
 * @property {number} omega Signed wheel angular velocity, rad/s.
 * @property {boolean} isBoundary Whether the pin sits on a segment boundary.
 * @property {number} pinIndex Stable pin identity, for per-pin debouncing.
 */

/**
 * @typedef {Object} PinArray
 * @property {Float64Array} angles Pin positions in the wheel frame, ascending, [0, 2PI).
 * @property {Uint8Array} boundary 1 where the pin sits on a segment boundary.
 * @property {Float64Array} gapAfter Angular gap from each pin to the next.
 * @property {Float64Array} amp Cam amplitude for the bump centered on each pin.
 * @property {Float64Array} contactHalf Half-width of each pin's contact window, radians.
 * @property {number} count
 * @property {number} pitchRatio Widest valley divided by narrowest; 1 means perfectly even.
 */

/** @param {number} a @returns {number} `a` wrapped into [0, 2PI). */
const wrapTau = (a) => {
  const r = a % TAU;
  return r < 0 ? r + TAU : r;
};

/** @param {number} v @param {number} lo @param {number} hi @returns {number} */
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/**
 * Chooses how many valleys each segment gets.
 *
 * A segment only ever gets a whole number of valleys, so its pitch is a rounding of the
 * ideal. A *sustained* pitch mismatch between regions of the rim phase-locks the terminal
 * staircase and rigs the odds outright: on [4,3,2,1,1] a 20% mismatch pulled one item 32%
 * off its weight. The pin budget is therefore searched for the layout whose widest and
 * narrowest valleys are closest to equal, breaking ties toward the nominal pin count.
 *
 * @param {number[]} fractions Normalized weights of the segments that get pins.
 * @param {number} basePins Nominal pin count at the target pitch.
 * @param {number} lo Lowest budget to consider.
 * @param {number} hi Highest budget to consider.
 * @returns {{counts: number[], ratio: number}}
 */
const chooseCounts = (fractions, basePins, lo, hi) => {
  let best = null;

  for (let budget = lo; budget <= hi; budget++) {
    const counts = fractions.map((f) => Math.max(1, Math.round(f * budget)));

    let total = 0;
    let minPitch = Infinity;
    let maxPitch = 0;
    for (let i = 0; i < counts.length; i++) {
      total += counts[i];
      const pitch = (fractions[i] * TAU) / counts[i];
      if (pitch < minPitch) minPitch = pitch;
      if (pitch > maxPitch) maxPitch = pitch;
    }
    if (total > PHYSICS.MAX_TOTAL_PINS) continue;

    const ratio = maxPitch / minPitch;
    const score = ratio + 0.002 * Math.abs(total - basePins);
    if (!best || score < best.score) best = { counts, ratio, score };
  }

  if (!best) return { counts: fractions.map(() => 1), ratio: 1 };
  return { counts: best.counts, ratio: best.ratio };
};

/** @param {number[]} values @returns {number} */
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * How far either side of a pin the pointer's nose is actually touching it.
 *
 * The nose dips `dip` pixels below the line the pin crests reach, and a pin is a circle of
 * radius `pinRadius` whose centre rides {@link GEOMETRY}.PIN_RING_RADIUS out. Contact starts
 * where that circle first reaches the resting nose, which is a chord of the ring:
 *
 *     hw = sqrt(dip * (2 * pinRadius - dip)) / PIN_RING_RADIUS
 *
 * At the deepest useful dip -- the nose level with the pin's centre -- this is just
 * `pinRadius / PIN_RING_RADIUS`, about 1.2 degrees for a boundary pin. The cam used to span
 * half the gap to the next pin instead, 6 degrees at nominal pitch, which is why the pointer
 * moved well before anything reached it.
 *
 * @param {number} amp Flapper deflection at the crest, radians.
 * @param {number} pinRadius Drawn pin radius, in {@link GEOMETRY}'s pixels.
 * @returns {{amp: number, half: number}} The deflection the pin can really deliver, and the
 *   half-width of the window over which it delivers it.
 */
const contactWindow = (amp, pinRadius) => {
  // A round pin cannot push the nose past its own centre: beyond that the nose is sliding under
  // the pin rather than being lifted by it, so the dip is capped there and the amplitude with it.
  const dip = Math.min(amp * GEOMETRY.POINTER_ARM, pinRadius);
  return {
    amp: dip / GEOMETRY.POINTER_ARM,
    half: Math.sqrt(dip * (2 * pinRadius - dip)) / GEOMETRY.PIN_RING_RADIUS,
  };
};

/** @returns {PinArray} A single-pin ring, used for empty or degenerate item lists. */
const singlePin = () => ({
  angles: new Float64Array([0]),
  boundary: new Uint8Array([1]),
  gapAfter: new Float64Array([TAU]),
  amp: new Float64Array([PHYSICS.CAM_AMPLITUDE]),
  contactHalf: new Float64Array([
    contactWindow(PHYSICS.CAM_AMPLITUDE, GEOMETRY.PIN_RADIUS_BOUNDARY).half,
  ]),
  count: 1,
  pitchRatio: 1,
});

/**
 * Builds the pin ring for a set of weighted items.
 *
 * One pin lands exactly on every segment boundary, so the flapper always seats strictly
 * inside a segment and the winner is never ambiguous. The remaining pins subdivide each
 * segment; how many is decided by {@link chooseCounts}, because equal valley widths are
 * what keep the landing distribution proportional to weight.
 *
 * @param {WheelItem[]} items
 * @returns {PinArray}
 */
export const buildPins = (items) => {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return singlePin();

  const weights = list.map((it) => Math.max(0, Number(it && it.weight) || 0));
  const total = weights.reduce((s, w) => s + w, 0);
  if (total <= 0) return singlePin();

  const basePins = Math.round(TAU / PHYSICS.TARGET_PITCH);

  // A segment too thin to hold even half a valley cannot be selected by the winner lookup
  // either, so it is left out of the ring rather than rounded up to a full valley it has
  // not earned. Without this a single zero-weight item drags the budget to its ceiling and
  // crushes the cam amplitude across the whole wheel.
  const minKeep = 0.5 / PHYSICS.MAX_TOTAL_PINS;

  /** @type {{start: number, frac: number}[]} */
  const kept = [];
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    const frac = weights[i] / total;
    const start = (acc / total) * TAU;
    acc += weights[i];
    if (frac >= minKeep) kept.push({ start, frac });
  }
  if (kept.length === 0) return singlePin();

  // The whole budget range is searched rather than starting from a heuristic floor: on a
  // list like [100, 1, 1] the only layout with even valleys is 102 pins, which any floor
  // derived from the thinnest segment would have skipped straight past.
  const fractions = kept.map((k) => k.frac);
  const lo = clamp(Math.max(basePins, kept.length), 1, PHYSICS.MAX_TOTAL_PINS);
  const { counts, ratio } = chooseCounts(fractions, basePins, lo, PHYSICS.MAX_TOTAL_PINS);

  /** @type {number[]} */
  const angles = [];
  /** @type {number[]} */
  const boundary = [];

  for (let i = 0; i < kept.length; i++) {
    const arc = kept[i].frac * TAU;
    const n = counts[i];
    angles.push(kept[i].start);
    boundary.push(1);
    for (let j = 1; j < n; j++) {
      angles.push(kept[i].start + (arc * j) / n);
      boundary.push(0);
    }
  }

  const count = angles.length;
  const out = {
    angles: Float64Array.from(angles),
    boundary: Uint8Array.from(boundary),
    gapAfter: new Float64Array(count),
    amp: new Float64Array(count),
    contactHalf: new Float64Array(count),
    count,
    pitchRatio: ratio,
  };

  for (let i = 0; i < count; i++) {
    out.gapAfter[i] =
      i < count - 1 ? out.angles[i + 1] - out.angles[i] : out.angles[0] + TAU - out.angles[count - 1];
  }

  // Cam amplitude has two independent jobs, so it gets two exponents.
  //
  // Within a wheel, a crest's barrier has to grow with the gap it guards, otherwise the
  // wheel stops uniformly per valley instead of per unit of arc and the odds stop tracking
  // the weights. That is GAP_EXPONENT, applied relative to this wheel's median gap.
  //
  // Across wheels, the ring's overall amplitude has to fall as pins get denser, or a
  // 120-pin list sheds 120 barriers per revolution and stops in under a turn. DENSITY_EXPONENT
  // holds the energy lost per revolution roughly constant instead.
  const mid = Math.max(median([...out.gapAfter]), 1e-9);
  const density = Math.pow(mid / PHYSICS.TARGET_PITCH, PHYSICS.DENSITY_EXPONENT);

  for (let i = 0; i < count; i++) {
    const meanGap = (out.gapAfter[i] + out.gapAfter[(i - 1 + count) % count]) / 2;
    const scale = clamp(meanGap / mid, PHYSICS.GAP_SCALE_FLOOR, 1 / PHYSICS.GAP_SCALE_FLOOR);
    const wanted = PHYSICS.CAM_AMPLITUDE * density * Math.pow(scale, PHYSICS.GAP_EXPONENT);

    // What the ring asks for, passed through what the drawn pin can actually deliver. A filler
    // pin is drawn smaller than a boundary pin, so it bites less -- which is what the player is
    // already being shown, and which the fairness harness gates.
    const pinRadius =
      out.boundary[i] === 1 ? GEOMETRY.PIN_RADIUS_BOUNDARY : GEOMETRY.PIN_RADIUS_FILLER;
    const contact = contactWindow(wanted, pinRadius);
    out.amp[i] = contact.amp;
    out.contactHalf[i] = contact.half;
  }

  return out;
};

/**
 * Coupled wheel + flapper simulation.
 *
 * The flapper is solved as a kinematic cam follower rather than a penalty spring:
 * while it is in contact its deflection is dictated by the cam, which removes the
 * stiff spring from the integrator entirely and lets the whole system run stably at a
 * 1 ms fixed step. It separates and goes ballistic only when the contact force would
 * have to go negative, which is what produces high-speed chatter.
 */
export class WheelPhysics {
  /**
   * @param {Object} [opts]
   * @param {WheelItem[]} [opts.items]
   * @param {number} [opts.preset] One of the {@link WHEEL_PRESETS} keys.
   * @param {string} [opts.tension] One of the {@link TENSION_MULTIPLIERS} keys.
   * @param {number} [opts.skinTensionMul] Extra tension factor from the pointer skin.
   * @param {number} [opts.skinMassMul] Extra flapper-inertia factor from the pointer skin.
   * @param {number} [opts.skinDampingMul] Extra flapper-damping factor from the pointer skin.
   * @param {() => number} [opts.rng] Uniform [0, 1) source; injectable for deterministic tests.
   */
  constructor(opts = {}) {
    /** @type {() => number} */
    this.rng = opts.rng || Math.random;
    /** @type {PinArray} */
    this.pins = buildPins(opts.items || []);
    this.maxLift = this._maxLift();

    this.preset = WHEEL_PRESETS[opts.preset] || WHEEL_PRESETS[10000];
    this.tensionKey = opts.tension || "normal";
    this.skinTensionMul = opts.skinTensionMul == null ? 1 : opts.skinTensionMul;
    this.skinMassMul = opts.skinMassMul == null ? 1 : opts.skinMassMul;
    this.skinDampingMul = opts.skinDampingMul == null ? 1 : opts.skinDampingMul;

    /** Wheel angle, radians, wrapped to [0, 2PI). */
    this.theta = 0;
    /** Wheel angular velocity, rad/s. Negative means the flapper has reversed it. */
    this.omega = 0;
    /** Flapper deflection, radians. */
    this.phi = 0;
    /** Flapper angular velocity, rad/s. */
    this.phiDot = 0;
    /** False while the flapper is airborne between pins. */
    this.contact = true;

    /** Rotation given back since the wheel was last making forward progress, radians. */
    this._backTravel = 0;
    /** Whether the anti-reverse stop ended this spin's rollback, rather than the escapement. */
    this.reverseStopped = false;

    /** Rendered arm angle, radians: `phi` seen through the arm's own flex. Output only. */
    this._flexPhi = 0;
    /** Rate of change of the rendered arm angle, rad/s. */
    this._flexVel = 0;

    this.spinning = false;
    this.settled = true;
    this.tSim = 0;
    this.launchLeft = 0;
    this.launchTorque = 0;
    this.estimatedDuration = 0;
    this.lastCrestWasBoundary = false;

    this._settleTimer = 0;
    this._acc = 0;
    this._prevD = 0;
    this._prevPin = -1;
    this._seatEmitted = false;
    /** @type {Map<number, number>} Last emission time per pin, for chatter debouncing. */
    this._lastEmit = new Map();
    /** @type {ImpactEvent[]} */
    this._events = [];

    this._applyTuning();
  }

  /** Recomputes derived tuning after a preset, tension or skin change. @returns {void} */
  _applyTuning() {
    const tensionMul = TENSION_MULTIPLIERS[this.tensionKey] || 1;
    this.I = this.preset.inertia;
    this.coulomb = this.preset.coulomb;
    this.k = PHYSICS.SPRING_K * tensionMul * this.skinTensionMul * (this._tensionJitter || 1);
    this.J = PHYSICS.FLAPPER_J * this.skinMassMul;
    this.c = PHYSICS.FLAPPER_C * this.skinDampingMul;
    this.b = PHYSICS.VISCOUS_B * (this.preset.drag || 1);
  }

  /**
   * Rebuilds the pin ring for a new item list without jolting the wheel: `theta` is
   * preserved, so the wheel re-seats into whichever valley now contains it. Ignored while
   * a spin is in flight, since rebuilding the ring under a moving flapper teleports the
   * cam out from under it.
   * @param {WheelItem[]} items
   * @returns {void}
   */
  setItems(items) {
    if (this.spinning) return;
    this.pins = buildPins(items);
    this.maxLift = this._maxLift();
    this._prevPin = -1;
    this._backTravel = 0;
    if (!this.spinning) {
      this.phi = 0;
      this.phiDot = 0;
      this.contact = true;
    }
  }

  /** @returns {number} The flapper's mechanical lift limit for the current pin ring. */
  _maxLift() {
    let peak = 0;
    for (let i = 0; i < this.pins.count; i++) if (this.pins.amp[i] > peak) peak = this.pins.amp[i];
    return peak * PHYSICS.LIFT_LIMIT;
  }

  /**
   * @param {number} preset One of the {@link WHEEL_PRESETS} keys.
   * @returns {void}
   */
  setPreset(preset) {
    this.preset = WHEEL_PRESETS[preset] || this.preset;
    this._applyTuning();
  }

  /**
   * @param {string} tension One of the {@link TENSION_MULTIPLIERS} keys.
   * @returns {void}
   */
  setTension(tension) {
    this.tensionKey = tension;
    this._applyTuning();
  }

  /**
   * @param {{tensionMul?: number, massMul?: number, dampingMul?: number}} skin
   * @returns {void}
   */
  setSkin(skin) {
    if (!skin) return;
    this.skinTensionMul = skin.tensionMul == null ? 1 : skin.tensionMul;
    this.skinMassMul = skin.massMul == null ? 1 : skin.massMul;
    this.skinDampingMul = skin.dampingMul == null ? 1 : skin.dampingMul;
    this._applyTuning();
  }

  /**
   * Advances the wheel by hand, for the idle attract drift. Pin coupling and audio are
   * deliberately skipped: a real flapper would simply block a drift this slow.
   * @param {number} deltaAngle Radians to advance.
   * @returns {void}
   */
  drift(deltaAngle) {
    if (this.spinning) return;
    this.theta = wrapTau(this.theta + deltaAngle);
    this._backTravel = 0;
    const cam = this._cam(this.theta);
    this.phi = cam.L;
    this.phiDot = 0;
    this.contact = Math.abs(cam.d) < cam.hwC;
  }

  /**
   * Starts a spin. Torque is ramped in over {@link PHYSICS}.WIND_UP rather than the
   * velocity being assigned, which is what makes the wheel read as heavy.
   * @param {number} powerFactor Charge level in (0, 1].
   * @returns {number} The estimated spin duration in milliseconds.
   */
  launch(powerFactor) {
    const power = clamp(powerFactor, 0.02, 1);
    const jitter = 1 + (this.rng() * 2 - 1) * PHYSICS.OMEGA_JITTER;
    this._tensionJitter = 1 + (this.rng() * 2 - 1) * PHYSICS.TENSION_JITTER;
    this._applyTuning();

    const targetOmega = PHYSICS.OMEGA_MAX * power * jitter;
    this.launchTorque = (this.I * targetOmega) / PHYSICS.WIND_UP;
    this.launchLeft = PHYSICS.WIND_UP;

    this.spinning = true;
    this.settled = false;
    this.tSim = 0;
    this._acc = 0;
    this._settleTimer = 0;
    this._seatEmitted = false;
    this._prevPin = -1;
    this._lastEmit.clear();
    this.lastCrestWasBoundary = false;
    this._backTravel = 0;
    this.reverseStopped = false;

    this.estimatedDuration = this._estimate();
    return this.estimatedDuration;
  }

  /**
   * Predicts how long this spin will take, by running the solver forward on a copy of its
   * own state and seeing where it stops.
   *
   * A closed form over a reduced model was tried first and ran 15-53% long, worst on
   * densely pinned wheels, which made the `premature_nope` achievement (cancel past 80% of
   * the expected duration) literally unreachable on a 50-item list. Since the solver is
   * deterministic, simulating it is not an approximation at all, and it costs a couple of
   * milliseconds once per spin against a spin lasting seconds.
   *
   * @returns {number} Milliseconds.
   */
  _estimate() {
    const saved = {
      theta: this.theta,
      omega: this.omega,
      phi: this.phi,
      phiDot: this.phiDot,
      contact: this.contact,
      spinning: this.spinning,
      settled: this.settled,
      tSim: this.tSim,
      launchLeft: this.launchLeft,
      acc: this._acc,
      settleTimer: this._settleTimer,
      seatEmitted: this._seatEmitted,
      prevPin: this._prevPin,
      lastCrestWasBoundary: this.lastCrestWasBoundary,
      backTravel: this._backTravel,
      reverseStopped: this.reverseStopped,
    };

    const h = PHYSICS.SUBSTEP;
    const limit = Math.ceil(PHYSICS.MAX_SPIN_TIME / h);
    let steps = 0;
    while (!this.settled && steps++ < limit) this._substep(h);
    const seconds = this.tSim;

    this.theta = saved.theta;
    this.omega = saved.omega;
    this.phi = saved.phi;
    this.phiDot = saved.phiDot;
    this.contact = saved.contact;
    this.spinning = saved.spinning;
    this.settled = saved.settled;
    this.tSim = saved.tSim;
    this.launchLeft = saved.launchLeft;
    this._acc = saved.acc;
    this._settleTimer = saved.settleTimer;
    this._seatEmitted = saved.seatEmitted;
    this._prevPin = saved.prevPin;
    this.lastCrestWasBoundary = saved.lastCrestWasBoundary;
    this._backTravel = saved.backTravel;
    this.reverseStopped = saved.reverseStopped;
    this._lastEmit.clear();
    this._events.length = 0;

    return clamp(seconds, 0.4, PHYSICS.MAX_SPIN_TIME) * 1000;
  }

  /** @returns {number} The estimated duration of the current spin, in milliseconds. */
  estimateDuration() {
    return this.estimatedDuration;
  }

  /** Aborts the current spin without settling or picking a winner. @returns {void} */
  cancel() {
    this.spinning = false;
    this.settled = true;
    this.omega = 0;
    this.phiDot = 0;
    this.launchLeft = 0;
    this._backTravel = 0;
    this._events.length = 0;
  }

  /**
   * Advances the drawn arm toward the deflection the solver computed.
   *
   * A damped second-order follower, so the arm lags the cam by a frame or two, overshoots when
   * a pin lets go and rings back through rest. Sub-stepped because a frame at 30 Hz is too
   * coarse a step for a 12 Hz mode to stay stable at.
   *
   * Runs whether or not the wheel is turning: the ringing outlasts the spin that caused it.
   *
   * @param {number} dt Seconds since the previous frame.
   * @returns {void}
   */
  _advanceFlex(dt) {
    const w = TAU * PHYSICS.FLEX_FREQ;
    const zeta = PHYSICS.FLEX_DAMPING;
    let left = clamp(dt, 0, PHYSICS.MAX_DT);

    while (left > 0) {
      const h = left > FLEX_STEP ? FLEX_STEP : left;
      const acc = w * w * (this.phi - this._flexPhi) - 2 * zeta * w * this._flexVel;
      this._flexVel += acc * h;
      this._flexPhi += this._flexVel * h;
      left -= h;
    }
  }

  /** @returns {number} Rendered flapper deflection, radians. */
  flapperAngle() {
    return this._flexPhi * PHYSICS.DISPLAY_GAIN;
  }

  /**
   * Where the wheel is sitting between two pins, as a fraction: 0 means the flapper is
   * right on top of a pin, 1 means it has dropped to the floor of the valley.
   *
   * A position, not a contact -- the flapper is only against the pin over the first tenth or so
   * of this range, and {@link touchingPin} is what answers that. A wheel that always reports 1
   * has a spring stiff enough to overpower bearing stiction every time, which looks mechanical:
   * it snaps to dead centre on every spin. A healthy spread here is what produces the
   * occasional nerve-wracking stop against a pin.
   *
   * @returns {number}
   */
  seatOffset() {
    const cam = this._cam(this.theta);
    return Math.min(Math.abs(cam.d) / cam.hw, 1);
  }

  /**
   * Width of the valley the flapper is sitting in, radians.
   *
   * Equal across the ring by construction -- that equality is the fairness guarantee -- but not
   * equal to `2PI / count` on a wheel whose segments round to different pin counts, so a
   * rollback is measured against this rather than against the ring's mean pitch.
   *
   * @returns {number}
   */
  valleyWidth() {
    return 2 * this._cam(this.theta).hw;
  }

  /** @returns {boolean} Whether the pin nearest the flapper is a segment boundary. */
  restingOnBoundary() {
    return this.pins.boundary[this._cam(this.theta).i] === 1;
  }

  /**
   * Whether the nose is against a pin right now, as opposed to hanging free between two.
   *
   * Distinct from {@link seatOffset}, which says where the wheel sits in its valley whether or
   * not anything is touching. Once the contact window shrank to the drawn pin, most spins end
   * free, so this is the honest measure of whether the escapement is still holding the wheel.
   *
   * @returns {boolean}
   */
  touchingPin() {
    const cam = this._cam(this.theta);
    return Math.abs(cam.d) < cam.hwC;
  }

  /**
   * Locates the pin nearest the flapper and evaluates the cam there.
   *
   * The pin owning each half of a gap is found first, then the flapper is only *on* that pin
   * while it is within the pin's contact window -- the arc over which the drawn circle actually
   * reaches the nose. Between windows the cam is flat and the wheel runs free, which is the
   * whole point: the cam used to span the entire gap, so the pointer began climbing a pin a
   * quarter-segment before it arrived.
   *
   * `hw` stays half the gap regardless, because {@link seatOffset} reads it as "how far across
   * the valley", not "how close to touching".
   *
   * @param {number} theta
   * @returns {{i: number, d: number, hw: number, hwC: number, L: number, Ld: number, Ldd: number}}
   */
  _cam(theta) {
    const pins = this.pins;
    const { angles, gapAfter, amp, contactHalf, count } = pins;
    const q = wrapTau(-theta);

    // Largest index whose angle is <= q; wraps to the last pin when q precedes all of them.
    let j;
    if (q < angles[0]) {
      j = count - 1;
    } else {
      let lo = 0;
      let hi = count - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (angles[mid] <= q) lo = mid;
        else hi = mid - 1;
      }
      j = lo;
    }

    const gap = gapAfter[j];
    let f = q - angles[j];
    if (f < 0) f += TAU;

    // The gap's near half is attributed to pin j (approaching, d < 0), its far half to pin j+1
    // (already passed, d > 0). Attribution is not contact: it only says which pin is nearest.
    let i;
    let d;
    const hw = gap / 2;
    if (f <= hw) {
      i = j;
      d = -f;
    } else {
      i = (j + 1) % count;
      d = gap - f;
    }

    // On a ring pinned tightly enough that the windows would overlap, the gap wins -- two pins
    // cannot both be touching the one nose.
    const hwC = Math.min(hw, contactHalf[i]);
    if (d <= -hwC || d >= hwC) return { i, d, hw, hwC, L: 0, Ld: 0, Ldd: 0 };

    const a = amp[i];
    const ratio = d / hwC;
    const L = a * (1 - ratio * ratio);
    const Ld = (-2 * a * d) / (hwC * hwC);
    const Ldd = (-2 * a) / (hwC * hwC);
    return { i, d, hw, hwC, L, Ld, Ldd };
  }

  /**
   * Advances the simulation by a wall-clock delta, sub-stepping at a fixed rate so the
   * result is identical at 60, 120 or 144 Hz.
   * @param {number} dt Seconds since the previous frame.
   * @returns {{impacts: ImpactEvent[], settled: boolean}}
   */
  step(dt) {
    this._events.length = 0;
    this._advanceFlex(dt);
    if (!this.spinning) return { impacts: this._events, settled: this.settled };

    this._acc += clamp(dt, 0, PHYSICS.MAX_DT);
    const h = PHYSICS.SUBSTEP;
    let guard = Math.ceil(PHYSICS.MAX_DT / h) + 2;

    while (this._acc >= h && guard-- > 0) {
      this._acc -= h;
      this._substep(h);
      if (this.settled) break;
    }

    return { impacts: this._events, settled: this.settled };
  }

  /**
   * One fixed-timestep integration step (semi-implicit Euler).
   * @param {number} h
   * @returns {void}
   */
  _substep(h) {
    const cam = this._cam(this.theta);
    const { i, d, hwC, L, Ld, Ldd } = cam;
    const isBoundary = this.pins.boundary[i] === 1;

    let tauLaunch = 0;
    if (this.launchLeft > 0) {
      tauLaunch = this.launchTorque;
      this.launchLeft -= h;
    }

    // Past the edge of the pin's contact window there is nothing under the nose at all, so the
    // flapper is not a cam follower there -- it is hanging on its mount. Saying otherwise makes
    // the next window entry teleport phiDot from 0 to Ld * omega with no impulse to pay for it,
    // which quietly hands the wheel energy at every pin.
    if (this.contact && Math.abs(d) >= hwC) this.contact = false;

    let alpha;
    let N = 0;

    if (this.contact) {
      // Cam-constrained: the flapper's inertia is reflected through the cam slope,
      // so the stiff spring never enters the integrator directly.
      const den = this.I + this.J * Ld * Ld;
      const drive =
        tauLaunch -
        this.b * this.omega -
        Ld * (this.k * L + this.c * Ld * this.omega + this.J * Ldd * this.omega * this.omega);
      alpha = this._withFriction(drive, den, this.k * L);
      N = this.k * L + this.c * Ld * this.omega + this.J * (Ldd * this.omega * this.omega + Ld * alpha);

      if (N < 0) {
        // The cam is dropping away faster than the spring can follow: the flapper flies.
        this.contact = false;
        this.phi = L;
        this.phiDot = Ld * this.omega;
        N = 0;
      }
    }

    if (!this.contact) {
      alpha = this._withFriction(tauLaunch - this.b * this.omega, this.I, 0);
      const phiAcc = (-this.k * this.phi - this.c * this.phiDot) / this.J;
      this.phiDot += phiAcc * h;
      this.phi += this.phiDot * h;

      // The flapper's mounting stops it travelling any further out.
      if (this.phi > this.maxLift) {
        this.phi = this.maxLift;
        if (this.phiDot > 0) this.phiDot = 0;
      }

      // ...and catches it at the bottom. Between pins the spring pulls the nose down onto its
      // rest stop, which is where it waits for the next pin rather than swinging past.
      if (this.phi < 0) {
        this.phi = 0;
        if (this.phiDot < 0) this.phiDot = 0;
      }
    }

    this.omega += alpha * h;

    // Anti-reverse stop. Everything above lets the flapper push the wheel backwards without
    // bound; what normally ends a rollback is the pin behind catching it, and on the freest
    // wheel with the stiffest spring that pin does not. Blocking the travel rather than damping
    // it is what a pawl does, and it leaves the escapement in charge wherever it still works --
    // see {@link PHYSICS}.REVERSE_LIMIT for why one valley is slack on every shipping setting.
    let dTheta = this.omega * h;
    if (dTheta < 0) {
      const room = PHYSICS.REVERSE_LIMIT * cam.hw * 2 - this._backTravel;
      if (-dTheta >= room) {
        dTheta = room > 0 ? -room : 0;
        this.omega = 0;
        this.reverseStopped = true;
      }
      this._backTravel -= dTheta;
    } else {
      // Forward travel re-arms the stop the way a ratchet's pawl drops into the next tooth: the
      // budget is measured from wherever the wheel last got to, not from the launch.
      this._backTravel = this._backTravel > dTheta ? this._backTravel - dTheta : 0;
    }

    const thetaNext = this.theta + dTheta;

    if (!this.contact) {
      const camNext = this._cam(thetaNext);
      if (Math.abs(camNext.d) < camNext.hwC && this.phi <= camNext.L) {
        // Re-seat: an inelastic collision along the cam constraint. The nose was dropped by the
        // pin it had been riding and is landing on the next one, which is the loud half of an
        // escapement's cycle and by far the most common event now that the nose is airborne
        // between pins rather than in contact the whole way round.
        const vRel = Math.abs(camNext.Ld * this.omega - this.phiDot);
        const den = this.I + this.J * camNext.Ld * camNext.Ld;
        const omegaAfter = (this.I * this.omega + this.J * camNext.Ld * this.phiDot) / den;
        const impulse = Math.abs(this.J * (camNext.Ld * omegaAfter - this.phiDot));
        this.omega = omegaAfter;
        this.phi = camNext.L;
        this.phiDot = camNext.Ld * this.omega;
        this.contact = true;
        this._emit("release", impulse / h, vRel, camNext.i, this.pins.boundary[camNext.i] === 1, 0);
      }
    } else {
      this.phi = L;
      this.phiDot = Ld * this.omega;
    }

    this.theta = wrapTau(thetaNext);
    this.tSim += h;

    this._detectCrossings(h, cam, N, isBoundary);
    this._checkSettle(h);
  }

  /**
   * Applies bearing friction, with a higher holding force once stopped so the wheel does
   * not jitter around zero and does not get dragged to dead centre.
   * @param {number} drive Net torque before friction.
   * @param {number} den Effective inertia.
   * @param {number} contactForce Normal force at the flapper tip; zero when separated.
   * @returns {number} Angular acceleration.
   */
  _withFriction(drive, den, contactForce) {
    if (Math.abs(this.omega) > PHYSICS.OMEGA_EPS) {
      return (drive - this.coulomb * Math.sign(this.omega)) / den;
    }

    // Stationary: the bearing holds a little harder than it drags, and the flapper tip grips
    // the pin it is pressed against. Together they can resist the spring's pull toward the
    // valley floor, so the wheel stays part-way up a pin instead of being dragged to centre.
    const hold = this.coulomb * PHYSICS.STATIC_FRICTION + PHYSICS.CONTACT_GRIP * contactForce;
    if (Math.abs(drive) <= hold) {
      this.omega = 0;
      return 0;
    }
    return (drive - hold * Math.sign(drive)) / den;
  }

  /**
   * Emits `engage` when a pin arrives under a resting nose and starts lifting it, and
   * `release` when the nose tips over a crest.
   *
   * Engagement is entering the pin's contact window, not crossing the valley bottom between two
   * pins. Those were the same instant while the cam ran wall to wall; now the valley bottom is
   * a stretch of nothing, and an engage keyed to it would fire where nothing is touching and be
   * filtered out every time. It only fires at low speed, since a nose still moving quickly is
   * airborne when the next pin arrives and lands on it instead -- that is a `release`.
   *
   * @param {number} h
   * @param {{i: number, d: number, hwC: number, Ld: number}} cam
   * @param {number} N
   * @param {boolean} isBoundary
   * @returns {void}
   */
  _detectCrossings(h, cam, N, isBoundary) {
    const after = this._cam(this.theta);

    const wasTouching = Math.abs(cam.d) < cam.hwC;
    const isTouching = Math.abs(after.d) < after.hwC;
    if (isTouching && (!wasTouching || after.i !== this._prevPin)) {
      const vImpact = Math.abs(after.Ld * this.omega);
      this._emit("engage", N, vImpact, after.i, this.pins.boundary[after.i] === 1, h * 0.5);
    }
    this._prevPin = after.i;

    if (after.i === cam.i && cam.d < 0 && after.d >= 0) {
      const frac = cam.d === after.d ? 0.5 : -cam.d / (after.d - cam.d);
      this.lastCrestWasBoundary = isBoundary;
      this._emit("release", N, Math.abs(cam.Ld * this.omega), cam.i, isBoundary, h * clamp(frac, 0, 1));
    } else if (after.i === cam.i && cam.d > 0 && after.d <= 0) {
      // Same crest, crossed backwards -- the flapper has just pushed the wheel back over.
      this.lastCrestWasBoundary = isBoundary;
      this._emit("release", N, Math.abs(cam.Ld * this.omega), cam.i, isBoundary, h * 0.5);
    }
  }

  /**
   * @param {number} h
   * @returns {void}
   */
  _checkSettle(h) {
    if (Math.abs(this.omega) < PHYSICS.OMEGA_EPS) {
      this._settleTimer += h;
    } else {
      this._settleTimer = 0;
    }

    if (this._settleTimer >= PHYSICS.SETTLE_TIME || this.tSim >= PHYSICS.MAX_SPIN_TIME) {
      this.spinning = false;
      this.settled = true;
      this.omega = 0;
      this.phiDot = 0;
      if (!this._seatEmitted) {
        this._seatEmitted = true;
        const cam = this._cam(this.theta);
        this._emit("seat", this.k * cam.L, 0, cam.i, this.pins.boundary[cam.i] === 1, 0);
      }
    }
  }

  /**
   * @param {'engage'|'release'|'seat'} kind
   * @param {number} force
   * @param {number} vImpact
   * @param {number} pinIndex
   * @param {boolean} isBoundary
   * @param {number} tOffset Sub-step offset, seconds.
   * @returns {void}
   */
  _emit(kind, force, vImpact, pinIndex, isBoundary, tOffset) {
    const magnitude = Math.abs(force);

    if (kind !== "seat") {
      // An engage happens at the valley floor where the contact force is near zero, so it
      // is judged on how fast the flapper is travelling; a release happens at the crest,
      // where force is the meaningful quantity.
      const audible =
        kind === "engage" ? vImpact >= PHYSICS.MIN_EVENT_SPEED : magnitude >= PHYSICS.MIN_EVENT_FORCE;
      if (!audible) return;

      const last = this._lastEmit.get(pinIndex);
      if (last != null && this.tSim - last < PHYSICS.EVENT_DEBOUNCE) return;
      if (this._events.length >= PHYSICS.MAX_EVENTS_PER_STEP) return;
      this._lastEmit.set(pinIndex, this.tSim);
    }

    this._events.push({
      tSim: this.tSim + tOffset,
      kind,
      force: magnitude,
      vImpact,
      omega: this.omega,
      isBoundary,
      pinIndex,
    });
  }
}

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.WheelPhysics = WheelPhysics;
  window.buildPins = buildPins;
  window.PHYSICS = PHYSICS;
  window.GEOMETRY = GEOMETRY;
  window.WHEEL_PRESETS = WHEEL_PRESETS;
  window.TENSION_MULTIPLIERS = TENSION_MULTIPLIERS;
}
