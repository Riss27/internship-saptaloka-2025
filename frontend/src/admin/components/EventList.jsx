import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiUsers, FiCalendar, FiImage } from "react-icons/fi";

const EventList = ({ events, deleteEvent }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Empty state dengan design yang lebih menarik
  if (events.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="text-center py-20 px-6">
          <div className="mb-6">
            <FiCalendar className="mx-auto text-slate-500 mb-4" size={48} />
          </div>
          <h3 className="text-slate-300 text-xl font-semibold mb-3">Tidak ada event yang ditemukan</h3>
          <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed">Coba kata kunci lain atau tambahkan event baru untuk memulai.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          {/* Header table dengan gradient background */}
          <thead className="bg-gradient-to-r from-slate-900/70 to-slate-800/70 border-b border-slate-700/50">
            <tr>
              <th className="p-5 font-semibold text-slate-200 text-sm uppercase tracking-wider">No</th>
              <th className="p-5 font-semibold text-slate-200 text-sm uppercase tracking-wider">Gambar</th>
              <th className="p-5 font-semibold text-slate-200 text-sm uppercase tracking-wider">Judul Event</th>
              <th className="p-5 font-semibold text-slate-200 text-sm uppercase tracking-wider">Peserta</th>
              <th className="p-5 font-semibold text-slate-200 text-sm uppercase tracking-wider">Tanggal</th>
              <th className="p-5 font-semibold text-slate-200 text-sm uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700/30">
            {events.map((event, index) => (
              <tr key={event.id} className="group hover:bg-slate-800/60 transition-all duration-300 ease-in-out">
                <td className="p-5 align-middle">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded-full text-slate-400 font-semibold text-sm">{index + 1}</div>
                </td>

                {/* Image dengan fallback dan loading state */}
                <td className="p-5 align-middle">
                  <div className="relative group">
                    <img
                      src={`http://localhost:3000${event.imageBannerUrl}`}
                      alt={event.title}
                      className="h-16 w-28 object-cover rounded-lg border border-slate-600/50 shadow-md transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='64' viewBox='0 0 112 64'%3E%3Crect width='112' height='64' fill='%2364748b'/%3E%3Ctext x='56' y='35' font-family='system-ui' font-size='12' fill='%23cbd5e1' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <FiImage className="text-white/70" size={20} />
                    </div>
                  </div>
                </td>

                <td className="p-5 align-middle">
                  <div className="max-w-xs">
                    <h4 className="font-semibold text-white text-base leading-tight mb-1 truncate" title={event.title}>
                      {event.title}
                    </h4>
                  </div>
                </td>

                <td className="p-5 align-middle">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-400 text-lg">{event.registeredCount}</span>
                      <span className="text-slate-500">/ {event.quota}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((event.registeredCount / event.quota) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>

                {/* Date dengan icon */}
                <td className="p-5 align-middle">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FiCalendar className="text-slate-500" size={16} />
                    <span className="text-sm font-medium">{formatDate(event.startDateTime)}</span>
                  </div>
                </td>

                <td className="p-5 align-middle">
                  <div className="flex items-center justify-center gap-2">
                    {/* View registrations button */}
                    <button
                      onClick={() => navigate(`/admin/events/registrations/${event.id}`)}
                      className="group/btn flex items-center justify-center w-10 h-10 text-blue-400 hover:text-white hover:bg-blue-500 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                      title="Lihat Peserta Terdaftar"
                    >
                      <FiUsers size={18} className="transition-transform group-hover/btn:scale-110" />
                    </button>

                    {/* Edit button */}
                    <Link
                      to={`/admin/events/edit/${event.id}`}
                      className="group/btn flex items-center justify-center w-10 h-10 text-yellow-400 hover:text-white hover:bg-yellow-500 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-500/25"
                      title="Edit Event"
                    >
                      <FiEdit size={18} className="transition-transform group-hover/btn:scale-110" />
                    </Link>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="group/btn flex items-center justify-center w-10 h-10 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                      title="Hapus Event"
                    >
                      <FiTrash2 size={18} className="transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer untuk informasi tambahan */}
      <div className="bg-slate-900/30 px-6 py-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Total: <span className="font-semibold text-slate-300">{events.length}</span> event
          </span>
          <div className="flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Peserta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Edit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Hapus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
