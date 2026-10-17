import React from "react";

const ListPanel = ({ title, emptyMessage, children }) => (
  <section className="rounded-lg border border-border bg-brand-800/50 p-4 sm:p-6">
    <h2 className="text-subheading text-cream mb-2">{title}</h2>
    {children ? (
      <div>{children}</div>
    ) : (
      <p className="py-3 text-sm text-cream/60 italic">{emptyMessage}</p>
    )}
  </section>
);

export default ListPanel;
