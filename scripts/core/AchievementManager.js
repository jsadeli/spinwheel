import { ACHIEVEMENTS } from "../achievements.js";
import { STORAGE_KEYS } from "../configs.js";

/**
 * AchievementManager - Manages user achievement unlocks and persistence
 * Handles checking conditions, unlocking, and storing achievements in localStorage
 */
export class AchievementManager {
  /**
   * Creates a new AchievementManager instance.
   * Automatically loads previously unlocked achievements from localStorage.
   */
  constructor() {
    this.storageKey = STORAGE_KEYS.ACHIEVEMENTS;
    this.unlocked = this.load();
  }

  /**
   * Loads achievement data from localStorage.
   *
   * @private
   * @returns {Object<string, {unlockedAt: string}>} Object mapping achievement IDs to unlock data.
   */
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load achievements", e);
      return {};
    }
  }

  /**
   * Persists the current unlocked achievements to localStorage.
   *
   * @private
   */
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.unlocked));
    } catch (e) {
      console.error("Failed to save achievements", e);
    }
  }

  /**
   * Check for new unlocks based on current stats.
   * @param {Object} stats - Current user stats (spins, level, history, etc.)
   * @returns {Array} - List of newly unlocked achievement objects
   */
  check(stats) {
    const newUnlocks = [];

    ACHIEVEMENTS.forEach((achievement) => {
      if (!this.unlocked[achievement.id]) {
        if (achievement.condition(stats)) {
          this.unlock(achievement.id);
          newUnlocks.push(achievement);
        }
      }
    });

    return newUnlocks;
  }

  /**
   * Unlocks a specific achievement by ID.
   * Records the unlock timestamp and persists to localStorage.
   *
   * @param {string} id - The unique achievement ID to unlock.
   * @example
   * achievementManager.unlock('first_spin');
   */
  unlock(id) {
    if (!this.unlocked[id]) {
      this.unlocked[id] = {
        unlockedAt: new Date().toISOString(),
      };
      this.save();
    }
  }

  /**
   * Resets all unlocked achievements.
   * Clears the in-memory state and persists the reset to localStorage.
   */
  reset() {
    this.unlocked = {};
    this.save();
  }

  /**
   * Returns the raw unlocked achievements data.
   *
   * @returns {Object<string, {unlockedAt: string}>} Object mapping achievement IDs to unlock timestamps.
   */
  getUnlocked() {
    return this.unlocked;
  }

  /**
   * Returns all achievements with their unlock status.
   *
   * @returns {Array<Object>} Array of achievement objects with isUnlocked and unlockedAt properties.
   * @example
   * const achievements = achievementManager.getAll();
   * // Returns: [{ id: 'first_spin', name: '...', isUnlocked: true, unlockedAt: Date, ... }]
   */
  getAll(stats = {}) {
    return ACHIEVEMENTS.map((ach) => {
      const progress = ach.progress
        ? typeof ach.progress === "function"
          ? ach.progress(stats)
          : ach.progress
        : 0;
      const target = ach.target
        ? typeof ach.target === "function"
          ? ach.target(stats)
          : ach.target
        : 0;

      return {
        ...ach,
        isUnlocked: !!this.unlocked[ach.id],
        unlockedAt: this.unlocked[ach.id] ? new Date(this.unlocked[ach.id].unlockedAt) : null,
        progress,
        target,
      };
    });
  }
}

// Expose to window
if (typeof window !== "undefined") {
  window.AchievementManager = AchievementManager;
}
