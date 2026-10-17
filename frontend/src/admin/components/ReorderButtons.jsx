import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

/**
 * Manual ordering controls for a list row.
 *
 * Vertical pair wired to onMove(-1) and onMove(+1); the edges of the list
 * disable the matching button so a row can never be moved past its
 * neighbours. Each button keeps a full touch target and names the item it
 * acts on, so the two identical arrows stay distinguishable by screen
 * reader.
 */
const ReorderButtons = ({ isFirst, isLast, onMove, itemName }) => {
  const buttonClass = `min-h-11 min-w-11 grid place-items-center rounded-lg border border-border text-cream/80 hover:border-brand-400 hover:text-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${FOCUS_RING}`;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={isFirst}
        aria-label={`Naikkan posisi ${itemName}`}
        className={buttonClass}
      >
        <ChevronUp className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={isLast}
        aria-label={`Turunkan posisi ${itemName}`}
        className={buttonClass}
      >
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default ReorderButtons;
