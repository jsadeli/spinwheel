/**
 * Gets the title associated with a specific level.
 * Levels 0-10 have unique titles, level 11+ returns "God of Wheel".
 *
 * @param {number} level - The level number (0-based).
 * @returns {string} The title for the level.
 * @example
 * getLevelTitle(0) // "Novice Spinner"
 * getLevelTitle(5) // "Spin Doctor"
 * getLevelTitle(15) // "God of Wheel"
 */
export const getLevelTitle = (level) => {
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

/**
 * Constants used for XP calculation.
 * Formula: Level 0 = BASE_REQUIRED, Level N = MULTIPLIER * (EXPONENT_GROWTH ^ N)
 *
 * @type {Object}
 * @property {number} BASE_REQUIRED - XP required for level 0 (20 XP).
 * @property {number} MULTIPLIER - Multiplier for exponential growth (10).
 * @property {number} EXPONENT_GROWTH - Base for exponential calculation (2).
 */
export const XP_CONSTANTS = {
  BASE_REQUIRED: 20,
  MULTIPLIER: 10,
  EXPONENT_GROWTH: 2,
};

/**
 * Calculates the minimum XP required to reach the next level from the current level.
 * @param {number} level - The current level.
 * @returns {number} The XP required for the level.
 */
export const getRequiredXpForLevel = (level) => {
  if (level === 0) return XP_CONSTANTS.BASE_REQUIRED;
  return XP_CONSTANTS.MULTIPLIER * Math.pow(XP_CONSTANTS.EXPONENT_GROWTH, level);
};

/**
 * Calculates the current level based on total XP.
 * @param {number} currentXp - The total accumulated XP.
 * @returns {number} The calculated level.
 */
export const calculateLevel = (currentXp) => {
  let level = 0;
  let required = getRequiredXpForLevel(level);
  while (currentXp >= required) {
    currentXp -= required;
    level++;
    required = getRequiredXpForLevel(level);
  }
  return level;
};

/**
 * Calculates the progress towards the next level.
 * @param {number} currentXp - The total accumulated XP.
 * @returns {{level: number, currentLevelXp: number, requiredLevelXp: number, progressPercent: number}} The progress details.
 */
export const getLevelProgress = (currentXp) => {
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
    progressPercent: (currentXp / required) * 100,
  };
};
