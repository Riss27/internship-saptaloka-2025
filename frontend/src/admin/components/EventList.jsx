import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Users,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import API_BASE from "../../lib/apiBase";
import SortableHeader from "./SortableHeader";

const EventList = ({
  events,
  total,
  hasSearch = false,
  sort = "",
  order = "desc",
  onSort,
  deleteEvent,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Empty state dengan design yang lebih menarik
  if (events.length === 0) {
    return (
      <div className="bg-gradient-to-br from-brand-700/60 to-brand-800/60 rounded-xl border border-border backdrop-blur-sm">
        <div className="text-center py-20 px-6">
          <div className="mb-6">
            <Calendar
              aria-hidden="true"
              className="mx-auto text-cream/70 mb-4 w-10 h-10"
            />
          </div>
          <h3 className="text-cream/80 text-xl font-semibold mb-3">
            {hasSearch
              ? "Tidak ditemukan event yang cocok."
              : "Tidak ada event yang ditemukan"}
          </h3>
          <p className="text-cream/70 text-base max-w-md mx-auto leading-relaxed">
            {hasSearch
              ? "Coba kata kunci lain untuk menemukan event yang Anda cari."
              : "Coba kata kunci lain atau tambahkan event baru untuk memulai."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-700/60 to-brand-800/60 rounded-xl border border-border backdrop-blur-sm overflow-hidden ">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-cream/80">
          {/* Header table dengan gradient background */}
          <thead className="bg-gradient-to-r from-brand-800/80 to-brand-700/80 border-b border-border">
            <tr>
              <th className="p-5 font-semibold text-cream/80 text-sm uppercase tracking-wider">
                No
              </th>
              <th className="p-5 font-semibold text-cream/80 text-sm uppercase tracking-wider">
                Gambar
              </th>
              <SortableHeader
                label="Judul Event"
                sortKey="title"
                activeSort={sort}
                order={order}
                onSort={onSort}
                className="p-5 font-semibold text-cream/80 text-sm uppercase tracking-wider"
              />
              <th className="p-5 font-semibold text-cream/80 text-sm uppercase tracking-wider">
                Peserta
              </th>
              <SortableHeader
                label="Tanggal"
                sortKey="startDateTime"
                activeSort={sort}
                order={order}
                onSort={onSort}
                className="p-5 font-semibold text-cream/80 text-sm uppercase tracking-wider"
              />
              <th className="p-5 font-semibold text-cream/80 text-sm uppercase tracking-wider text-center">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {events.map((event, index) => (
              <tr
                key={event.id}
                className="group bg-brand-800/60 hover:bg-brand-700/60 transition-all duration-300 ease-in-out"
              >
                <td className="p-5 align-middle">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-700 rounded-full text-cream/60 font-semibold text-sm">
                    {index + 1}
                  </div>
                </td>

                {/* Image dengan fallback dan loading state */}
                <td className="p-5 align-middle">
                  <div className="relative group">
                    <img
                      src={`${API_BASE}${event.imageBannerUrl}`}
                      alt={event.title}
                      className="h-16 w-28 object-cover rounded-lg border border-border transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='64' viewBox='0 0 112 64'%3E%3Crect width='112' height='64' fill='%23334155'/%3E%3Ctext x='56' y='35' font-family='system-ui' font-size='12' fill='%23e2e8f0' text-anchor='middle'%3ETanpa gambar%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ImageIcon
                        aria-hidden="true"
                        className="text-cream/70 w-5 h-5"
                      />
                    </div>
                  </div>
                </td>

                <td className="p-5 align-middle">
                  <div className="max-w-xs">
                    <h4
                      className="font-semibold text-cream text-base leading-tight mb-1 truncate"
                      title={event.title}
                    >
                      {event.title}
                    </h4>
                  </div>
                </td>

                <td className="p-5 align-middle">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-400 text-lg">
                        {event.registeredCount}
                      </span>
                      <span className="text-cream/70">/ {event.quota}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-20 h-2 bg-brand-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((event.registeredCount / event.quota) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>

                {/* Date dengan icon */}
                <td className="p-5 align-middle">
                  <div className="flex items-center gap-2 text-cream/80">
                    <Calendar
                      aria-hidden="true"
                      className="text-cream/70 w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      {formatDate(event.startDateTime)}
                    </span>
                  </div>
                </td>

                <td className="p-5 align-middle">
                  <div className="flex justify-center gap-2">
                    {/* View registrations button */}
                    <button
                      onClick={() =>
                        navigate(`/admin/events/registrations/${event.id}`)
                      }
                      className="group/btn flex items-center justify-center w-11 h-11 text-cream bg-brand-600 rounded-lg transition-all duration-300 ease-in-out transform "
                      title="Lihat Peserta Terdaftar"
                      aria-label={`Lihat peserta terdaftar untuk ${event.title}`}
                    >
                      <Users
                        aria-hidden="true"
                        className="w-5 h-5 transition-transform group-hover/btn:scale-110"
                      />
                    </button>

                    {/* Edit button */}
                    <Link
                      to={`/admin/events/edit/${event.id}`}
                      className="group/btn flex items-center justify-center w-11 h-11 text-cream bg-yellow-500 rounded-lg transition-all duration-300 ease-in-out transform "
                      title="Edit event"
                      aria-label={`Edit event ${event.title}`}
                    >
                      <Pencil
                        aria-hidden="true"
                        className="w-5 h-5 transition-transform group-hover/btn:scale-110"
                      />
                    </Link>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteEvent(event)}
                      className="group/btn flex items-center justify-center w-11 h-11 text-cream bg-red-500 rounded-lg transition-all duration-300 ease-in-out transform "
                      title="Hapus Event"
                      aria-label={`Hapus event ${event.title}`}
                    >
                      <Trash2
                        aria-hidden="true"
                        className="w-5 h-5 transition-transform group-hover/btn:scale-110"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer untuk informasi tambahan */}
      <div className="bg-brand-900/30 px-6 py-4 border-t border-border/30">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-cream/60">
            Total: <span className="font-semibold text-cream/80">{total}</span>{" "}
            event
          </span>
          <div className="flex flex-wrap items-center gap-4 text-cream/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
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
