import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

/**
 * Sortable table header cell.
 *
 * Stateless: the page owns sort state and decides what clicking the active
 * column does (toggle, or clear back to default). This component only
 * reports the requested sortKey and reflects the current state through
 * aria-sort and the directional icon, so assistive tech hears which column
 * is ordered and in which direction.
 */
const SortableHeader = ({
  label,
  sortKey,
  activeSort,
  order,
  onSort,
  ...thProps
}) => {
  const isActive = activeSort === sortKey;

  return (
    <th
      aria-sort={
        isActive ? (order === "asc" ? "ascending" : "descending") : "none"
      }
      className="p-0 font-semibold"
      {...thProps}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex w-full min-h-11 items-center gap-1.5 px-4 text-left text-cream/80 hover:text-cream transition-colors ${FOCUS_RING}`}
      >
        {label}
        {isActive ? (
          order === "asc" ? (
            <ArrowUp className="w-4 h-4 text-brand-400" aria-hidden="true" />
          ) : (
            <ArrowDown className="w-4 h-4 text-brand-400" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown
            className="w-3.5 h-3.5 text-cream/40"
            aria-hidden="true"
          />
        )}
        {isActive && (
          <span className="sr-only">
            {order === "asc" ? "(urutan naik)" : "(urutan turun)"}
          </span>
        )}
      </button>
    </th>
  );
};

export default SortableHeader;
