import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const LABELS = {
  uploading: "Mengunggah gambar…",
  processing: "Memroses gambar…",
  failed: "Unggahan gagal.",
};

/**
 * Upload state overlay for a dropzone.
 *
 * Absolutely positioned so it sits on the bottom edge of a
 * `relative overflow-hidden` container without moving the drop copy.
 * The bar is decorative reinforcement: the percentage is also written out
 * in text and announced politely, so it never relies on the fill alone.
 */
const UploadProgress = ({ phase, percent }) => {
  const reduced = useReducedMotion();

  if (!phase) return null;

  return (
    <div
      aria-live="polite"
      className="absolute inset-x-4 bottom-4 z-10 flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between gap-2 text-meta text-cream/70">
        <span>{LABELS[phase]}</span>
        {phase === "uploading" && <span>{percent}%</span>}
      </div>
      <div
        role="progressbar"
        aria-label="Progres unggahan"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={phase === "uploading" ? percent : undefined}
        className="h-2 w-full overflow-hidden rounded-full border border-border bg-brand-900"
      >
        {phase === "uploading" &&
          (reduced ? (
            <div
              className="h-full bg-brand-400"
              style={{ width: `${percent}%` }}
            />
          ) : (
            <motion.div
              className="h-full bg-brand-400"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.2 }}
            />
          ))}
        {phase === "processing" &&
          (reduced ? (
            <div className="h-full w-full bg-brand-400/40 animate-pulse" />
          ) : (
            <motion.div
              className="h-full w-1/3 bg-brand-400/70"
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
          ))}
        {phase === "failed" && <div className="h-full bg-red-400 w-full" />}
      </div>
    </div>
  );
};

export default UploadProgress;
