import React from "react";

/**
 * Page masthead.
 *
 * Replaces the centred title block that every list page repeated. The title is
 * left aligned and set at the display size, with the subtitle in the mixed case
 * body voice directly underneath. That contrast between the two voices is the
 * whole point of the type scale: the heading declares, the sentence explains.
 */
const PageHeader = ({ eyebrow, title, subtitle, children }) => (
  <header className="mb-12 sm:mb-16 lg:mb-20">
    {eyebrow && (
      <p className="text-meta uppercase tracking-[0.2em] text-brand-400 mb-5">
        {eyebrow}
      </p>
    )}
    <h1 className="text-heading text-cream uppercase">{title}</h1>
    {subtitle && (
      <p className="text-voice text-cream/70 mt-6 max-w-2xl">{subtitle}</p>
    )}
    {children}
  </header>
);

export default PageHeader;
