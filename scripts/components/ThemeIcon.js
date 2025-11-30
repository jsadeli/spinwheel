import { themes } from "/scripts/configs.js";

const ThemeIcon = ({ theme, size = 24 }) => {
  const { MonitorIcon, SunIcon, MoonIcon } = window;
  if (theme === themes.AUTO) return <MonitorIcon size={size} />;
  if (theme === themes.LIGHT) return <SunIcon size={size} />;
  return <MoonIcon size={size} />;
};

window.ThemeIcon = ThemeIcon;

