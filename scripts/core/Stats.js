/**
 * Stats - Centralized logic for calculating user statistics.
 * Used primarily for achievement tracking and progress monitoring.
 */
export class Stats {

  /**
   * Calculates the number of consecutive wins from the history.
   *
   * @param {Array} history - The history array containing past spin results.
   * @returns {number} The count of consecutive wins.
   */
  static calculateConsecutiveWins(history) {
    let consecutiveWins = 0;
    if (history && history.length > 0) {
      consecutiveWins = 1;
      const first = history[0].text;
      for (let i = 1; i < history.length; i++) {
        if (history[i].text === first) consecutiveWins++;
        else break;
      }
    }
    return consecutiveWins;
  }
}

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.Stats = Stats;
}
