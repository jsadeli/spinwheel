import { DAILY_CHALLENGES } from "../challenges.js";
import { STORAGE_KEYS } from "../configs.js";

/**
 * ChallengeManager - Manages daily challenge state, persistence, and logic
 * Handles daily resets, progress tracking, and completion checks
 */
export class ChallengeManager {
  /**
   * Creates a new ChallengeManager instance.
   * Automatically loads previous state from localStorage and checks for daily reset.
   */
  constructor() {
    this.storageKey = STORAGE_KEYS.DAILY_CHALLENGES;
    this.data = this.getDefaultData();
    this.load();
  }

  /**
   * Returns the default data structure.
   * @private
   * @returns {Object} Default state object with lastResetDate, spinsToday, and completed.
   */
  getDefaultData() {
    return {
      lastResetDate: null,
      spinsToday: 0,
      completed: [],
    };
  }

  /**
   * Loads data from local storage and checks for reset.
   * @private
   */
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure parsed data is a valid object before using it
        if (parsed && typeof parsed === "object") {
          this.data = parsed;
        }
      }
      this.checkReset();
    } catch (e) {
      console.error("Failed to load daily challenges data", e);
      // In case of error, ensure we have a valid state
      if (!this.data) {
        this.data = this.getDefaultData();
      }
    }
  }

  /**
   * Saves current data to local storage.
   * @private
   */
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save daily challenges data", e);
    }
  }

  /**
   * Checks if challenges should be reset based on the current date.
   * @private
   */
  checkReset() {
    const now = new Date();
    const todayStr = now.toDateString(); // "Mon Dec 01 2025"

    // Reset if it's a new day OR if it's the first run (lastResetDate is null)
    if (!this.data.lastResetDate || this.data.lastResetDate !== todayStr) {
      this.reset(todayStr);
    }
  }

  /**
   * Resets all daily progress.
   * @private
   * @param {string} dateStr - The new date string.
   */
  reset(dateStr) {
    this.data.lastResetDate = dateStr;
    this.data.spinsToday = 0;
    this.data.completed = [];
    this.save();
  }

  /**
   * Increments the daily spin count and checks for completions.
   * @param {Object} externalStats - Optional external stats to include in the check.
   * @returns {Array<Object>} List of newly completed challenges.
   * @example
   * const unlocks = challengeManager.incrementSpins({ winner: '🎉', level: 5 });
   */
  incrementSpins(externalStats = {}) {
    this.checkReset(); // Ensure we are on the correct day
    this.data.spinsToday += 1;
    this.save();
    return this.checkCompletions(externalStats);
  }

  /**
   * Checks for any newly completed challenges based on current stats.
   * @param {Object} externalStats - External stats to merge with internal data.
   * @returns {Array<Object>} List of newly completed challenges.
   */
  checkCompletions(externalStats = {}) {
    const newUnlocks = [];

    // Merge internal state with external stats
    const stats = {
      spinsToday: this.data.spinsToday,
      ...externalStats
    };

    DAILY_CHALLENGES.forEach((challenge) => {
      const isCompleted = this.data.completed.some(
        (c) => c.challengeId === challenge.id
      );
      if (isCompleted) return;

      // Use the condition function
      if (challenge.condition && challenge.condition(stats)) {
        this.data.completed.push({
          challengeId: challenge.id,
          completedAt: new Date().toISOString(),
        });
        newUnlocks.push(challenge);
      }
    });

    if (newUnlocks.length > 0) {
      this.save();
    }

    return newUnlocks;
  }

  /**
   * Returns the list of all challenges with their current status.
   * @param {Object} externalStats - External stats to calculate progress.
   * @returns {Array<Object>} Array of challenge objects with isCompleted and progress properties.
   * @example
   * const challenges = challengeManager.getAll({ xp: 1000, level: 3 });
   */
  getAll(externalStats = {}) {
    this.checkReset(); // Ensure fresh state

    const stats = {
      spinsToday: this.data.spinsToday,
      ...externalStats
    };

    return DAILY_CHALLENGES.map((challenge) => {
      // Calculate progress using the function
      const currentProgress = challenge.progress ? challenge.progress(stats) : 0;

      // Clamp progress to target for display purposes if needed
      const displayProgress = Math.min(currentProgress, challenge.target);

      // Find completion record
      const completionRecord = this.data.completed.find(
        (c) => c.challengeId === challenge.id
      );

      return {
        ...challenge,
        isCompleted: !!completionRecord,
        completedAt: completionRecord?.completedAt || null,
        progress: displayProgress,
      };
    });
  }

  /**
   * Returns the current spin count for today.
   * @returns {number} The number of spins completed today.
   */
  getSpinsToday() {
    return this.data.spinsToday;
  }
}

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.ChallengeManager = ChallengeManager;
}
