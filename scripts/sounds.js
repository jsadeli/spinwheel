// Win Sound Logic
window.playWinSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Helper for playing a tone
  const playTone = (freq, start, dur, type = 'triangle', vol = 0.1) => {
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
  playTone(523.25, now + 0.0, 0.3, 'square', 0.1); // C5
  playTone(659.25, now + 0.1, 0.3, 'square', 0.1); // E5
  playTone(783.99, now + 0.2, 0.3, 'square', 0.1); // G5

  // The "Ta-Da" finale (Chord)
  playTone(523.25, now + 0.3, 1.5, 'triangle', 0.15); // C5
  playTone(659.25, now + 0.3, 1.5, 'triangle', 0.15); // E5
  playTone(783.99, now + 0.3, 1.5, 'triangle', 0.15); // G5
  playTone(1046.50, now + 0.3, 2.0, 'sawtooth', 0.1); // C6 (Top Note, sharper)
};

// Tick Sound Logic
window.playTickSound = (audioCtxRef, soundEnabled, variant = 'default') => {
  if (!soundEnabled || !audioCtxRef.current) return;

  if (variant === 'crisp') return window.playCrispWoodTickSound(audioCtxRef, soundEnabled);
  if (variant === 'metallic') return window.playMetallicClankTickSound(audioCtxRef, soundEnabled);
  if (variant === 'crystal') return window.playCrystalGlassTickSound(audioCtxRef, soundEnabled);

  return window.playDefaultTickSound(audioCtxRef, soundEnabled)
};

// Tick Sound Logic - Electrical/Plastic Click Sound
window.playDefaultTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;

  // Short, "plastic click" sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

// Tick Sound Logic - Crisp Wood Knock Sound
window.playCrispWoodTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Layer 1: Clean mid-range fundamental (wood body without heavy bass)
  const fundamental = ctx.createOscillator();
  const fundamentalGain = ctx.createGain();
  fundamental.type = 'sine';
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
  harmonic.type = 'triangle';
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
  highTone.type = 'sine';
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
  shimmer.type = 'sine';
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
  attack.type = 'sawtooth';
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
  highpass.type = 'highpass';
  highpass.frequency.value = 300; // Remove muddy lows
  highpass.Q.value = 0.5;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
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

// Tick Sound Logic - Metallic Clank Sound
window.playMetallicClankTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Layer 1: The "Clank" - Low frequency metallic impact
  const impact = ctx.createOscillator();
  const impactGain = ctx.createGain();
  impact.type = 'square'; // Square wave for a harder, metallic edge
  impact.frequency.setValueAtTime(150, now);
  impact.frequency.exponentialRampToValueAtTime(40, now + 0.1);
  impactGain.gain.setValueAtTime(0.4, now);
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

  ratchet.type = 'sawtooth';
  ratchet.frequency.setValueAtTime(800, now);
  ratchet.frequency.linearRampToValueAtTime(400, now + 0.05); // Pitch drop simulates friction

  ratchetFilter.type = 'bandpass';
  ratchetFilter.frequency.value = 1200;
  ratchetFilter.Q.value = 2; // Resonant peak for metallic character

  ratchetGain.gain.setValueAtTime(0.2, now);
  ratchetGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  ratchet.connect(ratchetFilter);
  ratchetFilter.connect(ratchetGain);
  ratchetGain.connect(ctx.destination);
  ratchet.start(now);
  ratchet.stop(now + 0.06);

  // Layer 3: Metallic Ring/Ping - High pitched resonance
  const ring = ctx.createOscillator();
  const ringGain = ctx.createGain();
  ring.type = 'sine';
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
    data[i] = (Math.random() * 2 - 1);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000; // Remove mud

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.15, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
};

// Tick Sound Logic - Crystal Glass Sound
window.playCrystalGlassTickSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;
  const now = ctx.currentTime;

  // Layer 1: The "Ping" - Pure sine wave for the fundamental glass tone
  const fundamental = ctx.createOscillator();
  const fundamentalGain = ctx.createGain();
  fundamental.type = 'sine';
  fundamental.frequency.setValueAtTime(1800, now); // High pitch for crystal
  fundamentalGain.gain.setValueAtTime(0.15, now);
  fundamentalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6); // Long, clear decay
  fundamental.connect(fundamentalGain);
  fundamentalGain.connect(ctx.destination);
  fundamental.start(now);
  fundamental.stop(now + 0.6);

  // Layer 2: The "Shimmer" - High harmonic for fragility
  const harmonic = ctx.createOscillator();
  const harmonicGain = ctx.createGain();
  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(3200, now); // Very high harmonic
  harmonicGain.gain.setValueAtTime(0.05, now);
  harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(ctx.destination);
  harmonic.start(now);
  harmonic.stop(now + 0.4);

  // Layer 3: The "Tap" - Initial impact
  const tap = ctx.createOscillator();
  const tapGain = ctx.createGain();
  tap.type = 'triangle';
  tap.frequency.setValueAtTime(2000, now);
  tap.frequency.exponentialRampToValueAtTime(1000, now + 0.02);
  tapGain.gain.setValueAtTime(0.05, now);
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  tap.connect(tapGain);
  tapGain.connect(ctx.destination);
  tap.start(now);
  tap.stop(now + 0.02);
};

// Fire Crackle Sound Logic
window.playFireCrackle = (audioCtxRef, soundEnabled, isOutOfOrder) => {
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
  filter.type = 'lowpass';
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

// Breakdown Sound Logic
window.playBreakdownSound = (audioCtxRef, soundEnabled) => {
  if (!soundEnabled || !audioCtxRef.current) return;
  const ctx = audioCtxRef.current;

  // A loud "clunk" and power down sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 1);

  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 1);
};
