// Configs Module
export const defaultListName = "Lunch Ideas";

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

export const storageKeys = {
  SAVED_LISTS: "spinWheel_savedLists",
  INPUTS: "spinWheel_inputs", // Legacy
  ACTIVE_LIST_ID: "spinWheel_activeListId",
  HISTORY: "spinWheel_history",
  SOUND_ENABLED: "spinWheel_sound",
  THEME: "spinWheel_theme",
  SPIN_DURATION: "spinWheel_duration",
  HIDE_LABELS: "spinWheel_hideLabels",
  AI_VOICE_ENABLED: "spinWheel_aiVoice",
  TRAIL_ENABLED: "spinWheel_trailEnabled",
  GEMINI_API_KEY: "spinWheel_apiKey",
  TICK_SOUND: "spinWheel_tickSound",
  COLOR_SETTINGS: "spinWheel_colorSettings",
  COLOR_ASSIGNMENT: "spinWheel_colorAssignment",
  IS_CORRUPTED: "spinWheel_isCorrupted",
  XP: "spinWheel_xp",
  TOTAL_SPINS: "spinWheel_totalSpins",
  CANCELLED_SPINS: "spinWheel_cancelledSpins",
  INPUTS_TAB_VIEWS: "spinWheel_inputsTabViews",
  HISTORY_TAB_VIEWS: "spinWheel_historyTabViews",
  PROGRESS_TAB_VIEWS: "spinWheel_progressTabViews",
  IMPORTED_CODES: "spinWheel_importedCodes",
  ACHIEVEMENTS: "spinWheel_achievements",
  AI_VOICE_SELECTION: "spinWheel_aiVoiceSelection",
};

export const themes = {
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
};

export const TickSounds = {
  DEFAULT: "default",
  CRISP: "crisp",
  METALLIC: "metallic",
  CRYSTAL: "crystal",
};

export const ColorAssignmentMode = {
  DYNAMIC: "dynamic",
  DETERMINISTIC: "deterministic",
};

export const AIVoices = {
  AOEDE: "Aoede",
  IAPETUS: "Iapetus",
};

export const TOAST_DURATION = 5000;

export const TabNames = {
  INPUTS: "inputs",
  HISTORY: "history",
  PROGRESS: "progress",
};

export const GITHUB_LINK = "https://github.com/samuelkripto"; // universally accessible
export const SPINWHEEL_REPO = "https://github.com/samuelkripto/spinwheel";
