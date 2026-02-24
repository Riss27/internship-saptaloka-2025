import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import WorkshopCard from "../components/molecules/cards/WorkshopCard";
import { Search, X, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

const WorkshopsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/workshops?source=admin");
        const workshopsData = response.data.data;
        setWorkshops(workshopsData);
        setFilteredWorkshops(workshopsData);
        
        // Extract unique categories from workshops
        const uniqueCategories = [...new Set(workshopsData.map(w => w.category).filter(Boolean))];
        setCategories(uniqueCategories.map((cat, index) => ({ id: index + 1, name: cat })));
      } catch (error) {
        console.error("Gagal mengambil data workshops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  useEffect(() => {
    let filtered = workshops;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((workshop) => workshop.category === selectedCategory);
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((workshop) => {
        return (
          workshop.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workshop.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workshop.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredWorkshops(filtered);
  }, [selectedCategory, searchQuery, workshops, setSearchParams]);

  const handleClearSearch = () => setSearchQuery("");
  const handleClearCategory = () => {
    setSelectedCategory("");
    setSearchParams({});
  };

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
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">{t("workshops_page.title", "Workshop")}</h1>
          <p className="text-slate-600 mb-8">{t("workshops_page.subtitle", "Jelajahi berbagai workshop yang tersedia")}</p>

          {/* Search Bar and Category Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t("workshops_page.search_placeholder", "Cari workshop...")}
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

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white text-slate-800 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">{t("workshops_page.all_categories", "Semua Kategori")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <button
                    onClick={handleClearCategory}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {(searchQuery || selectedCategory) && (
              <p className="text-slate-500 text-sm">
                {t("static.showing", "Showing")} <span className="text-emerald-600 font-semibold">{filteredWorkshops.length}</span> {t("static.of", "of")}{" "}
                <span className="text-slate-800 font-semibold">{workshops.length}</span> {t("static.items", "workshops")}
              </p>
            )}
          </div>
        </div>

        {/* Grid Workshops */}
        {filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery || selectedCategory ? (
              <div>
                <Filter className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">
                  {t("workshops_page.no_workshops_found", "Tidak ada workshop yang ditemukan")}
                  {searchQuery && ` "${searchQuery}"`}
                  {selectedCategory && ` untuk kategori "${selectedCategory}"`}
                </p>
                <div className="flex gap-2 justify-center">
                  {searchQuery && (
                    <button onClick={handleClearSearch} className="text-emerald-600 hover:text-emerald-800 underline">
                      {t("static.clear_search", "Hapus pencarian")}
                    </button>
                  )}
                  {selectedCategory && (
                    <button onClick={handleClearCategory} className="text-emerald-600 hover:text-emerald-800 underline">
                      {t("workshops_page.clear_filter", "Hapus filter")}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-500">{t("workshops_page.no_workshops", "Belum ada workshop yang tersedia saat ini.")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopsPage;
