import { calculateLevel } from "./levels.js";
import { drawWheelTrail } from "./animations.js";
import { getItemColor } from "./colors.js";
import { COLOR_ASSIGNMENT_MODE } from "./configs.js";

/**
 * How far, in canvas pixels, a pin shoves the flapper outward at full lift. Matches the
 * drawn pin: the tip rests just inside the pin circle and rides over the top of one.
 */
const PIN_LIFT_PX = 10;

/**
 * Applies the removal animation to a item list, easing the outgoing item's weight to zero.
 * Shared with the physics layer so the pin ring follows the same geometry that is drawn.
 *
 * @param {Array<{text: string, weight: number}>} items
 * @param {{index: number, startTime: number, duration: number}|null} removingItem
 * @returns {Array<{text: string, weight: number}>}
 */
export const effectiveItems = (items, removingItem) => {
  if (!removingItem) return items;

  const { index, startTime, duration } = removingItem;
  const progress = Math.min((Date.now() - startTime) / duration, 1);
  const ease =
    progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const next = [...items];
  if (next[index]) {
    next[index] = { ...next[index], weight: next[index].weight * (1 - ease) };
  }
  return next;
};

/**
 * Draws the entire spin wheel on the canvas, including segments, text, hub, border, and trail.
 * Handles empty state, item removal animation, and dynamic/deterministic coloring.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {Array<{text: string, weight: number}>} items - The list of items to draw.
 * @param {string[]} colors - The array of colors to use for segments.
 * @param {number} rotation - The current rotation angle in radians.
 * @param {boolean} isDark - Whether dark mode is active.
 * @param {boolean} hideLabels - Whether to hide text labels on segments.
 * @param {boolean} trailEnabled - Whether to draw the motion trail.
 * @param {number} velocity - The current rotation velocity.
 * @param {Object|null} removingItem - State object for an item being removed (animation), or null.
 * @param {string} colorAssignment - The color assignment mode (dynamic or deterministic).
 * @param {number} xp - The current XP (used for trail effects).
 * @param {{angles: Float64Array, boundary: Uint8Array, count: number}|null} [pins] - Pin ring from
 *   buildPins(); boundary pins sit on segment edges. Falls back to a uniform ring when absent.
 */
export const drawWheel = (
  ctx,
  width,
  height,
  items,
  colors,
  rotation,
  isDark,
  hideLabels,
  trailEnabled,
  velocity,
  removingItem,
  colorAssignment,
  xp,
  pins
) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20; // Leave room for pins

  // --- Drawing ---
  ctx.clearRect(0, 0, width, height);

  if (items.length === 0) {
    // Empty State
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? "#334155" : "#f0f0f0";
    ctx.fill();
    ctx.strokeStyle = isDark ? "#475569" : "#ddd";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#5c5f77" : "#C0C0C0";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Add items to spin!", centerX, centerY + 120); // shifted down to prevent text from being obscured by the spin button
  } else {
    // Calculate Total Weight
    // Modified for animation: if removing, reduce weight of that item
    const drawItems = effectiveItems(items, removingItem);

    const totalWeight = drawItems.reduce((sum, item) => sum + item.weight, 0);

    // Draw Wheel Slices
    let currentAngle = rotation;

    drawItems.forEach((item, index) => {
      // Calculate slice size based on weight
      const sliceAngle = (item.weight / totalWeight) * (2 * Math.PI);

      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.closePath();

      if (colorAssignment === COLOR_ASSIGNMENT_MODE.DETERMINISTIC) {
        ctx.fillStyle = getItemColor(item.text, colors); // Deterministic colors
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

      const displayText = hideLabels
        ? "?"
        : item.text.substring(0, 18) + (item.text.length > 18 ? "..." : "");

      ctx.fillText(displayText, radius - 20, 5);
      ctx.restore();

      // Advance angle for next item
      currentAngle += sliceAngle;
    });

    // Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? "#1e293b" : "white";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw Trail Effect
    if (trailEnabled && Math.abs(velocity) > 0.3) {
      const currentLevel = calculateLevel(xp);
      drawWheelTrail(ctx, centerX, centerY, radius, rotation, velocity, currentLevel, isDark);
    }

    // Draw Pins
    // Pin positions come from the physics ring so what the flapper collides with is
    // exactly what is drawn. Boundary pins are the ones that can flip the outcome, so
    // they are drawn heavier than the fillers between them.
    const pinRadius = radius + 10; // Pins sit outside the main wheel
    const count = pins && pins.count ? pins.count : 30;
    const dense = count > 48;

    for (let i = 0; i < count; i++) {
      const local = pins && pins.angles ? pins.angles[i] : (i * 2 * Math.PI) / count;
      const isBoundary = pins && pins.boundary ? pins.boundary[i] === 1 : true;
      if (dense && !isBoundary && i % 2 === 1) continue; // thin the fillers when crowded

      const angle = local + rotation;
      const px = centerX + Math.cos(angle) * pinRadius;
      const py = centerY + Math.sin(angle) * pinRadius;

      ctx.beginPath();
      ctx.arc(px, py, isBoundary ? 5 : 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = isBoundary ? "#E2E8F0" : "#C0C0C0";
      ctx.fill();
      ctx.strokeStyle = isBoundary ? "#1f2937" : "#666";
      ctx.lineWidth = isBoundary ? 1.5 : 1;
      ctx.stroke();
    }
  }
};

/**
 * Renders the flapper.
 *
 * The tip is the part that decides the result, so it has to stay on the reference line the
 * winner is read from -- the horizontal through the wheel's centre. A pointer that pivots
 * about its tail does not: its tip swings sideways as it deflects, by up to six degrees,
 * which on a thirty-item wheel is half a slice. It cannot be fixed by reading the winner
 * from wherever the tip has swung to either, because the pointer is positioned in fixed
 * pixels while the wheel scales, so the tip's offset changes with the viewport and the same
 * wheel angle would pick different slices on a phone and a desktop.
 *
 * So the pointer pivots about its tip instead (`origin-left` on the element), and the lift
 * is drawn as the radial push it physically is: the pin shoves the flapper outward, away
 * from the wheel, while the arm rocks. The tip stays exactly where the winner is read, at
 * every screen size, and the winner logic needs no knowledge of the layout.
 *
 * The rendered rotation is negated because the tip sits left of the pivot in screen
 * coordinates, so a positive CSS rotation would swing the flapper against the oncoming pins
 * rather than with them.
 *
 * @param {HTMLElement|null} pointerElement - The DOM element for the pointer.
 * @param {number} flapperAngle - Deflection in radians, from WheelPhysics#flapperAngle().
 *   Always non-negative: a pin lifts the flapper the same way whichever way the wheel turns.
 * @param {number} [lift=0] - Seat-to-crest lift, 0..1, from WheelPhysics#flapperLift().
 * @returns {void}
 */
export const updatePointer = (pointerElement, flapperAngle, lift = 0) => {
  if (!pointerElement) return;

  const deg = (-flapperAngle * 180) / Math.PI;
  const push = lift * PIN_LIFT_PX;
  pointerElement.style.transform = `translateX(${push.toFixed(1)}px) rotate(${deg.toFixed(2)}deg)`;
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.drawWheel = drawWheel;
  window.effectiveItems = effectiveItems;
  window.updatePointer = updatePointer;
}
