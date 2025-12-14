import React from "react";
import { AchievementsList } from "../scripts/components/AchievementsList.js";
import { ChallengesList } from "../scripts/components/ChallengesList.js";
import { CoinChip } from "../scripts/components/CoinChip.js";
import { CoinStoreModal } from "../scripts/components/CoinStoreModal.js";
import { LevelCard } from "../scripts/components/LevelCard.js";
import { Modal } from "../scripts/components/Modal.js";
import { OutOfOrderOverlay } from "../scripts/components/OutOfOrderOverlay.js";
import { ThemeIcon } from "../scripts/components/ThemeIcon.js";
import { Toast } from "../scripts/components/Toast.js";
import { WinnerModal } from "../scripts/components/WinnerModal.js";
import { AchievementFilters, ACHIEVEMENTS } from "../scripts/achievements.js";
import { generateListFromGemini, generateSpeechFromGemini } from "../scripts/ai.js";
import { fireConfetti, fireSnowfall, spawnSmoke, drawWheelTrail } from "../scripts/animations.js";
import { DAILY_CHALLENGES } from "../scripts/challenges.js";
import { lerpColor, parseCustomColors, getItemColor } from "../scripts/colors.js";
import { processCommandCodes } from "../scripts/commands.js";
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
    // AchievementsList (AchievementsList.js)
    AchievementsList: typeof AchievementsList;
    // ChallengesList (ChallengesList.js)
    ChallengesList: typeof ChallengesList;
    // CoinChip (CoinChip.js)
    CoinChip: typeof CoinChip;
    // CoinStoreModal (CoinStoreModal.js)
    CoinStoreModal: typeof CoinStoreModal;
    // LevelCard (LevelCard.js)
    LevelCard: typeof LevelCard;
    // Modal (Modal.js)
    Modal: typeof Modal;
    // OutOfOrderOverlay (OutOfOrderOverlay.js)
    OutOfOrderOverlay: typeof OutOfOrderOverlay;
    // ThemeIcon (ThemeIcon.js)
    ThemeIcon: typeof ThemeIcon;
    // Toast (Toast.js)
    Toast: typeof Toast;
    // WinnerModal (WinnerModal.js)
    WinnerModal: typeof WinnerModal;
    // Achievements (achievements.js)
    AchievementFilters: typeof AchievementFilters;
    ACHIEVEMENTS: typeof ACHIEVEMENTS;
    // AI (ai.js)
    generateListFromGemini: typeof generateListFromGemini;
    generateSpeechFromGemini: typeof generateSpeechFromGemini;
    // Animations (animations.js)
    fireConfetti: typeof fireConfetti;
    fireSnowfall: typeof fireSnowfall;
    spawnSmoke: typeof spawnSmoke;
    drawWheelTrail: typeof drawWheelTrail;
    // Challenges (challenges.js)
    DAILY_CHALLENGES: typeof DAILY_CHALLENGES;
    // Colors (colors.js)
    lerpColor: typeof lerpColor;
    parseCustomColors: typeof parseCustomColors;
    getItemColor: typeof getItemColor;
    // Commands (commands.js)
    processCommandCodes: typeof processCommandCodes;
    // Icons (icons.js)
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
