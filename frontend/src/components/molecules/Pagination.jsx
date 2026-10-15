import React from "react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

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

  const buttonClass = [
    "min-h-11 px-6 py-2.5 rounded-full text-sm font-medium uppercase tracking-wide",
    "bg-brand-600 text-cream transition-colors hover:bg-brand-700",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-600",
    FOCUS_RING,
  ].join(" ");

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-3 sm:gap-4 mt-10 sm:mt-12 flex-wrap"
    >
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className={buttonClass}
      >
        Prev
      </button>

      <p className="text-cream/80 text-sm">
        Halaman <span className="text-brand-400 font-medium">{page}</span>{" "}
        dari <span className="text-brand-400 font-medium">{totalPages}</span>
      </p>

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className={buttonClass}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
