/**
 * @typedef {Object} Challenge
 * @property {string} id - Unique identifier for the challenge
 * @property {string} title - Display title
 * @property {string} description - Description of the challenge
 * @property {string} icon - Emoji icon
 * @property {number} bonusXp - XP awarded upon completion
 * @property {function(Object): boolean} condition - Function to check if challenge is completed based on stats
 * @property {number|function(Object): number} progress - Current progress value (runtime) or calculation function (static)
 * @property {number} target - Target value to reach
 * @property {boolean} [isCompleted] - (Runtime) Whether the challenge is completed
 * @property {string} [completedAt] - (Runtime) Timestamp of completion
 */

/**
 * Definition of Daily Challenges.
 * Now supports flexible conditions and progress calculation.
 * @type {Challenge[]}
 */
export const DAILY_CHALLENGES = [
  {
    id: "daily_spins_1",
    title: "Warm-up Wiggle",
    description: "You spun once. Just to see if it works. It works.",
    icon: "🎯",
    bonusXp: 1,
    condition: (stats) => stats.spinsToday >= 1,
    progress: (stats) => stats.spinsToday,
    target: 1,
  },
  {
    id: "daily_spins_10",
    title: "Spinfluencer",
    description: "10 spins in. The algorithm likes your dedication.",
    icon: "🔄",
    bonusXp: 10,
    condition: (stats) => stats.spinsToday >= 10,
    progress: (stats) => stats.spinsToday,
    target: 10,
  },
  {
    id: "daily_spins_100",
    title: "Triple-Digit Menace",
    description: "A 100 spins today. Your finger needs a vacation.",
    icon: "🏝️️",
    bonusXp: 100,
    condition: (stats) => stats.spinsToday >= 100,
    progress: (stats) => stats.spinsToday,
    target: 100,
  },
  {
    id: "daily_spins_1000",
    title: "Millennium Spinner",
    description: "A 1000 spins. Scientists are studying you.",
    icon: "🌪️",
    bonusXp: 1000,
    condition: (stats) => stats.spinsToday >= 1000,
    progress: (stats) => stats.spinsToday,
    target: 1000,
  },
];

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.DAILY_CHALLENGES = DAILY_CHALLENGES;
}
