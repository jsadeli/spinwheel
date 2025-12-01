/**
 * Definition of Daily Challenges.
 * Now supports flexible conditions and progress calculation.
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

// Expose to window for Babel scripts
if (typeof window !== "undefined") {
  window.DAILY_CHALLENGES = DAILY_CHALLENGES;
}
