
// Achievement Definitions
const ACHIEVEMENTS = [
  // --- Spins ---
  {
    id: "hello_world",
    title: "Hello World",
    description: "You pushed the button. We are so proud of you.",
    icon: "👋",
    bonusXp: 2,
    condition: (stats) => stats.spins >= 1,
  },
  {
    id: "decisions_decisions",
    title: "Decisions, Decisions",
    description: "10 spins in and you are getting suspiciously comfortable with chaos.",
    icon: "🤔",
    bonusXp: 10,
    condition: (stats) => stats.spins >= 10,
  },
  {
    id: "professional_procrastinator",
    title: "Professional Procrastinator",
    description: "After 50 spins, you have demonstrated a rare commitment to not committing",
    icon: "🐢️",
    bonusXp: 50,
    condition: (stats) => stats.spins >= 50,
  },
  {
    id: "centurion_of_chaos",
    title: "Centurion of Chaos",
    description: "A 100 spins later, and you are still not sure what to eat for lunch.",
    icon: "💯",
    bonusXp: 100,
    condition: (stats) => stats.spins >= 100,
  },
  {
    id: "millennium_of_mayhem",
    title: "Millennium of Mayhem",
    description: "1000 spins. Zero progress. Peak indecision achieved.",
    icon: "🌀",
    bonusXp: 1000,
    condition: (stats) => stats.spins >= 1000,
  },
  {
    id: "analysis_paralysis",
    title: "Analysis Paralysis",
    description: "Spin the wheel 5 times in under a minute. (Just pick one already.)",
    icon: "🤯",
    bonusXp: 50,
    condition: (stats) => stats.spinsInLastMinute >= 5,
  },
  {
    id: "speedrun",
    title: "Speedrun Any%",
    description: "Over 120 spins in 60 seconds. Glitches allowed, decisions optional.",
    icon: "🎮",
    bonusXp: 100,
    condition: (stats) => stats.spinsInLastMinute >= 120,
  },
  {
    id: "a_taste_of_fortune",
    title: "A Taste of Fortune",
    description: "50 spins in one session. The cookie says: 'Your fate is in motion. Keep spinning.'",
    icon: "🥠",
    bonusXp: 50,
    condition: (stats) => stats.sessionSpin >= 50,
  },
  {
    id: "champion_of_chance",
    title: "Champion of Chance",
    description: "100 spins in one session. Fortune favors your relentless fingers.",
    icon: "🏹",
    bonusXp: 100,
    condition: (stats) => stats.sessionSpin >= 100,
  },
  // --- Mystery Spin ---
  {
    id: "jesus_take_the_wheel",
    title: "Jesus Take The Wheel",
    description: 'Spin the wheel while in "Mystery Mode".',
    icon: "🙏",
    bonusXp: 10,
    condition: (stats) => stats.mysteryMode && stats.hasSpun,
  },
  // --- Muted Spin ---
  {
    id: "silence_is_golden",
    title: "Silence Is Golden",
    description: "Shhh, the wheel is thinking. Complete a spin with the sound muted.",
    icon: "🔇",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && stats.soundMuted,
  },
  // --- Other Spins ---
  {
    id: "power_overwhelming",
    title: "Power Overwhelming",
    description: "Hold the charge until the button shakes in fear.",
    icon: "⚡",
    bonusXp: 10,
    condition: (stats) => stats.maxPowerCharge,
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Ain't nobody got time for that. Complete and watch a quick spin.",
    icon: "💨",
    bonusXp: 5,
    condition: (stats) => stats.hasSpun && stats.spinDuration <= 5000,
  },
  {
    id: "patience_is_a_virtue",
    title: "Patience Is a Virtue",
    description: "Good things come to those who wait. Complete and watch a long spin.",
    icon: "🧘",
    bonusXp: 20,
    condition: (stats) => stats.hasSpun && stats.spinDuration >= 20000,
  },
  {
    id: "this_is_fine",
    title: "This Is Fine",
    description: "Stress-test the fire supression system by spinning 5 consecutive overheats.",
    icon: "🔥",
    bonusXp: 50,
    condition: (stats) => stats.consecutiveOverheats >= 5,
  },
  {
    id: "into_the_void",
    title: "Into the Void",
    description: "NullPointerException waiting to happen. Tried spinning an empty wheel.",
    icon: "👻",
    bonusXp: 10,
    condition: (stats) => stats.triedEmptySpin,
  },
  {
    id: "one_and_done",
    title: "One and Done",
    description: "Remove a winning option from the pool. Only the best remains.",
    icon: "🧹️",
    bonusXp: 5,
    condition: (stats) => stats.usedRemoveAndSpin,
  },
  {
    id: "abort_mission",
    title: "Abort Mission",
    description: "Canceled a spin mid-animation. Not all heroes wear capes.",
    icon: "❌️",
    bonusXp: 5,
    condition: (stats) => stats.cancelledSpins >= 1,
  },
  {
    id: "cancel_culture",
    title: "Cancel Culture",
    description: "100 canceled spins. The wheel bows to your indecision. Subjects tremble.",
    icon: "🛑",
    bonusXp: 100,
    condition: (stats) => stats.cancelledSpin >= 100,
  },
  {
    id: "duel_mode",
    title: "Duel Mode",
    description: "Face the wheel in a perfect 50-50 showdown.",
    icon: "🤺",
    bonusXp: 5,
    condition: (stats) => stats.itemCount === 2 && stats.hasSpun,
  },
  // --- Level Ups ---
  {
    id: "apprentice",
    title: "Apprentice",
    description: "Welcome to Level 1, where the real beginners envy you.",
    icon: "🐣",
    bonusXp: 2,
    condition: (stats) => stats.level >= 1,
  },
  {
    id: "one_small_step",
    title: "One Small Step",
    description: "One giant leap for indecisive kind.",
    icon: "🚀",
    bonusXp: 5,
    condition: (stats) => stats.level >= 2,
  },
  {
    id: "spinner_adept",
    title: "Spinner Adept",
    description: "Your skill in the spin arts grows with each rotation.",
    icon: "🎯",
    bonusXp: 10,
    condition: (stats) => stats.level >= 3,
  },
  {
    id: "spinaholic",
    title: "Spinaholic",
    description: "Your fingers are in a committed relationship with the spin button.",
    icon: "🎡",
    bonusXp: 10,
    condition: (stats) => stats.level >= 4,
  },
  {
    id: "phd_in_roundabout_solutions",
    title: "PhD in Roundabout Solutions",
    description: "Level 5 unlocked. You now specialize in complicated ways to avoid decisions.",
    icon: "🎓",
    bonusXp: 20,
    condition: (stats) => stats.level >= 5,
  },
  {
    id: "chaos_technician",
    title: "Chaos Technician",
    description: "Level 6 achieved. You can manipulate entropy without understanding thermodynamics.",
    icon: "👷",
    bonusXp: 30,
    condition: (stats) => stats.level >= 6,
  },
  {
    id: "confetti",
    title: "Party Mode",
    description: "Only those of Level 7 or higher may wield the sacred celebratory storm.",
    icon: "🎊",
    bonusXp: 50,
    condition: (stats) => stats.level >= 7,
  },
  {
    id: "mission_probability",
    title: "Mission: Probability",
    description: "Level 8 reached. Your mission, should you choose to accept it, is to discreetly influence outcomes.",
    icon: "🕶️",
    bonusXp: 80,
    condition: (stats) => stats.level >= 8,
  },
  {
    id: "wheel_whisperer",
    title: "Wheel Whisperer",
    description: "Reaching Level 9 officially qualifies you to talk to spinning objects.",
    icon: "🛞️",
    bonusXp: 100,
    condition: (stats) => stats.level >= 9,
  },
  {
    id: "the_chosen_one",
    title: "The Chosen One",
    description: "You have reached Level 10. Please, go touch some grass.",
    icon: "🌟",
    bonusXp: 2000,
    condition: (stats) => stats.level >= 10,
  },
  {
    id: "transcendence_protocol",
    title: "Transcendence Protocol",
    description: "All parameters exceeded. Divinity attained.",
    icon: "♾️",
    bonusXp: 3000,
    condition: (stats) => stats.level >= 11,
  },
  // --- Consecutive Wins ---
  {
    id: "double_or_nothing",
    title: "Double or Nothing",
    description: "Get the same result twice in a row.",
    icon: "👯‍♀️",
    bonusXp: 20,
    condition: (stats) => stats.consecutiveWins >= 2,
  },
  {
    id: "deja_vu",
    title: "Déjà Vu",
    description: "Land on the same option 3 times in a row. (Glitch in the matrix?)",
    icon: "🐈",
    bonusXp: 30,
    condition: (stats) => stats.consecutiveWins >= 3,
  },
  {
    id: "broken_record",
    title: "Broken Record",
    description: "Spin the same result 5 consecutive times.",
    icon: "😵‍💫",
    bonusXp: 50,
    condition: (stats) => stats.consecutiveWins >= 5,
  },
  {
    id: "one_in_a_million",
    title: "One in a Million",
    description: "Defy the odds by hitting the same winner 100 times in a row!",
    icon: "🦄",
    bonusXp: 1000,
    condition: (stats) => stats.consecutiveWins >= 100,
  },
  // --- Inputs ---
  {
    id: "i_make_my_own_luck",
    title: "I Make My Own Luck",
    description: "Spin your handcrafted, 100-percent-win-rate masterpiece.",
    icon: "🍀",
    bonusXp: 5,
    condition: (stats) => stats.itemCount === 1 && stats.hasSpun,
  },
  {
    id: "never_tell_me_the_odds",
    title: "Never Tell Me the Odds",
    description: "Win on a segment with 1 weight against a segment with 50+ weight.",
    icon: "🏋️‍♂️",
    bonusXp: 10,
    condition: (stats) => stats.winnerWeight === 1 && stats.maxWeight >= 50,
  },
  {
    id: "the_house_always_wins",
    title: "The House Always Wins",
    description: "We all knew that was coming. Create a weighted item with 100 weight and win.",
    icon: "🎲",
    bonusXp: 10,
    condition: (stats) => stats.winnerWeight >= 100,
  },
  {
    id: "tl_dr",
    title: "TL;DR",
    description: "Create a wheel option with more than 50 characters. (We're not reading that.)",
    icon: "📜",
    bonusXp: 10,
    condition: (stats) => stats.maxItemLength > 50,
  },
  {
    id: "why_are_you_like_this",
    title: "Why Are You Like This?",
    description: "Create a single list with more than 50 items.",
    icon: "😩",
    bonusXp: 10,
    condition: (stats) => stats.itemCount > 50,
  },
  {
    id: "trust_issues",
    title: "Trust Issues",
    description: "Can't trust the order? Shuffle the list.",
    icon: "🎰",
    bonusXp: 5,
    condition: (stats) => stats.usedShuffle && stats.itemCount >= 2,
  },
  {
    id: "certified_paranoid",
    title: "Certified Paranoid",
    description: "Shuffle 100 times straight. Truly, you trust nothing. Not even math.",
    icon: "🕵️‍♀️",
    bonusXp: 20,
    condition: (stats) => stats.consecutiveShuffles >= 100,
  },
  {
    id: "illusionist",
    title: "Illusionist",
    description: "Spin a list where every option is the same. (We admire your commitment to the illusion of choice.)",
    icon: "🪄",
    bonusXp: 20,
    condition: (stats) => stats.allIdentical && stats.itemCount >= 2,
  },
  // --- Lists ---
  {
    id: "branching_out",
    title: "Branching Out",
    description: "Create a new list to organize a different category of items.",
    icon: "🌱",
    bonusXp: 5,
    condition: (stats) => stats.listCount >= 2, // Assumed: Created at least one new list (default is 1)
  },
  {
    id: "the_more_the_merrier",
    title: "The More the Merrier",
    description: "Add 10 different lists to your collection.",
    icon: "🥳",
    bonusXp: 10,
    condition: (stats) => stats.listCount >= 10,
  },
  {
    id: "data_hoarder",
    title: "Data Hoarder",
    description: "Save 50 different lists in your library.",
    icon: "💾",
    bonusXp: 10,
    condition: (stats) => stats.listCount >= 50,
  },
  {
    id: "foreign_exchange",
    title: "Foreign Exchange",
    description: "Import a list from a shared URL.",
    icon: "🌍",
    bonusXp: 20,
    condition: (stats) => stats.importedList,
  },
  {
    id: "loot_box",
    title: "Loot Box",
    description: "Import 5 unique lists from shared URLs. Contents may be enchanted (or useless).",
    icon: "🎁",
    bonusXp: 50,
    condition: (stats) => stats.uniqueImportCount >= 5,
  },
  {
    id: "sharing_is_caring",
    title: "Sharing Is Caring",
    description: "Share a list with a friend (or yourself).",
    icon: "🫶",
    bonusXp: 30,
    condition: (stats) => stats.sharedList,
  },
  // --- History ---
  {
    id: "nothing_to_see_here",
    title: "Nothing to See Here",
    description: "Cover your tracks. Clear the history.",
    icon: "🙈",
    bonusXp: 10,
    condition: (stats) => stats.clearedHistory,
  },
  {
    id: "progress_enthusiast",
    title: "Progress Enthusiast",
    description: "More than 100 visits to your records. You inspect that tab like it owes you money.",
    icon: "📈",
    bonusXp: 20,
    condition: (stats) => stats.progressTabViews >= 100,
  },
  // --- Time of Day ---
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Go to sleep! Spin the wheel between midnight and sunrise.",
    icon: "🦉",
    bonusXp: 50,
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 0 && h < 3;
    },
  },
  {
    id: "insomniac",
    title: "Insomniac",
    description: "Who needs sleep when there are choices to be made?",
    icon: "🥱",
    bonusXp: 50,
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 3 && h < 6;
    },
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Caught the worm (or at least a spin) before 10 AM.",
    icon: "🐛",
    bonusXp: 50,
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 6 && h < 10;
    },
  },
  {
    id: "brunch_bunch",
    title: "Brunch Bunch",
    description: "Spun the wheel when it was too late for breakfast, too early for lunch.",
    icon: "🥑",
    bonusXp: 10,
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 10 && h < 14;
    },
  },
  {
    id: "coffee_break",
    title: "Coffee Break",
    description: "Beat the post-lunch slump with a spin.",
    icon: "☕",
    bonusXp: 10,
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 14 && h < 18;
    },
  },
  {
    id: "sunset_spinner",
    title: "Sunset Spinner",
    description: "Closed out the day as the sun went down.",
    icon: "🌙",
    bonusXp: 10,
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 18 && h < 22;
    },
  },
  {
    id: "last_call",
    title: "Last Call",
    description: "Getting one last spin in before tomorrow.",
    icon: "🛏️",
    bonusXp: 20,
    condition: (stats) => {
      const h = new Date().getHours();
      return stats.hasSpun && h >= 22 && h < 0;
    },
  },
  {
    id: "tgif",
    title: "TGIF",
    description: "Spin the wheel on a Friday after 5pm. Weekend vibes!",
    icon: "🎉️",
    bonusXp: 20,
    condition: (stats) => {
      const d = new Date();
      return stats.hasSpun && d.getDay() === 5 && d.getHours() >= 17;
    },
  },
  // --- Theme features ---
  {
    id: "flashbang",
    title: "Flashbang",
    description: "My eyes! Spin the wheel in Light Mode.",
    icon: "😎",
    bonusXp: 5,
    condition: (stats) => stats.hasSpun && !stats.isDark,
  },
  {
    id: "hello_darkness",
    title: "Hello Darkness",
    description: "My old friend. Spin the wheel in Dark Mode.",
    icon: "🌑",
    bonusXp: 5,
    condition: (stats) => stats.hasSpun && stats.isDark,
  },
  {
    id: "taste_the_rainbow",
    title: "Taste the Rainbow",
    description: "Spin using a custom color palette.",
    icon: "🌈",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && stats.isCustomColors,
  },
  {
    id: "light_switch_rave",
    title: "Light Switch Rave",
    description: "My eyes! Toggle between Light and Dark mode 10 times rapidly.",
    icon: "💡",
    bonusXp: 10,
    condition: (stats) => stats.rapidThemeToggles >= 10,
  },
  // --- AI features ---
  {
    id: "ghost_in_the_machine",
    title: "Ghost in the Machine",
    description: "Robots are deciding your lunch now. Generate a list using the AI Sparkle button.",
    icon: "🤖",
    bonusXp: 50,
    condition: (stats) => stats.usedAI,
  },
  {
    id: "press_secretary",
    title: "Press Secretary",
    description: "Let the AI do the talking. Use the AI Announce Winner feature.",
    icon: "📢",
    bonusXp: 50,
    condition: (stats) => stats.usedAIAnnounce,
  },
  // --- Meta Achievements ---
  {
    id: "almost_there",
    title: "Almost There",
    description: "Unlocked 20 achievements. Keep going!",
    icon: "🏅",
    bonusXp: 100,
    condition: (stats) => stats.unlockedCount >= 20,
  },
  {
    id: "halfway_hero",
    title: "Halfway Hero",
    description: "50 percent of achievements unlocked. Statistically impressive. Emotionally questionable.",
    icon: "😤",
    bonusXp: 200,
    condition: (stats) => stats.unlockedCount >= Math.floor(ACHIEVEMENTS.length / 2),
  },
  {
    id: "legendary_grindlord_80",
    title: "Legendary Grindlord",
    description: "You have cleared 80 percent of all achievements. The grind is no longer a choice. It is your destiny.",
    icon: "🎖️",
    bonusXp: 300,
    condition: (stats) => stats.unlockedCount >= Math.floor(ACHIEVEMENTS.length * 0.8),
  },
  {
    id: "the_completionist",
    title: "The Completionist",
    description:
      "You did it! All achievements unlocked! The ultimate reward for the ultimate player.",
    icon: "💎",
    bonusXp: 5000,
    condition: (stats) => stats.unlockedCount >= ACHIEVEMENTS.length - 1,
  },
  // --- Easter Eggs ---
  {
    id: "voided_warranty",
    title: "Voided Warranty",
    description: "You pushed the limits and paid the price.",
    icon: "💀",
    bonusXp: 100,
    condition: (stats) => stats.isBroken,
  },
  {
    id: "credit_where_due",
    title: "Credit Where Due",
    description: "Discovered the maker of the app.",
    icon: "🥚",
    bonusXp: 200,
    condition: (stats) => stats.winnerId === "@author",
  },
  {
    id: "lore_master",
    title: "Lore Master",
    description: "You actually read the backstory? Impressive.",
    icon: "📖",
    bonusXp: 300,
    condition: (stats) => stats.winnerId === "@about",
  },
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
