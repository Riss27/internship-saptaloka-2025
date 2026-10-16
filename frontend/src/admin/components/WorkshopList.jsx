import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Calendar } from "lucide-react";
import RichTextDisplay from "../../components/common/RichTextDisplay";
import API_BASE from "../../lib/apiBase";

const WorkshopList = ({ workshops, deleteWorkshop }) => {
  // Tampilkan pesan jika tidak ada data
  if (workshops.length === 0) {
    return (
      <div className="text-center py-16 bg-brand-800/50 rounded-lg">
        <p className="text-cream/60 text-lg">Belum ada workshop yang dibuat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {workshops.map((workshop) => (
        <div
          key={workshop.id}
          className="bg-brand-800/50 rounded-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 "
        >
          <img
            src={`${API_BASE}${workshop.imageUrl}`}
            alt={workshop.title}
            className="w-full md:w-1/3 h-48 md:h-auto object-cover"
          />
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-2xl font-bold text-cream mt-2">
                {workshop.title}
              </h2>
              <RichTextDisplay
                content={workshop.description}
                className="text-cream/80 mt-2 max-h-24 overflow-hidden"
                isDark={true}
              />

              <h3 className="font-semibold text-cream/80 mt-4 mb-2 border-t border-border pt-3">
                Bundled Events:
              </h3>
              <div className="flex flex-wrap gap-2">
                {workshop.Events.map((event) => (
                  <span
                    key={event.id}
                    className="bg-brand-700 text-cream/80 text-sm px-3 py-1 rounded-full flex items-center"
                  >
                    <Calendar aria-hidden="true" className="w-4 h-4 mr-2" />
                    {event.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Link
                to={`/admin/workshop/edit/${workshop.id}`}
                className="inline-flex items-center justify-center min-h-11 min-w-11 p-2 bg-yellow-500/20 text-yellow-300 rounded-full hover:bg-yellow-500/40 transition-colors"
                title="Edit Workshop"
                aria-label="Edit Workshop"
              >
                <Pencil aria-hidden="true" className="w-4 h-4" />
              </Link>
              <button
                onClick={() => deleteWorkshop(workshop.id)}
                className="min-h-11 min-w-11 grid place-items-center p-2 bg-red-500/20 text-red-400 rounded-full bg-red-500/40 transition-colors"
                title="Delete Workshop"
                aria-label="Delete Workshop"
              >
                <Trash2 aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkshopList;
