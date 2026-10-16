import React from "react";

/**
 * Section heading.
 *
 * Left aligned, because a centred heading on a wide canvas leaves the reader no
 * edge to start from. The index is the editorial touch: it gives the eye an
 * anchor and makes the page read as a sequence rather than a stack of boxes.
 *
 * Heading copy stays mixed case in the subtitle. Only the heading itself is
 * uppercase, which is where the system puts its declarative voice.
 */
const SectionHeading = ({ index, title, subtitle, action = null }) => (
  <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14">
    <div className="max-w-2xl">
      {index && (
        <p className="text-meta uppercase tracking-[0.2em] text-brand-400 mb-4">
          {index}
        </p>
      )}
      <h2 className="text-heading-sm text-cream uppercase">{title}</h2>
      <div
        className="w-16 border-t border-dashed border-brand-400/50 mt-5"
        aria-hidden="true"
      />
      {subtitle && <p className="text-body text-cream/70 mt-5">{subtitle}</p>}
    </div>
    {action}
  </header>
);

export default SectionHeading;
