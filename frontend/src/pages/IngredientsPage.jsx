import React, { useState, useEffect } from "react";
import axios from "axios";
import IngredientCard from "../components/features/ingredients/IngredientCard";
import { Search, X, FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/ingredients")
      .then((response) => {
        setIngredients(response.data.data);
        setFilteredIngredients(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data bahan:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = ingredients;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((ing) => ing.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((ing) => {
        const nameMatch = ing.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = ing.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = ing.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || categoryMatch || descriptionMatch;
      });
    }

    setFilteredIngredients(filtered);
  }, [selectedCategory, searchQuery, ingredients]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="bg-emerald-50/70 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">{t("ingredients_page.loading", "Loading Ingredients...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/70 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">{t("ingredients_page.title")}</h1>
          <p className="text-slate-600 mb-8">{t("ingredients_page.subtitle")}</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("ingredients_page.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white text-slate-800 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {searchQuery && (
                <button onClick={handleClearSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {(searchQuery || selectedCategory !== "All") && (
              <p className="text-slate-400 text-sm mt-3">
                {t("static.showing", "Menampilkan")} <span className="text-emerald-700 font-semibold">{filteredIngredients.length}</span> {t("static.of", "dari")} <span className="text-emerald-900 font-semibold">{ingredients.length}</span>{" "}
                {t("static.items", "bahan")}
              </p>
            )}
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button onClick={() => setSelectedCategory("All")} className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "All" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 hover:bg-emerald-50"}`}>
            {t("ingredients_page.all")}
          </button>
          <button
            onClick={() => setSelectedCategory("Essential Oil")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "Essential Oil" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
          >
            {t("ingredients_page.essential_oil")}
          </button>
          <button
            onClick={() => setSelectedCategory("Non Essential Oil")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "Non Essential Oil" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
          >
            {t("ingredients_page.non_essential_oil")}
          </button>
        </div>

        {/* Daftar Bahan */}
        {filteredIngredients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredIngredients.map((ingredient) => (
              <IngredientCard key={ingredient.id} ingredient={ingredient} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery || selectedCategory !== "All" ? (
              <div>
                <FlaskConical className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">{t("ingredients_page.no_ingredients_found")}</p>
                <div className="flex gap-3 justify-center mt-4">
                  {searchQuery && (
                    <button onClick={handleClearSearch} className="text-cyan-400 hover:text-cyan-300 underline">
                      {t("static.clear_search", "Hapus pencarian")}
                    </button>
                  )}
                  {selectedCategory !== "All" && (
                    <button onClick={() => setSelectedCategory("All")} className="text-cyan-400 hover:text-cyan-300 underline">
                      {t("static.view_all", "Lihat semua kategori")}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400">{t("ingredients_page.no_ingredients_found")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientsPage;
