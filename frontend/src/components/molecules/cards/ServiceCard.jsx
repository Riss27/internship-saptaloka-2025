import React from "react";
import { Link } from "react-router-dom";

/**
 * Service entry.
 *
 * These are links to other parts of the site, not content, so they are treated
 * like a line in a table of contents: no filled panel, no picture, no lift on
 * hover. The row is separated by a hairline and the title simply warms to the
 * accent tone when the pointer is over it.
 *
 * The focus ring is drawn inside the row rather than outside it, because a full
 * width row would otherwise push an outline over the neighbouring entries.
 */
const ServiceCard = ({ title, description, linkTo }) => {
  return (
    <Link
      to={linkTo}
      className="group flex flex-col gap-2 border-b border-border py-6 transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400 sm:flex-row sm:items-baseline sm:gap-10"
    >
      <span className="text-subheading text-cream transition-colors group-hover:text-brand-400 sm:w-5/12 sm:shrink-0">
        {title}
      </span>
      {description && (
        <span className="text-meta leading-relaxed text-cream/60 sm:flex-1">
          {description}
        </span>
      )}
    </Link>
  );
};

export default ServiceCard;