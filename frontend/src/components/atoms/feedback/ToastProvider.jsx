import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const MAX_VISIBLE = 3;
const EXIT_MS = 220;

const VARIANTS = {
  success: {
    duration: 3000,
    borderClass: "border-l-brand-400",
    Icon: CheckCircle2,
    iconClass: "text-brand-400",
  },
  error: {
    duration: 6000,
    borderClass: "border-l-red-400",
    Icon: CircleAlert,
    iconClass: "text-red-400",
  },
  info: {
    duration: 4000,
    borderClass: "border-l-cream/40",
    Icon: Info,
    iconClass: "text-cream/80",
  },
};

const ToastContext = createContext(null);

/**
 * Transient notifications.
 *
 * The queue lives in context and renders through a portal on the body, so
 * toasts sit above every layer including the admin sidebar and dialogs. At
 * most three cards are visible; a fourth push dismisses the oldest one
 * immediately. Auto-dismiss timers pause while the pointer rests over the
 * viewport so a hovered message never disappears mid-read, and focus is
 * deliberately never moved into a toast.
 */
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // id -> { remaining, deadline, handle, started, paused }. Timers live in a
  // ref so pausing on hover never re-renders the tree.
  const timersRef = useRef(new Map());
  const idRef = useRef(0);

  const clearTimer = useCallback((id) => {
    const entry = timersRef.current.get(id);
    if (entry) {
      if (entry.handle) clearTimeout(entry.handle);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id) => {
      clearTimer(id);
      setToasts((prev) => {
        if (prev.some((t) => t.id === id && t.leaving)) return prev;
        return prev.map((t) => (t.id === id ? { ...t, leaving: true } : t));
      });
      // Remove once the exit animation has had time to finish. The exact
      // frame does not matter; a tick past EXIT_MS is enough.
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, EXIT_MS + 40);
    },
    [clearTimer],
  );

  const push = useCallback((variant, message, duration) => {
    const id = ++idRef.current;
    timersRef.current.set(id, {
      remaining: duration,
      deadline: null,
      handle: null,
      started: false,
      paused: false,
    });
    setToasts((prev) => [
      ...prev,
      { id, variant, message, duration, leaving: false },
    ]);
  }, []);

  // Enforce the visible cap: the oldest non-leaving cards beyond
  // MAX_VISIBLE are dismissed the moment the queue overflows.
  useEffect(() => {
    const active = toasts.filter((t) => !t.leaving);
    if (active.length > MAX_VISIBLE) {
      active
        .slice(0, active.length - MAX_VISIBLE)
        .forEach((t) => dismiss(t.id));
    }
  }, [toasts, dismiss]);

  // Start any timer that has not been started yet. Runs on every render
  // because the ref map is not reactive; the started flag keeps it idempotent.
  useEffect(() => {
    toasts.forEach((t) => {
      const entry = timersRef.current.get(t.id);
      if (entry && !entry.started && !entry.paused) {
        entry.started = true;
        entry.handle = setTimeout(() => dismiss(t.id), entry.remaining);
        entry.deadline = Date.now() + entry.remaining;
      }
    });
  });

  // Clear everything if the provider unmounts.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((entry) => {
        if (entry.handle) clearTimeout(entry.handle);
      });
      timers.clear();
    };
  }, []);

  // Pause: freeze each running timer at its remaining value.
  const pauseTimers = useCallback(() => {
    const now = Date.now();
    timersRef.current.forEach((entry) => {
      if (entry.handle) {
        clearTimeout(entry.handle);
        entry.remaining = Math.max(0, entry.deadline - now);
        entry.handle = null;
        entry.deadline = null;
        entry.paused = true;
      }
    });
  }, []);

  // Resume: restart from where each timer stopped. The id comes from the map
  // key, since the entry alone cannot say which toast it belongs to.
  const resumeTimers = useCallback(() => {
    const now = Date.now();
    timersRef.current.forEach((entry, id) => {
      if (entry.paused) {
        entry.paused = false;
        entry.started = true;
        entry.handle = setTimeout(() => dismiss(id), entry.remaining);
        entry.deadline = now + entry.remaining;
      }
    });
  }, [dismiss]);

  const api = useMemo(
    () => ({
      success: (message, opts) =>
        push("success", message, opts?.duration ?? VARIANTS.success.duration),
      error: (message, opts) =>
        push("error", message, opts?.duration ?? VARIANTS.error.duration),
      info: (message, opts) =>
        push("info", message, opts?.duration ?? VARIANTS.info.duration),
    }),
    [push],
  );

  const value = useMemo(() => ({ toast: api }), [api]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            role="region"
            aria-label="Notifikasi"
            className="fixed right-4 top-16 md:top-4 z-[60] flex flex-col gap-3 w-[min(24rem,calc(100vw-2rem))]"
            onMouseEnter={pauseTimers}
            onMouseLeave={resumeTimers}
          >
            <AnimatePresence initial={false}>
              {toasts.map((t) => (
                <ToastCard
                  key={t.id}
                  toast={t}
                  onDismiss={() => dismiss(t.id)}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};

const ToastCard = ({ toast: t, onDismiss }) => {
  const reduced = useReducedMotion();
  const { borderClass, Icon, iconClass } = VARIANTS[t.variant];

  const initial = reduced ? { opacity: 0 } : { opacity: 0, x: 24 };
  const animate = reduced ? { opacity: 1 } : { opacity: 1, x: 0 };
  const exit = reduced ? { opacity: 0 } : { opacity: 0, x: 24 };

  return (
    <motion.div
      role={t.variant === "error" ? "alert" : "status"}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start gap-3 rounded-cards border border-border bg-brand-700 p-4 border-l-4 ${borderClass}`}
    >
      <Icon
        aria-hidden="true"
        className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`}
      />
      <p className="flex-1 text-sm text-cream/90 break-words">{t.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className={`grid shrink-0 place-items-center min-h-11 min-w-11 rounded-full text-cream/60 hover:text-cream transition-colors ${FOCUS_RING}`}
      >
        <X aria-hidden="true" className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

// The hook lives here by design (spec: context + hook in one file), which
// react-refresh cannot know about; fast-refresh degrades instead of breaking.
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast harus dipakai di dalam <ToastProvider>. Bungkus bagian aplikasi yang membutuhkan notifikasi dengan ToastProvider terlebih dahulu.",
    );
  }
  return ctx;
};

export default ToastProvider;
