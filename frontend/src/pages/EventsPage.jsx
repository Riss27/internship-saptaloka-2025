import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/features/events/EventCard";
import { Search, X, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      return (
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const handleClearSearch = () => setSearchQuery("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">{t("events_page.title")}</h1>
          <p className="text-slate-600 mb-8">{t("events_page.subtitle")}</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("events_page.search_placeholder")}
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

            {searchQuery && (
              <p className="text-slate-500 text-sm mt-3">
                {t("static.showing", "Showing")} <span className="text-emerald-600 font-semibold">{filteredEvents.length}</span> {t("static.of", "of")} <span className="text-slate-800 font-semibold">{events.length}</span>{" "}
                {t("static.items", "events")}
              </p>
            )}
          </div>
        </div>

        {/* Grid Events */}
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
                <p className="text-slate-600 text-lg mb-2">
                  {t("events_page.no_events_found", "No events found matching")} "{searchQuery}"
                </p>
                <button onClick={handleClearSearch} className="text-emerald-600 hover:text-emerald-800 underline">
                  {t("static.clear_search", "Clear search")}
                </button>
              </div>
            ) : (
              <p className="text-slate-500">{t("events_page.no_events", "No events available at the moment.")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
