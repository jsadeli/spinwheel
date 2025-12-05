const CoinStoreModal = ({ isOpen, onClose, coins, xp, onTransact }) => {
  if (!isOpen) return null;

  const { Modal, SpinCoinLogo, ZapIcon, ShoppingBagIcon, StarIcon } = window;
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
      title="Store"
      icon={<ShoppingBagIcon className="w-6 h-6 text-indigo-500" />}
      className="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full gap-4 pt-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedOption ? (
              <span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {selectedOption.coins} Coins
                </span>{" "}
                ⇄{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
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
              className={`px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${
                canAffordSelected
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/30"
                  : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50"
              }`}
            >
              <span>Buy</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Wallet Header */}
        <div className="grid grid-cols-2 gap-3">
          {/* Coins Balance */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-4 border-2 border-yellow-200 dark:border-yellow-800/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl w-6 h-6">
                <SpinCoinLogo size={24} />
              </span>
              <div className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">
                SpinCoin
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white tracking-tight text-right">
              {coins}
            </div>
          </div>

          {/* XP Balance */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-2">
              <StarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                XP
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight text-right">
              {xp}
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
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
              window.getLevelProgress(xp).requiredLevelXp - window.getLevelProgress(xp).currentLevelXp
            )}{" "}
            XP to the next level
          </div>
        </div>

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
                disabled={!canAfford}
                className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 ring-4 ring-indigo-500/10 scale-[1.01] z-10"
                    : canAfford
                    ? "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
                    : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60 cursor-not-allowed grayscale"
                }`}
              >
                {isBestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <ZapIcon className="w-3 h-3" /> BEST VALUE
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${
                      isSelected
                        ? "bg-indigo-100 dark:bg-indigo-900/50"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {index === 0
                      ? "🌱"
                      : index === 1
                      ? "⚡"
                      : index === 2
                      ? "🔥"
                      : index === 3
                      ? "💎"
                      : "👑"}
                  </div>

                  {/* Info Section - Coin Price */}
                  <div className="flex-1 h-14 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {option.label}
                      </div>
                      {option.bonus > 0 && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                            isSelected
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          +{option.bonus}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-bold ${
                          canAfford ? "text-gray-900 dark:text-white" : "text-red-500"
                        }`}
                      >
                        {option.coins}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          canAfford ? "text-gray-500 dark:text-gray-400" : "text-red-400"
                        }`}
                      >
                        coins
                      </span>
                      {!canAfford && (
                        <span className="text-xs text-red-400 font-medium">(insufficient)</span>
                      )}
                    </div>
                  </div>

                  {/* XP Reward */}
                  <div className="h-14 flex flex-col justify-between flex-shrink-0">
                    <div className="text-right text-xs text-gray-400 uppercase tracking-wider">
                      Reward
                    </div>
                    <div className="flex items-baseline gap-2 justify-end">
                      <span
                        className={`text-2xl font-bold ${
                          canAfford ? "text-gray-900 dark:text-white" : "text-gray-400"
                        }`}
                      >
                        {option.xp}
                      </span>
                      <span className="text-purple-500 font-medium">XP</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

window.CoinStoreModal = CoinStoreModal;
