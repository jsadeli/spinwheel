// Helper function to load state from localStorage
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

// Helper for relative time
export const getRelativeTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
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

// Helper to parse text into objects { text, weight }
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

// Helper to convert item objects back to string ("Text:Number") for text area
export const itemsToString = (itemsArray) => {
  return itemsArray
    .map((i) => {
      // If the current parsed text + weight matches the original input format, preserve it
      // Otherwise reconstruct it
      return i.weight > 1 ? `${i.text}:${i.weight}` : i.text;
    })
    .join("\n");
};

// Helper to copy text to clipboard
export const copyToClipboard = (text, setIsCopied) => {
  navigator.clipboard.writeText(text).then(() => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  });
};

// Helper to check if a string is likely just an emoji
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

// Helper to parse winner string into text and emoji segments
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

