// EventPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { FiPlus, FiSearch } from "react-icons/fi";
import EventList from "../../components/EventList";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil data event
  const fetchEvents = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/events`, {
        params: { search: searchTerm },
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data event:", error);
    }
  }, [searchTerm]);

  // Fetch data saat komponen mount & searchTerm berubah
  useEffect(() => {
    const handler = setTimeout(fetchEvents, 500);
    return () => clearTimeout(handler);
  }, [fetchEvents]);

  // Hapus event
  const deleteEvent = async (id) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus event ini? Semua data pendaftar juga akan terhapus.",
      )
    ) {
      try {
        await apiClient.delete(`/api/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Gagal menghapus event:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cream mb-2">
              Manage Events
            </h1>
            <p className="text-cream/60 text-lg">
              Kelola semua event yang akan diselenggarakan
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-cream/70">
                Total Events:{" "}
                <span className="font-semibold text-brand-400">
                  {events.length}
                </span>
              </span>
            </div>
          </div>
          <Link
            to="/admin/events/add"
            className="bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-lg font-semibold text-cream no-underline whitespace-nowrap flex items-center justify-center transition-all duration-300"
          >
            <FiPlus className="mr-2" size={18} /> New Event
          </Link>
        </div>
      </header>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
            <FiSearch />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari event berdasarkan judul..."
            className="w-full md:w-1/3 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400 text-cream"
          />
        </div>
      </div>

      {/* Render table via EventList */}
      <EventList events={events} deleteEvent={deleteEvent} />
    </div>
  );
};

export default EventPage;
