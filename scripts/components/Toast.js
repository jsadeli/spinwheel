// Toast Component
/**
 * Displays a temporary notification toast with different styles for achievements, errors, and general messages.
 *
 * @param {Object} props - Component props.
 * @param {function} props.onClose - Callback to close the toast.
 * @param {string} props.message - The main message text to display.
 * @param {string} [props.title="Notification"] - The title text (determines style for "Achievement Unlocked" etc).
 * @param {React.ReactNode} [props.icon=null] - Optional icon to display.
 * @param {number} [props.duration=TOAST_DURATION] - Duration in ms before auto-closing.
 */
const Toast = ({
  onClose,
  message,
  title = "Notification",
  icon = null,
  duration = window.TOAST_DURATION,
}) => {
  const { useEffect } = React;
  const { TrophyIcon, TrendingUpIcon, CloseIcon, SwordsIcon } = window;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isAchievement = title === "Achievement Unlocked";
  const isDailyChallenge = title === "Daily Quest Completed";
  const isLevelUp = title === "Level Up!";
  const isError = title === "Error" || title === "AI Voice Failed" || title === "AI Generation Failed";
  const isSpecial = isAchievement || isDailyChallenge || isLevelUp || isError;

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[10000]">
      {/* Toast Content with Animation */}
      <div
        className={`flex items-center justify-center rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] min-w-[340px] overflow-hidden ${
          isSpecial
            ? "p-[3px]"
            : "bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900"
        }`}
        style={{
          animation: isError
            ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
            : "xboxPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        }}
      >
        {isLevelUp && (
          // alternative yellow/gold border: #FCD34D,#F59E0B,#B45309,#F59E0B,#FCD34D
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3,#ff0000)] animate-[spin_4s_linear_infinite] z-0"></div>
        )}

        {isAchievement && (
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#874DFC,#590BF5,#4209B4,#590BF5,#874DFC)] animate-[spin_3s_linear_infinite] z-0"></div>
        )}

        {isDailyChallenge && (
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#6EE7B7,#10B981,#047857,#10B981,#6EE7B7)] animate-[spin_3s_linear_infinite] z-0"></div>
        )}

        {isError && (
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#EF4444,#B91C1C,#7F1D1D,#B91C1C,#EF4444)] animate-[spin_3s_linear_infinite] z-0"></div>
        )}

        <div
          className={`relative z-10 flex items-center gap-4 w-full h-full ${
            isSpecial ? "bg-white dark:bg-gray-900 rounded-xl pl-4 pr-6 py-3" : "pl-4 pr-6 py-3"
          }`}
        >
          {/* Icon Circle */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isAchievement
                ? "bg-indigo-100 dark:bg-indigo-900/30"
                : isDailyChallenge
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : isLevelUp
                ? "bg-yellow-100 dark:bg-yellow-900/30"
                : isError
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-indigo-50 dark:bg-indigo-900/30"
            }`}
          >
            {icon ? (
              <span className={`text-2xl ${isError ? "text-red-600 dark:text-red-400" : ""}`}>
                {icon}
              </span>
            ) : isLevelUp ? (
              <TrendingUpIcon
                size={24}
                className="text-yellow-600 dark:text-yellow-400 animate-bounce"
              />
            ) : isDailyChallenge ? (
              <SwordsIcon
                size={24}
                className="text-emerald-600 dark:text-emerald-400 animate-pulse"
              />
            ) : isError ? (
              <AlertTriangleIcon
                size={24}
                className="text-red-600 dark:text-red-400 animate-pulse"
              />
            ) : (
              <TrophyIcon
                size={24}
                className="text-indigo-600 dark:text-indigo-400 animate-pulse"
              />
            )}
          </div>

          {/* Text Content */}
          <div className="flex flex-col flex-grow">
            <span
              className={`text-xs font-bold tracking-wide uppercase ${
                isAchievement
                  ? "text-indigo-600 dark:text-indigo-400"
                  : isDailyChallenge
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isLevelUp
                  ? "text-yellow-600 dark:text-yellow-400"
                  : isError
                  ? "text-red-600 dark:text-red-400"
                  : "text-indigo-500 dark:text-indigo-400"
              }`}
            >
              {title}
            </span>
            <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100 leading-tight">
              {message}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close notification"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Expose to window (needed for Babel Standalone)
window.Toast = Toast;
