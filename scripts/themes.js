// Default Themes
window.defaultColors = [
  '#F25F5C', '#FF9F1C', '#FFBF69', '#FFE066',
  '#70C1B3', '#21A0A0', '#247BA0', '#1B98E0',
  '#6C5B7B', '#C06C84', '#F67280', '#F8B195'
];

window.beachColors = [
  '#D98C8C', '#D9A679', '#D9BF6F', '#A8C686',
  '#7FB0A6', '#7FA6C6', '#A6A1C6', '#C6A1B5',
  '#C6C6A1', '#BFA58F', '#A6C6C6', '#D9A1A1'
];

window.getPrestigeTheme = (level) => {
  if (level >= 11) return {
    border: 'bg-[conic-gradient(from_0deg,#ec4899,#8b5cf6,#3b82f6,#ec4899)] animate-[spin_4s_linear_infinite]',
    cardBg: 'bg-gray-50 dark:bg-gray-900',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    titleGradient: 'from-pink-500 via-purple-500 to-indigo-500',
    textColor: 'text-purple-900 dark:text-purple-100',
    accentColor: 'text-purple-400',
    barGradient: 'from-pink-500 via-purple-500 to-indigo-500',
    shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
  };
  if (level >= 10) return { // Diamond
    border: 'bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-400 animate-pulse',
    cardBg: 'bg-indigo-50 dark:bg-gray-900',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    titleGradient: 'from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400',
    textColor: 'text-indigo-900 dark:text-indigo-100',
    accentColor: 'text-indigo-400',
    barGradient: 'from-cyan-500 via-indigo-500 to-purple-500',
    shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.4)]'
  };
  if (level >= 9) return { // Gold
    border: 'bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-300 animate-pulse',
    cardBg: 'bg-yellow-50 dark:bg-gray-900',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    titleGradient: 'from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400',
    textColor: 'text-amber-900 dark:text-amber-100',
    accentColor: 'text-amber-400',
    barGradient: 'from-yellow-400 via-amber-500 to-yellow-500',
    shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]'
  };
  if (level >= 8) return { // Ruby
    border: 'bg-gradient-to-br from-rose-400 via-red-500 to-rose-400',
    cardBg: 'bg-rose-50 dark:bg-gray-900',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
    titleGradient: 'from-rose-600 to-red-600 dark:from-rose-400 dark:to-red-400',
    textColor: 'text-rose-900 dark:text-rose-100',
    accentColor: 'text-rose-400',
    barGradient: 'from-rose-400 via-red-500 to-rose-400',
    shadow: 'shadow-md'
  };
  if (level >= 7) return { // Topaz
    border: 'bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-300',
    cardBg: 'bg-cyan-50 dark:bg-gray-900',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    titleGradient: 'from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400',
    textColor: 'text-cyan-900 dark:text-cyan-100',
    accentColor: 'text-cyan-400',
    barGradient: 'from-cyan-400 via-sky-500 to-blue-500',
    shadow: 'shadow-md'
  };
  if (level >= 5) return { // Emerald
    border: 'bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-300',
    cardBg: 'bg-emerald-50 dark:bg-gray-900',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleGradient: 'from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    accentColor: 'text-emerald-400',
    barGradient: 'from-emerald-400 via-teal-500 to-emerald-400',
    shadow: 'shadow-sm'
  };
  if (level >= 3) return { // Bronze
    border: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-200',
    cardBg: 'bg-orange-50 dark:bg-gray-900',
    iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    titleGradient: 'from-orange-600 to-red-500 dark:from-orange-400 dark:to-red-400',
    textColor: 'text-orange-900 dark:text-orange-100',
    accentColor: 'text-orange-400',
    barGradient: 'from-orange-400 to-red-400',
    shadow: 'shadow-sm'
  };
  if (level >= 1) return { // Silver
    border: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-300',
    cardBg: 'bg-slate-50 dark:bg-gray-900',
    iconBg: 'bg-slate-200 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-400',
    titleGradient: 'from-slate-600 to-gray-500 dark:from-slate-400 dark:to-gray-300',
    textColor: 'text-slate-800 dark:text-slate-200',
    accentColor: 'text-slate-400',
    barGradient: 'from-slate-400 via-gray-500 to-slate-400',
    shadow: 'shadow-md'
  };
  // Basic
  return {
    border: 'bg-gray-200 dark:bg-gray-700',
    cardBg: 'bg-gray-50 dark:bg-gray-900',
    iconBg: 'bg-gray-200 dark:bg-gray-800',
    iconColor: 'text-gray-500 dark:text-gray-400',
    titleGradient: 'from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200',
    textColor: 'text-gray-700 dark:text-gray-300',
    accentColor: 'text-gray-400',
    barGradient: 'from-gray-400 to-gray-500',
    shadow: 'shadow-sm'
  };
};
