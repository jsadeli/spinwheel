// @ts-ignore
import React from "react";
import { SpinCoinLogo } from "../icons.js";

export const CoinChip = ({
  balance,
  rollingDuration = 500,
  animationDuration = 2000,
  onClick = undefined,
  size = 24,
}) => {
  const { useState, useEffect } = React;
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevBalance, setPrevBalance] = useState(balance);
  const [isRolling, setIsRolling] = useState(false);
  const [delta, setDelta] = useState(0);
  const isIncreasing = balance >= prevBalance;

  useEffect(() => {
    if (balance !== prevBalance) {
      setDelta(balance - prevBalance);

      setIsRolling(true);
      setIsAnimating(true);

      const rollTimer = setTimeout(() => {
        setIsRolling(false);
        setPrevBalance(balance);
      }, rollingDuration);

      const animTimer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);

      return () => {
        clearTimeout(rollTimer);
        clearTimeout(animTimer);
      };
    }
  }, [balance, rollingDuration, animationDuration]);

  return (
    <div
      className={`${onClick ? "cursor-pointer pointer-events-auto" : "pointer-events-none"}`}
      onClick={onClick}
    >
      <div
        className={`flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-indigo-100 dark:border-indigo-900 transition-all duration-300 ${
          isAnimating ? "scale-110 ring-4 ring-yellow-400/30" : "scale-100"
        } ${
          onClick
            ? "hover:bg-indigo-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95"
            : ""
        }`}
      >
        {/* SpinCoin */}
        <SpinCoinLogo size={size} />

        {/* Balance */}
        <div className="font-bold text-indigo-900 dark:text-indigo-100 font-mono relative h-6 overflow-hidden">
          <div className="opacity-0 h-6 flex items-center">{balance}</div>
          <div
            key={prevBalance}
            className={`absolute top-0 left-0 w-full flex flex-col`}
            style={{
              transition: isRolling
                ? `transform ${rollingDuration}ms ease-in-out`
                : "none",
              transform: isIncreasing
                ? isRolling
                  ? "translateY(-50%)"
                  : "translateY(0%)"
                : isRolling
                ? "translateY(0%)"
                : "translateY(-50%)",
            }}
          >
            {isIncreasing ? (
              <>
                <div className="h-6 flex items-center">{prevBalance}</div>
                <div className="h-6 flex items-center">{balance}</div>
              </>
            ) : (
              <>
                <div className="h-6 flex items-center">{balance}</div>
                <div className="h-6 flex items-center">{prevBalance}</div>
              </>
            )}
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
            {delta}
          </div>
        )}
      </div>
    </div>
  );
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.CoinChip = CoinChip;
}
