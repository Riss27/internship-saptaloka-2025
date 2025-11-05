import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiClock, FiDollarSign, FiUsers } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";

const getStatusBadge = (status) => {
  const badges = {
    Open: "bg-green-100 text-green-800",
    "Coming Soon": "bg-blue-100 text-blue-800",
    Closed: "bg-red-100 text-red-800",
    Finished: "bg-slate-200 text-slate-700",
  };
  return badges[status] || "bg-gray-200 text-gray-700";
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
    <div className="bg-white rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full">
      <Link to={`/events/${event.id}`} className="block">
        {/* Image Container */}
        <div className="w-full h-56 overflow-hidden bg-slate-100 relative">
          <LazyLoadImage
            alt={event.title}
            src={`http://localhost:3000${event.imageBannerUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            wrapperClassName="w-full h-full"
            threshold={100}
          />
          {event.status && <span className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${getStatusBadge(event.status)}`}>{translatedStatus}</span>}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/events/${event.id}`}>
          <h3 className="font-bold text-xl text-slate-800 mb-4 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors" title={translatedTitle}>
            {translatedTitle}
          </h3>
        </Link>

        <div className="space-y-2.5 text-slate-600 text-sm flex-grow">
          <div className="flex items-center gap-2.5">
            <FiCalendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{formatDate(event.startDateTime)}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiClock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{formatTime(event.startDateTime)} WIB</span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiMapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiDollarSign className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-emerald-700">{event.fee > 0 ? `Rp ${new Intl.NumberFormat("id-ID").format(event.fee)}` : "Gratis"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <FiUsers className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Sisa kuota: <strong>{availableQuota > 0 ? availableQuota : "Penuh"}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
