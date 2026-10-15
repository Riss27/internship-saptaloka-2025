import React from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

// Status is signalled with surface tone rather than a separate red, so the card
// stays inside the brand palette. Open is the only fully solid badge.
const getStatusBadge = (status) => {
  const badges = {
    Open: "bg-brand-600 text-cream",
    "Coming Soon": "bg-brand-600/70 text-cream",
    Closed: "bg-brand-800 text-cream/80 border border-border",
    Finished: "bg-brand-800 text-cream/80 border border-border",
  };
  return badges[status] || "bg-brand-800 text-cream/80 border border-border";
};

const EventCard = ({ event }) => {
  const translatedTitle = useTranslateDB(event.title);
  const translatedStatus = useTranslateDB(event.status);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const availableQuota = event.quota - (event.registeredCount || 0);

  return (
    <div className="bg-brand-800 rounded-cards overflow-hidden group border border-border flex flex-col h-full">
      <Link
        to={`/events/${event.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="block shrink-0"
      >
        {/* Image Container */}
        <div className="w-full h-56 shrink-0 overflow-hidden bg-brand-700 relative">
          <LazyLoadImage
            alt=""
            src={`${API_BASE}${event.imageBannerUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
            wrapperClassName="w-full h-full"
            threshold={100}
          />
          {event.status && (
            <span
              className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-medium rounded-full uppercase ${getStatusBadge(event.status)}`}
            >
              {translatedStatus}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link
          to={`/events/${event.id}`}
          aria-label={`${translatedTitle}, view event details`}
          className={`self-start rounded-xs ${FOCUS_RING}`}
        >
          <h3
            className="font-medium text-xl text-cream mb-4 line-clamp-2 leading-snug uppercase transition-colors group-hover:text-brand-400"
            title={translatedTitle}
          >
            {translatedTitle}
          </h3>
        </Link>

        <div className="space-y-2.5 text-cream/80 text-sm flex-grow">
          <div className="flex items-center gap-2.5">
            <FiCalendar className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
            <span>{formatDate(event.startDateTime)}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiClock className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
            <span>{formatTime(event.startDateTime)} WIB</span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiMapPin className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiDollarSign className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
            <span className="font-semibold text-cream">
              {event.fee > 0
                ? `Rp ${new Intl.NumberFormat("id-ID").format(event.fee)}`
                : "Gratis"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiUsers className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
            <span>
              Sisa kuota:{" "}
              <strong className="text-cream font-semibold">
                {availableQuota > 0 ? availableQuota : "Penuh"}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;