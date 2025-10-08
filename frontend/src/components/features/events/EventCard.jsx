import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiClock, FiDollarSign, FiUsers } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Fungsi helper untuk menentukan warna badge
const getStatusBadge = (status) => {
  switch (status) {
    case "Open":
      return "bg-green-600/80 text-green-200";
    case "Coming Soon":
      return "bg-blue-600/80 text-blue-200";
    case "Closed":
    case "Finished":
      return "bg-slate-600/80 text-slate-300";
    default:
      return "bg-gray-600/80 text-gray-200";
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
    <div className="bg-slate-800 rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/20 flex flex-col">
      <Link to={`/events/${event.id}`} className="block">
        <div className="w-full h-56 overflow-hidden relative bg-slate-900">
          <LazyLoadImage
            alt={event.title}
            src={`http://localhost:3000${event.imageBannerUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f172a' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2322d3ee'%3ELoading...%3C/text%3E%3C/svg%3E"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f172a' width='400' height='300'/%3E%3Cpath d='M150 100h100v80h-100z' fill='%231e293b'/%3E%3Ccircle cx='170' cy='130' r='10' fill='%2322d3ee'/%3E%3Cpath d='M150 160l30-20 25 15 45-35v60h-100z' fill='%230e7490'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2322d3ee'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
            wrapperClassName="w-full h-full"
            threshold={100}
          />
          {event.status && <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>{event.status}</span>}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/events/${event.id}`}>
          <h3 className="font-bold text-xl text-white mt-1 truncate group-hover:text-cyan-400" title={event.title}>
            {event.title}
          </h3>
        </Link>
        <div className="space-y-2 text-slate-400 text-sm mt-3 flex-grow">
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
