import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiClock, FiDollarSign, FiUsers } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Fungsi helper untuk menentukan warna badge
const getStatusBadge = (status) => {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-800";
    case "Coming Soon":
      return "bg-blue-100 text-blue-800";
    case "Closed":
    case "Finished":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const EventCard = ({ event }) => {
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

  // Hitung sisa kuota
  const availableQuota = event.quota - (event.registeredCount || 0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-emerald-500/20 border border-slate-100 flex flex-col">
      <Link to={`/events/${event.id}`} className="block">
        <div className="w-full h-56 overflow-hidden relative bg-slate-100">
          <LazyLoadImage
            alt={event.title}
            src={`http://localhost:3000${event.imageBannerUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            wrapperClassName="w-full h-full"
            threshold={100}
          />
          {event.status && <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>{event.status}</span>}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/events/${event.id}`}>
          <h3 className="font-bold text-xl text-slate-800 mt-1 truncate group-hover:text-emerald-600 transition-colors" title={event.title}>
            {event.title}
          </h3>
        </Link>
        <div className="space-y-2 text-slate-500 text-sm mt-3 flex-grow">
          <div className="flex items-center gap-2">
            <FiCalendar />
            <span>{formatDate(event.startDateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock />
            <span>{formatTime(event.startDateTime)} WIB</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiDollarSign />
            <span>{event.fee > 0 ? `Rp ${new Intl.NumberFormat("id-ID").format(event.fee)}` : "Gratis"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers />
            <span>Sisa kuota: {availableQuota > 0 ? availableQuota : "Penuh"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
