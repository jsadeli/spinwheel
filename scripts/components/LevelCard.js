// @ts-ignore
import React from "react";

const { getLevelTitle } = window;

/**
 * Displays the user's current level, XP progress, and prestige theme effects.
 * Handles special visual states for "Cosmic" levels (11+) and "Corrupted" (cheat) modes.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.levelInfo - Object containing level details (level, currentLevelXp, requiredLevelXp, progressPercent).
 * @param {number} props.xp - Total accumulated XP.
 * @param {boolean} props.isCorrupted - Whether the user has enabled cheats/corruption.
 * @param {Object} props.prestigeTheme - Theme configuration object for the current level.
 */
const LevelCard = ({ levelInfo, xp, isCorrupted, prestigeTheme }) => {
  const isCosmic = levelInfo.level >= 11;

  // Corrupted State Override
  if (isCorrupted) {
    return (
      <div className="relative overflow-hidden rounded-xl mb-4 group shadow-[0_0_15px_rgba(239,68,68,0.6)] border-2 border-red-500/50">
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        {/* Glitch Effect Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ff0000_10px,#ff0000_11px)] animate-[pulse_0.1s_infinite]"></div>
        </div>

        <div className="relative z-10 p-5 text-left">
          <div className="flex items-center justify-start mb-4 space-x-3">
            <div className="p-2 bg-red-900/50 rounded-full shadow-sm animate-pulse">
              <AlertTriangleIcon size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-red-500 font-mono tracking-tighter animate-[pulse_2s_infinite]">
                SYSTEM COMPROMISED
              </h3>
              <p className="text-xs text-red-400 font-mono font-bold mt-1 uppercase tracking-widest">
                Level {levelInfo.level} <span className="mx-2 text-red-600">•</span> {xp} XP [MODDED]
              </p>
            </div>
          </div>

          {/* Corrupted Progress Bar */}
          <div className="relative z-10 h-5 w-full bg-red-900/30 rounded-full overflow-hidden border border-red-500/30">
            <div
              className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-1000 ease-out"
              style={{ width: `${levelInfo.progressPercent}%` }}
            >
              <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)] opacity-20"></div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between text-[10px] font-bold text-red-500 font-mono opacity-80 mt-2 px-1 uppercase tracking-wider">
            <span>ERR_OVERFLOW: {Math.floor(levelInfo.currentLevelXp)}</span>
            <span>TARGET: {Math.floor(levelInfo.requiredLevelXp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl mb-4 group ${
        isCosmic
          ? "shadow-[0_0_60px_rgba(139,92,246,0.4)] dark:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
          : prestigeTheme.shadow
      }`}
    >
      {/* Dynamic Border/Background */}
      {isCosmic ? (
        <>
          {/* Cosmic Glow (Behind) */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-60 dark:opacity-75 animate-pulse"></div>
          {/* Cosmic Border (Sharp) */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-40 dark:opacity-50"></div>
        </>
      ) : (
        <div
          className={`absolute inset-0 ${prestigeTheme.border} opacity-100 dark:opacity-80`}
        ></div>
      )}

      <div
        className={`relative m-[2px] ${
          isCosmic ? "bg-indigo-50 dark:bg-gray-900" : prestigeTheme.cardBg
        } rounded-[10px] p-5 text-left transition-colors duration-300 overflow-hidden`}
      >
        {/* Cosmic Background Effects */}
        {isCosmic && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[10px]">
            {/* Stars / Dust Pattern - Inverted for Light Mode */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI4MCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')] opacity-20 dark:opacity-30 invert dark:invert-0 animate-[pulse_4s_infinite]"></div>
            {/* Nebulas */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        )}

        <div className={`relative z-10 flex items-center justify-start mb-4 space-x-3`}>
          <div
            className={`p-2 ${prestigeTheme.iconBg} rounded-full shadow-sm transition-colors duration-300`}
          >
            <TrophyIcon
              size={24}
              className={`${prestigeTheme.iconColor} ${
                levelInfo.level >= 9 ? "animate-bounce" : ""
              }`}
            />
          </div>
          <div>
            <h3
              className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${prestigeTheme.titleGradient} leading-none`}
            >
              {getLevelTitle(levelInfo.level)}
            </h3>
            <p
              className={`text-sm ${prestigeTheme.textColor} font-bold mt-1 uppercase tracking-widest text-xs`}
            >
              Level {levelInfo.level} <span className={`mx-2 ${prestigeTheme.accentColor}`}>•</span>{" "}
              {xp} XP
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 h-5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${prestigeTheme.barGradient} transition-all duration-1000 ease-out bg-[length:200%_100%] animate-[liquidFlow_3s_ease_infinite] overflow-hidden`}
            style={{ width: `${levelInfo.progressPercent}%` }}
          >
            {/* Shine effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent"></div>

            {/* High Tier Shimmer Overlay (Level 10+) */}
            {levelInfo.level >= 10 && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"></div>
            )}
          </div>
        </div>

        <div
          className={`relative z-10 flex justify-between text-[10px] font-bold ${prestigeTheme.textColor} opacity-60 mt-2 px-1 uppercase tracking-wider`}
        >
          <span>
            {Math.floor(levelInfo.currentLevelXp)} XP ({Math.round(levelInfo.progressPercent)}%)
          </span>
          <span>{Math.floor(levelInfo.requiredLevelXp)} XP</span>
        </div>
      </div>
    </div>
  );
};

// Expose to window (needed for Babel Standalone)
window.LevelCard = LevelCard;
