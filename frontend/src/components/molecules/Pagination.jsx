import React from "react";

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || !meta.totalPages || meta.totalPages <= 1) {
    return null;
  }

  const { page, totalPages } = meta;

  const goTo = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageChange(newPage);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-12 flex-wrap">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="px-6 py-2 rounded-full font-semibold bg-white text-slate-700 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Prev
      </button>

      <p className="text-slate-600">
        Halaman <span className="text-emerald-700 font-semibold">{page}</span> dari <span className="text-emerald-800 font-semibold">{totalPages}</span>
      </p>

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="px-6 py-2 rounded-full font-semibold bg-white text-slate-700 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
