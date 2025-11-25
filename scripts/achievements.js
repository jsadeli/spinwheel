
// Achievement Definitions
const ACHIEVEMENTS = [
  {
    id: 'hello_world',
    title: 'Hello World',
    description: "You pushed the button. We're so proud of you.",
    icon: '👋',
    condition: (stats) => stats.spins >= 1
  },
  {
    id: 'decisions_decisions',
    title: 'Decisions, Decisions',
    description: "You're starting to get the hang of letting fate decide.",
    icon: '🤔',
    condition: (stats) => stats.spins >= 10
  },
  {
    id: 'professional_procrastinator',
    title: 'Professional Procrastinator',
    description: "You could have made a decision by now, but this is more fun.",
    icon: '⏳',
    condition: (stats) => stats.spins >= 50
  },
  {
    id: 'centurion_of_chaos',
    title: 'Centurion of Chaos',
    description: "A hundred spins later, and you're still not sure what to eat for lunch.",
    icon: '💯',
    condition: (stats) => stats.spins >= 100
  },
  {
    id: 'apprentice',
    title: 'Apprentice',
    description: "You have reached Level 1.",
    icon: '🎓',
    condition: (stats) => stats.level >= 1
  },
  {
    id: 'the_chosen_one',
    title: 'The Chosen One',
    description: "You have reached Level 10. Please, go touch some grass.",
    icon: '🌟',
    condition: (stats) => stats.level >= 10
  },
  {
    id: 'double_or_nothing',
    title: 'Double or Nothing',
    description: "Get the same result twice in a row.",
    icon: '🎲',
    condition: (stats) => stats.consecutiveWins >= 2
  },
  {
    id: 'power_overwhelming',
    title: 'Power Overwhelming',
    description: "Hold the charge until the button shakes in fear.",
    icon: '⚡',
    condition: (stats) => stats.maxPowerCharge
  }
];

class AchievementManager {
  constructor() {
    this.storageKey = 'spinWheel_achievements';
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
