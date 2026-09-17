import { TICK_SOUNDS } from "./configs.js";

/**
 * Plays a celebratory fanfare sound when the wheel stops.
 * Creates a C Major chord progression using Web Audio API.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 * @example
 * playWinSound(audioCtxRef, true);
 */
export const playWinSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Helper for playing a tone
  const playTone = (freq, start, dur, type = "triangle", vol = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(getSfxBus(ctx));
    osc.start(start);
    osc.stop(start + dur);
  };

  // A major fanfare sequence (C Major)
  playTone(523.25, now + 0.0, 0.3, "square", 0.1); // C5
  playTone(659.25, now + 0.1, 0.3, "square", 0.1); // E5
  playTone(783.99, now + 0.2, 0.3, "square", 0.1); // G5

  // The "Ta-Da" finale (Chord)
  playTone(523.25, now + 0.3, 1.5, "triangle", 0.15); // C5
  playTone(659.25, now + 0.3, 1.5, "triangle", 0.15); // E5
  playTone(783.99, now + 0.3, 1.5, "triangle", 0.15); // G5
  playTone(1046.5, now + 0.3, 2.0, "sawtooth", 0.1); // C6 (Top Note, sharper)
};

/**
 * Plays a Christmas-themed Jingle Bells melody.
 * Replaces the win sound for the holiday season.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playJingleBells = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Helper for playing a tone with bell-like envelope
  // Increased default volume to 0.4 to match the loudness of playWinSound (which uses louder Square/Sawtooth waves)
  const playNote = (freq, start, dur, vol = 0.4) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Mix sine and triangle for a bell/chime character
    osc.type = "sine";
    // Add a subtle second oscillator for richness could be nice, but keeping it simple for now

    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.05); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur); // Bell-like decay

    osc.connect(gain);
    gain.connect(getSfxBus(ctx));
    osc.start(start);
    osc.stop(start + dur);
  };

  const E5 = 659.25;
  const G5 = 783.99;
  const C5 = 523.25;
  const D5 = 587.33;

  // Timing (Seconds)
  let t = now;
  const beat = 0.2;

  // First measure: E E E
  playNote(E5, t, 0.3); t += beat;
  playNote(E5, t, 0.3); t += beat;
  playNote(E5, t, 0.6); t += beat * 2;

  // Second measure: E E E
  playNote(E5, t, 0.3); t += beat;
  playNote(E5, t, 0.3); t += beat;
  playNote(E5, t, 0.6); t += beat * 2;

  // Third measure: E G C D E (long)
  playNote(E5, t, 0.3); t += beat;
  playNote(G5, t, 0.3); t += beat;
  playNote(C5, t, 0.3); t += beat;
  playNote(D5, t, 0.3); t += beat;
  playNote(E5, t, 1.2); t += beat * 4;

  // Final chord for "Win" feeling (C Major)
  // Reduced individual volume for the chord to avoid clipping while maintaining fullness
  const chordStart = t - beat * 2; // Overlap slightly with the last note
  playNote(C5, chordStart, 2.0, 0.3);
  playNote(E5, chordStart, 2.0, 0.3);
  playNote(G5, chordStart, 2.0, 0.3);
};

/**
 * Plays one pin strike.
 *
 * With an `impact` from the physics solver the voice is synthesized from that strike's
 * own force and speed. Without one it falls back to a representative mid-force release,
 * which is what a settings preview wants.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 * @param {string} [variant=TICK_SOUNDS.DEFAULT] - The tick sound variant to play.
 * @param {Object} [impact] - Impact event from WheelPhysics#step().
 * @returns {void}
 * @example
 * playTickSound(audioCtxRef, true, TICK_SOUNDS.CRISP);
 */
export const playTickSound = (audioCtxRef, soundEnabled, variant = TICK_SOUNDS.DEFAULT, impact) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;

  const spec = TICK_VARIANT_SPECS[variant] || TICK_VARIANT_SPECS[TICK_SOUNDS.DEFAULT];
  const ev = impact || {
    kind: "release",
    force: IMPACT_TUNING.FORCE_REF,
    vImpact: IMPACT_TUNING.V_REF,
    omega: IMPACT_TUNING.OMEGA_REF * 0.5,
    isBoundary: false,
  };

  buildImpactVoice(ctx, getWheelBus(ctx), spec, mapImpact(ev, spec, 1, 1), ctx.currentTime + 0.002);
};

/**
 * Plays the default electrical/plastic click tick sound.
 * @param {Object} audioCtxRef @param {boolean} soundEnabled @returns {void}
 */
export const playDefaultTickSound = (audioCtxRef, soundEnabled) =>
  playTickSound(audioCtxRef, soundEnabled, TICK_SOUNDS.DEFAULT);

/**
 * Plays a crisp wooden knock tick sound.
 * @param {Object} audioCtxRef @param {boolean} soundEnabled @returns {void}
 */
export const playCrispWoodTickSound = (audioCtxRef, soundEnabled) =>
  playTickSound(audioCtxRef, soundEnabled, TICK_SOUNDS.CRISP);

/**
 * Plays a heavy metallic clank tick sound.
 * @param {Object} audioCtxRef @param {boolean} soundEnabled @returns {void}
 */
export const playMetallicClankTickSound = (audioCtxRef, soundEnabled) =>
  playTickSound(audioCtxRef, soundEnabled, TICK_SOUNDS.METALLIC);

/**
 * Plays a luxurious crystal glass tick sound.
 * @param {Object} audioCtxRef @param {boolean} soundEnabled @returns {void}
 */
export const playCrystalGlassTickSound = (audioCtxRef, soundEnabled) =>
  playTickSound(audioCtxRef, soundEnabled, TICK_SOUNDS.CRYSTAL);

/**
 * Plays a fire crackle sound effect during overcharge.
 * Only plays if sound is enabled and the wheel is not broken.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 * @param {boolean} isOutOfOrder - Whether the wheel is currently broken.
 */
export const playFireCrackle = (audioCtxRef, soundEnabled, isOutOfOrder) => {
  if (!soundEnabled || !audioCtxRef.current || isOutOfOrder) return;
  const ctx = audioCtxRef.current;

  // Synthesize a short burst of noise (crackle)
  const bufferSize = ctx.sampleRate * 0.1; // 0.1 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Filter to make it sound more like fire (low rumble + high crackle)
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1000; // Muffle the harsh white noise

  const gain = ctx.createGain();
  // Random volume for texture
  gain.gain.setValueAtTime(0.05 + Math.random() * 0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(getSfxBus(ctx));

  noise.start();
};

/**
 * Plays a breakdown sound when the wheel breaks from overcharging.
 * Creates a descending "power down" effect.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playBreakdownSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;

  // A loud "clunk" and power down sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(100, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 1);

  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

  osc.connect(gain);
  gain.connect(getSfxBus(ctx));

  osc.start();
  osc.stop(ctx.currentTime + 1);
};

/**
 * Plays a cash register "Cha-Ching!" sound effect.
 * Used when a purchase is successfully completed.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playPurchaseSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // "Cha" - Mechanical/Sliding sound (short burst of filtered noise/sawtooth)
  const chaOsc = ctx.createOscillator();
  const chaGain = ctx.createGain();
  const chaFilter = ctx.createBiquadFilter();

  chaOsc.type = "sawtooth";
  chaOsc.frequency.setValueAtTime(800, now);
  chaOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.1); // Slide up slightly

  chaFilter.type = "highpass";
  chaFilter.frequency.setValueAtTime(2000, now);

  chaGain.gain.setValueAtTime(0.2, now);
  chaGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  chaOsc.connect(chaFilter);
  chaFilter.connect(chaGain);
  chaGain.connect(getSfxBus(ctx));
  chaOsc.start(now);
  chaOsc.stop(now + 0.1);

  // "Ching!" - High pitched ringing coin sound (Two distinct bells)
  const bell1 = ctx.createOscillator();
  const bell1Gain = ctx.createGain();
  bell1.type = "sine";
  bell1.frequency.setValueAtTime(1600, now + 0.08); // B6 approx
  bell1Gain.gain.setValueAtTime(0, now + 0.08);
  bell1Gain.gain.linearRampToValueAtTime(0.3, now + 0.09); // Fast attack
  bell1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8); // Long decay

  bell1.connect(bell1Gain);
  bell1Gain.connect(getSfxBus(ctx));
  bell1.start(now + 0.08);
  bell1.stop(now + 0.8);

  const bell2 = ctx.createOscillator();
  const bell2Gain = ctx.createGain();
  bell2.type = "sine";
  bell2.frequency.setValueAtTime(2400, now + 0.12); // High harmonic
  bell2Gain.gain.setValueAtTime(0, now + 0.12);
  bell2Gain.gain.linearRampToValueAtTime(0.2, now + 0.13);
  bell2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  bell2.connect(bell2Gain);
  bell2Gain.connect(getSfxBus(ctx));
  bell2.start(now + 0.12);
  bell2.stop(now + 0.6);
};

/**
 * Plays a "Big Purchase" sound effect for expensive items.
 * A rich, multi-layered chime/chord with a magical sparkle.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playBigPurchaseSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // 1. Rich Chord (Major 7th: C4, E4, G4, B4)
  const frequencies = [261.63, 329.63, 392.0, 493.88]; // C4, E4, G4, B4
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i % 2 === 0 ? "sine" : "triangle"; // Mix sine and triangle for richness
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0); // Long Sustain

    osc.connect(gain);
    gain.connect(getSfxBus(ctx));
    osc.start(now);
    osc.stop(now + 2.0);
  });

  // 2. High Sparkle Arpeggio (Rapid high notes)
  const sparkleFreqs = [1046.5, 1318.51, 1567.98, 2093.0]; // C6 scale
  sparkleFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + 0.1 + i * 0.08); // Staggered start

    gain.gain.setValueAtTime(0, now + 0.1 + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.1 + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc.connect(gain);
    gain.connect(getSfxBus(ctx));
    osc.start(now + 0.1 + i * 0.08);
    osc.stop(now + 1.0);
  });

  // 3. Deep Bass Pulse (for weight/importance)
  const bassOsc = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bassOsc.type = "sine";
  bassOsc.frequency.setValueAtTime(65.41, now); // C2
  bassGain.gain.setValueAtTime(0, now);
  bassGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
  bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  bassOsc.connect(bassGain);
  bassGain.connect(getSfxBus(ctx));
  bassOsc.start(now);
  bassOsc.stop(now + 1.5);
};

/**
 * Converts base64-encoded PCM audio data to a WAV Blob.
 * Used for playing AI-generated voice announcements.
 *
 * @param {string} base64Data - Base64-encoded PCM audio data.
 * @returns {Blob} A WAV audio Blob ready to be played.
 */
export const base64ToWavBlob = (base64Data) => {
  const audioBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  // Basic WAV header construction for PCM data
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + audioBytes.length, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, audioBytes.length, true);

  return new Blob([wavHeader, audioBytes], { type: "audio/wav" });
};

/**
 * Audio class for managing the charging/power-up sound effect.
 * Creates a rising mechanical motor sound that intensifies during overcharge.
 */
export const ChargeSound = class {
  /**
   * Creates a new ChargeSound instance.
   *
   * @param {AudioContext} audioCtx - Web Audio API context.
   */
  constructor(audioCtx) {
    this.ctx = audioCtx;
    this.osc = null;
    this.gain = null;
    this.filter = null;
  }

  /**
   * Starts the charging sound effect.
   * Creates oscillators, filters, and gain nodes for the motor sound.
   */
  start() {
    if (!this.ctx) return;
    this.stop(); // Ensure clean start

    const ctx = this.ctx;
    this.osc = ctx.createOscillator();
    this.gain = ctx.createGain();
    this.filter = ctx.createBiquadFilter();

    // Sawtooth gives a buzzy, mechanical "motor" sound
    this.osc.type = "sawtooth";
    this.osc.frequency.setValueAtTime(150, ctx.currentTime);

    // Configure Lowpass Filter to muffle the digital harshness
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(400, ctx.currentTime); // Start quite muffled (400Hz)

    // Fade in to avoid clicking
    this.gain.gain.setValueAtTime(0, ctx.currentTime);
    this.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);

    // Connect: Oscillator -> Filter -> Gain -> Output
    this.osc.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(getSfxBus(ctx));
    this.osc.start();
  }

  /**
   * Updates the charging sound based on power level and overcharge time.
   * Increases pitch and intensity as power builds, and creates a "screaming" effect during overcharge.
   *
   * @param {number} power - Current power level (0-1).
   * @param {number} [overchargeTime=0] - Time spent overcharging in milliseconds.
   */
  update(power, overchargeTime = 0) {
    if (!this.osc) return;
    const ctx = this.ctx;

    // Base: Ramp pitch from 150Hz to 500Hz based on power (0 to 1)
    let targetFreq = 150 + power * 350;

    // Overcharge Logic: If smoke is appearing (>3000ms overcharge), ramp pitch higher
    // Breakdown happens at ~18000ms. We ramp from 3000ms to 18000ms.
    if (overchargeTime > 3000) {
      // Normalize progress from 0.0 to 1.0 based on the danger zone duration (15s)
      const dangerProgress = Math.min((overchargeTime - 3000) / 15000, 1);

      // Add extra pitch (up to +800Hz) to reach ~1300Hz screaming
      targetFreq += dangerProgress * 800;

      // Open the filter wide to let the harsh high frequencies through
      if (this.filter) {
        const filterFreq = 1000 + dangerProgress * 5000; // Open up to 6000Hz
        this.filter.frequency.setTargetAtTime(filterFreq, ctx.currentTime, 0.1);
      }

      // Increase volume slightly
      if (this.gain) {
        this.gain.gain.setTargetAtTime(0.15 + dangerProgress * 0.1, ctx.currentTime, 0.1);
      }
    } else {
      // Normal charging behavior
      if (this.filter) {
        const filterFreq = 400 + power * 600; // Cap at 1000Hz for heavy feel
        this.filter.frequency.setTargetAtTime(filterFreq, ctx.currentTime, 0.1);
      }
      if (this.gain) {
        this.gain.gain.setTargetAtTime(0.1 + power * 0.05, ctx.currentTime, 0.1);
      }
    }

    this.osc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);
  }

  /**
   * Stops the charging sound with a quick fade-out.
   * Cleans up all audio nodes to prevent memory leaks.
   */
  stop() {
    if (this.osc) {
      try {
        const ctx = this.ctx;
        const gain = this.gain;
        const osc = this.osc;
        const filter = this.filter;

        // Fade out quickly
        if (gain) {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        }

        setTimeout(() => {
          if (osc) {
            osc.stop();
            osc.disconnect();
          }
          if (filter) filter.disconnect();
          if (gain) gain.disconnect();
        }, 200);
      } catch (e) { }

      this.osc = null;
      this.gain = null;
      this.filter = null;
    }
  }
};



/* ==========================================================================
 * Impact-driven wheel audio
 *
 * The wheel used to fire one fixed tick per animation frame, so a fast spin
 * crossing five pins in 16ms played a single click and sounded sparse and
 * digital. The physics solver now reports every contact it computes, with a
 * sub-frame timestamp and the force behind it, and this layer turns that
 * stream into sound: each strike is synthesized from its own impact, and the
 * whole thing is scheduled on the audio clock rather than the frame clock.
 * ========================================================================== */

/**
 * Normalization for the physics-side quantities. These are measured, not guessed:
 * they are the medians of the release-force and impact-speed distributions over a
 * few hundred simulated spins. Re-measure with tools/physics-sim.mjs if the solver
 * is retuned.
 * @type {Object<string, number>}
 */
export const IMPACT_TUNING = {
  /** Median contact force of a mid-spin crest release. */
  FORCE_REF: 3.3,
  /** Median flapper approach speed, rad/s. */
  V_REF: 100,
  /** Wheel speed treated as "fast", rad/s. */
  OMEGA_REF: 10,
  /** Impact rate at which density ducking starts, per second. */
  RATE_REF: 12,
  /** Peak linear gain of one nominal release voice. */
  AMP_BASE: 0.22,
};

/** @param {number} v @param {number} lo @param {number} hi @returns {number} */
const clampAudio = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** @param {number} a @param {number} b @param {number} x @returns {number} */
const smoothstep = (a, b, x) => {
  const t = clampAudio((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * @typedef {Object} AudioBuses
 * @property {GainNode} master Global mute/level handle.
 * @property {GainNode} sfx Unity-gain path for the pre-existing sounds.
 * @property {GainNode} wheel Compressed and soft-clipped path for wheel impacts.
 */

/** @type {WeakMap<BaseAudioContext, AudioBuses>} */
const busCache = new WeakMap();

/**
 * Returns this context's shared buses, creating them on first use.
 *
 * Everything previously connected straight to `ctx.destination`, so overlapping
 * transients clipped: the wooden tick alone schedules six layers whose peaks sum
 * past 1.0. The wheel path now goes through a compressor and a soft clipper; the
 * sfx path stays at unity gain so the existing sounds come out unchanged.
 *
 * @param {AudioContext} ctx
 * @returns {AudioBuses}
 */
export const getBuses = (ctx) => {
  const cached = busCache.get(ctx);
  if (cached) return cached;

  const master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  const sfx = ctx.createGain();
  sfx.gain.value = 1;
  sfx.connect(master);

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 10;
  comp.ratio.value = 6;
  comp.attack.value = 0.003;
  comp.release.value = 0.2;

  // The compressor's 3ms attack lets the very front of each transient through
  // untouched, which is exactly the part that clips, so a soft clipper catches it.
  // WaveShaper hard-clips anything outside [-1, 1] before consulting the curve, so
  // the pad keeps the input inside that window.
  const pad = ctx.createGain();
  pad.gain.value = 0.7;

  const shaper = ctx.createWaveShaper();
  const curve = new Float32Array(4096);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    const a = Math.abs(x);
    curve[i] = a <= 0.6 ? x : Math.sign(x) * (0.6 + 0.38 * Math.tanh((a - 0.6) / 0.38));
  }
  shaper.curve = curve;
  shaper.oversample = "2x";

  const wheel = ctx.createGain();
  wheel.gain.value = 1;
  wheel.connect(comp);
  comp.connect(pad);
  pad.connect(shaper);
  shaper.connect(master);

  const buses = { master, sfx, wheel };
  busCache.set(ctx, buses);
  return buses;
};

/** @param {AudioContext} ctx @returns {GainNode} */
export const getWheelBus = (ctx) => getBuses(ctx).wheel;

/** @param {AudioContext} ctx @returns {GainNode} */
export const getSfxBus = (ctx) => getBuses(ctx).sfx;

/**
 * @typedef {Object} NoiseBuffers
 * @property {AudioBuffer} low
 * @property {AudioBuffer} mid
 * @property {AudioBuffer} bright
 * @property {AudioBuffer} brown
 */

/** @type {WeakMap<BaseAudioContext, NoiseBuffers>} */
const noiseCache = new WeakMap();

/**
 * Pre-bakes the noise beds once per context.
 *
 * Building noise per tick meant four nodes per strike; at well over a hundred
 * strikes a second that allocation pressure alone drops frames. Reusing a buffer
 * cuts the noise path to a source and a gain.
 *
 * @param {AudioContext} ctx
 * @returns {NoiseBuffers}
 */
export const getNoiseBuffers = (ctx) => {
  const cached = noiseCache.get(ctx);
  if (cached) return cached;

  const sr = ctx.sampleRate;
  /** @param {number} fc @returns {number} */
  const poleFor = (fc) => 1 - Math.exp((-2 * Math.PI * fc) / sr);

  /**
   * @param {number} seconds
   * @param {(x: number, i: number) => number} shape
   * @returns {AudioBuffer}
   */
  const make = (seconds, shape) => {
    const buf = ctx.createBuffer(1, Math.floor(sr * seconds), sr);
    const data = buf.getChannelData(0);
    let peak = 1e-9;
    for (let i = 0; i < data.length; i++) {
      const v = shape(Math.random() * 2 - 1, i);
      data[i] = v;
      if (Math.abs(v) > peak) peak = Math.abs(v);
    }
    for (let i = 0; i < data.length; i++) data[i] /= peak;
    return buf;
  };

  let lp1 = 0;
  const aLow = poleFor(900);
  const low = make(1, (x) => {
    lp1 += aLow * (x - lp1);
    return lp1;
  });

  let hpState = 0;
  let lp2 = 0;
  const aHp = poleFor(400);
  const aLp = poleFor(3800);
  const mid = make(1, (x) => {
    hpState += aHp * (x - hpState);
    const hp = x - hpState;
    lp2 += aLp * (hp - lp2);
    return lp2;
  });

  let hp2 = 0;
  const aHp2 = poleFor(1200);
  const bright = make(1, (x) => {
    hp2 += aHp2 * (x - hp2);
    return x - hp2;
  });

  const brown = make(2, (() => {
    let y = 0;
    return (x) => {
      y = 0.98 * y + 0.02 * x;
      return y;
    };
  })());

  // Crossfade the brown tail into its head so the loop has no seam.
  const bd = brown.getChannelData(0);
  const fade = Math.floor(sr * 0.05);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    bd[i] = bd[i] * t + bd[bd.length - fade + i] * (1 - t);
  }

  const buffers = { low, mid, bright, brown };
  noiseCache.set(ctx, buffers);
  return buffers;
};

/**
 * @typedef {Object} TickPartial
 * @property {OscillatorType} type
 * @property {number} ratio Multiple of the voice's base frequency.
 * @property {number} gain Level relative to the voice.
 * @property {number} decayMul Decay relative to the voice.
 * @property {number} glide End frequency as a fraction of the start; 1 means no glide.
 */

/**
 * @typedef {Object} TickVariantSpec
 * @property {number} f0
 * @property {number} pitchSemis
 * @property {number} decay0
 * @property {number} decayMax
 * @property {number} overlapAllow Seconds of decay allowed per impact per second.
 * @property {number} cutoff0
 * @property {number} ampBase
 * @property {number} attack
 * @property {number} detuneCents
 * @property {TickPartial[]} partials
 * @property {{band: string, gain: number, decayMul: number}|null} noise
 */

/**
 * Timbre definitions for the four selectable tick sounds. The frequency ratios are
 * carried over from the original hand-written variants so each keeps its character;
 * what changes is that force and speed now drive the envelope rather than constants.
 * @type {Object<string, TickVariantSpec>}
 */
export const TICK_VARIANT_SPECS = /** @type {Object<string, TickVariantSpec>} */ ({
  [TICK_SOUNDS.DEFAULT]: {
    f0: 560,
    pitchSemis: 10,
    decay0: 0.045,
    decayMax: 0.07,
    overlapAllow: 0.9,
    cutoff0: 3200,
    ampBase: 0.95,
    attack: 0.0006,
    detuneCents: 15,
    partials: [{ type: "square", ratio: 1, gain: 1, decayMul: 1, glide: 0.18 }],
    noise: { band: "bright", gain: 0.1, decayMul: 0.25 },
  },
  [TICK_SOUNDS.CRISP]: {
    f0: 285,
    pitchSemis: 8,
    decay0: 0.075,
    decayMax: 0.11,
    overlapAllow: 0.9,
    cutoff0: 4000,
    ampBase: 1.1,
    attack: 0.0008,
    detuneCents: 20,
    partials: [
      { type: "sine", ratio: 1, gain: 1, decayMul: 1, glide: 0.78 },
      { type: "triangle", ratio: 1.96, gain: 0.75, decayMul: 0.75, glide: 0.78 },
      { type: "sine", ratio: 4.2, gain: 0.35, decayMul: 0.55, glide: 0.8 },
    ],
    noise: { band: "mid", gain: 0.5, decayMul: 0.22 },
  },
  [TICK_SOUNDS.METALLIC]: {
    f0: 155,
    pitchSemis: 6,
    decay0: 0.1,
    decayMax: 0.16,
    overlapAllow: 0.9,
    cutoff0: 5000,
    ampBase: 1,
    attack: 0.0006,
    detuneCents: 25,
    partials: [
      { type: "square", ratio: 1, gain: 1, decayMul: 1, glide: 0.28 },
      { type: "sawtooth", ratio: 5.2, gain: 0.42, decayMul: 0.6, glide: 0.5 },
      { type: "sine", ratio: 15.5, gain: 0.28, decayMul: 1.5, glide: 1 },
    ],
    noise: { band: "bright", gain: 0.3, decayMul: 0.4 },
  },
  [TICK_SOUNDS.CRYSTAL]: {
    f0: 1800,
    // Real glass has fixed modal frequencies: striking it harder changes how loud and
    // how noisy it is, not what note it is. A crystal that pitch-bends reads as a synth.
    pitchSemis: 3,
    decay0: 0.42,
    decayMax: 0.6,
    // A long decay is the point of this variant, but twenty overlapping identical sines
    // sum coherently into a siren, so it is allowed more overlap and given real detune.
    overlapAllow: 2.2,
    cutoff0: 9000,
    ampBase: 0.85,
    attack: 0.0015,
    detuneCents: 60,
    partials: [
      { type: "sine", ratio: 1, gain: 1, decayMul: 1, glide: 1 },
      { type: "sine", ratio: 1.78, gain: 0.33, decayMul: 0.72, glide: 1 },
      { type: "triangle", ratio: 1.11, gain: 0.3, decayMul: 0.06, glide: 0.5 },
    ],
    noise: { band: "bright", gain: 0.08, decayMul: 0.06 },
  },
});

/**
 * Turns one impact into voice parameters.
 *
 * Loudness follows impact speed and brightness follows contact force, which is how
 * struck objects actually behave. Both are passed through tanh so that a mis-set
 * reference shifts the timbre slightly instead of falling off a loudness cliff: a
 * 4x error in FORCE_REF moves the level by under 2dB.
 *
 * @param {Object} ev Impact event from the physics solver.
 * @param {TickVariantSpec} spec Variant timbre spec.
 * @param {number} rateHz Current impact rate.
 * @param {number} merged How many impacts were folded into this grain.
 * @returns {{amp: number, freq: number, cutoff: number, decay: number}}
 */
const mapImpact = (ev, spec, rateHz, merged) => {
  const T = IMPACT_TUNING;
  const reverse = ev.omega < 0;
  const isEngage = ev.kind === "engage";

  const drive = Math.tanh(clampAudio(ev.force / T.FORCE_REF, 0, 6));
  const punch = Math.tanh(clampAudio((ev.vImpact || ev.force) / T.V_REF, 0, 6));
  const speed = clampAudio(Math.abs(ev.omega) / T.OMEGA_REF, 0, 1.5);

  // Without this the wheel simply gets louder the faster it turns, purely because more
  // voices overlap. Ducking with density keeps the level roughly steady.
  const rateDuck = Math.min(1, Math.pow(T.RATE_REF / Math.max(rateHz, T.RATE_REF), 0.4));
  const boundary = ev.isBoundary ? 1 + 0.25 * (1 - smoothstep(2, 10, rateHz)) : 1;

  const amp = clampAudio(
    T.AMP_BASE *
      Math.pow(punch, 0.6) *
      (isEngage ? 0.38 : 1) *
      (reverse ? 0.55 : 1) *
      boundary *
      rateDuck *
      Math.min(Math.sqrt(merged), 1.8) *
      spec.ampBase,
    0,
    0.5
  );

  const freq = clampAudio(
    spec.f0 *
      Math.pow(2, (spec.pitchSemis * (drive - 0.5)) / 12) *
      (isEngage ? 0.7 : 1) *
      (reverse ? 0.72 : 1) *
      (1 + 0.06 * (Math.random() - 0.5)) *
      (ev.isBoundary && rateHz < 10 ? 1.035 : 1),
    45,
    5000
  );

  const cutoff = clampAudio(
    spec.cutoff0 * (0.45 + 1.35 * drive) * (1 + 0.25 * speed) * (isEngage ? 0.5 : 1) * (reverse ? 0.5 : 1),
    250,
    14000
  );

  // Capping decay against the impact rate is load-bearing: without it a long-tailed
  // variant stacks dozens of simultaneous voices into a drone at speed.
  const decay = clampAudio(
    spec.decay0 * (0.55 + 0.75 * drive) * (isEngage ? 0.45 : 1) * (reverse ? 1.25 : 1) * Math.min(1.6, 1 + 0.15 * (merged - 1)),
    0.008,
    Math.min(spec.decayMax, spec.overlapAllow / Math.max(rateHz, 1))
  );

  return { amp, freq, cutoff, decay };
};

/**
 * Builds and schedules one impact voice.
 *
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {TickVariantSpec} spec
 * @param {{amp: number, freq: number, cutoff: number, decay: number}} p
 * @param {number} t0 Audio-clock start time.
 * @returns {number} The time at which the voice finishes.
 */
const buildImpactVoice = (ctx, dest, spec, p, t0) => {
  const voice = ctx.createGain();
  const end = t0 + p.decay + 0.004;

  // The old ticks jumped straight to full gain and stopped their node at -40dBFS, so
  // every click carried a click at each end. A sub-millisecond ramp in and a short
  // linear ramp to true zero remove both.
  voice.gain.setValueAtTime(0, t0);
  voice.gain.linearRampToValueAtTime(p.amp, t0 + spec.attack);
  voice.gain.exponentialRampToValueAtTime(Math.max(p.amp * 0.0015, 1e-5), t0 + p.decay);
  voice.gain.linearRampToValueAtTime(0, end);

  let tail = voice;
  if (p.cutoff < 8000) {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = p.cutoff;
    voice.connect(lp);
    lp.connect(dest);
    tail = lp;
  } else {
    voice.connect(dest);
  }

  for (const part of spec.partials) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = part.type;
    g.gain.value = part.gain;

    const f = p.freq * part.ratio;
    osc.frequency.setValueAtTime(f, t0);
    if (part.glide !== 1) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(f * part.glide, 20),
        t0 + p.decay * part.decayMul * 0.9
      );
    }
    osc.detune.value = (Math.random() * 2 - 1) * spec.detuneCents;

    osc.connect(g);
    g.connect(voice);
    osc.start(t0);
    osc.stop(t0 + p.decay * part.decayMul + 0.006);
  }

  if (spec.noise) {
    const buffers = getNoiseBuffers(ctx);
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = buffers[spec.noise.band];
    src.playbackRate.value = 0.8 + Math.random() * 0.45;
    g.gain.value = spec.noise.gain;
    src.connect(g);
    g.connect(voice);
    const offset = Math.random() * Math.max(src.buffer.duration - 0.2, 0.01);
    src.start(t0, offset, p.decay * spec.noise.decayMul + 0.01);
  }

  return end;
};

/**
 * Plays the heavy wooden settle when the flapper drops into its final valley.
 *
 * This is not a loud release: it is the wheel's last energy going into the mount, so
 * it is lower, slower, duller and stripped of the bright partials. It also has a floor,
 * because "the wheel has stopped" has to be audible even after a feeble spin.
 *
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {number} force
 * @param {number} t0
 * @returns {void}
 */
export const playSeatThunk = (ctx, dest, force, t0) => {
  const base = 105;
  const amp = clampAudio(0.3 * Math.pow(Math.tanh(force / IMPACT_TUNING.FORCE_REF), 0.5), 0.1, 0.34);

  const voice = ctx.createGain();
  voice.gain.setValueAtTime(0, t0);
  voice.gain.linearRampToValueAtTime(amp, t0 + 0.003);
  voice.gain.exponentialRampToValueAtTime(amp * 0.0015, t0 + 0.26);
  voice.gain.linearRampToValueAtTime(0, t0 + 0.3);

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1100;
  lp.Q.value = 0.7;
  voice.connect(lp);
  lp.connect(dest);

  const layers = /** @type {{type: OscillatorType, f: number, glide: number, gain: number, decay: number}[]} */ ([
    { type: "sine", f: base, glide: 0.72, gain: 1, decay: 0.26 },
    { type: "triangle", f: base * 2.02, glide: 1, gain: 0.45, decay: 0.13 },
    { type: "sawtooth", f: base * 4.5, glide: 0.44, gain: 0.3, decay: 0.022 },
  ]);
  for (const l of layers) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = l.type;
    g.gain.value = l.gain;
    osc.frequency.setValueAtTime(l.f, t0);
    if (l.glide !== 1) osc.frequency.exponentialRampToValueAtTime(l.f * l.glide, t0 + l.decay * 0.9);
    osc.connect(g);
    g.connect(voice);
    osc.start(t0);
    osc.stop(t0 + l.decay + 0.01);
  }

  const src = ctx.createBufferSource();
  const ng = ctx.createGain();
  src.buffer = getNoiseBuffers(ctx).low;
  ng.gain.value = 0.35;
  src.connect(ng);
  ng.connect(voice);
  src.start(t0, Math.random() * 0.5, 0.055);
};

/**
 * The continuous bed under a spin: bearing rumble, air whoosh, and the ripple buzz
 * that takes over once individual ticks stop being distinguishable.
 *
 * The low band only really exists on headphones and desktop speakers; phone speakers
 * are effectively dead below 200Hz. The impression of mass on a phone comes from the
 * mid-band whoosh, so that is a separate band rather than one wideband rumble.
 */
export class WheelRumble {
  /**
   * @param {AudioContext} ctx
   * @param {AudioNode} dest
   */
  constructor(ctx, dest) {
    this.ctx = ctx;
    this.dest = dest;
    this.running = false;
    this.disposed = false;
    /** @type {AudioBufferSourceNode|null} */
    this.noise = null;
    /** @type {OscillatorNode|null} */
    this.motor = null;
    /** @type {GainNode|null} */
    this.sum = null;
  }

  /** Idempotent: starting an already-running bed must not stack a second one. @returns {void} */
  start() {
    if (this.running || this.disposed) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    this.sum = ctx.createGain();
    this.sum.gain.setValueAtTime(0, now);
    this.sum.gain.linearRampToValueAtTime(1, now + 0.12);
    this.sum.connect(this.dest);

    this.noise = ctx.createBufferSource();
    this.noise.buffer = getNoiseBuffers(ctx).brown;
    this.noise.loop = true;

    this.bearingBP = ctx.createBiquadFilter();
    this.bearingBP.type = "bandpass";
    this.bearingBP.Q.value = 1.2;
    this.bearingGain = ctx.createGain();
    this.bearingGain.gain.value = 0;

    this.airBP = ctx.createBiquadFilter();
    this.airBP.type = "bandpass";
    this.airGain = ctx.createGain();
    this.airGain.gain.value = 0;

    this.noise.connect(this.bearingBP);
    this.bearingBP.connect(this.bearingGain);
    this.bearingGain.connect(this.sum);
    this.noise.connect(this.airBP);
    this.airBP.connect(this.airGain);
    this.airGain.connect(this.sum);

    this.motor = ctx.createOscillator();
    this.motor.type = "sawtooth";
    this.motorLP = ctx.createBiquadFilter();
    this.motorLP.type = "lowpass";
    this.motorGain = ctx.createGain();
    this.motorGain.gain.value = 0;
    this.motor.connect(this.motorLP);
    this.motorLP.connect(this.motorGain);
    this.motorGain.connect(this.sum);

    // Start at a random point in the loop so consecutive spins do not sound identical.
    this.noise.start(now, Math.random() * 1.5);
    this.motor.start(now);
    this.running = true;
  }

  /**
   * @param {number} omega Signed wheel speed, rad/s.
   * @param {number} rateHz Current impact rate.
   * @returns {void}
   */
  update(omega, rateHz) {
    if (!this.running || this.disposed) return;
    const now = this.ctx.currentTime;
    const s = clampAudio(Math.abs(omega) / 8, 0, 1.25);

    // Every parameter is ramped rather than assigned: a direct write steps at the render
    // quantum boundary, which is audible as zipper noise on a continuous bed.
    const set = (param, value, tau) => param.setTargetAtTime(value, now, tau);

    set(this.bearingBP.frequency, 60 + 90 * s, 0.12);
    // The bearing hum is there from the start (mass); the air whoosh only arrives at real
    // speed. That asymmetry is most of the "heavy object winding up" impression.
    set(this.bearingGain.gain, 0.075 * Math.pow(s, 0.8), 0.08);
    set(this.airBP.frequency, 420 + 1800 * Math.pow(s, 1.15), 0.12);
    this.airBP.Q.value = 0.6 + 0.5 * s;
    set(this.airGain.gain, 0.05 * Math.pow(s, 1.6), 0.08);

    set(this.motor.frequency, clampAudio(rateHz, 20, 400), 0.05);
    set(this.motorLP.frequency, clampAudio(rateHz * 8, 400, 6000), 0.12);
    set(this.motorGain.gain, 0.055 * smoothstep(38, 70, rateHz) * Math.min(1, s), 0.08);
  }

  /**
   * @param {number} [release=0.35] Fade-out length in seconds.
   * @returns {void}
   */
  stop(release = 0.35) {
    if (!this.running || this.disposed) return;
    const now = this.ctx.currentTime;
    this.sum.gain.cancelScheduledValues(now);
    this.sum.gain.setValueAtTime(this.sum.gain.value, now);
    this.sum.gain.linearRampToValueAtTime(0, now + release);

    // Teardown is driven by the audio clock, not a wall-clock timer: a setTimeout fires
    // while a suspended context is frozen mid-fade and tears down a node still ramping.
    this.noise.onended = () => this._teardown();
    this.noise.stop(now + release + 0.02);
    this.motor.stop(now + release + 0.02);
    this.running = false;
  }

  /** @returns {void} */
  _teardown() {
    for (const node of [this.noise, this.motor, this.bearingBP, this.bearingGain, this.airBP, this.airGain, this.motorLP, this.motorGain, this.sum]) {
      try {
        if (node) node.disconnect();
      } catch (e) {
        /* already detached */
      }
    }
    this.noise = null;
    this.motor = null;
    this.sum = null;
  }

  /** @returns {void} */
  dispose() {
    if (this.running) this.stop(0.02);
    this.disposed = true;
  }
}

/**
 * Schedules impact events onto the audio clock.
 *
 * Two problems it exists to solve. Fine detail: physics reports impacts with sub-frame
 * timing, so they must be placed with `start(t)` rather than fired when the frame
 * happens to run, or a fast spin degenerates into one tick per frame. Coarse volume: a
 * dense wheel at speed asks for well over a hundred voices a second, which no phone
 * will survive, so near-simultaneous strikes are merged into single louder grains and
 * a token bucket bounds the rest.
 */
export class ImpactScheduler {
  /**
   * @param {AudioContext} ctx
   * @param {AudioNode} dest
   * @param {() => boolean} isEnabled Read live, so muting mid-spin takes effect at once.
   * @param {() => string} getVariant
   */
  constructor(ctx, dest, isEnabled, getVariant) {
    this.ctx = ctx;
    this.dest = dest;
    this.isEnabled = isEnabled;
    this.getVariant = getVariant;

    this.lookahead = 0.035;
    this.t0 = 0;
    this.tokens = 12;
    this.lastRefill = 0;
    this.mergeWindow = 0.012;
    this.pending = null;
    /** @type {number[]} */
    this.endTimes = [];
    this.seatCount = 0;
    this.late = 0;
    this.dropped = 0;
    this.rateHz = 0;
  }

  /**
   * Anchors the spin's timeline. This is the only conversion between the frame clock and
   * the audio clock: every event time afterwards is this anchor plus the solver's own
   * accumulated time, which is drift-free and immune to frame jitter.
   * @returns {void}
   */
  beginSpin() {
    this.t0 = this.ctx.currentTime + this.lookahead;
    this.tokens = 12;
    this.lastRefill = this.ctx.currentTime;
    this.mergeWindow = 0.012;
    this.pending = null;
    this.endTimes.length = 0;
    this.seatCount = 0;
    this.late = 0;
    this.dropped = 0;
  }

  /**
   * Re-anchors after the context was suspended. `ctx.currentTime` stops while suspended
   * but the solver's clock does not, so without this every queued event fires at once on
   * resume.
   * @param {number} tSimNow
   * @returns {void}
   */
  reanchor(tSimNow) {
    this.t0 = this.ctx.currentTime + this.lookahead - tSimNow;
  }

  /**
   * @param {Array<Object>} impacts
   * @param {number} rateHz
   * @returns {void}
   */
  schedule(impacts, rateHz) {
    this.rateHz = rateHz;
    if (!impacts.length) return;
    if (!this.isEnabled()) return;

    const now = this.ctx.currentTime;
    this.tokens = Math.min(12, this.tokens + (now - this.lastRefill) * 60);
    this.lastRefill = now;
    this.endTimes = this.endTimes.filter((t) => t > now);

    for (const ev of impacts) {
      if (ev.kind === "seat") {
        this._flush();
        this._scheduleSeat(ev);
        continue;
      }

      // Above roughly 18 impacts a second the engage and its release are inside the
      // perceptual fusion window, so the softer one is pure cost.
      if (ev.kind === "engage" && rateHz > 18) continue;

      const tA = this.t0 + ev.tSim;
      if (tA > now + 0.3) break;

      const p = this.pending;
      if (p && p.kind === ev.kind && tA - p.tA < this.mergeWindow) {
        p.n++;
        p.force = Math.max(p.force, ev.force);
        p.vImpact = Math.max(p.vImpact, ev.vImpact || 0);
        p.isBoundary = p.isBoundary || ev.isBoundary;
        continue;
      }

      this._flush();
      this.pending = {
        tA,
        kind: ev.kind,
        force: ev.force,
        vImpact: ev.vImpact || 0,
        omega: ev.omega,
        isBoundary: ev.isBoundary,
        n: 1,
      };
    }

    this._flush();

    if (this.mergeWindow > 0.012) this.mergeWindow = Math.max(0.012, this.mergeWindow * 0.92);
  }

  /** @returns {void} */
  _flush() {
    const p = this.pending;
    this.pending = null;
    if (!p) return;

    const now = this.ctx.currentTime;
    if (this.tokens < 1 || this.endTimes.length >= 24) {
      // Out of budget: widen the merge window instead of dropping on a cliff. This can
      // only happen well above the rate at which individual ticks are distinguishable,
      // where the rumble's ripple buzz is already carrying the rhythm.
      this.mergeWindow = Math.min(0.04, this.mergeWindow * 1.6);
      this.dropped++;
      return;
    }

    let t = p.tA;
    const lateBy = now - t;
    if (lateBy > 0.04) {
      this.late++;
      this.dropped++;
      return;
    }
    if (lateBy > 0) t = now + 0.002;

    const spec = TICK_VARIANT_SPECS[this.getVariant()] || TICK_VARIANT_SPECS[TICK_SOUNDS.DEFAULT];
    const params = mapImpact(p, spec, Math.max(this.rateHz, 1), p.n);
    this.tokens -= 1;
    this.endTimes.push(buildImpactVoice(this.ctx, this.dest, spec, params, t));
  }

  /**
   * @param {Object} ev
   * @returns {void}
   */
  _scheduleSeat(ev) {
    // The flapper can bounce once as it drops in; anything past that is chatter.
    if (this.seatCount >= 2) return;
    this.seatCount++;
    const t = Math.max(this.ctx.currentTime + 0.005, this.t0 + ev.tSim);
    playSeatThunk(this.ctx, this.dest, ev.force, t);
  }

  /**
   * Adapts the lookahead between spins rather than during one: changing it mid-spin
   * shifts every later event and is audible as a tempo hiccup.
   * @returns {void}
   */
  endSpin() {
    this.lookahead =
      this.late > 0
        ? Math.min(0.09, this.lookahead + 0.015)
        : Math.max(0.03, this.lookahead - 0.005);
    this._flush();
  }
}

// Expose to window (needed for Babel Standalone).
// This block lives at the end of the file on purpose: const and class bindings are in
// their temporal dead zone until evaluated, so exporting from the middle would throw for
// anything declared below it.
if (typeof window !== "undefined") {
  window.playWinSound = playWinSound;
  window.playJingleBells = playJingleBells;
  window.playTickSound = playTickSound;
  window.playDefaultTickSound = playDefaultTickSound;
  window.playCrispWoodTickSound = playCrispWoodTickSound;
  window.playMetallicClankTickSound = playMetallicClankTickSound;
  window.playCrystalGlassTickSound = playCrystalGlassTickSound;
  window.playFireCrackle = playFireCrackle;
  window.playBreakdownSound = playBreakdownSound;
  window.playPurchaseSound = playPurchaseSound;
  window.playBigPurchaseSound = playBigPurchaseSound;
  window.base64ToWavBlob = base64ToWavBlob;
  window.ChargeSound = ChargeSound;
  window.getBuses = getBuses;
  window.getWheelBus = getWheelBus;
  window.getSfxBus = getSfxBus;
  window.playSeatThunk = playSeatThunk;
  window.WheelRumble = WheelRumble;
  window.ImpactScheduler = ImpactScheduler;
  window.IMPACT_TUNING = IMPACT_TUNING;
}
