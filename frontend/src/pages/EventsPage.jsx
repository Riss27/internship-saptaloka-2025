import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/features/events/EventCard";
import { Search, X, Calendar } from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/events")
      .then((response) => {
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data events:", error);
        setIsLoading(false);
      });
  }, []);

  // Filter events berdasarkan query pencarian
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => {
        const titleMatch = event.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = event.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const locationMatch = event.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = event.category?.toLowerCase().includes(searchQuery.toLowerCase());

        return titleMatch || descriptionMatch || locationMatch || categoryMatch;
      });
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  // Handler untuk clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-700 text-lg">Loading Events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">Kegiatan & Event</h1>
          <p className="text-slate-600 mb-8">Ikuti berbagai kegiatan menarik yang kami selenggarakan.</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari event berdasarkan nama, lokasi, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white text-slate-800 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {searchQuery && (
                <button onClick={handleClearSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <p className="text-slate-500 text-sm mt-3">
                Menampilkan <span className="text-emerald-600 font-semibold">{filteredEvents.length}</span> dari <span className="text-slate-800 font-semibold">{events.length}</span> event
              </p>
            )}
          </div>
        </div>

        {/* Konten Events */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">Tidak ada event yang cocok dengan pencarian "{searchQuery}"</p>
                <button onClick={handleClearSearch} className="text-emerald-600 hover:text-emerald-800 underline">
                  Hapus pencarian
                </button>
              </div>
            ) : (
              <p className="text-slate-500">Belum ada kegiatan yang tersedia saat ini.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
