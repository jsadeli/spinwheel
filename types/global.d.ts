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
import { AchievementManager } from "../scripts/core/AchievementManager.js";
import { ChallengeManager } from "../scripts/core/ChallengeManager.js";
import { GeminiError } from "../scripts/core/GeminiError.js";
import { Stats } from "../scripts/core/Stats.js";
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
  Icon,
  SpinWheelLogo,
  SpinCoinLogo,
  SettingsIcon,
  SlidersIcon,
  Volume2Icon,
  VolumeXIcon,
  ShuffleIcon,
  Trash2Icon,
  TrophyIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  CheckIcon,
  ChevronDownIcon,
  GithubIcon,
  ShareIcon,
  CopyIcon,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  ZapIcon,
  HourglassIcon,
  CodeIcon,
  ScrollIcon,
  HelpCircleIcon,
  SparklesIcon,
  BotIcon,
  KeyIcon,
  PaletteIcon,
  PlusIcon,
  DownloadIcon,
  TrendingUpIcon,
  CloseIcon,
  CirclePlusIcon,
  TrailIcon,
  MusicIcon,
  ElectricIcon,
  WoodIcon,
  MechanicalIcon,
  CrystalGlassIcon,
  AlertTriangleIcon,
  SkullIcon,
  MaleIcon,
  FemaleIcon,
  SwordsIcon,
  ShoppingBagIcon,
  StarIcon,
  SeedlingIcon,
  BoltIcon,
  FlameIcon,
  GemIcon,
  CrownIcon,
  PlayIcon,
  StopIcon,
} from "../scripts/icons.js";
import {
  getLevelTitle,
  XP_CONSTANTS,
  getRequiredXpForLevel,
  calculateLevel,
  getLevelProgress,
} from "../scripts/levels.js";
import {
  playWinSound,
  playJingleBells,
  playTickSound,
  playDefaultTickSound,
  playCrispWoodTickSound,
  playMetallicClankTickSound,
  playCrystalGlassTickSound,
  playFireCrackle,
  playBreakdownSound,
  playPurchaseSound,
  playBigPurchaseSound,
  base64ToWavBlob,
  ChargeSound,
} from "../scripts/sounds.js";
import { defaultColors, beachColors, getPrestigeTheme, getTierColors } from "../scripts/themes.js";
import {
  loadState,
  getRelativeTime,
  parseItems,
  itemsToString,
  copyToClipboard,
  isEmoji,
  parseWinnerString,
} from "../scripts/utils.js";
import { drawWheel, updatePointer } from "../scripts/wheel.js";

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
    // AchievementManager (AchievementManager.js)
    AchievementManager: typeof AchievementManager;
    // ChallengeManager (ChallengeManager.js)
    ChallengeManager: typeof ChallengeManager;
    // GeminiError (GeminiError.js)
    GeminiError: typeof GeminiError;
    // Stats (Stats.js)
    Stats: typeof Stats;
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
    // Icons (icons.js)
    Icon: typeof Icon;
    SpinWheelLogo: typeof SpinWheelLogo;
    SpinCoinLogo: typeof SpinCoinLogo;
    SettingsIcon: typeof SettingsIcon;
    SlidersIcon: typeof SlidersIcon;
    Volume2Icon: typeof Volume2Icon;
    VolumeXIcon: typeof VolumeXIcon;
    ShuffleIcon: typeof ShuffleIcon;
    Trash2Icon: typeof Trash2Icon;
    TrophyIcon: typeof TrophyIcon;
    SunIcon: typeof SunIcon;
    MoonIcon: typeof MoonIcon;
    MonitorIcon: typeof MonitorIcon;
    CheckIcon: typeof CheckIcon;
    ChevronDownIcon: typeof ChevronDownIcon;
    GithubIcon: typeof GithubIcon;
    ShareIcon: typeof ShareIcon;
    CopyIcon: typeof CopyIcon;
    ClockIcon: typeof ClockIcon;
    EyeIcon: typeof EyeIcon;
    EyeOffIcon: typeof EyeOffIcon;
    ZapIcon: typeof ZapIcon;
    HourglassIcon: typeof HourglassIcon;
    CodeIcon: typeof CodeIcon;
    ScrollIcon: typeof ScrollIcon;
    HelpCircleIcon: typeof HelpCircleIcon;
    SparklesIcon: typeof SparklesIcon;
    BotIcon: typeof BotIcon;
    KeyIcon: typeof KeyIcon;
    PaletteIcon: typeof PaletteIcon;
    PlusIcon: typeof PlusIcon;
    DownloadIcon: typeof DownloadIcon;
    TrendingUpIcon: typeof TrendingUpIcon;
    CloseIcon: typeof CloseIcon;
    CirclePlusIcon: typeof CirclePlusIcon;
    TrailIcon: typeof TrailIcon;
    MusicIcon: typeof MusicIcon;
    ElectricIcon: typeof ElectricIcon;
    WoodIcon: typeof WoodIcon;
    MechanicalIcon: typeof MechanicalIcon;
    CrystalGlassIcon: typeof CrystalGlassIcon;
    AlertTriangleIcon: typeof AlertTriangleIcon;
    SkullIcon: typeof SkullIcon;
    MaleIcon: typeof MaleIcon;
    FemaleIcon: typeof FemaleIcon;
    SwordsIcon: typeof SwordsIcon;
    ShoppingBagIcon: typeof ShoppingBagIcon;
    StarIcon: typeof StarIcon;
    SeedlingIcon: typeof SeedlingIcon;
    BoltIcon: typeof BoltIcon;
    FlameIcon: typeof FlameIcon;
    GemIcon: typeof GemIcon;
    CrownIcon: typeof CrownIcon;
    PlayIcon: typeof PlayIcon;
    StopIcon: typeof StopIcon;
    // Levels (levels.js)
    getLevelTitle: typeof getLevelTitle;
    XP_CONSTANTS: typeof XP_CONSTANTS;
    getRequiredXpForLevel: typeof getRequiredXpForLevel;
    calculateLevel: typeof calculateLevel;
    getLevelProgress: typeof getLevelProgress;
    // Sounds (sounds.js)
    playWinSound: typeof playWinSound;
    playJingleBells: typeof playJingleBells;
    playTickSound: typeof playTickSound;
    playDefaultTickSound: typeof playDefaultTickSound;
    playCrispWoodTickSound: typeof playCrispWoodTickSound;
    playMetallicClankTickSound: typeof playMetallicClankTickSound;
    playCrystalGlassTickSound: typeof playCrystalGlassTickSound;
    playFireCrackle: typeof playFireCrackle;
    playBreakdownSound: typeof playBreakdownSound;
    playPurchaseSound: typeof playPurchaseSound;
    playBigPurchaseSound: typeof playBigPurchaseSound;
    base64ToWavBlob: typeof base64ToWavBlob;
    ChargeSound: typeof ChargeSound;
    // Themes (themes.js)
    defaultColors: typeof defaultColors;
    beachColors: typeof beachColors;
    getPrestigeTheme: typeof getPrestigeTheme;
    getTierColors: typeof getTierColors;
    // Utilities (utils.js)
    loadState: typeof loadState;
    getRelativeTime: typeof getRelativeTime;
    parseItems: typeof parseItems;
    itemsToString: typeof itemsToString;
    copyToClipboard: typeof copyToClipboard;
    isEmoji: typeof isEmoji;
    parseWinnerString: typeof parseWinnerString;
    // Wheel (wheel.js)
    drawWheel: typeof drawWheel;
    updatePointer: typeof updatePointer;
  }
}
