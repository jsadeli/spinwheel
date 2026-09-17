/**
 * Fires a confetti animation with physics-based particle effects.
 * Visual style varies based on user's XP level (different colors, shapes, and physics).
 *
 * @param {number} [level=0] - The current XP level (affects confetti appearance and behavior).
 * @example
 * fireConfetti(5); // Emerald tier confetti
 * fireConfetti(11); // Cosmic tier with stars and glow effects
 */
export const fireConfetti = (level = 0) => {
  // Configuration for each prestige tier
  let config = {
    colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    shapes: ["rect"], // rect, circle, diamond, star
    count: 50,
    gravity: 0.07,
    drag: 0.96,
    force: 1.0,
    glow: false,
    sizeMod: 1.0,
  };

  if (level >= 11) {
    // Cosmic - Stars & Planets, floaty, glowing
    config.colors = ["#ec4899", "#8b5cf6", "#3b82f6", "#6366f1", "#d946ef", "#ffffff"];
    config.shapes = ["circle", "star"];
    config.count = 200;
    config.gravity = 0.04; // Very floaty
    config.force = 1.3;
    config.glow = true;
    config.sizeMod = 1.2;
  } else if (level >= 10) {
    // Diamond - Sharp diamonds, high energy
    config.colors = ["#22d3ee", "#6366f1", "#c084fc", "#818cf8", "#e0e7ff"];
    config.shapes = ["diamond"];
    config.count = 150;
    config.gravity = 0.08;
    config.force = 1.2;
    config.glow = true;
  } else if (level >= 9) {
    // Gold - Coins (circles), heavy but bouncy
    config.colors = ["#fcd34d", "#f59e0b", "#fbbf24", "#d97706", "#fffbeb"];
    config.shapes = ["circle"];
    config.count = 100;
    config.gravity = 0.09; // Heavier
    config.force = 1.1;
  } else if (level >= 8) {
    // Ruby - Intense reds, mixed shapes
    config.colors = ["#fb7185", "#ef4444", "#e11d48", "#f43f5e", "#ffe4e6"];
    config.shapes = ["rect", "diamond"];
    config.count = 75;
    config.gravity = 0.07;
  } else if (level >= 7) {
    // Topaz - Blue/Cyan, shards (triangles)
    config.colors = ["#67e8f9", "#38bdf8", "#93c5fd", "#0ea5e9", "#e0f2fe"];
    config.shapes = ["triangle", "rect"];
    config.count = 50;
  } else if (level >= 5) {
    // Emerald - Green, standard confetti
    config.colors = ["#34d399", "#2dd4bf", "#10b981", "#059669", "#d1fae5"];
    config.shapes = ["rect"];
  }

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  container.style.perspective = "1000px"; // Depth for 3D
  document.body.appendChild(container);

  const particles = [];
  const startX = window.innerWidth / 2;
  // Start slightly below center to align better with the modal center
  const startY = window.innerHeight / 2 + 50;

  for (let i = 0; i < config.count; i++) {
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.left = "0"; // Positioning handled by translate3d
    el.style.top = "0";

    // Size
    const baseSize = Math.random() * 8 + 6;
    const size = baseSize * config.sizeMod + "px";
    el.style.width = size;
    el.style.height = size;

    // Shape Logic
    const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];

    if (shape === "circle") {
      el.style.borderRadius = "50%";
    } else if (shape === "diamond") {
      // Use clip-path for diamond to allow independent rotation
      el.style.clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
      el.style.background = config.colors[Math.floor(Math.random() * config.colors.length)];
    } else if (shape === "star") {
      el.style.clipPath =
        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    } else if (shape === "triangle") {
      el.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      // Triangles look better if they are taller
      el.style.height = baseSize * 1.5 * config.sizeMod + "px";
    } else {
      // Rect (default)
      el.style.height = Math.random() > 0.5 ? size : Math.random() * 4 + 4 + "px";
    }

    const colorHex = config.colors[Math.floor(Math.random() * config.colors.length)];
    el.style.backgroundColor = colorHex;

    // Glow effect for high tiers
    if (config.glow) {
      el.style.boxShadow = `0 0 ${Math.random() * 6 + 2}px ${colorHex}`;
    }

    const startOpacity = 0.7 + Math.random() * 0.3;
    el.style.opacity = startOpacity.toString();
    el.style.willChange = "transform, opacity";

    container.appendChild(el);

    // Physics
    const angle = Math.random() * Math.PI * 2; // Random direction around center
    const explosionForce = (Math.random() * 15 + 10) * config.force;

    // Initial velocities based on angle and force
    // Ensure a strong upward bias (negative Y) for the "pop"
    let vx = Math.cos(angle) * explosionForce * (Math.random() * 0.8 + 0.2);
    let vy = -Math.abs(Math.sin(angle) * explosionForce) - (Math.random() * 15 + 10);

    particles.push({
      el,
      x: startX,
      y: startY,
      vx: vx,
      vy: vy,
      gravity: config.gravity + Math.random() * 0.05,
      drag: config.drag,
      rotX: Math.random() * 360,
      rotY: Math.random() * 360,
      rotZ: Math.random() * 360,
      rotSpeedX: (Math.random() - 0.5) * 15, // Tumble speed
      rotSpeedY: (Math.random() - 0.5) * 15,
      rotSpeedZ: (Math.random() - 0.5) * 10,
      opacity: startOpacity,
      fadeStart: Date.now() + 3000 + Math.random() * 2000, // Start fading later (after 3-5s)
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  // Physics Animation Loop
  const animate = () => {
    const now = Date.now();
    let activeParticles = 0;

    particles.forEach((p) => {
      // Apply physics
      p.vy += p.gravity; // Apply gravity
      p.vx *= p.drag; // Apply air resistance
      p.vy *= p.drag;

      p.x += p.vx;
      p.y += p.vy;

      // Apply rotation
      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.rotZ += p.rotSpeedZ;

      // Update DOM styling using translate3d for performance
      // We subtract half width/height to center the rotation point
      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotateX(${p.rotX}deg) rotateY(${p.rotY}deg) rotateZ(${p.rotZ}deg)`;

      // Fade out logic
      if (now > p.fadeStart) {
        p.opacity -= 0.015;
        p.el.style.opacity = Math.max(0, p.opacity);
      }

      // Check if particle is still visible on screen
      if (p.y < window.innerHeight + 50 && p.opacity > 0) {
        activeParticles++;
      }
    });

    // Continue animation if particles are active and under time limit (increased to 20s)
    if (activeParticles > 0 && now - startTime < 20000) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Cleanup
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };

  animate();
};

/**
 * Fires a christmas-themed snowfall animation.
 * Replaces the confetti animation with falling snow from the top of the screen.
 *
 * @param {number} [duration=5000] - How long the snowfall lasts in ms (default 5s).
 */
export const fireSnowfall = (duration = 5000) => {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  const particles = [];
  const count = 150;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.innerHTML = "❄";
    el.style.position = "absolute";
    el.style.color = "white";
    el.style.fontSize = Math.random() * 15 + 10 + "px";
    el.style.textShadow = "0 0 5px rgba(255, 255, 255, 0.8)";
    el.style.userSelect = "none";

    // Random start position (mostly above screen)
    const startX = Math.random() * window.innerWidth;
    const startY = -Math.random() * window.innerHeight; // Start above viewport

    // Initial opacity
    el.style.opacity = (Math.random() * 0.5 + 0.5).toString();
    el.style.willChange = "transform, opacity";

    container.appendChild(el);

    particles.push({
      el,
      x: startX,
      y: startY,
      speedY: Math.random() * 2 + 1, // Fall speed
      speedX: (Math.random() - 0.5) * 1, // Drift speed
      swaySpeed: Math.random() * 0.05 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      swayAmplitude: Math.random() * 2,
      opacity: parseFloat(el.style.opacity),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    });
  }

  let animationFrameId;
  const startTime = Date.now();
  let fadingOut = false;

  const animate = () => {
    const now = Date.now();
    const elapsed = now - startTime;

    // Start fading out near the end
    if (elapsed > duration - 1000) {
      fadingOut = true;
    }

    if (elapsed > duration) {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      return;
    }

    particles.forEach((p) => {
      p.y += p.speedY;

      // Swaying motion
      p.x += Math.sin(now * 0.001 * p.swaySpeed + p.swayOffset) * 0.5 + p.speedX;

      // Rotation
      p.rotation += p.rotationSpeed;

      // Wrap around if it goes off bottom (optional, but for a short effect, maybe just let them fall)
      // Since it's a "win" animation, continuous falling for duration is nice.
      if (p.y > window.innerHeight) {
        p.y = -50;
        p.x = Math.random() * window.innerWidth;
      }

      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;

      if (fadingOut) {
        p.opacity -= 0.02;
        p.el.style.opacity = Math.max(0, p.opacity);
      }
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  animate();
};

/**
 * Spawns smoke particles around the spin button during overcharge.
 * Progressively darkens and intensifies, eventually adding fire particles.
 * Phases: White → Grey → Dark Grey → Black + Fire (inferno)
 *
 * @param {Object} smokeContainerRef - React ref to the smoke container DOM element.
 * @param {Object} overchargeRef - React ref containing the current overcharge time in milliseconds.
 * @param {Function} playFireCrackle - Callback function to play fire crackle sound effects.
 * @example
 * spawnSmoke(smokeContainerRef, overchargeRef, playFireCrackle);
 */
export const spawnSmoke = (smokeContainerRef, overchargeRef, playFireCrackle) => {
  if (!smokeContainerRef.current) return;

  const timeOver = overchargeRef.current;
  const delay = 3000; // 3 seconds delay before smoke starts

  // If we haven't passed the delay threshold, don't spawn anything
  if (timeOver < delay) return;

  // Calculate effective time for phases relative to the start of smoke
  const effectiveTime = timeOver - delay;

  // Determine intensity phases
  // Phase 1 (0-5s of smoke): White -> Grey
  // Phase 2 (5-10s of smoke): Grey -> Dark Grey
  // Phase 3 (10s+ of smoke): Inferno (Black + Fire)

  const intensity = Math.min(effectiveTime / 5000, 1);
  const extremeIntensity = Math.max(0, Math.min((effectiveTime - 5000) / 5000, 1));
  const isInferno = effectiveTime > 10000;

  // Probability to spawn a particle this frame
  if (Math.random() > 0.1 + intensity * 0.5) return;

  const el = document.createElement("div");
  let size = 10 + Math.random() * 20 + intensity * 30;

  // Phase 3: Double size for the smoke
  if (isInferno) size *= 2;

  // Calculate Smoke Color
  let color;
  if (isInferno) {
    // Pitch black / very dark grey for inferno
    const val = Math.floor(Math.random() * 30);
    color = `rgb(${val},${val},${val})`;
  } else {
    // Progressive darkening from White (255) to Grey
    const greyVal = Math.floor(255 - intensity * 100 - extremeIntensity * 100);
    color = `rgb(${greyVal},${greyVal},${greyVal})`;
  }

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.background = color;
  el.style.position = "absolute";
  el.style.borderRadius = "50%";
  el.style.filter = "blur(8px)";
  el.style.pointerEvents = "none";

  // Random position around center
  const angle = Math.random() * Math.PI * 2;
  // Distance from container (50% of container)
  const dist = Math.random() * 50;
  const left = 50 + Math.cos(angle) * dist;
  const top = 50 + Math.sin(angle) * dist;

  el.style.left = `calc(${left}% - ${size / 2}px)`;
  el.style.top = `calc(${top}% - ${size / 2}px)`;

  // Random rotation
  el.style.setProperty("--rot", `${(Math.random() - 0.5) * 360}deg`);

  el.style.animation = `smokeRise ${1 + Math.random()}s forwards`;

  smokeContainerRef.current.appendChild(el);

  // --- FIRE PARTICLES (Inferno Phase Only) ---
  if (isInferno) {
    // Play crackle sound randomly (approx 20% of frames) to create a texture
    // 60fps * 0.2 = ~12 crackles per second
    if (Math.random() > 0.8) playFireCrackle();

    if (Math.random() > 0.5) {
      const fire = document.createElement("div");
      // Increased fire particle size for better visibility
      const fSize = 50 + Math.random() * 25;
      const fColors = ["#ef4444", "#f97316", "#eab308"]; // Red, Orange, Yellow
      const fColor = fColors[Math.floor(Math.random() * fColors.length)];

      fire.style.width = `${fSize}px`;
      fire.style.height = `${fSize}px`;
      fire.style.background = fColor;
      fire.style.position = "absolute";
      fire.style.borderRadius = "50%";
      fire.style.filter = "blur(4px)";
      fire.style.pointerEvents = "none";

      // Fire spawns tighter to the center
      const fLeft = 50 + (Math.random() - 0.5) * 30;
      const fTop = 50 + (Math.random() - 0.5) * 30;

      fire.style.left = `calc(${fLeft}% - ${fSize / 2}px)`;
      fire.style.top = `calc(${fTop}% - ${fSize / 2}px)`;

      // Fire rises faster and dies quicker than smoke
      fire.style.animation = `smokeRise 0.6s forwards`;

      smokeContainerRef.current.appendChild(fire);

      // Cleanup fire
      setTimeout(() => {
        if (fire.parentNode) fire.parentNode.removeChild(fire);
      }, 600);
    }
  }

  // Cleanup Smoke
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 2000);
};

/**
 * Draws a motion trail behind the spinning wheel.
 * Trail appearance varies by XP level with different colors, glows, and sparkle effects.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D canvas rendering context.
 * @param {number} centerX - X coordinate of the wheel center.
 * @param {number} centerY - Y coordinate of the wheel center.
 * @param {number} radius - Radius of the wheel.
 * @param {number} rotation - Current rotation angle in radians.
 * @param {number} velocity - Current rotation velocity (affects trail length).
 * @param {number} level - Current XP level (affects trail appearance).
 * @param {boolean} isDark - Whether dark mode is active.
 * @example
 * drawWheelTrail(ctx, 200, 200, 150, Math.PI, 0.5, 10, true);
 */
export const drawWheelTrail = (ctx, centerX, centerY, radius, rotation, velocity, level, isDark) => {
  // Only draw when spinning fast enough. Velocity is rad/second and is signed, since
  // the flapper can drive the wheel backwards at the end of a spin.
  const speed = Math.abs(velocity);
  if (speed < 0.3) return;

  // Trail length depends on speed, capped at half circle
  const trailLength = Math.min(speed * 0.5, Math.PI);

  // Trail streams behind the direction of travel, whichever way that currently is.
  const dir = velocity < 0 ? -1 : 1;
  const startAngle = rotation - trailLength * dir;
  const endAngle = rotation;

  ctx.save();

  const trailRadius = radius;
  let lineWidth = 6;
  let shadowBlur = 0;
  let shadowColor = "transparent";
  let gradientStops = [];
  let hasSparkles = false;
  let sparkleColor = "#fff";
  let sparkleChance = 0;

  // Define Tier Styles
  if (level >= 11) { // Cosmic
    gradientStops = [
      { pos: 0, color: "rgba(236, 72, 153, 0)" }, // Pink transparent
      { pos: 0.5, color: "rgba(217, 70, 239, 0.6)" }, // Fuchsia
      { pos: 1, color: "rgba(139, 92, 246, 0.9)" }, // Violet opaque
    ];
    shadowBlur = 25;
    shadowColor = "#8b5cf6";
    lineWidth = 10;
    hasSparkles = true;
    sparkleColor = "#6366f1"; // Indigo
    sparkleChance = 0.7;
  } else if (level >= 10) { // Diamond
    gradientStops = [
      { pos: 0, color: "rgba(34, 211, 238, 0)" }, // Cyan transparent
      { pos: 0.5, color: "rgba(99, 102, 241, 0.6)" }, // Indigo
      { pos: 1, color: "rgba(168, 85, 247, 0.9)" }, // Purple opaque
    ];
    shadowBlur = 20;
    shadowColor = "#22d3ee";
    lineWidth = 9;
    hasSparkles = true;
    sparkleColor = "#e0f2fe"; // Light Blue
    sparkleChance = 0.75;
  } else if (level >= 9) { // Gold
    gradientStops = [
      { pos: 0, color: "rgba(253, 224, 71, 0)" }, // Yellow transparent
      { pos: 0.5, color: "rgba(234, 179, 8, 0.6)" }, // Amber
      { pos: 1, color: "rgba(245, 158, 11, 0.9)" }, // Orange opaque
    ];
    shadowBlur = 20;
    shadowColor = "#fbbf24";
    lineWidth = 8;
    hasSparkles = true;
    sparkleColor = "#fffbeb"; // Warm White
    sparkleChance = 0.8;
  } else if (level >= 8) { // Ruby
    gradientStops = [
      { pos: 0, color: "rgba(251, 113, 133, 0)" }, // Rose transparent
      { pos: 0.6, color: "rgba(239, 68, 68, 0.6)" }, // Red
      { pos: 1, color: "rgba(225, 29, 72, 0.9)" }, // Dark Red opaque
    ];
    shadowBlur = 20;
    shadowColor = "#ef4444";
    lineWidth = 8;
    hasSparkles = true; // Fire sparks
    sparkleColor = "#fbbf24"; // Amber sparks
    sparkleChance = 0.8;
  } else if (level >= 7) { // Topaz
    gradientStops = [
      { pos: 0, color: "rgba(103, 232, 249, 0)" }, // Cyan transparent
      { pos: 0.5, color: "rgba(6, 182, 212, 0.6)" }, // Cyan
      { pos: 1, color: "rgba(59, 130, 246, 0.8)" }, // Blue opaque
    ];
    shadowBlur = 15;
    shadowColor = "#06b6d4";
    lineWidth = 7;
  } else if (level >= 5) { // Emerald
    gradientStops = [
      { pos: 0, color: "rgba(52, 211, 153, 0)" }, // Emerald transparent
      { pos: 1, color: "rgba(16, 185, 129, 0.8)" }, // Emerald opaque
    ];
    shadowBlur = 15;
    shadowColor = "#10b981";
    lineWidth = 6;
  } else if (level >= 3) { // Bronze
    gradientStops = [
      { pos: 0, color: "rgba(253, 186, 116, 0)" }, // Orange transparent
      { pos: 1, color: "rgba(234, 88, 12, 0.8)" }, // Dark Orange opaque
    ];
    shadowBlur = 10;
    shadowColor = "#f97316";
    lineWidth = 5;
  } else if (level >= 1) { // Silver
    gradientStops = [
      { pos: 0, color: "rgba(148, 163, 184, 0)" }, // Slate transparent
      { pos: 1, color: "rgba(71, 85, 105, 0.6)" }, // Slate opaque
    ];
    shadowBlur = 5;
    shadowColor = "#94a3b8";
    lineWidth = 4;
  } else { // Basic
    const baseColor = isDark ? "255, 255, 255" : "0, 0, 0";
    gradientStops = [
      { pos: 0, color: `rgba(${baseColor}, 0)` },
      { pos: 1, color: `rgba(${baseColor}, 0.3)` },
    ];
    lineWidth = 4;
  }

  // Draw Gradient Trail
  const gradient = ctx.createLinearGradient(
    centerX + Math.cos(startAngle) * trailRadius,
    centerY + Math.sin(startAngle) * trailRadius,
    centerX + Math.cos(endAngle) * trailRadius,
    centerY + Math.sin(endAngle) * trailRadius
  );

  gradientStops.forEach((stop) => gradient.addColorStop(stop.pos, stop.color));

  ctx.beginPath();
  ctx.arc(centerX, centerY, trailRadius, startAngle, endAngle);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  if (shadowBlur > 0) {
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
  }
  ctx.stroke();

  // Reset Shadow
  ctx.shadowBlur = 0;

  // Draw Sparkles
  if (hasSparkles && Math.random() > sparkleChance) {
    const sparkAngle = startAngle + Math.random() * (endAngle - startAngle);
    // Randomize radius slightly for "cloud" effect
    const sparkR = trailRadius + (Math.random() - 0.5) * (lineWidth * 2);
    const sx = centerX + Math.cos(sparkAngle) * sparkR;
    const sy = centerY + Math.sin(sparkAngle) * sparkR;

    ctx.fillStyle = Math.random() > 0.5 ? "#fff" : sparkleColor;
    ctx.globalAlpha = Math.random();
    ctx.fillRect(sx, sy, 2, 2);
    ctx.globalAlpha = 1.0;
  }

  ctx.restore();
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.fireConfetti = fireConfetti;
  window.fireSnowfall = fireSnowfall;
  window.spawnSmoke = spawnSmoke;
  window.drawWheelTrail = drawWheelTrail;
}

