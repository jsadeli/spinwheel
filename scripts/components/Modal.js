// @ts-ignore
import React from "react";

// Generic Reusable Modal Component
/**
 * A generic, reusable modal component with backdrop, animation, and close handlers.
 * Supports custom headers, footers, and content.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is currently visible.
 * @param {() => void} props.onClose - Callback function to close the modal.
 * @param {React.ReactNode} [props.title] - The title content to display in the header.
 * @param {React.ReactNode} [props.icon] - Optional icon to display next to the title.
 * @param {React.ReactNode} [props.header] - Optional sticky header content below the title bar.
 * @param {React.ReactNode} props.children - The content to display inside the modal body.
 * @param {React.ReactNode} [props.footer] - Optional content to display in the footer.
 * @param {string} [props.className=""] - Additional CSS classes for the modal container.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  icon,
  header,
  children,
  footer,
  className = "",
}) => {
  if (!isOpen) return null;

  const { useEffect } = React;
  const { CloseIcon } = window; // Access global Icon component

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop / Overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 flex flex-col max-h-[85vh] overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              {icon && <span className="mr-2 text-indigo-500">{icon}</span>}
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

        {/* Optional Custom Header Content (Sticky) */}
        {header && <div className="px-6 pb-4">{header}</div>}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">{children}</div>

        {/* Optional Footer */}
        {footer && <div className="px-6 pb-6">{footer}</div>}
      </div>
    </div>
  );
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.Modal = Modal;
}
