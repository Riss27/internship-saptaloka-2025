import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin } from "react-icons/fi";

// Fungsi helper untuk menentukan warna badge
const getStatusBadge = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-green-600/80 text-green-200';
    case 'Coming Soon':
      return 'bg-blue-600/80 text-blue-200';
    case 'Closed':
    case 'Finished':
      return 'bg-slate-600/80 text-slate-300';
    default:
      return 'bg-gray-600/80 text-gray-200';
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

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/20">
      <Link to={`/events/${event.id}`} className="block">
        <div className="w-full h-56 overflow-hidden relative">
          <img 
            src={`http://localhost:3000${event.imageBannerUrl}`} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
          />
          {/* --- TAMBAHKAN BADGE STATUS DI SINI --- */}
          {event.status && (
            <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>
              {event.status}
            </span>
          )}
          {/* ------------------------------------- */}
        </div>
        <div className="p-5">
          <h3 className="font-bold text-xl text-white mt-1 truncate group-hover:text-cyan-400" title={event.title}>
            {event.title}
          </h3>
          <div className="flex items-center text-slate-400 text-sm mt-2">
            <FiCalendar className="mr-2" />
            <span>{formatDate(event.startDateTime)}</span>
          </div>
          <div className="flex items-center text-slate-400 text-sm mt-1">
            <FiMapPin className="mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;