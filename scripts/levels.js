// Helper to get XP level title
const getLevelTitle = (level) => {
  const titles = [
    "Novice Spinner",                     // Lvl 0: 0 XP
    "Casual Clicker",                     // Lvl 1: 20 XP
    "Spin Enthusiast",                    // Lvl 2: 40 XP
    "Professional Procrastinator",        // Lvl 3: 80 XP
    "Frequent Spinner",                   // Lvl 4: 160 XP
    "Spin Doctor",                        // Lvl 5: 320 XP
    "Entropy Engineer",                   // Lvl 6: 640 XP
    "Lord of the Spins",                  // Lvl 7: 1280 XP
    "Agent of Probability",               // Lvl 8: 2560 XP
    "Wheel Master",                       // Lvl 9: 5120 XP
    "Oracle of Spin",                     // Lvl 10: 10240 XP
  ];
  return titles[level] || "God of Wheel"; // Lvl 11+: 20480 XP
};

// XP Progress Constants
const XP_CONSTANTS = {
  BASE_REQUIRED: 20,
  MULTIPLIER: 10,
  EXPONENT_GROWTH: 2,
};

// Helper to get required minimum XP for a specific level
const getRequiredXpForLevel = (level) => {
  if (level === 0) return XP_CONSTANTS.BASE_REQUIRED;
  return XP_CONSTANTS.MULTIPLIER * Math.pow(XP_CONSTANTS.EXPONENT_GROWTH, level);
};

// Helper to calculate XP level
const calculateLevel = (currentXp) => {
  let level = 0;
  let required = getRequiredXpForLevel(level);
  while (currentXp >= required) {
    currentXp -= required;
    level++;
    required = getRequiredXpForLevel(level);
  }
  return level;
};

// Helper to get XP level progress
const getLevelProgress = (currentXp) => {
  let level = 0;
  let required = getRequiredXpForLevel(level);

  // Find current level base XP
  while (currentXp >= required) {
    currentXp -= required;
    level++;
    required = getRequiredXpForLevel(level);
  }

  return {
    level,
    currentLevelXp: currentXp,
    requiredLevelXp: required,
    progressPercent: (currentXp / required) * 100
  };
};

// Expose to window
window.getLevelTitle = getLevelTitle;
window.XP_CONSTANTS = XP_CONSTANTS;
window.getRequiredXpForLevel = getRequiredXpForLevel;
window.calculateLevel = calculateLevel;
window.getLevelProgress = getLevelProgress;
