const defaultListName = "Lunch Ideas";

const defaultListItems = [
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

const storageKeys = {
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

const themes = {
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
};

const AIVoices = {
  AOEDE: "Aoede",
  IAPETUS: "Iapetus",
};

const TOAST_DURATION = 5000;

const TabNames = {
  INPUTS: "inputs",
  HISTORY: "history",
  PROGRESS: "progress",
};

const GITHUB_LINK = "https://github.com/samuelkripto"; // universally accessible

// Expose to window
window.defaultListName = defaultListName;
window.defaultListItems = defaultListItems;
window.storageKeys = storageKeys;
window.themes = themes;
window.AIVoices = AIVoices;
window.TOAST_DURATION = TOAST_DURATION;
window.TabNames = TabNames;
window.GITHUB_LINK = GITHUB_LINK;
