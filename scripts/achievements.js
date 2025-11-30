import { AIVoices } from "/scripts/configs.js";

// Achievement Definitions
export const AchievementFilters = {
  ALL: "all",
  UNLOCKED: "unlocked",
  LOCKED: "locked",
};

export const ACHIEVEMENTS = [
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
    id: "the_long_haul",
    title: "The Long Haul",
    description: "500 spins logged. Your wrist endurance is suspicious.",
    icon: "🚚️",
    bonusXp: 500,
    condition: (stats) => stats.spins >= 500,
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
    id: "button_masher",
    title: "Button Masher",
    description: "Hit the spin button 200 times in a single hour. No cooldown. No mercy.",
    icon: "👊",
    bonusXp: 200,
    condition: (stats) => stats.spinsInLastHour >= 200,
  },
  {
    id: "a_taste_of_fortune",
    title: "A Taste of Fortune",
    description:
      "50 spins in one session. The cookie says: 'Your fate is in motion. Keep spinning.'",
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
    title: "Jesus Take the Wheel",
    description: 'Spin the wheel while in "Mystery Mode".',
    icon: "🙏",
    bonusXp: 10,
    condition: (stats) => stats.mysteryMode && stats.hasSpun,
  },
  {
    id: "devil_take_the_wheel",
    title: "Devil Take the Wheel",
    description: "Temptation wins this round. Could not wait for the reveal and peeked.",
    icon: "😈",
    bonusXp: 66,
    condition: (stats) => stats.mysteryModeCancelledDuringSpin,
  },
  // --- Spin Sounds ---
  {
    id: "silence_is_golden",
    title: "Silence Is Golden",
    description: "Shhh, the wheel is thinking. Complete a spin with the sound muted.",
    icon: "🔇",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && stats.soundMuted,
  },
  {
    id: "click_clack",
    title: "Click Clack",
    description: "Keeping it classic. Completed a spin with the default electric click.",
    icon: "🖱️",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && !stats.soundMuted && stats.tickSound === "default",
  },
  {
    id: "knock_on_wood",
    title: "Knock on Wood",
    description: "Superstitious? Completed a spin with the crisp wooden sound.",
    icon: "🪵",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && !stats.soundMuted && stats.tickSound === "crisp",
  },
  {
    id: "heavy_metal",
    title: "Heavy Metal",
    description:
      "Industrial grade decision making. Completed a spin with the metallic clank sound.",
    icon: "⚙️",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && !stats.soundMuted && stats.tickSound === "metallic",
  },
  {
    id: "crystal_glass",
    title: "Crystal Glass",
    description: "Luxurious decision making. Completed a spin with the crystal glass sound.",
    icon: "🍷️",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && !stats.soundMuted && stats.tickSound === "crystal",
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
    id: "afk",
    title: "AFK",
    description: "Welcome back! You spun the wheel after being away for 10 minutes.",
    icon: "💤",
    bonusXp: 20,
    condition: (stats) => stats.timeSinceLastSpin >= 600000, // milliseconds
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
    description: "500 canceled spins. The wheel bows to your indecision. Subjects tremble.",
    icon: "🛑",
    bonusXp: 500,
    condition: (stats) => stats.cancelledSpins >= 500,
  },
  {
    id: "premature_nope",
    title: "Premature Nope",
    description: "Ruined a perfectly good spin just before the climax, because... nope.",
    icon: "🏃",
    bonusXp: 20,
    condition: (stats) => stats.isCancelledSpin && stats.spinPercentage >= 0.8,
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
    condition: (stats) => stats.level >= 1 && stats.hasSpun,
  },
  {
    id: "one_small_step",
    title: "One Small Step",
    description:
      "Lift-off achieved. Your spinning career has officially cleared the tutorial zone.",
    icon: "🚀",
    bonusXp: 5,
    condition: (stats) => stats.level >= 2 && stats.hasSpun,
  },
  {
    id: "spinner_adept",
    title: "Spinner Adept",
    description:
      "Your skill in the spin arts grows with each rotation. You now live in the 3rd circle of spinner knowledge.",
    icon: "🎯",
    bonusXp: 10,
    condition: (stats) => stats.level >= 3 && stats.hasSpun,
  },
  {
    id: "spinaholic",
    title: "Spinaholic",
    description:
      "Crossed the threshold where casuals stop and enthusiasts begin. 4th gear engaged.",
    icon: "🎡",
    bonusXp: 10,
    condition: (stats) => stats.level >= 4 && stats.hasSpun,
  },
  {
    id: "phd_in_roundabout_solutions",
    title: "PhD in Roundabout Solutions",
    description:
      "Risen high enough to qualify for advanced coursework. Only 5% survive this syllabus.",
    icon: "🎓",
    bonusXp: 20,
    condition: (stats) => stats.level >= 5 && stats.hasSpun,
  },
  {
    id: "chaos_technician",
    title: "Chaos Technician",
    description:
      "Reached the domain where only 6 hands are steady enough to manage this much entropy.",
    icon: "👷",
    bonusXp: 30,
    condition: (stats) => stats.level >= 6 && stats.hasSpun,
  },
  {
    id: "confetti",
    title: "Party Mode",
    description: "Authorized to trigger premium celebration protocols reserved for the 7th tier.",
    icon: "🎊",
    bonusXp: 50,
    condition: (stats) => stats.level >= 7 && stats.hasSpun,
  },
  {
    id: "mission_probability",
    title: "Mission: Probability",
    description: "Your mission, should you choose to accept it, is to get the 8th file.",
    icon: "🕶️",
    bonusXp: 100,
    condition: (stats) => stats.level >= 8 && stats.hasSpun,
  },
  {
    id: "wheel_whisperer",
    title: "Wheel Whisperer",
    description: "Ascended to the 9th rank, officially qualifies you to talk to spinning objects.",
    icon: "🛞️",
    bonusXp: 200,
    condition: (stats) => stats.level >= 9 && stats.hasSpun,
  },
  {
    id: "the_chosen_one",
    title: "The Chosen One",
    description: "Stepped into the 10th circle of legend. Please, go touch some grass.",
    icon: "🌟",
    bonusXp: 3000,
    condition: (stats) => stats.level >= 10 && stats.hasSpun,
  },
  {
    id: "transcendence_protocol",
    title: "Transcendence Protocol",
    description: "All parameters exceeded. Divinity attained. You now exist in the 11th echelon.",
    icon: "♾️",
    bonusXp: 5000,
    condition: (stats) => stats.level >= 11 && stats.hasSpun,
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
    id: "glitch_in_the_matrix",
    title: "Glitch in the Matrix",
    description:
      "Probability has been rewritten. The Architect approves your 50 identical outcomes.",
    icon: "🐈‍⬛",
    bonusXp: 500,
    condition: (stats) => stats.consecutiveWins >= 50,
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
    description:
      "Spin a list where every option is the same. (We admire your commitment to the illusion of choice.)",
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
    id: "history_hoarder",
    title: "History Hoarder",
    description: "You have kept 500 items in your history. Digital packrat status confirmed.",
    icon: "📚",
    bonusXp: 500,
    condition: (stats) => stats.historyLength >= 500,
  },
  {
    id: "progress_enthusiast",
    title: "Progress Enthusiast",
    description:
      "More than 100 visits to your records. You inspect that tab like it owes you money.",
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
  // --- Spin Trail Effect ---
  {
    id: "silver_spark",
    title: "Silver Spark",
    description:
      "Spun while radiating that early-stage metallic shimmer. Fresh, bright, and just getting started.",
    icon: "🪙",
    bonusXp: 5,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 1,
  },
  {
    id: "trailblazer",
    title: "Trailblazer",
    description: "Spin with the trail effect enabled. Leaving your mark on the wheel.",
    icon: "✨",
    bonusXp: 10,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 3,
  },
  {
    id: "emerald_swirl",
    title: "Emerald Swirl",
    description:
      "A vivid green arc followed your spin. That vibrant hue appears only once you have ventured deep enough.",
    icon: "💚",
    bonusXp: 20,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 5,
  },
  {
    id: "topaz_trace",
    title: "Topaz Trace",
    description:
      "Spun with a warm, gem-bright yellow streak trailing you. Only mid-ascenders radiate this kind of polish.",
    icon: "🔷",
    bonusXp: 40,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 7,
  },
  {
    id: "ruby_reverb",
    title: "Ruby Reverb",
    description:
      "Your trail pulsed with a deep crimson glow. That shade appears only to those approaching the summit.",
    icon: "♦️",
    bonusXp: 60,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 8,
  },
  {
    id: "golden_slipstream",
    title: "Golden Slipstream",
    description:
      "Radiant golden trail reserved for those standing just shy of mastery. The wheel now recognizes royalty.",
    icon: "💫",
    bonusXp: 100,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 9,
  },
  {
    id: "quantum_wake",
    title: "Quantum Wake",
    description:
      "Your spin left a quantum distortion trail behind. Probability is filing a complaint.",
    icon: "⚛️",
    bonusXp: 500,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 10,
  },
  {
    id: "cosmic_drift",
    title: "Cosmic Drift",
    description:
      "Your trail shimmered with stardust patterns not found in any earthly spectrum. Only those who spin beyond the divine ever see this glow.",
    icon: "🌌",
    bonusXp: 1000,
    condition: (stats) => stats.hasSpun && stats.trailEnabled && stats.level >= 11,
  },
  // --- AI features ---
  {
    id: "ghost_in_the_machine",
    title: "Ghost in the Machine",
    description: "Robots are deciding your lunch now. Generate a list using the AI Sparkle button.",
    icon: "🤖",
    bonusXp: 100,
    condition: (stats) => stats.usedAI,
  },
  {
    id: "press_secretary",
    title: "Press Secretary",
    description: "Let the AI do the talking. Use the AI Announce Winner feature.",
    icon: "📢",
    bonusXp: 100,
    condition: (stats) => stats.usedAIAnnounce,
  },
  {
    id: "her_voice",
    title: "Her Voice",
    description: "Invite Aoede to speak. A soft breeze carries every word.",
    icon: "🌸",
    bonusXp: 10,
    condition: (stats) => stats.usedAIAnnounce && stats.aiVoice === AIVoices.AOEDE,
  },
  {
    id: "his_voice",
    title: "His Voice",
    description: "Hear Iapetus in full clarity. Strong, resonant, and unwavering.",
    icon: "🎙️",
    bonusXp: 10,
    condition: (stats) => stats.usedAIAnnounce && stats.aiVoice === AIVoices.IAPETUS,
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
    description:
      "50 percent of achievements unlocked. Statistically impressive. Emotionally questionable.",
    icon: "😤",
    bonusXp: 200,
    condition: (stats) => stats.unlockedCount >= Math.floor(ACHIEVEMENTS.length / 2),
  },
  {
    id: "legendary_grindlord_80",
    title: "Legendary Grindlord",
    description:
      "You have cleared 80 percent of all achievements. The grind is no longer a choice. It is your destiny.",
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
    bonusXp: 9999,
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
    id: "the_cake_is_a_lie",
    title: "The Cake Is a Lie",
    description: "You have discovered the truth: there is no cake.",
    icon: "🍰",
    bonusXp: 100,
    condition: (stats) => {
      const cakeEmojis = ["🍰", "🎂", "🧁", "🍥"];
      return cakeEmojis.some((emoji) => stats.winnerId && stats.winnerId.includes(emoji));
    },
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
