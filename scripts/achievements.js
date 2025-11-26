
// Achievement Definitions
const ACHIEVEMENTS = [
  // --- Spins ---
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
    icon: '🐢️',
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
    id: 'analysis_paralysis',
    title: 'Analysis Paralysis',
    description: "Spin the wheel 5 times in under a minute. (Just pick one already.)",
    icon: '🤯',
    condition: (stats) => stats.spinsInLastMinute >= 5
  },
  // --- Mystery Spin ---
  {
    id: 'jesus_take_the_wheel',
    title: 'Jesus Take The Wheel',
    description: "Spin the wheel while in \"Mystery Mode\" (labels hidden).",
    icon: '🙏',
    condition: (stats) => stats.mysteryMode && stats.hasSpun
  },
  // --- Muted Spin ---
  {
    id: 'silence_is_golden',
    title: 'Silence is Golden',
    description: "Shhh, the wheel is thinking. Complete a spin with the sound muted.",
    icon: '🔇',
    condition: (stats) => stats.hasSpun && stats.soundMuted
  },
  // --- Other Spins ---
  {
    id: 'power_overwhelming',
    title: 'Power Overwhelming',
    description: "Hold the charge until the button shakes in fear.",
    icon: '⚡',
    condition: (stats) => stats.maxPowerCharge
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: "Ain't nobody got time for that. Complete and watch a quick spin.",
    icon: '💨',
    condition: (stats) => stats.hasSpun && stats.spinDuration <= 5000
  },
  {
    id: 'patience_is_a_virtue',
    title: 'Patience is a Virtue',
    description: "Good things come to those who wait. Complete and watch a long spin.",
    icon: '🧘',
    condition: (stats) => stats.hasSpun && stats.spinDuration >= 20000
  },
  {
    id: 'this_is_fine',
    title: 'This Is Fine',
    description: "Trigger the \"Overheating\" button effect 5 times in a row.",
    icon: '🔥',
    condition: (stats) => stats.consecutiveOverheats >= 5
  },
  {
    id: 'into_the_void',
    title: 'Into The Void',
    description: "Null Pointer Exception waiting to happen. Delete all options and try to spin an empty wheel.",
    icon: '👻',
    condition: (stats) => stats.triedEmptySpin
  },
  {
    id: 'one_and_done',
    title: 'One And Done',
    description: "Remove a winning option from the pool. Only the best remains.",
    icon: '🧹️',
    condition: (stats) => stats.usedRemoveAndSpin
  },
  // --- Level Ups ---
  {
    id: 'apprentice',
    title: 'Apprentice',
    description: "You have reached Level 1.",
    icon: '🎓',
    condition: (stats) => stats.level >= 1
  },
  {
    id: 'one_small_step',
    title: 'One Small Step',
    description: "One giant leap for indecisive kind.",
    icon: '🚀',
    condition: (stats) => stats.level >= 2
  },
  {
    id: 'the_chosen_one',
    title: 'The Chosen One',
    description: "You have reached Level 10. Please, go touch some grass.",
    icon: '🌟',
    condition: (stats) => stats.level >= 10
  },
  // --- XP ---
  {
    id: 'xp_miner',
    title: 'XP Miner',
    description: "Earn 100 XP in a single session.",
    icon: '⛏️',
    condition: (stats) => stats.sessionXP >= 100
  },
  // --- Consecutive Wins ---
  {
    id: 'double_or_nothing',
    title: 'Double or Nothing',
    description: "Get the same result twice in a row.",
    icon: '👯‍♀️',
    condition: (stats) => stats.consecutiveWins >= 2
  },
  {
    id: 'deja_vu',
    title: 'Déjà Vu',
    description: "Land on the same option 3 times in a row. (Glitch in the matrix?)",
    icon: '🐈',
    condition: (stats) => stats.consecutiveWins >= 3
  },
  {
    id: 'broken_record',
    title: 'Broken Record',
    description: "Spin the same result 5 consecutive times.",
    icon: '😵‍💫',
    condition: (stats) => stats.consecutiveWins >= 5
  },
  {
    id: 'one_in_a_million',
    title: 'One in a Million',
    description: "Defy the odds by hitting the same winner 100 times in a row!",
    icon: '🦄',
    condition: (stats) => stats.consecutiveWins >= 100
  },
  // --- Inputs ---
  {
    id: 'i_make_my_own_luck',
    title: 'I Make My Own Luck',
    description: "Create a wheel with only one option. (Spoiler: You won.)",
    icon: '🍀',
    condition: (stats) => stats.itemCount === 1 && stats.hasSpun
  },
  {
    id: 'never_tell_me_the_odds',
    title: 'Never Tell Me The Odds',
    description: "Win on a segment with 1 weight against a segment with 50+ weight.",
    icon: '🏋️‍♂️',
    condition: (stats) => stats.winnerWeight === 1 && stats.maxWeight >= 50
  },
  {
    id: 'the_house_always_wins',
    title: 'The House Always Wins',
    description: "We all knew that was coming. Create a weighted item with 100 weight and win.",
    icon: '🎲',
    condition: (stats) => stats.winnerWeight >= 100
  },
  {
    id: 'tl_dr',
    title: 'TL;DR',
    description: "Create a wheel option with more than 50 characters. (We're not reading that.)",
    icon: '📜',
    condition: (stats) => stats.maxItemLength > 50
  },
  {
    id: 'why_are_you_like_this',
    title: 'Why Are You Like This?',
    description: "Create a single list with more than 50 items.",
    icon: '😩',
    condition: (stats) => stats.itemCount > 50
  },
  {
    id: 'trust_issues',
    title: 'Trust Issues',
    description: "Can't trust the order? Shuffle the list.",
    icon: '🎰',
    condition: (stats) => stats.usedShuffle
  },
  // --- Lists ---
  {
    id: 'branching_out',
    title: 'Branching Out',
    description: "Create a new list to organize a different category of items.",
    icon: '🌱',
    condition: (stats) => stats.listCount >= 2 // Assumed: Created at least one new list (default is 1)
  },
  {
    id: 'the_more_the_merrier',
    title: 'The More the Merrier',
    description: "Add 10 different lists to your collection.",
    icon: '🥳',
    condition: (stats) => stats.listCount >= 10
  },
  {
    id: 'data_hoarder',
    title: 'Data Hoarder',
    description: "Save 50 different lists in your library.",
    icon: '💾',
    condition: (stats) => stats.listCount >= 50
  },
  {
    id: 'foreign_exchange',
    title: 'Foreign Exchange',
    description: "Import a list from a shared URL.",
    icon: '🌍',
    condition: (stats) => stats.importedList
  },
  {
    id: 'sharing_is_caring',
    title: 'Sharing is Caring',
    description: "Share a list with a friend (or yourself).",
    icon: '📤',
    condition: (stats) => stats.sharedList
  },
  // --- History ---
  {
    id: 'nothing_to_see_here',
    title: 'Nothing to See Here',
    description: "Cover your tracks. Clear the history.",
    icon: '🙈',
    condition: (stats) => stats.clearedHistory
  },
  // --- Time of Day ---
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: "Go to sleep! Spin the wheel between midnight and sunrise.",
    icon: '🦉',
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 0 && h < 3;
    }
  },
  {
    id: 'insomniac',
    title: 'Insomniac',
    description: "Who needs sleep when there are choices to be made?",
    icon: '🥱',
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 3 && h < 6;
    }
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: "Caught the worm (or at least a spin) before 10 AM.",
    icon: '🐛',
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 6 && h < 10;
    }
  },
  {
    id: 'brunch_bunch',
    title: 'Brunch Bunch',
    description: "Spun the wheel when it was too late for breakfast, too early for lunch.",
    icon: '🥑',
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 10 && h < 14;
    }
  },
  {
    id: 'coffee_break',
    title: 'Coffee Break',
    description: "Beat the post-lunch slump with a spin.",
    icon: '☕',
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 14 && h < 18;
    }
  },
  {
    id: 'sunset_spinner',
    title: 'Sunset Spinner',
    description: "Closed out the day as the sun went down.",
    icon: '🌙',
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 18 && h < 22;
    }
  },
  {
    id: 'last_call',
    title: 'Last Call',
    description: "Getting one last spin in before tomorrow.",
    icon: '🛏️',
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 22 && h < 0;
    }
  },
  // --- Theme features ---
  {
    id: 'flashbang',
    title: 'Flashbang',
    description: "My eyes! Spin the wheel in Light Mode.",
    icon: '😎',
    condition: (stats) => stats.hasSpun && !stats.isDark
  },
  {
    id: 'hello_darkness',
    title: 'Hello Darkness',
    description: "My old friend. Spin the wheel in Dark Mode.",
    icon: '🌑',
    condition: (stats) => stats.hasSpun && stats.isDark
  },
  {
    id: 'taste_the_rainbow',
    title: 'Taste the Rainbow',
    description: "Spin using a custom color palette.",
    icon: '🌈',
    condition: (stats) => stats.hasSpun && stats.isCustomColors
  },
  {
    id: 'light_switch_rave',
    title: 'Light Switch Rave',
    description: "My eyes! Toggle between Light and Dark mode 10 times rapidly.",
    icon: '💡',
    condition: (stats) => stats.rapidThemeToggles >= 10
  },
  // --- AI features ---
  {
    id: 'ghost_in_the_machine',
    title: 'Ghost in the Machine',
    description: "Robots are deciding your lunch now. Generate a list using the AI Sparkle button.",
    icon: '🤖',
    condition: (stats) => stats.usedAI
  },
  {
    id: 'press_secretary',
    title: 'Press Secretary',
    description: "Let the AI do the talking. Use the AI Announce Winner feature.",
    icon: '📢',
    condition: (stats) => stats.usedAIAnnounce
  },
  // --- Easter Eggs ---
  {
    id: 'voided_warranty',
    title: 'Voided Warranty',
    description: "You pushed the limits and paid the price.",
    icon: '💀',
    condition: (stats) => stats.isBroken
  },
  {
    id: 'credit_where_due',
    title: 'Credit Where Due',
    description: "Discovered the maker of the app.",
    icon: '🥚',
    condition: (stats) => stats.winnerId === '@author'
  },
  {
    id: 'lore_master',
    title: 'Lore Master',
    description: "You actually read the backstory? Impressive.",
    icon: '📖',
    condition: (stats) => stats.winnerId === '@about'
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
