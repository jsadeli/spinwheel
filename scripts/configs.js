/**
 * Default name for newly created spin lists.
 * @type {string}
 */
export const defaultListName = "Lunch Ideas";

/**
 * Default items for new spin lists.
 * @type {string[]}
 */
export const defaultListItems = [
  "Pizza",
  "Burger",
  "Sushi",
  "Chicken Sate",
  "Gado-Gado",
  "Pasta",
  "Yakiniku",
  "Ramen",
  "Pad Thai",
  "Sandwich",
  "Fried Rice",
];

/**
 * localStorage keys used throughout the application.
 * All keys are prefixed with "spinWheel_" to avoid conflicts.
 * @type {Object<string, string>}
 */
export const storageKeys = {
  /** Saved spin lists */
  SAVED_LISTS: "spinWheel_savedLists",
  /** Legacy input storage key */
  INPUTS: "spinWheel_inputs",
  /** Currently active list ID */
  ACTIVE_LIST_ID: "spinWheel_activeListId",
  /** Spin history */
  HISTORY: "spinWheel_history",
  /** Sound effects enabled/disabled */
  SOUND_ENABLED: "spinWheel_sound",
  /** Theme preference (auto/light/dark) */
  THEME: "spinWheel_theme",
  /** Spin animation duration in milliseconds */
  SPIN_DURATION: "spinWheel_duration",
  /** Whether to hide wheel segment labels */
  HIDE_LABELS: "spinWheel_hideLabels",
  /** AI voice announcement enabled/disabled */
  AI_VOICE_ENABLED: "spinWheel_aiVoice",
  /** Trail animation enabled/disabled */
  TRAIL_ENABLED: "spinWheel_trailEnabled",
  /** Gemini API key for AI features */
  GEMINI_API_KEY: "spinWheel_apiKey",
  /** Selected tick sound */
  TICK_SOUND: "spinWheel_tickSound",
  /** Custom color settings */
  COLOR_SETTINGS: "spinWheel_colorSettings",
  /** Color assignment mode (dynamic/deterministic) */
  COLOR_ASSIGNMENT: "spinWheel_colorAssignment",
  /** Data corruption flag */
  IS_CORRUPTED: "spinWheel_isCorrupted",
  /** User's current experience points */
  XP: "spinWheel_xp",
  /** Total completed spins */
  TOTAL_SPINS: "spinWheel_totalSpins",
  /** Total cancelled spins */
  CANCELLED_SPINS: "spinWheel_cancelledSpins",
  /** Number of times inputs tab has been viewed */
  INPUTS_TAB_VIEWS: "spinWheel_inputsTabViews",
  /** Number of times history tab has been viewed */
  HISTORY_TAB_VIEWS: "spinWheel_historyTabViews",
  /** Number of times progress tab has been viewed */
  PROGRESS_TAB_VIEWS: "spinWheel_progressTabViews",
  /** Imported shared list codes */
  IMPORTED_CODES: "spinWheel_importedCodes",
  /** Unlocked achievements */
  ACHIEVEMENTS: "spinWheel_achievements",
  /** Selected AI voice (Aoede/Iapetus) */
  AI_VOICE_SELECTION: "spinWheel_aiVoiceSelection",
};

/**
 * Available theme options for the application.
 * @type {Object<string, string>}
 */
export const themes = {
  /** Automatically match system theme */
  AUTO: "auto",
  /** Light theme */
  LIGHT: "light",
  /** Dark theme */
  DARK: "dark",
};

/**
 * Available tick sound effects for the spin wheel.
 * @type {Object<string, string>}
 */
export const TickSounds = {
  /** Default electric click sound */
  DEFAULT: "default",
  /** Crisp wooden knock sound */
  CRISP: "crisp",
  /** Heavy metallic clank sound */
  METALLIC: "metallic",
  /** Luxurious crystal glass sound */
  CRYSTAL: "crystal",
};

/**
 * Color assignment modes for wheel segments.
 * @type {Object<string, string>}
 */
export const ColorAssignmentMode = {
  /** Colors change randomly on each spin */
  DYNAMIC: "dynamic",
  /** Each item always gets the same color */
  DETERMINISTIC: "deterministic",
};

/**
 * Available AI voice options for winner announcements.
 * Uses Google's text-to-speech voice names.
 * @type {Object<string, string>}
 */
export const AIVoices = {
  /** Female voice (Aoede - Greek muse of song) */
  AOEDE: "Aoede",
  /** Male voice (Iapetus - Greek titan) */
  IAPETUS: "Iapetus",
};

/**
 * Duration in milliseconds for toast notifications.
 * @type {number}
 */
export const TOAST_DURATION = 5000;

/**
 * Tab identifiers for the application's main navigation.
 * @type {Object<string, string>}
 */
export const TabNames = {
  /** Input/list editing tab */
  INPUTS: "inputs",
  /** Spin history tab */
  HISTORY: "history",
  /** XP and achievements tab */
  PROGRESS: "progress",
};

/**
 * GitHub profile link for the application author.
 * @type {string}
 */
export const GITHUB_LINK = "https://github.com/samuelkripto";

/**
 * GitHub repository link for this application.
 * @type {string}
 */
export const SPINWHEEL_REPO = "https://github.com/samuelkripto/spinwheel";
