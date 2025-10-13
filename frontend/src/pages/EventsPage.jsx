import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/features/events/EventCard";
import { Search, X, Calendar } from "lucide-react";
import { useLanguage } from "../context/useLanguage";

const EventsPage = () => {
  const { t } = useLanguage(); // Ambil function translate
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
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('events.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">{t('events.title')}</h1>
          <p className="text-slate-400 mb-8">{t('events.subtitle')}</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('events.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={handleClearSearch} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <p className="text-slate-400 text-sm mt-3">
                {t('events.showing')} <span className="text-purple-400 font-semibold">{filteredEvents.length}</span> {t('events.of')} <span className="text-white font-semibold">{events.length}</span> {t('events.event')}
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
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">
                  {t('events.no_results')} "{searchQuery}"
                </p>
                <button 
                  onClick={handleClearSearch} 
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {t('common.clear_search')}
                </button>
              </div>
            ) : (
              <p className="text-slate-400">{t('events.no_events')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;