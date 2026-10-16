import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import WorkshopCard from "../components/molecules/cards/WorkshopCard";
import Pagination from "../components/molecules/Pagination";
import { Search, X, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const WorkshopsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
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
    const fetchWorkshops = async () => {
      try {
        const response = await apiClient.get("/api/workshops", {
          params: {
            source: "admin",
            page,
            limit: 12,
            ...(deferredSearch.trim() && { search: deferredSearch.trim() }),
            ...(selectedCategory && { category: selectedCategory }),
          },
        });
        if (!active) return;
        setFilteredWorkshops(response.data.data);
        setMeta(response.data.meta || null);
      } catch (error) {
        if (!active) return;
        console.error("Gagal mengambil data workshops:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchWorkshops();
    return () => {
      active = false;
    };
  }, [page, deferredSearch, selectedCategory]);

  // Kategori dropdown diambil dari daftar lengkap (bukan halaman yang sedang ditampilkan)
  useEffect(() => {
    apiClient
      .get("/api/workshops?source=admin")
      .then((response) => {
        const uniqueCategories = [
          ...new Set(response.data.data.map((w) => w.category).filter(Boolean)),
        ];
        setCategories(
          uniqueCategories.map((name, index) => ({ id: index + 1, name })),
        );
      })
      .catch((error) =>
        console.error("Gagal mengambil kategori workshops:", error),
      );
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, deferredSearch]);

  // Sinkronkan filter kategori ke URL
  useEffect(() => {
    setSearchParams(selectedCategory ? { category: selectedCategory } : {});
  }, [selectedCategory, setSearchParams]);

  const handleClearSearch = () => setSearchQuery("");
  const handleClearCategory = () => {
    setSelectedCategory("");
    setSearchParams({});
  };

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

  const secondaryButtonClass = `min-h-11 px-6 py-2.5 rounded-buttons-pill bg-brand-800 border border-border text-cream/90 hover:bg-brand-700 hover:text-cream font-medium uppercase tracking-wide text-sm transition-colors ${FOCUS_RING}`;

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-brand-400 mb-3 uppercase tracking-wide">
            {t("workshops_page.title", "Workshop")}
          </h1>
          <p className="text-cream/80 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
            {t(
              "workshops_page.subtitle",
              "Jelajahi berbagai workshop yang tersedia",
            )}
          </p>

          {/* Search Bar and Category Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 w-5 h-5"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  aria-label={t(
                    "workshops_page.search_placeholder",
                    "Cari workshop...",
                  )}
                  placeholder={t(
                    "workshops_page.search_placeholder",
                    "Cari workshop...",
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-brand-800 text-cream rounded-inputs border border-border placeholder:text-cream/60 focus:border-brand-400 transition-colors ${FOCUS_RING}`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label={t("static.clear_search", "Hapus pencarian")}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center text-cream/70 hover:text-cream transition-colors ${FOCUS_RING}`}
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 w-5 h-5 z-10"
                  aria-hidden="true"
                />
                <select
                  aria-label={t(
                    "workshops_page.all_categories",
                    "Semua Kategori",
                  )}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-brand-800 text-cream rounded-inputs border border-border focus:border-brand-400 transition-colors appearance-none cursor-pointer ${FOCUS_RING}`}
                >
                  <option value="">
                    {t("workshops_page.all_categories", "Semua Kategori")}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={handleClearCategory}
                    aria-label={t(
                      "workshops_page.clear_filter",
                      "Hapus filter",
                    )}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center text-cream/70 hover:text-cream transition-colors ${FOCUS_RING}`}
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {(searchQuery || selectedCategory) && (
              <p className="text-cream/70 text-sm mt-4">
                {t("static.showing", "Showing")}{" "}
                <span className="text-brand-400 font-medium">
                  {meta?.total ?? filteredWorkshops.length}
                </span>{" "}
                {t("static.items", "workshops")}
              </p>
            )}
          </div>
        </div>

        {/* Grid Workshops */}
        {filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        ) : (
          <div className="bg-brand-800 border border-border rounded-cards px-6 py-10 sm:py-12 text-center max-w-lg mx-auto">
            <span className="inline-grid place-items-center w-20 h-20 rounded-full bg-brand-700 mb-5">
              <Filter className="w-10 h-10 text-brand-400" aria-hidden="true" />
            </span>
            {searchQuery || selectedCategory ? (
              <>
                <p className="text-cream/80 text-lg mb-6">
                  {t(
                    "workshops_page.no_workshops_found",
                    "Tidak ada workshop yang ditemukan",
                  )}
                  {searchQuery && ` "${searchQuery}"`}
                  {selectedCategory && ` untuk kategori "${selectedCategory}"`}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className={secondaryButtonClass}
                    >
                      {t("static.clear_search", "Hapus pencarian")}
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={handleClearCategory}
                      className={secondaryButtonClass}
                    >
                      {t("workshops_page.clear_filter", "Hapus filter")}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-cream/80 text-lg">
                {t(
                  "workshops_page.no_workshops",
                  "Belum ada workshop yang tersedia saat ini.",
                )}
              </p>
            )}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default WorkshopsPage;
