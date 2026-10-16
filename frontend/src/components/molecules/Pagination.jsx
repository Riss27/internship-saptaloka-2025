import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

/**
 * Page controls.
 *
 * Paging is a utility, so it does not get to be the loudest thing under a
 * gallery. The two controls are quiet outlined rectangles rather than filled
 * pills, and a hairline above the row separates the paging from the last row of
 * content the way it would in a printed index. The position sits between them
 * and takes the remaining width, so it stays centred even when the two controls
 * are different widths on a narrow phone.
 */
const Pagination = ({ meta, onPageChange }) => {
  if (!meta || !meta.totalPages || meta.totalPages <= 1) {
    return null;
  }

  const { page, totalPages } = meta;

  const goTo = (newPage) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    onPageChange(newPage);
  };

  const controlClass = [
    "min-h-11 px-4 sm:px-5 rounded-buttons-outlined border border-border",
    "inline-flex items-center gap-2 text-meta font-medium uppercase tracking-[0.18em]",
    "text-cream/80 transition-colors hover:border-brand-400 hover:text-cream",
    "disabled:opacity-40 disabled:hover:border-border disabled:hover:text-cream/80 disabled:cursor-not-allowed",
    FOCUS_RING,
  ].join(" ");

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 sm:mt-16 border-t border-border pt-6 sm:pt-7"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-6">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className={controlClass}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          Prev
        </button>

        <p className="flex-1 px-2 text-center text-meta text-cream/60 sm:border-x sm:border-border sm:px-6 sm:py-2">
          Halaman <span className="text-brand-400 font-medium">{page}</span> dari{" "}
          <span className="text-brand-400 font-medium">{totalPages}</span>
        </p>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className={controlClass}
        >
          Next
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;