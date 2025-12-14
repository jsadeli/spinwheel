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
    gain.connect(ctx.destination);
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
    gain.connect(ctx.destination);
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
 * Plays a tick sound as the wheel rotates.
 * Supports multiple sound variants (default, crisp, metallic, crystal).
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 * @param {string} [variant=TICK_SOUNDS.DEFAULT] - The tick sound variant to play.
 * @example
 * playTickSound(audioCtxRef, true, TICK_SOUNDS.CRISP);
 */
export const playTickSound = (audioCtxRef, soundEnabled, variant = TICK_SOUNDS.DEFAULT) => {
  if (!soundEnabled || !audioCtxRef.current) return;

  if (variant === TICK_SOUNDS.CRISP) return playCrispWoodTickSound(audioCtxRef, soundEnabled);
  if (variant === TICK_SOUNDS.METALLIC) return playMetallicClankTickSound(audioCtxRef, soundEnabled);
  if (variant === TICK_SOUNDS.CRYSTAL) return playCrystalGlassTickSound(audioCtxRef, soundEnabled);

  return playDefaultTickSound(audioCtxRef, soundEnabled);
};

/**
 * Plays the default electrical/plastic click tick sound.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playDefaultTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;

  // Short, "plastic click" sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

/**
 * Plays a crisp wooden knock tick sound.
 * Synthesizes a multi-layered wood percussion sound with clarity and presence.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playCrispWoodTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Layer 1: Clean mid-range fundamental (wood body without heavy bass)
  const fundamental = ctx.createOscillator();
  const fundamentalGain = ctx.createGain();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(280, now); // Mid-range for clarity
  fundamental.frequency.exponentialRampToValueAtTime(220, now + 0.08);
  fundamentalGain.gain.setValueAtTime(0.25, now);
  fundamentalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  fundamental.connect(fundamentalGain);
  fundamentalGain.connect(ctx.destination);
  fundamental.start(now);
  fundamental.stop(now + 0.08);

  // Layer 2: Bright harmonic (clarity and presence)
  const harmonic = ctx.createOscillator();
  const harmonicGain = ctx.createGain();
  harmonic.type = "triangle";
  harmonic.frequency.setValueAtTime(560, now); // 2x fundamental
  harmonic.frequency.exponentialRampToValueAtTime(440, now + 0.06);
  harmonicGain.gain.setValueAtTime(0.28, now); // Strong for clarity
  harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(ctx.destination);
  harmonic.start(now);
  harmonic.stop(now + 0.06);

  // Layer 3: High-frequency definition (crisp character)
  const highTone = ctx.createOscillator();
  const highGain = ctx.createGain();
  highTone.type = "sine";
  highTone.frequency.setValueAtTime(1200, now); // High and clear
  highTone.frequency.exponentialRampToValueAtTime(900, now + 0.05);
  highGain.gain.setValueAtTime(0.2, now); // Prominent for crispness
  highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  highTone.connect(highGain);
  highGain.connect(ctx.destination);
  highTone.start(now);
  highTone.stop(now + 0.05);

  // Layer 4: Ultra-crisp shimmer (premium sparkle)
  const shimmer = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmer.type = "sine";
  shimmer.frequency.setValueAtTime(2200, now); // Very high for sparkle
  shimmer.frequency.exponentialRampToValueAtTime(1600, now + 0.04);
  shimmerGain.gain.setValueAtTime(0.12, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(ctx.destination);
  shimmer.start(now);
  shimmer.stop(now + 0.04);

  // Layer 5: Very short percussive attack (the "knock")
  const attack = ctx.createOscillator();
  const attackGain = ctx.createGain();
  attack.type = "sawtooth";
  attack.frequency.setValueAtTime(600, now); // Higher for crispness
  attack.frequency.exponentialRampToValueAtTime(300, now + 0.02);
  attackGain.gain.setValueAtTime(0.3, now); // Strong initial attack
  attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  attack.connect(attackGain);
  attackGain.connect(ctx.destination);
  attack.start(now);
  attack.stop(now + 0.02);

  // Layer 6: Bright wood texture (minimal filtering for maximum clarity)
  const bufferSize = ctx.sampleRate * 0.015;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // High-pass and low-pass for crisp, clean texture
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 300; // Remove muddy lows
  highpass.Q.value = 0.5;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 3500; // Keep bright highs
  lowpass.Q.value = 1.0; // Slight resonance for character

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.28, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  noise.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
};

/**
 * Plays a heavy metallic clank tick sound.
 * Simulates the sound of metal gears or mechanical parts engaging.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playMetallicClankTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Layer 1: The "Clank" - Low frequency metallic impact
  const impact = ctx.createOscillator();
  const impactGain = ctx.createGain();
  impact.type = "square"; // Square wave for a harder, metallic edge
  impact.frequency.setValueAtTime(150, now);
  impact.frequency.exponentialRampToValueAtTime(40, now + 0.1);
  impactGain.gain.setValueAtTime(0.25, now);
  impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  impact.connect(impactGain);
  impactGain.connect(ctx.destination);
  impact.start(now);
  impact.stop(now + 0.1);

  // Layer 2: The "Ratchet" - High frequency gear scrape
  // Using a bandpass filtered sawtooth for that "zipper" or "ratchet" quality
  const ratchet = ctx.createOscillator();
  const ratchetGain = ctx.createGain();
  const ratchetFilter = ctx.createBiquadFilter();

  ratchet.type = "sawtooth";
  ratchet.frequency.setValueAtTime(800, now);
  ratchet.frequency.linearRampToValueAtTime(400, now + 0.05); // Pitch drop simulates friction

  ratchetFilter.type = "bandpass";
  ratchetFilter.frequency.value = 1200;
  ratchetFilter.Q.value = 2; // Resonant peak for metallic character

  ratchetGain.gain.setValueAtTime(0.12, now);
  ratchetGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  ratchet.connect(ratchetFilter);
  ratchetFilter.connect(ratchetGain);
  ratchetGain.connect(ctx.destination);
  ratchet.start(now);
  ratchet.stop(now + 0.06);

  // Layer 3: Metallic Ring/Ping - High pitched resonance
  const ring = ctx.createOscillator();
  const ringGain = ctx.createGain();
  ring.type = "sine";
  ring.frequency.setValueAtTime(2400, now); // High metallic ping
  ringGain.gain.setValueAtTime(0.08, now);
  ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15); // Longer decay for resonance
  ring.connect(ringGain);
  ringGain.connect(ctx.destination);
  ring.start(now);
  ring.stop(now + 0.15);

  // Layer 4: Grinding Noise - Mechanical friction
  const bufferSize = ctx.sampleRate * 0.04;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 1000; // Remove mud

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.08, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
};

/**
 * Plays a luxurious crystal glass tick sound.
 * Creates a high-pitched, resonant tone reminiscent of fine crystal.
 *
 * @param {Object} audioCtxRef - React ref containing the Web Audio API context.
 * @param {boolean} soundEnabled - Whether sound effects are enabled.
 */
export const playCrystalGlassTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Layer 1: The "Ping" - Pure sine wave for the fundamental glass tone
  const fundamental = ctx.createOscillator();
  const fundamentalGain = ctx.createGain();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(1800, now); // High pitch for crystal
  fundamentalGain.gain.setValueAtTime(0.3, now);
  fundamentalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6); // Long, clear decay
  fundamental.connect(fundamentalGain);
  fundamentalGain.connect(ctx.destination);
  fundamental.start(now);
  fundamental.stop(now + 0.6);

  // Layer 2: The "Shimmer" - High harmonic for fragility
  const harmonic = ctx.createOscillator();
  const harmonicGain = ctx.createGain();
  harmonic.type = "sine";
  harmonic.frequency.setValueAtTime(3200, now); // Very high harmonic
  harmonicGain.gain.setValueAtTime(0.1, now);
  harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(ctx.destination);
  harmonic.start(now);
  harmonic.stop(now + 0.4);

  // Layer 3: The "Tap" - Initial impact
  const tap = ctx.createOscillator();
  const tapGain = ctx.createGain();
  tap.type = "triangle";
  tap.frequency.setValueAtTime(2000, now);
  tap.frequency.exponentialRampToValueAtTime(1000, now + 0.02);
  tapGain.gain.setValueAtTime(0.1, now);
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  tap.connect(tapGain);
  tapGain.connect(ctx.destination);
  tap.start(now);
  tap.stop(now + 0.02);
};

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
  gain.connect(ctx.destination);

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
  gain.connect(ctx.destination);

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
  chaGain.connect(ctx.destination);
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
  bell1Gain.connect(ctx.destination);
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
  bell2Gain.connect(ctx.destination);
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
    gain.connect(ctx.destination);
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
    gain.connect(ctx.destination);
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
  bassGain.connect(ctx.destination);
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
    this.gain.connect(ctx.destination);
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

// Expose to window (needed for Babel Standalone)
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
}

