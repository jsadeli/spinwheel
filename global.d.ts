import React from "react";

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
    // Themes
    THEMES: {
      AUTO: string;
      LIGHT: string;
      DARK: string;
    };
    // Achievements
    AchievementFilters: {
      ALL: string;
      UNLOCKED: string;
      LOCKED: string;
    };
    // utils.js
    loadState: <T>(key: string, defaultValue: T) => T;
    getRelativeTime: (date: Date | string | number) => string;
    parseItems: (text: string) => Array<{ text: string; weight: number; original: string }>;
    itemsToString: (itemsArray: Array<{ text: string; weight: number }>) => string;
    copyToClipboard: (text: string, setIsCopied: (copied: boolean) => void) => void;
    isEmoji: (str: string) => boolean;
    parseWinnerString: (text: string) => Array<{ text: string; isEmoji: boolean | null }>;
  }
}
