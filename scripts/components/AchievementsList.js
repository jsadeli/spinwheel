const { AchievementFilters, getRelativeTime } = window;

/**
 * Renders a list of achievements with filtering and sorting capabilities.
 *
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.achievements - List of achievement objects.
 * @param {string} props.achievementFilter - Current filter state (all, unlocked, locked).
 * @param {function} props.setAchievementFilter - State setter for the filter.
 */
const AchievementsList = ({ achievements, achievementFilter, setAchievementFilter }) => {
  const filteredAchievements = achievements.filter((ach) => {
    if (achievementFilter === AchievementFilters.UNLOCKED) return ach.isUnlocked;
    if (achievementFilter === AchievementFilters.LOCKED) return !ach.isUnlocked;
    return true;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // 1. Unlocked comes first
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;

    // 2. If both unlocked, sort by date (newest first)
    if (a.isUnlocked && b.isUnlocked) {
      return new Date(b.unlockedAt) - new Date(a.unlockedAt);
    }

    // 3. If both locked, sort by bonusXp (smallest first)
    return (a.bonusXp || 0) - (b.bonusXp || 0);
  });

  return (
    <div className="space-y-3">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
          Achievements ({achievements.filter((a) => a.isUnlocked).length}/{achievements.length})
        </h4>

        {/* Filter Controls */}
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setAchievementFilter(AchievementFilters.ALL)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              achievementFilter === AchievementFilters.ALL
                ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setAchievementFilter(AchievementFilters.UNLOCKED)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              achievementFilter === AchievementFilters.UNLOCKED
                ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Earned
          </button>
          <button
            onClick={() => setAchievementFilter(AchievementFilters.LOCKED)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              achievementFilter === AchievementFilters.LOCKED
                ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            To-Do
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {sortedAchievements.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
            No achievements match this filter.
          </div>
        ) : (
          sortedAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border flex items-start space-x-4 transition-all duration-300 ${
                ach.isUnlocked
                  ? "bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-900 shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
                  ach.isUnlocked
                    ? "bg-indigo-100 dark:bg-indigo-900/30 shadow-inner"
                    : "bg-gray-200 dark:bg-gray-700 grayscale"
                }`}
              >
                {ach.icon}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h5
                      className={`font-bold text-base ${
                        ach.isUnlocked
                          ? "text-gray-800 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {ach.title}
                    </h5>
                    {ach.bonusXp > 0 && (
                      <span
                        className={`text-xs font-bold mt-0.5 ${
                          ach.isUnlocked ? "text-yellow-600 dark:text-yellow-400" : "text-gray-400"
                        }`}
                      >
                        +{ach.bonusXp} XP
                      </span>
                    )}
                  </div>
                  {ach.isUnlocked && (
                    <span
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap"
                      title={ach.unlockedAt.toISOString()}
                    >
                      {ach.unlockedAt ? getRelativeTime(ach.unlockedAt) : "Unlocked"}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    ach.isUnlocked
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {ach.description}
                </p>

                {/* Progress Bar */}
                {!ach.isUnlocked && ach.target >= 2 && (
                  <>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((ach.progress / ach.target) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {ach.progress} / {ach.target}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Expose to window (needed for Babel Standalone)
window.AchievementsList = AchievementsList;
