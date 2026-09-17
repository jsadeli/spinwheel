/**
 * Default name for newly created spin lists.
 * @type {string}
 */
export const DEFAULT_LIST_NAME = "Lunch Ideas";

/**
 * Default items for new spin lists.
 * @type {string[]}
 */
export const DEFAULT_LIST_ITEMS = [
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
export const STORAGE_KEYS = {
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
  /** Daily Challenges data */
  DAILY_CHALLENGES: "spinWheel_dailyChallenges",
  /** Coin balance */
  COINS: "spinWheel_coins",
  /** Flapper spring tension preset */
  FLAPPER_TENSION: "spinWheel_flapperTension",
  /** Selected pointer skin */
  POINTER_SKIN: "spinWheel_pointerSkin",
};

/**
 * Available theme options for the application.
 * @type {Object<string, string>}
 */
export const THEMES = {
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
export const TICK_SOUNDS = {
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
 * Flapper spring tension presets.
 *
 * Tension is how hard the pointer fights the wheel: a stiff spring brakes harder on every
 * pin, holds the wheel longer at the last crest, and rolls it further back when it fails
 * to climb. It does move which pin the wheel stalls on, so every setting is gated through
 * tools/physics-sim.mjs to confirm it does not bias the odds.
 * @type {Object<string, string>}
 */
export const FLAPPER_TENSIONS = {
  /** Barely notices the pins; the wheel glides. */
  LIGHT: "light",
  /** Balanced default. */
  NORMAL: "normal",
  /** Audible chatter and a long hold at the final crest. */
  STRONG: "strong",
  /** Slams the wheel around; frequent stalls and rollbacks. */
  BRUTAL: "brutal",
};

/**
 * Pointer skins. Each skin is a physical object, not just a picture: its multipliers feed
 * straight into the flapper solver, so a heavy sword really does brake harder than a laser.
 * A cosmetic must never move a player's odds, so each skin is gated through
 * tools/physics-sim.mjs alongside the tension presets.
 * `color` is the CSS border color used for the pointer triangle.
 * @type {Object<string, {id: string, label: string, color: string, tensionMul: number, massMul: number, dampingMul: number}>}
 */
export const POINTER_SKINS = {
  CLASSIC: {
    id: "classic",
    label: "Classic",
    color: "#dc2626",
    tensionMul: 1,
    massMul: 1,
    dampingMul: 1,
  },
  SWORD: {
    id: "sword",
    label: "Sword",
    color: "#94a3b8",
    tensionMul: 1.3,
    massMul: 1.8,
    dampingMul: 0.8,
  },
  FEATHER: {
    id: "feather",
    label: "Feather",
    color: "#38bdf8",
    tensionMul: 0.85,
    massMul: 0.5,
    dampingMul: 1.3,
  },
  LASER: {
    id: "laser",
    label: "Laser",
    color: "#a855f7",
    tensionMul: 0.75,
    massMul: 0.3,
    dampingMul: 2.2,
  },
};

/**
 * Color assignment modes for wheel segments.
 * @type {Object<string, string>}
 */
export const COLOR_ASSIGNMENT_MODE = {
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
export const AI_VOICES = {
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
export const TAB_NAMES = {
  /** Input/list editing tab */
  INPUTS: "inputs",
  /** Spin history tab */
  HISTORY: "history",
  /** XP and achievements tab */
  PROGRESS: "progress",
};

/**
 * Minimum level required to unlock Daily Challenges.
 * @type {number}
 */
export const DAILY_CHALLENGE_LEVEL = 8;

/**
 * Hour of the day (0-23) when daily challenges reset.
 * @type {number}
 */
export const DAILY_CHALLENGE_RESET_HOUR = 0;

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

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.DEFAULT_LIST_NAME = DEFAULT_LIST_NAME;
  window.DEFAULT_LIST_ITEMS = DEFAULT_LIST_ITEMS;
  window.STORAGE_KEYS = STORAGE_KEYS;
  window.THEMES = THEMES;
  window.TICK_SOUNDS = TICK_SOUNDS;
  window.FLAPPER_TENSIONS = FLAPPER_TENSIONS;
  window.POINTER_SKINS = POINTER_SKINS;
  window.COLOR_ASSIGNMENT_MODE = COLOR_ASSIGNMENT_MODE;
  window.AI_VOICES = AI_VOICES;
  window.TOAST_DURATION = TOAST_DURATION;
  window.TAB_NAMES = TAB_NAMES;
  window.DAILY_CHALLENGE_LEVEL = DAILY_CHALLENGE_LEVEL;
  window.DAILY_CHALLENGE_RESET_HOUR = DAILY_CHALLENGE_RESET_HOUR;
  window.GITHUB_LINK = GITHUB_LINK;
  window.SPINWHEEL_REPO = SPINWHEEL_REPO;
}
