import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const Popup = ({ isOpen, onClose, title, children }) => {
  const closeButtonRef = useRef(null);

  // Callers pass onClose as a fresh inline function on every render, so it is
  // kept in a ref. Otherwise the effect below would re-run on every keystroke
  // typed into the form and pull focus back onto the close button.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // The dialog behaves like a real one: Escape closes it and focus moves into
  // the panel when it opens, so a keyboard reader is never left behind the
  // scrim on the page underneath.
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-brand-900/85 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Konten Popup */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="bg-brand-700 text-cream rounded-t-cards sm:rounded-cards border border-border w-full sm:max-w-md max-h-[92svh] sm:max-h-[85vh] overflow-y-auto p-5 sm:p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Popup */}
        <div className="flex justify-between items-start gap-4 border-b border-border pb-3 mb-4 sticky top-0 bg-brand-700 z-10">
          <h2
            id="popup-title"
            className="text-lg sm:text-xl font-medium text-cream uppercase leading-snug break-words"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close the dialog"
            className={`flex-shrink-0 h-11 w-11 grid place-items-center rounded-full text-cream bg-brand-800 hover:bg-brand-600 transition-colors ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Popup;
