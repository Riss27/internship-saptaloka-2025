import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

/**
 * Page-level error banner.
 *
 * The banner takes focus on mount whenever it has content, so a screen
 * reader lands on the explanation instead of a form that silently failed.
 * Callers pass their own margin (usually mb-6) through className; the
 * component itself owns only the banner chrome.
 */
const ErrorBanner = ({ title, message, onDismiss, className = "" }) => {
  const reduced = useReducedMotion();
  const bannerRef = useRef(null);

  useEffect(() => {
    if (message) {
      bannerRef.current?.focus();
    }
  }, [message]);

  // Selalu null saat message kosong — title selalu hardcoded di caller,
  // jadi tanpa guard ini banner "Gagal menyimpan" hantu tampil di mount.
  if (!message) return null;

  return (
    <motion.div
      ref={bannerRef}
      role="alert"
      tabIndex={-1}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4 outline-none ${className}`}
    >
      <TriangleAlert
        aria-hidden="true"
        className="w-5 h-5 shrink-0 mt-0.5 text-red-400"
      />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold text-red-400 text-sm">{title}</p>}
        {message && <p className="mt-1 text-cream/80 text-sm">{message}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup pesan"
          className={`grid shrink-0 place-items-center min-h-11 min-w-11 rounded-full text-cream/60 hover:text-cream transition-colors ${FOCUS_RING}`}
        >
          <X aria-hidden="true" className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};

export default ErrorBanner;
