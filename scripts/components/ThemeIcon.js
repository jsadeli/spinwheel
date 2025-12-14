// @ts-ignore
import React from "react";

/**
 * Renders an icon representing the current theme (Auto, Light, or Dark).
 *
 * @param {Object} props - Component props.
 * @param {string} props.theme - The current theme value (auto, light, dark).
 * @param {number} [props.size=24] - The size of the icon.
 */
export const ThemeIcon = ({ theme, size = 24 }) => {
  const { MonitorIcon, SunIcon, MoonIcon, THEMES } = window;

  // Safety check: Don't render if icons/globals aren't loaded yet
  if (!MonitorIcon || !SunIcon || !MoonIcon || !THEMES) {
    return null;
  }

  if (theme === THEMES.AUTO) return <MonitorIcon size={size} />;
  if (theme === THEMES.LIGHT) return <SunIcon size={size} />;
  return <MoonIcon size={size} />;
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.ThemeIcon = ThemeIcon;
}
