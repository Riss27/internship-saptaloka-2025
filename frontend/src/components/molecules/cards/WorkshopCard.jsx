import React from "react";
import { Link } from "react-router-dom";
import { FiTag, FiCalendar } from "react-icons/fi";
import { ArrowRight } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import RichTextDisplay from "../../common/RichTextDisplay";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const WorkshopCard = ({ workshop }) => {
  const translatedTitle = useTranslateDB(workshop.title);
  const translatedDescription = useTranslateDB(workshop.description);

  return (
    <div className="bg-brand-800 rounded-cards overflow-hidden group border border-border flex flex-col h-full">
      <Link
        to={`/workshops/${workshop.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="block shrink-0"
      >
        {/* Image Container */}
        <div className="w-full h-56 shrink-0 overflow-hidden bg-brand-700 relative">
          <LazyLoadImage
            alt=""
            src={`${API_BASE}${workshop.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
            wrapperClassName="w-full h-full"
            threshold={100}
          />
          {workshop.category && (
            <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium rounded-full bg-brand-600 text-cream uppercase">
              {workshop.category}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link
          to={`/workshops/${workshop.id}`}
          aria-label={`${translatedTitle}, view workshop details`}
          className={`self-start rounded-xs ${FOCUS_RING}`}
        >
          <h3
            className="font-medium text-xl text-cream mb-3 line-clamp-2 leading-snug uppercase transition-colors group-hover:text-brand-400"
            title={translatedTitle}
          >
            {translatedTitle}
          </h3>
        </Link>

        <div className="space-y-2.5 text-cream/80 text-sm flex-grow mb-4">
          {workshop.category && (
            <div className="flex items-center gap-2.5">
              <FiTag className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
              <span>{workshop.category}</span>
            </div>
          )}

          {workshop.Events && workshop.Events.length > 0 && (
            <div className="flex items-center gap-2.5">
              <FiCalendar className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
              <span>
                {workshop.Events.length}{" "}
                {workshop.Events.length === 1 ? "Event" : "Events"}
              </span>
            </div>
          )}

          <RichTextDisplay
            content={translatedDescription}
            className=" text-cream/80 line-clamp-3"
          />
        </div>

        <Link
          to={`/workshops/${workshop.id}`}
          className={`mt-auto inline-flex items-center gap-2 min-h-11 self-start text-brand-400 hover:text-cream font-medium text-sm uppercase tracking-wide transition-colors ${FOCUS_RING}`}
        >
          Lihat Detail
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default WorkshopCard;