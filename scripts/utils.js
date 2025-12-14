/**
 * Retrieves a value from localStorage and parses it as JSON.
 * Returns the default value if the key doesn't exist or if parsing fails.
 *
 * @template T
 * @param {string} key - The localStorage key to retrieve.
 * @param {T} defaultValue - The value to return if the key is missing or invalid.
 * @returns {T} The parsed value from localStorage or the default value.
 * @example
 * const items = loadState('spinItems', []);
 * const settings = loadState('userSettings', { theme: 'dark' });
 */
export const loadState = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return defaultValue;
  }
};

/**
 * Formats a date into a relative time string (e.g., "5 minutes ago", "just now").
 *
 * @param {Date|string|number} date - The date to format.
 * @returns {string} The relative time string.
 * @example
 * getRelativeTime(new Date('2024-01-01')) // "3 months ago"
 * getRelativeTime('2024-01-01T10:00:00Z') // "3 months ago"
 * getRelativeTime(Date.now() - 3600000) // "1 hour ago"
 */
export const getRelativeTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffInSeconds < 60) return "just now"; // cosmetic preference for very recent events
  // OR use: return rtf.format(-diffInSeconds, 'second');

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return rtf.format(-diffInMinutes, "minute");

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return rtf.format(-diffInHours, "hour");

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return rtf.format(-diffInDays, "day");

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return rtf.format(-diffInWeeks, "week");

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return rtf.format(-diffInMonths, "month");

  const diffInYears = Math.floor(diffInDays / 365);
  return rtf.format(-diffInYears, "year");
};

/**
 * Parses a multiline string into an array of item objects.
 * Supports "Text:Weight" format (e.g., "Pizza: 10").
 *
 * @param {string} text - The input string to parse.
 * @returns {Array<{text: string, weight: number, original: string}>} An array of item objects.
 * @example
 * parseItems("Pizza\nBurger:5\nTaco:2")
 * // Returns: [
 * //   { text: "Pizza", weight: 1, original: "Pizza" },
 * //   { text: "Burger", weight: 5, original: "Burger:5" },
 * //   { text: "Taco", weight: 2, original: "Taco:2" }
 * // ]
 */
export const parseItems = (text) => {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
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

/**
 * Converts an array of item objects back into a string format suitable for a textarea.
 * Preserves weights if they are greater than 1.
 *
 * @param {Array<{text: string, weight: number}>} itemsArray - The array of items to convert.
 * @returns {string} A newline-separated string representation of the items.
 * @example
 * itemsToString([
 *   { text: "Pizza", weight: 1, original: "Pizza" },
 *   { text: "Burger", weight: 5, original: "Burger:5" }
 * ])
 * // Returns: "Pizza\nBurger:5"
 */
export const itemsToString = (itemsArray) => {
  return itemsArray
    .map((i) => {
      // If the current parsed text + weight matches the original input format, preserve it
      // Otherwise reconstruct it
      return i.weight > 1 ? `${i.text}:${i.weight}` : i.text;
    })
    .join("\n");
};

/**
 * Copies text to the system clipboard and updates a state setter to indicate success.
 *
 * @param {string} text - The text to copy.
 * @param {function(boolean): void} setIsCopied - A state setter function to update the "copied" status.
 * @example
 * copyToClipboard("Hello World", (copied) => {
 *   console.log(copied ? "Copied!" : "Ready to copy again");
 * });
 */
export const copyToClipboard = (text, setIsCopied) => {
  navigator.clipboard.writeText(text).then(() => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  });
};

/**
 * Checks if a string consists primarily of emoji characters.
 * Returns false if the string contains any letters.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is likely an emoji, false otherwise.
 * @example
 * isEmoji("🎉") // true
 * isEmoji("🎉🎊") // true
 * isEmoji("Party 🎉") // false (contains letters)
 * isEmoji("123") // true (no letters, contains emoji-like chars check)
 * isEmoji("") // false
 */
export const isEmoji = (str) => {
  if (!str) return false;
  // If it contains any letters, treat as text (apply gradient)
  if (/\p{L}/u.test(str)) return false;

  // Check if it contains emoji-like characters
  // \p{Emoji_Presentation}: Standard emojis
  // \p{Extended_Pictographic}: Newer emojis
  // \u20E3: Keycap combining character (for 1️⃣, #️⃣, etc)
  const emojiLikeRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\u20E3)/u;
  return emojiLikeRegex.test(str);
};

/**
 * Parses a winner string into segments of text and emojis.
 * Useful for rendering text with different styles (e.g., gradients for text, flat for emojis).
 *
 * @param {string} text - The winner text to parse.
 * @returns {Array<{text: string, isEmoji: boolean|null}>} An array of segments.
 * @example
 * parseWinnerString("Pizza 🍕")
 * // Modern browsers: [
 * //   { text: "Pizza ", isEmoji: false },
 * //   { text: "🍕", isEmoji: true }
 * // ]
 *
 * parseWinnerString("🎉🎊")
 * // Returns: [{ text: "🎉🎊", isEmoji: true }]
 */
export const parseWinnerString = (text) => {
  if (!text) return [];

  // Use Intl.Segmenter if available (Modern Browsers)
  if (typeof Intl.Segmenter !== "undefined") {
    const segmenter = new Intl.Segmenter([], { granularity: "grapheme" });
    const segments = Array.from(segmenter.segment(text));

    const parts = [];
    let currentPart = { text: "", isEmoji: null };

    for (const { segment } of segments) {
      const isEmo = isEmoji(segment);

      if (currentPart.isEmoji === null) {
        currentPart = { text: segment, isEmoji: isEmo };
      } else if (currentPart.isEmoji === isEmo) {
        currentPart.text += segment;
      } else {
        parts.push(currentPart);
        currentPart = { text: segment, isEmoji: isEmo };
      }
    }
    if (currentPart.text) {
      parts.push(currentPart);
    }
    return parts;
  }

  // Fallback for older browsers: Check the whole string
  // If it's mixed, we can't easily split without a complex regex,
  // so we default to treating it as text (gradient) unless it's purely emoji.
  return [{ text: text, isEmoji: isEmoji(text) }];
};

// Expose to window for Babel scripts
if (typeof window !== "undefined") {
  window.loadState = loadState;
  window.getRelativeTime = getRelativeTime;
  window.parseItems = parseItems;
  window.itemsToString = itemsToString;
  window.copyToClipboard = copyToClipboard;
  window.isEmoji = isEmoji;
  window.parseWinnerString = parseWinnerString;
}

