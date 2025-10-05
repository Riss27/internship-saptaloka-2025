import React from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiCalendar } from "react-icons/fi";

const WorkshopList = ({ workshops, deleteWorkshop }) => {
  // Tampilkan pesan jika tidak ada data
  if (workshops.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-800/50 rounded-lg">
        <p className="text-slate-400 text-lg">Belum ada workshop yang dibuat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {workshops.map((workshop) => (
        <div key={workshop.id} className="bg-slate-800/50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-cyan-500/20">
          <img src={`http://localhost:3000${workshop.imageUrl}`} alt={workshop.title} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-2xl font-bold text-white mt-2">{workshop.title}</h2>
              <div className="prose prose-invert text-slate-300 mt-2 max-h-24 overflow-hidden" dangerouslySetInnerHTML={{ __html: workshop.description }} />

              <h3 className="font-semibold text-slate-200 mt-4 mb-2 border-t border-slate-700 pt-3">Bundled Events:</h3>
              <div className="flex flex-wrap gap-2">
                {workshop.Events.map((event) => (
                  <span key={event.id} className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full flex items-center">
                    <FiCalendar className="mr-2" />
                    {event.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Link to={`/admin/workshop/edit/${workshop.id}`} className="inline-flex items-center justify-center p-2 bg-yellow-500/20 text-yellow-300 rounded-full hover:bg-yellow-500/40 transition-colors" title="Edit Workshop">
                <FiEdit />
              </Link>
              <button onClick={() => deleteWorkshop(workshop.id)} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors" title="Delete Workshop">
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkshopList;
