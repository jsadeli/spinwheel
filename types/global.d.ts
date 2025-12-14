import React from "react";
import {
  DEFAULT_LIST_NAME,
  DEFAULT_LIST_ITEMS,
  STORAGE_KEYS,
  THEMES,
  TICK_SOUNDS,
  COLOR_ASSIGNMENT_MODE,
  AI_VOICES,
  TOAST_DURATION,
  TAB_NAMES,
  DAILY_CHALLENGE_LEVEL,
  DAILY_CHALLENGE_RESET_HOUR,
  GITHUB_LINK,
  SPINWHEEL_REPO,
} from "../scripts/configs.js";
import {
  loadState,
  getRelativeTime,
  parseItems,
  itemsToString,
  copyToClipboard,
  isEmoji,
  parseWinnerString,
} from "../scripts/utils.js";

declare global {
  interface Window {
    ThemeIcon: React.FC<any>;
    Modal: React.FC<any>;
    // Icons
    Icon: React.FC<any>;
    SpinWheelLogo: React.FC<any>;
    SpinCoinLogo: React.FC<any>;
    SettingsIcon: React.FC<any>;
    SlidersIcon: React.FC<any>;
    Volume2Icon: React.FC<any>;
    VolumeXIcon: React.FC<any>;
    ShuffleIcon: React.FC<any>;
    Trash2Icon: React.FC<any>;
    TrophyIcon: React.FC<any>;
    SunIcon: React.FC<any>;
    MoonIcon: React.FC<any>;
    MonitorIcon: React.FC<any>;
    CheckIcon: React.FC<any>;
    ChevronDownIcon: React.FC<any>;
    GithubIcon: React.FC<any>;
    ShareIcon: React.FC<any>;
    CopyIcon: React.FC<any>;
    ClockIcon: React.FC<any>;
    EyeIcon: React.FC<any>;
    EyeOffIcon: React.FC<any>;
    ZapIcon: React.FC<any>;
    HourglassIcon: React.FC<any>;
    CodeIcon: React.FC<any>;
    ScrollIcon: React.FC<any>;
    HelpCircleIcon: React.FC<any>;
    SparklesIcon: React.FC<any>;
    BotIcon: React.FC<any>;
    KeyIcon: React.FC<any>;
    PaletteIcon: React.FC<any>;
    PlusIcon: React.FC<any>;
    DownloadIcon: React.FC<any>;
    TrendingUpIcon: React.FC<any>;
    CloseIcon: React.FC<any>;
    CirclePlusIcon: React.FC<any>;
    TrailIcon: React.FC<any>;
    MusicIcon: React.FC<any>;
    ElectricIcon: React.FC<any>;
    WoodIcon: React.FC<any>;
    MechanicalIcon: React.FC<any>;
    CrystalGlassIcon: React.FC<any>;
    AlertTriangleIcon: React.FC<any>;
    SkullIcon: React.FC<any>;
    MaleIcon: React.FC<any>;
    FemaleIcon: React.FC<any>;
    SwordsIcon: React.FC<any>;
    ShoppingBagIcon: React.FC<any>;
    StarIcon: React.FC<any>;
    SeedlingIcon: React.FC<any>;
    BoltIcon: React.FC<any>;
    FlameIcon: React.FC<any>;
    GemIcon: React.FC<any>;
    CrownIcon: React.FC<any>;
    PlayIcon: React.FC<any>;
    StopIcon: React.FC<any>;
    // Configurations (configs.js)
    THEMES: typeof THEMES;
    DEFAULT_LIST_NAME: typeof DEFAULT_LIST_NAME;
    DEFAULT_LIST_ITEMS: typeof DEFAULT_LIST_ITEMS;
    STORAGE_KEYS: typeof STORAGE_KEYS;
    TICK_SOUNDS: typeof TICK_SOUNDS;
    COLOR_ASSIGNMENT_MODE: typeof COLOR_ASSIGNMENT_MODE;
    AI_VOICES: typeof AI_VOICES;
    TOAST_DURATION: typeof TOAST_DURATION;
    TAB_NAMES: typeof TAB_NAMES;
    DAILY_CHALLENGE_LEVEL: typeof DAILY_CHALLENGE_LEVEL;
    DAILY_CHALLENGE_RESET_HOUR: typeof DAILY_CHALLENGE_RESET_HOUR;
    GITHUB_LINK: typeof GITHUB_LINK;
    SPINWHEEL_REPO: typeof SPINWHEEL_REPO;
    // Achievements (achievements.js)
    AchievementFilters: {
      ALL: string;
      UNLOCKED: string;
      LOCKED: string;
    };
    // Utilities (utils.js)
    loadState: typeof loadState;
    getRelativeTime: typeof getRelativeTime;
    parseItems: typeof parseItems;
    itemsToString: typeof itemsToString;
    copyToClipboard: typeof copyToClipboard;
    isEmoji: typeof isEmoji;
    parseWinnerString: typeof parseWinnerString;
  }
}
