import { getLevelProgress } from "./levels.js";
import { fireConfetti } from "./animations.js";
import { THEMES, STORAGE_KEYS } from "./configs.js";

/**
 * Processes and executes console commands from the input text.
 * Only executes if the list name is "@console" and the first line is "#!sudo".
 *
 * @param {string} listName - The name of the current list.
 * @param {string} inputText - The full text content of the input area.
 * @param {Object} context - The context object containing state setters and managers.
 * @param {number} context.xp - Current XP.
 * @param {function} context.setXp - State setter for XP.
 * @param {function} context.setIsCorrupted - State setter for corruption status.
 * @param {function} context.setIsOutOfOrder - State setter for out-of-order status.
 * @param {function} context.setTheme - State setter for the theme.
 * @param {function} context.setInputText - State setter for the input text.
 * @param {function} context.addToast - Function to display toast notifications.
 * @param {function} context.setWinner - State setter for the winner.
 * @param {Object} context.achievementManager - The achievement manager instance.
 * @param {function} context.setAchievements - State setter for achievements list.
 * @returns {boolean} True if a command that stops execution (like reset) was run, false otherwise.
 * @example
 * processCommandCodes("@console", "#!sudo\n#!enable-cheats", { ...context });
 */
export const processCommandCodes = (
  listName,
  inputText,
  {
    xp,
    setXp,
    setIsCorrupted,
    setIsOutOfOrder,
    setTheme,
    setInputText,
    addToast,
    setWinner,
    achievementManager,
    setAchievements,
  }
) => {
  if (!listName || listName.toLowerCase() !== "@console") return false;

  const lines = inputText.split("\n");
  if (lines.length === 0 || lines[0].trim() !== "#!sudo") return false;

  let commandExecutedCount = 0;
  let isCheatsEnabled = false;
  let currentXp = xp;

  for (const line of lines.slice(1)) {
    let commandExecuted = false;
    const command = line.trim();
    let message = line.trim();

    if (command === "#!enable-cheats") {
      isCheatsEnabled = true;
      message = "Cheat mode enabled!";
      commandExecuted = true;
    } else if (command.startsWith("xp:") && isCheatsEnabled) {
      const amount = parseInt(command.substring(3), 10);
      if (!isNaN(amount)) {
        setXp((prev) => prev + amount);
        currentXp += amount;
        message = `${amount > 0 ? "+" : ""}${amount} XP`;
        setIsCorrupted(true);
        localStorage.setItem(STORAGE_KEYS.IS_CORRUPTED, "true");
        commandExecuted = true;
      }
    } else if (command === "levelup" && isCheatsEnabled) {
      const info = getLevelProgress(currentXp);
      const needed = info.requiredLevelXp - info.currentLevelXp;
      setXp((prev) => prev + needed);
      currentXp += needed;
      message = `Leveled Up! (+${Math.round(needed)} XP)`;
      setIsCorrupted(true);
      localStorage.setItem(STORAGE_KEYS.IS_CORRUPTED, "true");
      commandExecuted = true;
    } else if (command.startsWith("toast:")) {
      addToast(command.substring(6));
      commandExecuted = true;
    } else if (command.startsWith("winner:")) {
      const name = command.substring(7);
      setWinner(name);
      commandExecuted = true;
    } else if (command === "confetti") {
      const level = getLevelProgress(currentXp).level;
      fireConfetti(level);
      commandExecuted = true;
    } else if (command.startsWith("confetti:")) {
      const level = parseInt(command.substring(9), 10);
      if (!isNaN(level)) {
        fireConfetti(level);
        commandExecuted = true;
      }
    } else if (command === "break") {
      setIsOutOfOrder(true);
      commandExecuted = true;
    } else if (command.startsWith("theme:")) {
      let newTheme = command.substring(6).trim();
      if (newTheme === "system") newTheme = THEMES.AUTO;

      if (Object.values(THEMES).includes(newTheme)) {
        setTheme(newTheme);
        message = `Theme set to ${newTheme}`;
        commandExecuted = true;
      }
    } else if (command === "reset:achievements") {
      achievementManager.reset();
      setAchievements(achievementManager.getAll());
      message = "Achievements reset!";
      commandExecuted = true;
    } else if (command === "reset:level") {
      setXp(() => 0);
      commandExecuted = true;
      message = "Level reset!";
    } else if (command === "reset") {
      localStorage.clear();
      window.location.reload();
      commandExecuted = true;
      return true; // Stop everything
    }

    if (commandExecuted) {
      addToast(message, "COMMAND EXECUTED", "✅", 2500);
      commandExecutedCount++;
    }
  }

  if (commandExecutedCount >= 2) {
    addToast(`${commandExecutedCount}`, "COMMANDS EXECUTED", "🖥️", 2500);
  }

  if (commandExecutedCount >= 1) {
    setInputText("");
    return true; // Stop spin
  }

  return false;
};

// Expose to window
if (typeof window !== "undefined") {
  window.processCommandCodes = processCommandCodes;
}

