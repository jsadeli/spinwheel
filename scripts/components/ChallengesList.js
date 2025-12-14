import React from "react";

const { AchievementFilters, SwordsIcon, getRelativeTime } = window;

/**
 * Renders a list of daily challenges with filtering.
 *
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.challenges - List of challenge objects.
 * @param {string} props.filter - Current filter state (all, completed, incomplete).
 * @param {function} props.setFilter - State setter for the filter.
 */
const ChallengesList = ({ challenges, filter, setFilter }) => {
  // Filter challenges first
  const filteredChallenges = challenges.filter((ch) => {
    if (filter === AchievementFilters.UNLOCKED) return ch.isCompleted;
    if (filter === AchievementFilters.LOCKED) return !ch.isCompleted;
    return true;
  });

  // Sort challenges: Completed (newest first) -> In Progress (highest progress first) -> Locked
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    // 1. Incomplete first, then Completed
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;

    // 2. If both incomplete, sort by bonus XP ascending
    if (!a.isCompleted && !b.isCompleted) {
      return a.bonusXp - b.bonusXp;
    }

    // 3. If both completed, sort by date (newest first)
    return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm uppercase tracking-wider">
          Daily Quests ({challenges.filter((c) => c.isCompleted).length}/{challenges.length})
        </h4>

        {/* Filter Controls */}
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setFilter(AchievementFilters.ALL)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              filter === AchievementFilters.ALL
                ? "bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter(AchievementFilters.UNLOCKED)} // Reusing UNLOCKED for Completed
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              filter === AchievementFilters.UNLOCKED
                ? "bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Earned
          </button>
          <button
            onClick={() => setFilter(AchievementFilters.LOCKED)} // Reusing LOCKED for To-Do
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              filter === AchievementFilters.LOCKED
                ? "bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            To-Do
          </button>
        </div>
      </div>

      {/* Daily Challenges Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-lg p-3 mb-4 text-xs text-emerald-800 dark:text-emerald-200 flex items-center">
        <SwordsIcon size={24} className="mr-2" />
        <div className="flex flex-col items-start">
          <span>Daily quests reset every midnight.</span>
          <span>Complete tasks every day to earn bonus XP!</span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {sortedChallenges.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
            No quests match this filter.
          </div>
        ) : (
          sortedChallenges.map((ch) => (
            <div
              key={ch.id}
              className={`p-4 rounded-xl border flex items-start space-x-4 transition-all duration-300 ${
                ch.isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900 shadow-sm"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
                  ch.isCompleted
                    ? "bg-emerald-100 dark:bg-emerald-900/30 shadow-inner"
                    : "bg-gray-100 dark:bg-gray-700 grayscale"
                }`}
              >
                {ch.icon}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h5
                      className={`font-bold text-base ${
                        ch.isCompleted
                          ? "text-emerald-900 dark:text-emerald-100"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {ch.title}
                    </h5>
                    <span
                      className={`text-xs font-bold mt-0.5 ${
                        ch.isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                      }`}
                    >
                      +{ch.bonusXp} XP
                    </span>
                  </div>
                  {ch.isCompleted && (
                    <span
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-100 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap"
                      title={ch.completedAt}
                    >
                      {ch.completedAt ? getRelativeTime(ch.completedAt) : "Completed"}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    ch.isCompleted
                      ? "text-emerald-800 dark:text-emerald-200"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {ch.description}
                </p>

                {/* Progress Bar */}
                {!ch.isCompleted && ch.target >= 2 && (
                  <>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(ch.progress / ch.target) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {ch.progress} / {ch.target}
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

// Expose to window
window.ChallengesList = ChallengesList;
