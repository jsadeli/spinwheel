// @ts-ignore
import React from "react";

/**
 * A collapsible section of the settings dropdown: a clickable header that toggles a body of
 * option rows. Renders header and body as siblings (not nested in a wrapper) so the panel's
 * `last:border-b-0` and scroll layout keep working on the section that happens to be last.
 *
 * Sections start collapsed, so the header carries `summary` — the section's current value —
 * to keep the setting visible without expanding it.
 *
 * @param {Object} props - Component props.
 * @param {string} props.id - Stable id for this section; also seeds the body's DOM id.
 * @param {string} props.title - Section label, rendered uppercase.
 * @param {string} [props.summary] - Current value shown on the right while collapsed.
 * @param {boolean} props.isOpen - Whether the body is expanded.
 * @param {() => void} props.onToggle - Called when the header is clicked.
 * @param {React.ReactNode} props.children - The option rows.
 */
export const SettingsSection = ({ id, title, summary, isOpen, onToggle, children }) => {
  const { ChevronDownIcon } = window;

  // Safety check: Don't render if icons aren't loaded yet
  if (!ChevronDownIcon) {
    return null;
  }

  const bodyId = `settings-section-${id}`;

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        className="flex items-center w-full p-2 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
      >
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        <span className="ml-auto flex items-center space-x-1 min-w-0">
          {summary && (
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{summary}</span>
          )}
          <span
            className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDownIcon size={14} />
          </span>
        </span>
      </button>

      {isOpen && (
        <div
          id={bodyId}
          className="py-1 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
        >
          {children}
        </div>
      )}
    </>
  );
};

// Expose to window (needed for Babel Standalone)
if (typeof window !== "undefined") {
  window.SettingsSection = SettingsSection;
}
