import React from "react";
import { Link } from "react-router-dom";
import { Tag, Calendar } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import RichTextDisplay from "../../common/RichTextDisplay";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

/**
 * Workshop card.
 *
 * A workshop is the one entry here that bundles other entries, so it keeps its
 * related-event count alongside the description. The detail link is pinned to
 * the bottom of the card with mt-auto, otherwise a two-line title would push it
 * down and the row of cards would end on ragged edges.
 */
const WorkshopCard = ({ workshop }) => {
  const translatedTitle = useTranslateDB(workshop.title);
  const translatedDescription = useTranslateDB(workshop.description);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-cards border border-border bg-brand-800 transition-colors hover:border-brand-400">
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-brand-700 sm:h-48">
        <Link to={`/workshops/${workshop.id}`} tabIndex={-1} aria-hidden="true">
          <LazyLoadImage
            alt=""
            src={`${API_BASE}${workshop.imageUrl}`}
            effect="blur"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
            wrapperClassName="w-full h-full"
            threshold={100}
          />
        </Link>
        {workshop.category && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-meta uppercase tracking-[0.14em] text-cream">
            {workshop.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="text-subheading leading-tight text-cream uppercase transition-colors group-hover:text-brand-400 line-clamp-2"
          title={translatedTitle}
        >
          <Link
            to={`/workshops/${workshop.id}`}
            aria-label={`${translatedTitle}, view workshop details`}
            className={FOCUS_RING}
          >
            {translatedTitle}
          </Link>
        </h3>

        <div className="mb-5 mt-4 flex-1 space-y-2.5 text-meta text-cream/70">
          {workshop.category && (
            <p className="flex items-center gap-2.5">
              <Tag
                className="h-4 w-4 flex-shrink-0 text-brand-400"
                aria-hidden="true"
              />
              <span>{workshop.category}</span>
            </p>
          )}

          {workshop.Events && workshop.Events.length > 0 && (
            <p className="flex items-center gap-2.5">
              <Calendar
                className="h-4 w-4 flex-shrink-0 text-brand-400"
                aria-hidden="true"
              />
              <span>
                {workshop.Events.length}{" "}
                {workshop.Events.length === 1 ? "Event" : "Events"}
              </span>
            </p>
          )}

          <RichTextDisplay
            content={translatedDescription}
            className="text-cream/70 line-clamp-3"
          />
        </div>

        <div className="mt-auto border-t border-border pt-4">
          <Link
            to={`/workshops/${workshop.id}`}
            className={`inline-flex min-h-11 items-center gap-2 text-meta uppercase tracking-[0.18em] text-brand-400 transition-colors hover:text-cream ${FOCUS_RING}`}
          >
            Lihat Detail
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;