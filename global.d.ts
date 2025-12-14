import React from "react";

declare global {
  interface Window {
    ThemeIcon: React.FC<any>;
    Modal: React.FC<any>;
    // Add other globals here as you encounter errors
    THEMES: {
      AUTO: string;
      LIGHT: string;
      DARK: string;
    };
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
