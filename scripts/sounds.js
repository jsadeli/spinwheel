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
window.playTickSound = (audioCtxRef, soundEnabled) => {
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
