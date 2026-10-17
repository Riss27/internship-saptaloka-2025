import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TriangleAlert } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Destructive-action confirmation.
 *
 * Focus lands on the cancel button — the safe default, so an impatient
 * Enter never destroys anything — and Tab is trapped inside the panel until
 * the dialog closes. Callers pass inline handlers, so both are mirrored into
 * refs; otherwise typing or a loading toggle would re-run the focus effect
 * and yank focus back to cancel mid-interaction.
 */
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  danger = true,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const cancelRef = useRef(null);

  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    cancelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (loadingRef.current) return;
        onCancelRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => !el.disabled && el.getAttribute("aria-hidden") !== "true",
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  const backdropMotion = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...backdropMotion}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-brand-900/85 backdrop-blur-sm grid place-items-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !loadingRef.current) {
              onCancelRef.current?.();
            }
          }}
        >
          <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cd-title"
            aria-describedby="cd-msg"
            {...panelMotion}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-cards border border-border bg-brand-700 p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <TriangleAlert
                aria-hidden="true"
                className="w-6 h-6 shrink-0 text-red-400"
              />
              <div className="min-w-0">
                <h2 id="cd-title" className="text-subheading text-cream">
                  {title}
                </h2>
                <p
                  id="cd-msg"
                  className="mt-2 text-sm leading-relaxed text-cream/70"
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => onCancelRef.current?.()}
                className={`min-h-11 px-5 rounded-buttons-outlined border border-border text-sm font-medium text-cream/90 hover:border-brand-400 transition-colors ${FOCUS_RING}`}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => onConfirmRef.current?.()}
                disabled={loading}
                className={
                  `min-h-11 px-5 rounded-lg text-sm transition-colors disabled:opacity-60 ${FOCUS_RING} ` +
                  (danger
                    ? "bg-red-600 hover:bg-red-700 font-semibold text-cream"
                    : "bg-brand-600 hover:bg-brand-500 font-medium text-cream")
                }
              >
                {loading ? `${confirmLabel}…` : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
