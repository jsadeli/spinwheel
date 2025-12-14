// @ts-ignore
import React from "react";

const { parseWinnerString } = window;

/**
 * Displays the winner announcement modal.
 * Features special themes for high levels (Cosmic) and Easter eggs for specific winner names.
 *
 * @param {Object} props - Component props.
 * @param {string} props.winner - The text of the winning item.
 * @param {Object} props.levelInfo - User's level information (affects theme).
 * @param {Object} props.prestigeTheme - Theme configuration for the current level.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onRemoveAndSpin - Callback to remove the winner and spin again.
 */
const WinnerModal = ({ winner, levelInfo, prestigeTheme, onClose, onRemoveAndSpin }) => {
  if (!winner) return null;

  const { useEffect } = React;
  const { CodeIcon, ScrollIcon, TrophyIcon, CloseIcon } = window;
  const isCosmic = levelInfo.level >= 11;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-300">
      {(() => {
        return (
          <div
            className={`relative w-full max-w-sm transform scale-100 animate-in zoom-in-95 duration-300 group rounded-2xl ${
              isCosmic
                ? "shadow-[0_0_60px_rgba(139,92,246,0.4)] dark:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
                : prestigeTheme.shadow
            }`}
          >
            {/* Dynamic Border/Background */}
            {isCosmic ? (
              <>
                {/* Cosmic Glow (Behind) */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 dark:opacity-75 animate-pulse"></div>
                {/* Cosmic Border (Sharp) */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-40 dark:opacity-50"></div>
              </>
            ) : (
              <div
                className={`absolute inset-0 ${prestigeTheme.border} opacity-100 dark:opacity-80 rounded-2xl`}
              ></div>
            )}

            <div
              className={`relative m-[2px] ${
                isCosmic ? "bg-indigo-50 dark:bg-gray-900" : prestigeTheme.cardBg
              } rounded-[14px] p-8 text-center transition-colors duration-300 overflow-hidden`}
            >
              {/* Close Button (Top Right) */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>

              {/* Cosmic Background Effects */}
              {isCosmic && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[14px]">
                  {/* Stars / Dust Pattern - Inverted for Light Mode */}
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI4MCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')] opacity-20 dark:opacity-30 invert dark:invert-0 animate-[pulse_4s_infinite]"></div>
                  {/* Nebulas */}
                  <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
              )}

              {/* Conditional Content Based on Winner Name (Easter Eggs) */}
              {winner === "@author" ? (
                <>
                  {/* Author Easter Egg - Keep original colors for identity */}
                  <div className="relative z-10 mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                    <CodeIcon size={32} />
                  </div>
                  <h3 className="relative z-10 text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">
                    Developer Revealed!
                  </h3>
                  <div className="relative z-10 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4 break-words">
                    PT Samuel Kripto Indonesia
                  </div>
                  <p className="relative z-10 text-sm text-gray-600 dark:text-gray-300 mb-8 italic">
                    We turn caffeine into code and panic into features, all proudly debugged with
                    console.log. ☕😱💻🔍🚀
                  </p>
                </>
              ) : winner === "@about" ? (
                <>
                  {/* About Easter Egg - Keep original colors for identity */}
                  <div className="relative z-10 mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                    <ScrollIcon size={32} />
                  </div>
                  <h3 className="relative z-10 text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">
                    The Secret Origin
                  </h3>
                  <div className="relative z-10 text-2xl font-black text-gray-800 dark:text-white mb-4 break-words">
                    Why does this exist?
                  </div>
                  <div className="relative z-10 text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-left space-y-4 max-h-60 overflow-y-auto pr-2">
                    <p>
                      Originally developed by the Samuel Kripto technical team to solve a very real
                      operational crisis: choosing the next weekly meeting host without triggering
                      mass avoidance behavior. Manual selection had become an undeniable
                      productivity sink, often followed by five minutes of awkward silence, sudden
                      bursts of “urgent” typing, and at least one person staring intently at logs
                      that absolutely did not require immediate attention.
                    </p>
                    <p>
                      Over time, the process evolved into something resembling a workplace survival
                      game. Cameras mysteriously turned off, microphones instantly muted, and
                      several team members perfected the art of blending into the background like
                      highly trained corporate chameleons. In extreme cases, strategic “BRB”
                      bathroom breaks were deployed the moment the question “Who wants to host next
                      week?” appeared.
                    </p>
                    <p>
                      To restore order (and dignity), this wheel was built. A tool of fairness,
                      efficiency, and cold, impartial randomness—because if fate chooses the host,
                      at least no one can be blamed.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Standard Winner - Uses Prestige Theme */}
                  <div
                    className={`relative z-10 mx-auto w-16 h-16 ${prestigeTheme.iconBg} rounded-full flex items-center justify-center mb-4 ${prestigeTheme.iconColor} transition-colors duration-300`}
                  >
                    <TrophyIcon
                      size={32}
                      className={levelInfo.level >= 9 ? "animate-bounce" : ""}
                    />
                  </div>
                  <h3
                    className={`relative z-10 uppercase tracking-widest text-sm font-bold mb-2 ${prestigeTheme.textColor} opacity-80`}
                  >
                    We have a winner!
                  </h3>
                  <div className="relative z-10 text-4xl font-black mb-8 break-words">
                    {/* normal text (gradient) and emojis (full-color) */}
                    {parseWinnerString(winner).map((part, i) => (
                      <span
                        key={i}
                        className={
                          part.isEmoji
                            ? "text-gray-800 dark:text-white"
                            : `text-transparent bg-clip-text bg-gradient-to-r ${prestigeTheme.titleGradient}`
                        }
                      >
                        {part.text}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="relative z-10 grid grid-cols-1 gap-3">
                <button
                  onClick={onClose}
                  className={`w-full py-3 bg-gradient-to-r ${prestigeTheme.barGradient} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
                >
                  Close
                </button>
                <button
                  onClick={onRemoveAndSpin}
                  className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Remove & Spin Again
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// Expose to window (needed for Babel Standalone)
// @ts-ignore
window.WinnerModal = WinnerModal;
