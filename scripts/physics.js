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
  /** Flapper torsion spring constant at nominal tension. */
  SPRING_K: 22,
  /** Flapper moment of inertia. */
  FLAPPER_J: 0.00007,
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
  /** Fixed integration timestep, seconds. */
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
};

/**
 * Wheel mass presets, keyed by the legacy `spinDuration` values so existing
 * localStorage and the `speed_demon` / `patience_is_a_virtue` achievements keep working.
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
  light: 0.55,
  normal: 1,
  strong: 1.7,
  brutal: 2.6,
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
 */

/** @param {number} a @returns {number} `a` wrapped into [0, 2PI). */
const wrapTau = (a) => {
  const r = a % TAU;
  return r < 0 ? r + TAU : r;
};

/** @param {number} v @param {number} lo @param {number} hi @returns {number} */
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/**
 * Builds the pin ring for a set of weighted items.
 *
 * One pin lands exactly on every segment boundary, which is what keeps the landing
 * probability proportional to weight; the remaining pins subdivide each segment so the
 * tick pitch stays near {@link PHYSICS}.TARGET_PITCH. Every segment gets at least one
 * valley, so no item can ever become unreachable.
 *
 * @param {WheelItem[]} items
 * @returns {PinArray}
 */
export const buildPins = (items) => {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) {
    return {
      angles: new Float64Array([0]),
      boundary: new Uint8Array([1]),
      gapAfter: new Float64Array([TAU]),
      amp: new Float64Array([PHYSICS.CAM_AMPLITUDE]),
      count: 1,
    };
  }

  const WEIGHT_FLOOR = 1e-6;
  const weights = list.map((it) => Math.max(WEIGHT_FLOOR, Number(it && it.weight) || 0));
  const total = weights.reduce((s, w) => s + w, 0);

  // A segment always gets a whole number of valleys, so a segment narrower than one
  // pitch is rounded up to one and lands far more often than its weight deserves. The
  // pin budget is therefore raised until even the thinnest segment is resolved, capped
  // so an extreme list cannot turn the rim into a solid ring.
  const minFraction = Math.min(...weights) / total;
  const basePins = Math.round(TAU / PHYSICS.TARGET_PITCH);
  const budget = clamp(Math.ceil(1.2 / minFraction), basePins, PHYSICS.MAX_TOTAL_PINS);

  /** @type {number[]} */
  const angles = [];
  /** @type {number[]} */
  const boundary = [];

  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    const start = (acc / total) * TAU;
    acc += weights[i];
    const end = (acc / total) * TAU;
    const arc = end - start;

    const n = Math.max(1, Math.round((weights[i] / total) * budget));

    angles.push(start);
    boundary.push(1);
    for (let j = 1; j < n; j++) {
      angles.push(start + (arc * j) / n);
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
  };

  for (let i = 0; i < count; i++) {
    out.gapAfter[i] =
      i < count - 1 ? out.angles[i + 1] - out.angles[i] : out.angles[0] + TAU - out.angles[count - 1];
  }

  // Cam amplitude tracks the local gap so narrow valleys stay numerically tame and so
  // the barrier a spin has to clear scales with the arc it is being trapped in.
  for (let i = 0; i < count; i++) {
    const hwL = out.gapAfter[i] / 2;
    const hwR = out.gapAfter[(i - 1 + count) % count] / 2;
    const meanGap = hwL + hwR;
    const scale = clamp(meanGap / PHYSICS.TARGET_PITCH, PHYSICS.GAP_SCALE_FLOOR, 1);
    out.amp[i] = PHYSICS.CAM_AMPLITUDE * Math.pow(scale, PHYSICS.GAP_EXPONENT);
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
   * preserved, so the wheel re-seats into whichever valley now contains it.
   * @param {WheelItem[]} items
   * @returns {void}
   */
  setItems(items) {
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
    this.lastCrestWasBoundary = false;

    this.estimatedDuration = this._estimate(targetOmega);
    return this.estimatedDuration;
  }

  /**
   * Closed-form stop-time estimate for a reduced model (no cam, averaged pin drag).
   * Kept so the `premature_nope` achievement still has a percentage to measure against.
   * @param {number} omega0
   * @returns {number} Milliseconds.
   */
  _estimate(omega0) {
    const beta = this.b + pinDragCoefficient(this.pins, this.c);
    const seconds =
      beta > 1e-9
        ? (this.I / beta) * Math.log(1 + (beta * omega0) / this.coulomb)
        : (this.I * omega0) / this.coulomb;
    return clamp(seconds, 0.4, PHYSICS.MAX_SPIN_TIME) * 1000 + PHYSICS.WIND_UP * 1000;
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
    this._events.push({
      tSim: this.tSim + tOffset,
      kind,
      force: Math.abs(force),
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
