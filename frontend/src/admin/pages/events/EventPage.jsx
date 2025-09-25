// EventPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPlus, FiSearch } from "react-icons/fi";
import EventList from "../../components/EventList";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil data event
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events`, {
        params: { search: searchTerm },
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data event:", error);
    }
  };

  // Fetch data saat komponen mount & searchTerm berubah
  useEffect(() => {
    const handler = setTimeout(fetchEvents, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Hapus event
  const deleteEvent = async (id) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus event ini? Semua data pendaftar juga akan terhapus."
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/api/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Gagal menghapus event:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Events</h1>
          <p className="text-slate-400 mt-1">
            Kelola semua event yang akan diselenggarakan.
          </p>
        </div>
        <Link
          to="/events/add"
          className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-md font-semibold text-white no-underline whitespace-nowrap flex items-center justify-center transition-colors duration-300"
        >
          <FiPlus className="mr-2" /> New Event
        </Link>
      </header>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <FiSearch />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari event berdasarkan judul..."
            className="w-full md:w-1/3 p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
          />
        </div>
      </div>

      {/* Render table via EventList */}
      <EventList events={events} deleteEvent={deleteEvent} />
    </div>
  );
};

export default EventPage;
