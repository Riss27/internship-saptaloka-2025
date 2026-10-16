import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, CircleDollarSign, Users } from "lucide-react";
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

/**
 * Event card.
 *
 * The banner is short and wide, so the card reads as a landscape plate rather
 * than another portrait tile. Inside it the order is inverted from the old
 * version: the date is a small tracked label at the top and the title carries
 * the card. The remaining facts sit under a hairline at the foot, where they
 * stay readable without competing with the title.
 */
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
    <div className="group flex h-full flex-col overflow-hidden rounded-cards border border-border bg-brand-800 transition-colors hover:border-brand-400">
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-brand-700 sm:h-40">
        <Link to={`/events/${event.id}`} tabIndex={-1} aria-hidden="true">
          <LazyLoadImage
            alt=""
            src={`${API_BASE}${event.imageBannerUrl}`}
            effect="blur"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
            wrapperClassName="w-full h-full"
            threshold={100}
          />
        </Link>
        {event.status && (
          <span
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-meta uppercase tracking-[0.14em] ${getStatusBadge(event.status)}`}
          >
            {translatedStatus}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-3 flex items-center gap-2 text-meta uppercase tracking-[0.18em] text-brand-400">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          <time dateTime={event.startDateTime}>
            {formatDate(event.startDateTime)}
          </time>
        </p>

        <h3
          className="text-subheading leading-tight text-cream uppercase transition-colors group-hover:text-brand-400 line-clamp-2"
          title={translatedTitle}
        >
          <Link
            to={`/events/${event.id}`}
            aria-label={`${translatedTitle}, view event details`}
            className={FOCUS_RING}
          >
            {translatedTitle}
          </Link>
        </h3>

        <div className="mt-auto space-y-2 border-t border-border pt-4 text-meta text-cream/70">
          <p className="flex items-center gap-2.5">
            <Clock
              className="h-4 w-4 flex-shrink-0 text-brand-400"
              aria-hidden="true"
            />
            <span>{formatTime(event.startDateTime)} WIB</span>
          </p>

          <p className="flex items-center gap-2.5">
            <MapPin
              className="h-4 w-4 flex-shrink-0 text-brand-400"
              aria-hidden="true"
            />
            <span className="line-clamp-1">{event.location}</span>
          </p>

          <p className="flex items-center gap-2.5">
            <CircleDollarSign
              className="h-4 w-4 flex-shrink-0 text-brand-400"
              aria-hidden="true"
            />
            <span className="text-cream">
              {event.fee > 0
                ? `Rp ${new Intl.NumberFormat("id-ID").format(event.fee)}`
                : "Gratis"}
            </span>
          </p>

          <p className="flex items-center gap-2.5">
            <Users
              className="h-4 w-4 flex-shrink-0 text-brand-400"
              aria-hidden="true"
            />
            <span>
              Sisa kuota:{" "}
              <strong className="text-cream">
                {availableQuota > 0 ? availableQuota : "Penuh"}
              </strong>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;