// Helper function to load state from localStorage
window.loadState = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return defaultValue;
  }
};

// Helper for relative time
window.getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) return 'just now'; // cosmetic preference for very recent events
  // OR use: return rtf.format(-diffInSeconds, 'second');

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute');

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return rtf.format(-diffInHours, 'hour');

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return rtf.format(-diffInDays, 'day');

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return rtf.format(-diffInWeeks, 'week');

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return rtf.format(-diffInMonths, 'month');

  const diffInYears = Math.floor(diffInDays / 365);
  return rtf.format(-diffInYears, 'year');
};

// Helper to parse text into objects { text, weight }
window.parseItems = (text) => {
  return text.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      // Check for "Text:Number" pattern
      // Added \s* to allow spaces between colon and number (e.g. "Pizza: 10")
      const match = line.match(/^(.*):\s*(\d+)$/);
      if (match) {
        const weight = parseInt(match[2], 10);
        if (!isNaN(weight) && weight > 0) {
          return { text: match[1].trim(), weight: weight, original: line.trim() };
        }
      }
      return { text: line.trim(), weight: 1, original: line.trim() };
    });
};

// Helper to convert item objects back to string ("Text:Number") for text area
window.itemsToString = (itemsArray) => {
  return itemsArray.map(i => {
    // If the current parsed text + weight matches the original input format, preserve it
    // Otherwise reconstruct it
    return i.weight > 1 ? `${i.text}:${i.weight}` : i.text;
  }).join('\n');
};

// Helper to calculate XP level
window.calculateLevel = (currentXp) => {
  let level = 0;
  let required = 10;
  while (currentXp >= required) {
    currentXp -= required;
    level++;
    required = 10 * Math.pow(2, level);
  }
  return level;
};

// Helper to get XP level progress
window.getLevelProgress = (currentXp) => {
  let level = 0;
  let required = 20;
  let accumulatedXp = 0;

  // Find current level base XP
  while (currentXp >= required) {
    currentXp -= required;
    accumulatedXp += required;
    level++;
    required = 10 * Math.pow(2, level); // adjust the multipler to make it more or less difficult to level up
  }

  return {
    level,
    currentLevelXp: currentXp,
    requiredLevelXp: required,
    progressPercent: (currentXp / required) * 100
  };
};

// Helper to get XP level title
window.getLevelTitle = (level) => {
  const titles = [
    "Novice Spinner",              // 0: 0 XP
    "Casual Clicker",              // 1: 20 XP
    "Spin Enthusiast",             // 2: 40 XP
    "Professional Procrastinator", // 3: 80 XP
    "Frequent Spinner",            // 4: 160 XP
    "Spin Doctor",                 // 5: 320 XP
    "Entropy Engineer",            // 6: 640 XP
    "Lord of the Spins",           // 7: 1280 XP
    "Agent of Probability",        // 8: 2560 XP
    "Wheel Master",                // 9: 5120 XP
    "Oracle of Spin"               // 10: 10240 XP
  ];
  return titles[level] || "God of Wheel"; // 11+: 20480 XP
};

// Helper to copy text to clipboard
window.copyToClipboard = (text, setIsCopied) => {
  navigator.clipboard.writeText(text).then(() => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  });
};
