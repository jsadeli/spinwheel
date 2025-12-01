/**
 * Definition of Daily Challenges.
 * Now supports flexible conditions and progress calculation.
 */
export const DAILY_CHALLENGES = [
  {
    id: "daily_spins_1",
    title: "First Spin",
    description: "Spin the wheel for the first time today.",
    icon: "🥇",
    bonusXp: 1,
    condition: (stats) => stats.spinsToday >= 1,
    progress: (stats) => stats.spinsToday,
    target: 1,
  },
  {
    id: "daily_spins_10",
    title: "Warming Up",
    description: "Spin the wheel 10 times today.",
    icon: "🕙",
    bonusXp: 10,
    condition: (stats) => stats.spinsToday >= 10,
    progress: (stats) => stats.spinsToday,
    target: 10,
  },
  {
    id: "daily_spins_100",
    title: "Century Spinner",
    description: "Spin the wheel 100 times today.",
    icon: "💯",
    bonusXp: 100,
    condition: (stats) => stats.spinsToday >= 100,
    progress: (stats) => stats.spinsToday,
    target: 100,
  },
  {
    id: "daily_spins_1000",
    title: "Millenium Falcon",
    description: "Spin the wheel 1000 times today.",
    icon: "🌀",
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
