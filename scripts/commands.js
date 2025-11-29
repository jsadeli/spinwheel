
window.processCommandCodes = (listName, inputText, {
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
  windowObjects
}) => {
  if (!listName || listName.toLowerCase() !== '@console') return false;

  const lines = inputText.split('\n');
  if (lines.length === 0 || lines[0].trim() !== '#!sudo') return false;

  let commandExecutedCount = 0;
  let isCheatsEnabled = false;
  let currentXp = xp;

  const { themes, storageKeys, getLevelProgress } = windowObjects;

  for (const line of lines.slice(1)) {
    let commandExecuted = false;
    const command = line.trim();
    let message = line.trim();

    if (command === '#!enable-cheats') {
      isCheatsEnabled = true;
      message = "Cheat mode enabled!";
      commandExecuted = true;
    } else if (command.startsWith('xp:') && isCheatsEnabled) {
      const amount = parseInt(command.substring(3), 10);
      if (!isNaN(amount)) {
        setXp(prev => prev + amount);
        currentXp += amount;
        message = `${amount > 0 ? '+' : ''}${amount} XP`;
        setIsCorrupted(true);
        localStorage.setItem(storageKeys.IS_CORRUPTED, 'true');
        commandExecuted = true;
      }
    } else if (command === 'levelup' && isCheatsEnabled) {
      const info = getLevelProgress(currentXp);
      const needed = info.requiredLevelXp - info.currentLevelXp;
      setXp(prev => prev + needed);
      currentXp += needed;
      message = `Leveled Up! (+${Math.round(needed)} XP)`;
      setIsCorrupted(true);
      localStorage.setItem(storageKeys.IS_CORRUPTED, 'true');
      commandExecuted = true;
    } else if (command.startsWith('toast:')) {
      addToast(command.substring(6));
      commandExecuted = true;
    } else if (command.startsWith('winner:')) {
      const name = command.substring(7);
      setWinner(name);
      commandExecuted = true;
    } else if (command === 'confetti') {
      const level = getLevelProgress(currentXp).level;
      fireConfetti(level);
      commandExecuted = true;
    } else if (command.startsWith('confetti:')) {
      const level = parseInt(command.substring(9), 10);
      if (!isNaN(level)) {
        window.fireConfetti(level);
        commandExecuted = true;
      }
    } else if (command === 'break') {
      setIsOutOfOrder(true);
      commandExecuted = true;
    } else if (command.startsWith('theme:')) {
      let newTheme = command.substring(6).trim();
      if (newTheme === 'system') newTheme = themes.AUTO;

      if (Object.values(themes).includes(newTheme)) {
        setTheme(newTheme);
        message = `Theme set to ${newTheme}`;
        commandExecuted = true;
      }
    } else if (command === 'reset:achievements') {
      achievementManager.reset();
      setAchievements(achievementManager.getAll());
      message = "Achievements reset!";
      commandExecuted = true;
    } else if (command === 'reset:level') {
      setXp(() => 0);
      commandExecuted = true;
      message = "Level reset!";
    } else if (command === 'reset') {
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
    setInputText('');
    return true; // Stop spin
  }

  return false;
};
