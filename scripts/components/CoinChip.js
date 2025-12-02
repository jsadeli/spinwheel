const CoinChip = ({ balance, animate, onAnimationComplete }) => {
  const { useState, useEffect } = React;
  const [isAnimating, setIsAnimating] = useState(false);

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
        <div className="font-bold text-indigo-900 dark:text-indigo-100 font-mono">
          {balance.toLocaleString()}
        </div>

        {/* +1 */}
        {isAnimating && (
          <div className="absolute -top-1 -right-1 text-green-500 font-bold animate-bounce text-sm">
            +1
          </div>
        )}
      </div>
    </div>
  );
};

window.CoinChip = CoinChip;
