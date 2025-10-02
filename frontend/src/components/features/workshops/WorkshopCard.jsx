import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";

const WorkshopCard = ({ workshop }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/20">
      <Link to={`/workshops/${workshop.id}`} className="block">
        <div className="w-full h-56 overflow-hidden relative">
          <img src={`http://localhost:3000${workshop.imageUrl}`} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${workshop.status === "published" ? "bg-green-600/80 text-green-200" : "bg-yellow-600/80 text-yellow-200"}`}>{workshop.status}</span>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-xl text-white mt-2 truncate group-hover:text-cyan-400" title={workshop.title}>
            {workshop.title}
          </h3>
          <div className="prose prose-sm prose-invert text-slate-400 mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: workshop.description }} />
          <div className="mt-4 pt-3 border-t border-slate-700">
            <p className="text-xs font-semibold text-slate-400 mb-2">Termasuk Event:</p>
            <div className="flex flex-wrap gap-2">
              {workshop.Events.slice(0, 2).map((event) => (
                <span key={event.id} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                  {event.title}
                </span>
              ))}
              {workshop.Events.length > 2 && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">+{workshop.Events.length - 2} lainnya</span>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WorkshopCard;
