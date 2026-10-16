import React from "react";

/**
 * A page band.
 *
 * The earlier layout wrapped every block in a raised panel with a border, which
 * stacked box inside box down the page and flattened the whole thing into a
 * template. Sections are now separated by space and an optional hairline, and
 * only content that is genuinely a surface gets a surface.
 */
const Section = ({ children, className = "", divider = false, id }) => (
  <section
    id={id}
    className={`relative ${divider ? "border-t border-border" : ""} ${className}`}
  >
    {children}
  </section>
);

export default Section;
