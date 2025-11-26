// Toast Component
window.Toast = ({ message, onClose, duration = 5000, title = "Notification", icon = null }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isAchievement = title === "Achievement Unlocked";
  const isLevelUp = title === "Level Up!";
  const isSpecial = isAchievement || isLevelUp;

  return (
    <div
      className={`fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[10000] flex items-center justify-center rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] min-w-[320px] overflow-hidden ${isSpecial ? 'p-[3px]' : 'bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900'}`}
      style={{ animation: 'xboxPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
    >
      {isLevelUp && (
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3,#ff0000)] animate-[spin_4s_linear_infinite] z-0"></div>
      )}

      {isAchievement && (
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#FCD34D,#F59E0B,#B45309,#F59E0B,#FCD34D)] animate-[spin_3s_linear_infinite] z-0"></div>
      )}

      <div className={`relative z-10 flex items-center gap-4 w-full h-full ${isSpecial ? 'bg-white dark:bg-gray-900 rounded-xl pl-4 pr-6 py-3' : 'pl-4 pr-6 py-3'}`}>
        {/* Icon Circle */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isAchievement ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
          {icon ? <span className="text-2xl">{icon}</span> : (
            isLevelUp ?
              <TrendingUpIcon size={24} className="text-indigo-600 dark:text-indigo-400 animate-bounce" /> :
              <TrophyIcon size={24} className="text-yellow-600 dark:text-yellow-400 animate-pulse" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col flex-grow">
          <span className={`text-xs font-bold tracking-wide uppercase ${isAchievement ? 'text-yellow-600 dark:text-yellow-400' : 'text-indigo-500 dark:text-indigo-400'}`}>
            {title}
          </span>
          <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100 leading-tight">
            {message.replace("Level Up! ", "").replace("Achievement Unlocked: ", "")}
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
  );
};
