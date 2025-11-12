import React from "react";
import { Link } from "react-router-dom";
import { FiTag, FiCalendar } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";

const WorkshopCard = ({ workshop }) => {
  const translatedTitle = useTranslateDB(workshop.title);
  const translatedDescription = useTranslateDB(workshop.description);

  return (
    <div className="bg-white rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full">
      <Link to={`/workshops/${workshop.id}`} className="block">
        {/* Image Container */}
        <div className="w-full h-56 overflow-hidden bg-slate-100 relative">
          <LazyLoadImage
            alt={workshop.title}
            src={`http://localhost:3000${workshop.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            wrapperClassName="w-full h-full"
            threshold={100}
          />
          {workshop.category && (
            <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm bg-emerald-100 text-emerald-800">
              {workshop.category}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/workshops/${workshop.id}`}>
          <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors" title={translatedTitle}>
            {translatedTitle}
          </h3>
        </Link>

        <div className="space-y-2.5 text-slate-600 text-sm flex-grow mb-4">
          {workshop.category && (
            <div className="flex items-center gap-2.5">
              <FiTag className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{workshop.category}</span>
            </div>
          )}

          {workshop.Events && workshop.Events.length > 0 && (
            <div className="flex items-center gap-2.5">
              <FiCalendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{workshop.Events.length} {workshop.Events.length === 1 ? "Event" : "Events"}</span>
            </div>
          )}

          <div className="prose prose-sm max-w-none text-slate-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: translatedDescription }} />
        </div>

        <Link
          to={`/workshops/${workshop.id}`}
          className="mt-auto text-emerald-600 hover:text-emerald-800 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
        >
          Lihat Detail <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default WorkshopCard;

