import { calculateLevel } from './levels.js';

const drawWheel = (ctx, width, height, items, colors, rotation, isDark, hideLabels, trailEnabled, velocity, removingItem, colorAssignment, xp) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20; // Leave room for pins
  const NUM_PINS = 30;

  // --- Drawing ---
  ctx.clearRect(0, 0, width, height);

  if (items.length === 0) {
    // Empty State
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#334155' : '#f0f0f0';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#475569' : '#ddd';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isDark ? '#5c5f77' : '#C0C0C0';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add items to spin!', centerX, centerY + 120); // shifted down to prevent text from being obscured by the spin button
  } else {
    // Calculate Total Weight
    // Modified for animation: if removing, reduce weight of that item
    let effectiveItems = [...items];
    if (removingItem) {
      const { index, startTime, duration } = removingItem;
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease in out
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // We need to identify the item by index or text. Index is safer if text is not unique?
      // But items list might have changed? No, we blocked interaction.
      // Let's use the index stored in ref.
      if (effectiveItems[index]) {
        // Clone the item to not mutate ref
        effectiveItems[index] = { ...effectiveItems[index], weight: effectiveItems[index].weight * (1 - ease) };
      }
    }

    const totalWeight = effectiveItems.reduce((sum, item) => sum + item.weight, 0);

    // Draw Wheel Slices
    let currentAngle = rotation;

    effectiveItems.forEach((item, index) => {
      // Calculate slice size based on weight
      const sliceAngle = (item.weight / totalWeight) * (2 * Math.PI);

      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.closePath();

      if (colorAssignment === 'deterministic') {
        ctx.fillStyle = window.getItemColor(item.text, colors); // Deterministic colors
      } else {
        ctx.fillStyle = colors[index % colors.length]; // Dynamic colors
      }

      ctx.fill();
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      // Rotate to center of the weighted slice
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = items.length > 12 ? "bold 14px Arial" : "bold 18px Arial";

      const displayText = hideLabels ? "?" : (item.text.substring(0, 18) + (item.text.length > 18 ? '...' : ''));

      ctx.fillText(displayText, radius - 20, 5);
      ctx.restore();

      // Advance angle for next item
      currentAngle += sliceAngle;
    });

    // Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#1e293b' : 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw Trail Effect
    if (trailEnabled && window.drawWheelTrail && (velocity > 0.005)) {
      const currentLevel = calculateLevel(xp);
      window.drawWheelTrail(ctx, centerX, centerY, radius, rotation, velocity, currentLevel, isDark);
    }

    // Draw Pins
    const pinRadius = radius + 10; // Pins sit outside the main wheel
    for (let i = 0; i < NUM_PINS; i++) {
      const angle = (i * 2 * Math.PI / NUM_PINS) + rotation;
      const px = centerX + Math.cos(angle) * pinRadius;
      const py = centerY + Math.sin(angle) * pinRadius;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#C0C0C0'; // Silver pins
      ctx.fill();
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
};

const updatePointer = (pointerElement, rotation, velocity) => {
  if (!pointerElement) return;

  const NUM_PINS = 30;
  const pinSpacing = (2 * Math.PI) / NUM_PINS;
  const pinPhase = (rotation % pinSpacing) / pinSpacing;

  let pointerAngle = 0;

  // Physics Parameters
  // Dynamic max angle based on velocity
  // Cap velocity influence to avoid 360 spins
  const velocityFactor = Math.min(velocity * 800, 40);
  const maxAngle = 30 + velocityFactor;

  const pushThreshold = 0.65; // Earlier contact for smoother push

  if (pinPhase > pushThreshold) {
    // PUSH PHASE: Pin contacts pointer and pushes it down (Clockwise)
    // Map range [0.85, 1.0] to [0, maxAngle]
    const t = (pinPhase - pushThreshold) / (pushThreshold - 1);
    // Use a slight curve for weight
    pointerAngle = t * maxAngle;
  } else {
    // SPRING/SNAP PHASE: Pin releases, pointer snaps back
    // Damped harmonic oscillator: A * e^(-ct) * cos(wt)
    const t = pinPhase;

    // Tune these for "snapiness"
    const decay = 10; // How fast energy is lost
    const freq = 120;  // Wiggle speed

    // Start at maxAngle (t=0), decay to 0
    pointerAngle = maxAngle * Math.exp(-decay * t) * Math.cos(freq * t);
  }

  pointerElement.style.transform = `rotate(${pointerAngle}deg)`;
};

// Expose to window
window.drawWheel = drawWheel;
window.updatePointer = updatePointer;
