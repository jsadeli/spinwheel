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
 * @param {Object} context.challengeManager - The challenge manager instance.
 * @param {function} context.setChallenges - State setter for challenges list.
 * @returns {boolean} True if a command that stops execution (like reset) was run, false otherwise.
 * @example
 * processCommandCodes("@console", "#!sudo\n#!enable-cheats", { ...context });
 */
const EXACT_COMMANDS = {
  "#!enable-cheats": (ctx, state) => {
    state.isCheatsEnabled = true;
    return { message: "Cheat mode enabled!" };
  },
  levelup: (ctx, state) => {
    if (!state.isCheatsEnabled) return null;
    const info = getLevelProgress(state.currentXp);
    const needed = info.requiredLevelXp - info.currentLevelXp;
    ctx.setXp((prev) => prev + needed);
    state.currentXp += needed;
    ctx.setIsCorrupted(true);
    localStorage.setItem(STORAGE_KEYS.IS_CORRUPTED, "true");
    return { message: `Leveled Up! (+${Math.round(needed)} XP)` };
  },
  "toast:achievement": (ctx) => {
    ctx.addToast("Unlocked an achievement!", "Achievement Unlocked");
    return { executed: true };
  },
  "toast:quest": (ctx) => {
    ctx.addToast("Completed a daily quest!", "Daily Quest Completed");
    return { executed: true };
  },
  "toast:levelup": (ctx) => {
    ctx.addToast("Congrats! You have leveled up!", "Level Up!");
    return { executed: true };
  },
  "toast:error": (ctx) => {
    ctx.addToast("This is a sample error message.", "Error");
    return { executed: true };
  },
  confetti: (ctx, state) => {
    const level = getLevelProgress(state.currentXp).level;
    fireConfetti(level);
    return { executed: true };
  },
  break: (ctx) => {
    ctx.setIsOutOfOrder(true);
    return { executed: true };
  },
  "reset:achievements": (ctx) => {
    ctx.achievementManager.reset();
    ctx.setAchievements(ctx.achievementManager.getAll());
    return { executed: true };
  },
  "reset:quests": (ctx) => {
    ctx.challengeManager.reset(new Date());
    ctx.setChallenges(ctx.challengeManager.getAll());
    return { executed: true };
  },
  "reset:level": (ctx) => {
    ctx.setXp(() => 0);
    return { executed: true };
  },
  reset: () => {
    localStorage.clear();
    window.location.reload();
    return { stop: true };
  },
};

const PREFIX_COMMANDS = [
  {
    prefix: "xp:",
    handler: (command, ctx, state) => {
      if (!state.isCheatsEnabled) return null;
      const amount = parseInt(command.substring(3), 10);
      if (isNaN(amount)) return null;

      ctx.setXp((prev) => prev + amount);
      state.currentXp += amount;
      ctx.setIsCorrupted(true);
      localStorage.setItem(STORAGE_KEYS.IS_CORRUPTED, "true");
      return { message: `${amount > 0 ? "+" : ""}${amount} XP` };
    },
  },
  {
    prefix: "toast:",
    handler: (command, ctx) => {
      ctx.addToast(command.substring(6));
      return { executed: true };
    },
  },
  {
    prefix: "winner:",
    handler: (command, ctx) => {
      ctx.setWinner(command.substring(7));
      return { executed: true };
    },
  },
  {
    prefix: "confetti:",
    handler: (command) => {
      const level = parseInt(command.substring(9), 10);
      if (!isNaN(level)) {
        fireConfetti(level);
        return { executed: true };
      }
      return null;
    },
  },
  {
    prefix: "theme:",
    handler: (command, ctx) => {
      let newTheme = command.substring(6).trim();
      if (newTheme === "system") newTheme = THEMES.AUTO;
      if (Object.values(THEMES).includes(newTheme)) {
        ctx.setTheme(newTheme);
        return { executed: true };
      }
      return null;
    },
  },
];

export const processCommandCodes = (listName, inputText, context) => {
  if (!listName || listName.toLowerCase() !== "@console") return false;

  const lines = inputText.split("\n");
  if (lines.length === 0 || lines[0].trim() !== "#!sudo") return false;

  let commandExecutedCount = 0;

  // Mutable state for the execution session
  const state = {
    isCheatsEnabled: false,
    currentXp: context.xp,
  };

  for (const line of lines.slice(1)) {
    const command = line.trim();
    let result = null;

    // 1. Try Exact Match
    if (EXACT_COMMANDS[command]) {
      result = EXACT_COMMANDS[command](context, state);
    }

    // 2. Try Prefix Match
    if (!result) {
      for (const { prefix, handler } of PREFIX_COMMANDS) {
        if (command.startsWith(prefix)) {
          result = handler(command, context, state);
          if (result) break;
        }
      }
    }

    // 3. Process Result
    if (result) {
      if (result.stop) return true;

      const message = result.message || command;
      context.addToast(message, "COMMAND EXECUTED", "✅", 2500);
      commandExecutedCount++;
    }
  }

  if (commandExecutedCount >= 2) {
    context.addToast(`${commandExecutedCount}`, "COMMANDS EXECUTED", "🖥️", 2500);
  }

  if (commandExecutedCount >= 1) {
    context.setInputText("");
    return true; // Stop spin
  }

  return false;
};

// Expose to window
if (typeof window !== "undefined") {
  window.processCommandCodes = processCommandCodes;
}
