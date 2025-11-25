// Confetti Logic - Fireworks Style Physics
window.fireConfetti = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const confettiCount = 250; // Increased count slightly for explosion effect
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.perspective = '1000px'; // Depth for 3D
  document.body.appendChild(container);

  const particles = [];
  const startX = window.innerWidth / 2;
  // Start slightly below center to align better with the modal center
  const startY = window.innerHeight / 2 + 50;

  for (let i = 0; i < confettiCount; i++) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = '0'; // Positioning handled by translate3d
    el.style.top = '0';

    // Random size and shape
    const size = Math.random() * 8 + 6 + 'px';
    el.style.width = size;
    el.style.height = Math.random() > 0.5 ? size : (Math.random() * 4 + 4 + 'px'); // Square or rectangle

    const colorHex = colors[Math.floor(Math.random() * colors.length)];
    el.style.backgroundColor = colorHex;
    const startOpacity = 0.7 + Math.random() * 0.2; // Semi-transparent (70-90%)
    el.style.opacity = startOpacity.toString();
    el.style.willChange = 'transform, opacity'; // Optimization

    container.appendChild(el);

    // Physics Initialization
    // Explosion mechanics: random angle, random upward force
    const angle = Math.random() * Math.PI * 2; // Random direction around center
    const explosionForce = Math.random() * 15 + 10; // Random power

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
      gravity: 0.07 + Math.random() * 0.05, // Reduced gravity (was ~0.5) for floaty fall
      drag: 0.96, // Increased drag (was 0.98) for air resistance
      rotX: Math.random() * 360,
      rotY: Math.random() * 360,
      rotZ: Math.random() * 360,
      rotSpeedX: (Math.random() - 0.5) * 15, // Tumble speed
      rotSpeedY: (Math.random() - 0.5) * 15,
      rotSpeedZ: (Math.random() - 0.5) * 10,
      opacity: startOpacity,
      fadeStart: Date.now() + 3000 + Math.random() * 2000 // Start fading later (after 3-5s)
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  // Physics Animation Loop
  const animate = () => {
    const now = Date.now();
    let activeParticles = 0;

    particles.forEach(p => {
      // Apply physics
      p.vy += p.gravity; // Apply gravity
      p.vx *= p.drag;    // Apply air resistance
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
    if (activeParticles > 0 && (now - startTime < 20000)) {
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
