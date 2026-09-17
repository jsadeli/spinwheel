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
 * This module is deliberately DOM-free so it can be imported by Node for headless
 * Monte Carlo fairness testing (see tools/physics-sim.mjs).
 *
 * @module physics
 */

const TAU = Math.PI * 2;

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
  /** Flapper deflection at a pin crest, for a nominal-pitch gap. */
  CAM_AMPLITUDE: 0.25,
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
   * Deliberately weak. A stiff spring always beats bearing stiction on the way down, so the
   * wheel is dragged to the floor of a valley on essentially every spin and comes to rest
   * dead between two pins. At this value the restoring torque is comparable to stiction, so
   * the wheel often stops wherever it died -- including partway up a pin, with the flapper
   * visibly leaning against it. It also means the last seconds are decided by much finer
   * energy margins: roughly four times as many crests are crossed in the closing three
   * seconds as with a stiff spring.
   */
  SPRING_K: 4,
  /** Flapper moment of inertia. */
  FLAPPER_J: 0.00003,
  /** Flapper viscous damping; this is what turns crest climbs into net energy loss. */
  FLAPPER_C: 0.004,
  /** Wheel viscous drag coefficient. */
  VISCOUS_B: 0.02,
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
  /** Below this speed the wheel is a candidate for settling. */
  OMEGA_EPS: 0.02,
  /** How long the wheel must stay below OMEGA_EPS before it counts as settled. */
  SETTLE_TIME: 0.12,
  /** Hard cap on simulated spin length, so a spin can never fail to terminate. */
  MAX_SPIN_TIME: 90,
  /** Multiplier from physical flapper deflection to rendered deflection. */
  DISPLAY_GAIN: 2.4,
  /**
   * Event gating. A settling wheel rocks across a valley floor and the flapper re-seats
   * many times on the same pin, which is physically real but produces hundreds of
   * inaudible events per second. These bound what reaches the audio layer.
   */
  MIN_EVENT_FORCE: 0.12,
  MIN_EVENT_SPEED: 6,
  EVENT_DEBOUNCE: 0.04,
  MAX_EVENTS_PER_STEP: 8,
};

/**
 * Wheel mass presets, keyed by the legacy `spinDuration` values so existing localStorage
 * and the `speed_demon` / `patience_is_a_virtue` achievements keep working.
 *
 * Coulomb friction deliberately does *not* scale with inertia. Bearing friction really is
 * proportional to weight, but making it so leaves the ratio that governs deceleration
 * unchanged, and the preset would then do nothing at all. It is scaled sub-proportionally
 * instead, which is what makes a heavy wheel run long.
 * @type {Object<number, {key: number, label: string, inertia: number, coulomb: number}>}
 */
export const WHEEL_PRESETS = {
  5000: { key: 5000, label: "light", inertia: 0.55, coulomb: 1.1 },
  10000: { key: 10000, label: "normal", inertia: 1.0, coulomb: 1.0 },
  20000: { key: 20000, label: "heavy", inertia: 2.1, coulomb: 0.95 },
};

/**
 * Spring tension multipliers applied on top of {@link PHYSICS}.SPRING_K.
 * @type {Object<string, number>}
 */
export const TENSION_MULTIPLIERS = {
  light: 0.7,
  normal: 1,
  strong: 1.5,
  brutal: 2.2,
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

/** @returns {PinArray} A single-pin ring, used for empty or degenerate item lists. */
const singlePin = () => ({
  angles: new Float64Array([0]),
  boundary: new Uint8Array([1]),
  gapAfter: new Float64Array([TAU]),
  amp: new Float64Array([PHYSICS.CAM_AMPLITUDE]),
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
    out.amp[i] = PHYSICS.CAM_AMPLITUDE * density * Math.pow(scale, PHYSICS.GAP_EXPONENT);
  }

  return out;
};

/**
 * Mean viscous drag the pin ring adds to the wheel, used for the closed-form
 * duration estimate. Derived from the integral of the squared cam slope over each
 * pin's window, divided by that window's width.
 *
 * @param {PinArray} pins
 * @param {number} flapperC
 * @returns {number}
 */
const pinDragCoefficient = (pins, flapperC) => {
  let sum = 0;
  for (let i = 0; i < pins.count; i++) {
    const hwL = pins.gapAfter[i] / 2;
    const hwR = pins.gapAfter[(i - 1 + pins.count) % pins.count] / 2;
    const a2 = pins.amp[i] * pins.amp[i];
    const integral = ((4 * a2) / 3) * (1 / hwL + 1 / hwR);
    sum += integral / (hwL + hwR);
  }
  return (flapperC * sum) / pins.count;
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
    this.b = PHYSICS.VISCOUS_B;
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
    this._prevPin = -1;
    if (!this.spinning) {
      this.phi = 0;
      this.phiDot = 0;
      this.contact = true;
    }
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
    const cam = this._cam(this.theta);
    this.phi = cam.L;
    this.phiDot = 0;
    this.contact = true;
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
    this._events.length = 0;
  }

  /** @returns {number} Rendered flapper deflection, radians. */
  flapperAngle() {
    return this.phi * PHYSICS.DISPLAY_GAIN;
  }

  /**
   * Where the wheel is sitting between two pins, as a fraction: 0 means the flapper is
   * right on top of a pin, 1 means it has dropped to the floor of the valley.
   *
   * A wheel that always reports 1 has a spring stiff enough to overpower bearing stiction
   * every time, which looks mechanical -- it snaps to dead centre on every spin. A healthy
   * spread here is what produces the occasional nerve-wracking stop against a pin.
   *
   * @returns {number}
   */
  seatOffset() {
    const cam = this._cam(this.theta);
    return Math.min(Math.abs(cam.d) / cam.hw, 1);
  }

  /** @returns {boolean} Whether the pin the flapper is resting against is a segment boundary. */
  restingOnBoundary() {
    return this.pins.boundary[this._cam(this.theta).i] === 1;
  }

  /**
   * Locates the pin currently under the flapper and evaluates the cam there.
   * @param {number} theta
   * @returns {{i: number, d: number, hw: number, L: number, Ld: number, Ldd: number}}
   */
  _cam(theta) {
    const pins = this.pins;
    const { angles, gapAfter, amp, count } = pins;
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

    // Windows tile the gap exactly: the near half belongs to pin j (approaching, d < 0),
    // the far half to pin j+1 (already passed, d > 0).
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

    const a = amp[i];
    const ratio = d / hw;
    const L = a * (1 - ratio * ratio);
    const Ld = (-2 * a * d) / (hw * hw);
    const Ldd = (-2 * a) / (hw * hw);
    return { i, d, hw, L, Ld, Ldd };
  }

  /**
   * Advances the simulation by a wall-clock delta, sub-stepping at a fixed rate so the
   * result is identical at 60, 120 or 144 Hz.
   * @param {number} dt Seconds since the previous frame.
   * @returns {{impacts: ImpactEvent[], settled: boolean}}
   */
  step(dt) {
    this._events.length = 0;
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
    const { i, d, L, Ld, Ldd } = cam;
    const isBoundary = this.pins.boundary[i] === 1;

    let tauLaunch = 0;
    if (this.launchLeft > 0) {
      tauLaunch = this.launchTorque;
      this.launchLeft -= h;
    }

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
      alpha = this._withFriction(drive, den);
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
      alpha = this._withFriction(tauLaunch - this.b * this.omega, this.I);
      const phiAcc = (-this.k * this.phi - this.c * this.phiDot) / this.J;
      this.phiDot += phiAcc * h;
      this.phi += this.phiDot * h;
    }

    this.omega += alpha * h;
    const thetaNext = this.theta + this.omega * h;

    if (!this.contact) {
      const camNext = this._cam(thetaNext);
      if (this.phi <= camNext.L) {
        // Re-seat: an inelastic collision along the cam constraint.
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
   * Applies Coulomb bearing friction, including stiction so the wheel does not
   * jitter around zero.
   * @param {number} drive Net torque before friction.
   * @param {number} den Effective inertia.
   * @returns {number} Angular acceleration.
   */
  _withFriction(drive, den) {
    if (Math.abs(this.omega) > PHYSICS.OMEGA_EPS) {
      return (drive - this.coulomb * Math.sign(this.omega)) / den;
    }
    if (Math.abs(drive) <= this.coulomb) {
      this.omega = 0;
      return 0;
    }
    return (drive - this.coulomb * Math.sign(drive)) / den;
  }

  /**
   * Emits `engage` when the flapper crosses a valley bottom onto a new pin, and
   * `release` when it tips over a crest.
   * @param {number} h
   * @param {{i: number, d: number, Ld: number}} cam
   * @param {number} N
   * @param {boolean} isBoundary
   * @returns {void}
   */
  _detectCrossings(h, cam, N, isBoundary) {
    const after = this._cam(this.theta);

    if (this._prevPin !== -1 && after.i !== this._prevPin) {
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
  window.WHEEL_PRESETS = WHEEL_PRESETS;
  window.TENSION_MULTIPLIERS = TENSION_MULTIPLIERS;
}
