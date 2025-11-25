// Toast Component
window.Toast = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-4 pl-4 pr-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-indigo-100 dark:border-indigo-900 min-w-[320px]"
      style={{ animation: 'xboxPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
    >
      {/* Icon Circle */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
        <TrophyIcon size={24} className="text-yellow-500 animate-pulse" />
      </div>

      {/* Text Content */}
      <div className="flex flex-col flex-grow">
        <span className="text-xs font-bold tracking-wide text-indigo-500 dark:text-indigo-400 uppercase">
          Level Up!
        </span>
        <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100 leading-tight">
          {message.replace("Level Up! ", "")}
        </span>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Close notification"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
};
