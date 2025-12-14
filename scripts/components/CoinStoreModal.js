// @ts-ignore
import React from "react";

export const CoinStoreModal = ({ isOpen, onClose, coins, xp, onTransact }) => {
  if (!isOpen) return null;

  const {
    Modal,
    CoinChip,
    ZapIcon,
    ShoppingBagIcon,
    SeedlingIcon,
    BoltIcon,
    FlameIcon,
    GemIcon,
    CrownIcon,
  } = window;
  const { useState, useEffect } = React;

  const [selectedOption, setSelectedOption] = useState(null);

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (isOpen) setSelectedOption(null);
  }, [isOpen]);

  const SWAP_OPTIONS = [
    { coins: 10, xp: 5, bonus: 0, label: "Starter" },
    { coins: 50, xp: 50, bonus: 0, label: "Basic" },
    { coins: 100, xp: 150, bonus: 50, label: "Pro" },
    { coins: 500, xp: 1000, bonus: 100, label: "Elite" },
    { coins: 1000, xp: 3000, bonus: 200, label: "Ultimate", bestValue: true },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleConfirmTransact = () => {
    if (selectedOption && coins >= selectedOption.coins) {
      onTransact(selectedOption);
      setSelectedOption(null);
    }
  };

  const canAffordSelected = selectedOption && coins >= selectedOption.coins;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">Store</span>
          <span className="text-gray-400 dark:text-gray-500">|</span>
          <span className="text-gray-600 dark:text-gray-400 font-normal">
            {/* Larger screens uses the full-length text */}
            <span className="hidden sm:inline">Your SpinCoin balance:</span>
            {/* Smaller screens uses the truncated text */}
            <span className="sm:hidden">SpinCoin:</span>
          </span>
          <CoinChip balance={coins} size={28} />
        </div>
      }
      icon={<ShoppingBagIcon className="w-6 h-6 text-indigo-500" />}
      className="max-w-2xl"
      header={
        /* XP Progress Bar */
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              Level {window.getLevelProgress(xp).level}
            </div>
            {selectedOption && (
              <div className="text-sm font-bold text-indigo-500 animate-pulse">
                +{selectedOption.xp} XP
              </div>
            )}
          </div>

          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Layer 1: Current XP (Deep Purple) */}
            <div
              className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-500 ease-out z-10"
              style={{ width: `${window.getLevelProgress(xp).progressPercent}%` }}
            />

            {/* Layer 2: Potential XP (Light Purple) */}
            {selectedOption && (
              <div
                className="absolute top-0 h-full bg-indigo-300 dark:bg-indigo-400 transition-all duration-500 ease-out z-0"
                style={{
                  left: `${window.getLevelProgress(xp).progressPercent}%`,
                  width: `${Math.min(
                    100 - window.getLevelProgress(xp).progressPercent,
                    (selectedOption.xp / window.getLevelProgress(xp).requiredLevelXp) * 100
                  )}%`,
                }}
              />
            )}
          </div>

          <div className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            {Math.max(
              0,
              window.getLevelProgress(xp).requiredLevelXp -
                window.getLevelProgress(xp).currentLevelXp
            )}{" "}
            XP to the next level
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full gap-4 pt-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedOption ? (
              <span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {selectedOption.coins} SpinCoin
                </span>{" "}
                ⇄{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedOption.xp} XP
                </span>
              </span>
            ) : (
              "Select a package to buy"
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmTransact}
              disabled={!canAffordSelected}
              className={`relative rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 overflow-hidden ${
                canAffordSelected
                  ? "group p-[1px]"
                  : "px-8 py-2.5 bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50"
              }`}
            >
              {canAffordSelected && (
                <div className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,#6366f1_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,#ffffff_100%)] animate-[spin_2s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              <div
                className={`flex items-center justify-center gap-2 h-full w-full rounded-xl relative z-10 ${
                  canAffordSelected
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 px-8 py-2.5"
                    : ""
                }`}
              >
                <span>Buy</span>
              </div>
            </button>
          </div>
        </div>
      }
    >
      {/* Shop List */}
      <div className="space-y-3">
        {SWAP_OPTIONS.map((option, index) => {
          const canAfford = coins >= option.coins;
          // Fix: Compare by unique label to ensure selection persists across re-renders
          const isSelected = selectedOption?.label === option.label;
          const isBestValue = option.bestValue;

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                index > 0 ? "mt-3" : ""
              } ${
                isSelected && !canAfford
                  ? "border-red-500 bg-red-50/50 dark:bg-red-900/20 ring-4 ring-red-500/10 scale-[1.01] z-10"
                  : isSelected
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 ring-4 ring-indigo-500/10 scale-[1.01] z-10"
                  : canAfford
                  ? "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:translate-x-0.5"
                  : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60 grayscale"
              }`}
            >
              {isBestValue && canAfford && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-b-lg shadow-md flex items-center gap-1">
                  <ZapIcon className="w-3 h-3" /> BEST VALUE
                </div>
              )}
              {!canAfford && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-b-lg shadow-sm flex items-center gap-1 z-20">
                  INSUFFICIENT
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${
                    isSelected
                      ? "bg-indigo-100 dark:bg-indigo-900/50"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {index === 0 ? (
                    <SeedlingIcon className="w-8 h-8 text-green-500" />
                  ) : index === 1 ? (
                    <BoltIcon className="w-8 h-8 text-yellow-500" />
                  ) : index === 2 ? (
                    <FlameIcon className="w-8 h-8 text-orange-500" />
                  ) : index === 3 ? (
                    <GemIcon className="w-8 h-8 text-cyan-400" />
                  ) : (
                    <CrownIcon className="w-8 h-8 text-amber-500" />
                  )}
                </div>

                {/* Content Container (Merged Info & Reward) */}
                <div className="flex-1 h-14 flex flex-col justify-between min-w-0">
                  {/* Top Row: Label + Bonus --- Reward Label */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
                        {option.label}
                      </div>
                      {option.bonus > 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                            isSelected
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          +{option.bonus}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider flex-shrink-0">
                      Reward
                    </div>
                  </div>

                  {/* Bottom Row: Cost --- XP Value */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {option.coins}
                      </span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                        SpinCoin
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 flex-shrink-0">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {option.xp}
                      </span>
                      <span className="text-sm text-indigo-500 font-medium">XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.CoinStoreModal = CoinStoreModal;
}
