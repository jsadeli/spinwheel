// Colors Utility Module
/**
 * Linearly interpolates between two hex colors.
 *
 * @param {string} a - The start color in hex format (e.g., "#FF0000").
 * @param {string} b - The end color in hex format (e.g., "#0000FF").
 * @param {number} amount - The interpolation amount (0.0 to 1.0).
 * @returns {string} The interpolated color in hex format.
 */
export const lerpColor = (a, b, amount) => {
  const ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);
  return "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
};

/**
 * Parses a string containing custom colors into an array of valid hex color strings.
 * Handles various formats including comma-separated, newline-separated, and JSON-like strings.
 *
 * @param {string} input - The input string containing color codes.
 * @returns {string[]} An array of valid hex color strings found in the input.
 */
export const parseCustomColors = (input) => {
  if (!input) return [];
  // Clean input and extract valid hex codes
  const cleaned = input.replace(/[\[\]"']/g, "");
  return cleaned
    .split(/[\n,]+/)
    .map((c) => c.trim())
    .filter((c) => /^#([0-9A-F]{3}){1,2}$/i.test(c));
};

/**
 * Deterministically selects a color from a palette based on the input text.
 * Uses a hash function to ensure the same text always maps to the same color index.
 *
 * @param {string} text - The text to generate a color for.
 * @param {string[]} colors - The array of available colors (palette).
 * @returns {string} The selected hex color from the palette.
 */
export const getItemColor = (text, colors) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.lerpColor = lerpColor;
  window.parseCustomColors = parseCustomColors;
  window.getItemColor = getItemColor;
}

