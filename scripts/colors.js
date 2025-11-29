// Helper for color interpolation
window.lerpColor = (a, b, amount) => {
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

// Helper to parse custom colors from string
window.parseCustomColors = (input) => {
  if (!input) return [];
  // Clean input and extract valid hex codes
  const cleaned = input.replace(/[\[\]"']/g, "");
  return cleaned
    .split(/[\n,]+/)
    .map((c) => c.trim())
    .filter((c) => /^#([0-9A-F]{3}){1,2}$/i.test(c));
};

// Helper for deterministic colors
window.getItemColor = (text, colors) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
