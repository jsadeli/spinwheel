const CoinChip = ({ balance, animate, onAnimationComplete }) => {
  const { useState, useEffect } = React;
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevBalance, setPrevBalance] = useState(balance);
  const [isRolling, setIsRolling] = useState(false);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    if (balance !== prevBalance) {
      setDelta(balance - prevBalance);
      setIsRolling(true);
      const timer = setTimeout(() => {
        setIsRolling(false);
        setPrevBalance(balance);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [balance, prevBalance]);

  useEffect(() => {
    if (animate) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        if (onAnimationComplete) onAnimationComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="pointer-events-none">
      <div
        className={`flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-indigo-100 dark:border-indigo-900 transition-all duration-300 ${
          isAnimating ? "scale-110 ring-4 ring-yellow-400/30" : "scale-100"
        }`}
      >
        {/* SpinCoin */}
        <div className="text-xl w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            aria-labelledby="scFlex"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          >
            <title id="scFlex">SpinCoin - Responsive</title>

            <circle cx="8" cy="8" r="7" fill="#FFB84D" stroke="#D1892C" stroke-width="1" />
            <circle cx="8" cy="8" r="4" fill="none" stroke="#FFDFA6" stroke-width="1" />

            <text
              x="8"
              y="10"
              font-family="Inter, Arial, sans-serif"
              font-size="7"
              font-weight="700"
              text-anchor="middle"
              fill="#B35E00"
            >
              S
            </text>
          </svg>
        </div>

        {/* Balance */}
        <div className="font-bold text-indigo-900 dark:text-indigo-100 font-mono relative h-6 overflow-hidden">
          <div className="opacity-0 h-6 flex items-center">
            {balance.toLocaleString()}
          </div>
          <div
            className={`absolute top-0 left-0 w-full flex flex-col ${
              isRolling
                ? "transition-transform duration-300 -translate-y-1/2"
                : ""
            }`}
          >
            <div className="h-6 flex items-center">
              {prevBalance.toLocaleString()}
            </div>
            <div className="h-6 flex items-center">
              {balance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Delta */}
        {isAnimating && delta !== 0 && (
          <div
            className={`absolute -top-1 -right-1 font-bold animate-bounce text-sm ${
              delta > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

window.CoinChip = CoinChip;
