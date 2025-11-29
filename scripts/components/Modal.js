// Generic Reusable Modal Component
window.Modal = ({ isOpen, onClose, title, icon, children, footer, className = "" }) => {
  if (!isOpen) return null;

  const { useEffect } = React;
  const { CloseIcon } = window; // Access global Icon component

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop / Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 flex flex-col max-h-[85vh] overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              {icon && (
                <span className="mr-2 text-indigo-500">
                  {icon}
                </span>
              )}
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-6 pb-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
