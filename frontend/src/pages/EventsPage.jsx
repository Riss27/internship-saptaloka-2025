import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import EventCard from "../components/molecules/cards/EventCard";
import Pagination from "../components/molecules/Pagination";
import { Search, X, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

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
        params: {
          page,
          limit: 12,
          ...(deferredSearch.trim() && { search: deferredSearch.trim() }),
        },
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
      <div
        role="status"
        aria-live="polite"
        className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-cream/80 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-brand-400 mb-3 uppercase tracking-wide">
            {t("events_page.title")}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
            {t("events_page.subtitle")}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 w-5 h-5"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label={t("events_page.search_placeholder")}
                placeholder={t("events_page.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 bg-brand-800 text-cream rounded-inputs border border-border placeholder:text-cream/60 focus:border-brand-400 transition-colors ${FOCUS_RING}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label={t("static.clear_search", "Clear search")}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center text-cream/70 hover:text-cream transition-colors ${FOCUS_RING}`}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-cream/70 text-sm mt-3">
                {t("static.showing", "Showing")}{" "}
                <span className="text-brand-400 font-medium">
                  {meta?.total ?? filteredEvents.length}
                </span>{" "}
                {t("static.items", "events")}
              </p>
            )}
          </div>
        </div>

        {/* Grid Events */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-brand-800 border border-border rounded-cards px-6 py-10 sm:py-12 text-center max-w-lg mx-auto">
            <span className="inline-grid place-items-center w-20 h-20 rounded-full bg-brand-700 mb-5">
              <Calendar className="w-10 h-10 text-brand-400" aria-hidden="true" />
            </span>
            <p className="text-cream/80 text-lg mb-6">
              {t("events_page.no_events_found", "No events found matching")}{" "}
              "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className={`min-h-11 px-6 py-2.5 rounded-buttons-pill bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide text-sm transition-colors ${FOCUS_RING}`}
            >
              {t("static.clear_search", "Clear search")}
            </button>
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default EventsPage;
