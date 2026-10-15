import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import EventCard from "../components/molecules/cards/EventCard";
import Pagination from "../components/molecules/Pagination";
import { Search, X, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventsPage = () => {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const { t } = useTranslation();

  // Tunda query 400ms biar tidak request tiap ketikan
  useEffect(() => {
    const handler = setTimeout(() => setDeferredSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    apiClient
      .get("/api/events", {
        params: { page, limit: 12, ...(deferredSearch.trim() && { search: deferredSearch.trim() }) },
      })
      .then((response) => {
        if (!active) return;
        setFilteredEvents(response.data.data);
        setMeta(response.data.meta || null);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Gagal mengambil data events:", error);
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, deferredSearch]);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch]);

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
                {t("static.showing", "Showing")} <span className="text-emerald-600 font-semibold">{meta?.total ?? filteredEvents.length}</span>{" "}
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

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default EventsPage;
