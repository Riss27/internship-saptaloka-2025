import React from "react";

const StatCard = ({ icon, label, value, spanLast = false }) => (
  <div
    className={`rounded-lg border border-border bg-brand-800/50 p-4 sm:p-5 ${spanLast ? "last:col-span-2 md:last:col-span-1" : ""}`}
  >
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-700 text-brand-400"
      >
        {icon}
      </span>
      <span className="text-meta text-cream/60 truncate">{label}</span>
    </div>
    <p className="mt-3 text-3xl font-bold text-cream">{value}</p>
  </div>
);

export default StatCard;
