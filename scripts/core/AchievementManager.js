/**
 * AchievementManager - Manages user achievement unlocks and persistence
 * Handles checking conditions, unlocking, and storing achievements in localStorage
 */
class AchievementManager {
  constructor() {
    this.storageKey = window.storageKeys.ACHIEVEMENTS;
    this.unlocked = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load achievements", e);
      return {};
    }
  }

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

    ACHIEVEMENTS.forEach(achievement => {
      if (!this.unlocked[achievement.id]) {
        if (achievement.condition(stats)) {
          this.unlock(achievement.id);
          newUnlocks.push(achievement);
        }
      }
    });

    return newUnlocks;
  }

  unlock(id) {
    if (!this.unlocked[id]) {
      this.unlocked[id] = {
        unlockedAt: new Date().toISOString()
      };
      this.save();
    }
  }

  reset() {
    this.unlocked = {};
    this.save();
  }

  getUnlocked() {
    return this.unlocked;
  }

  getAll() {
    return ACHIEVEMENTS.map(ach => ({
      ...ach,
      isUnlocked: !!this.unlocked[ach.id],
      unlockedAt: this.unlocked[ach.id] ? new Date(this.unlocked[ach.id].unlockedAt) : null
    }));
  }
}

// Export for use in main app
window.AchievementManager = AchievementManager;
