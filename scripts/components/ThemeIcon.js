// @ts-ignore
import React from "react";

const { THEMES } = window;

/**
 * Renders an icon representing the current theme (Auto, Light, or Dark).
 *
 * @param {Object} props - Component props.
 * @param {string} props.theme - The current theme value (auto, light, dark).
 * @param {number} [props.size=24] - The size of the icon.
 */
const ThemeIcon = ({ theme, size = 24 }) => {
  const { MonitorIcon, SunIcon, MoonIcon } = window;
  if (theme === THEMES.AUTO) return <MonitorIcon size={size} />;
  if (theme === THEMES.LIGHT) return <SunIcon size={size} />;
  return <MoonIcon size={size} />;
};

// Expose to window (needed for Babel Standalone)
window.ThemeIcon = ThemeIcon;
