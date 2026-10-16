import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import ProductCard from "../components/molecules/cards/ProductCard";
import Pagination from "../components/molecules/Pagination";
import { Search, X, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/atoms/layout/PageHeader";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const ProductsPage = () => {
  const { t } = useTranslation();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // Tunda query 400ms biar tidak request tiap ketikan
  useEffect(() => {
    const handler = setTimeout(() => setDeferredSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    apiClient
      .get("/api/products", {
        params: {
          page,
          limit: 12,
          ...(deferredSearch.trim() && { search: deferredSearch.trim() }),
          ...(selectedCategory !== "All" && { category: selectedCategory }),
        },
      })
      .then((response) => {
        if (!active) return;
        setFilteredProducts(response.data.data);
        setMeta(response.data.meta || null);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Gagal mengambil data produk:", error);
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, deferredSearch, selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, deferredSearch]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-cream/80 text-lg">
          {t("products_page.loading", "Loading Product...")}
        </p>
      </div>
    );
  }

  const categories = [
    { id: "All", label: t("products_page.all") },
    { id: "Parfum", label: t("products_page.perfume") },
    { id: "Aromaterapi", label: t("products_page.aromatherapy") },
  ];

  const filterClass = (isActive) =>
    [
      "min-h-11 px-6 py-2.5 rounded-buttons-pill text-sm font-medium uppercase tracking-wide transition-colors",
      FOCUS_RING,
      isActive
        ? "bg-brand-600 text-cream"
        : "bg-brand-800 border border-border text-cream/80 hover:bg-brand-700 hover:text-cream",
    ].join(" ");

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-28">
        <PageHeader
          eyebrow={t("products_page.all")}
          title={t("products_page.our_collection")}
          subtitle={t("products_page.collection_subtitle")}
        >
          {/* Search bar */}
          <div className="max-w-2xl mt-10">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 w-5 h-5"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label={t("products_page.search_placeholder")}
                placeholder={t("products_page.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 bg-brand-800 text-cream rounded-inputs border border-border placeholder:text-cream/60 focus:border-brand-400 transition-colors ${FOCUS_RING}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label={t("products_page.clear_search")}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center text-cream/70 hover:text-cream transition-colors ${FOCUS_RING}`}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>

            {(searchQuery || selectedCategory !== "All") && (
              <p className="text-cream/70 text-sm mt-3">
                {t("Menampilkan")}{" "}
                <span className="text-brand-400 font-medium">
                  {meta?.total ?? filteredProducts.length}
                </span>{" "}
                {t("produk")}
              </p>
            )}
          </div>
        </PageHeader>

        {/* Filter Kategori */}
        <div className="flex gap-3 sm:gap-4 mb-10 sm:mb-14 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              aria-pressed={selectedCategory === category.id}
              className={filterClass(selectedCategory === category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Galeri Produk */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border-t border-border pt-14 sm:pt-16 text-center max-w-lg mx-auto">
            <span className="inline-grid place-items-center w-20 h-20 rounded-full border border-border mb-6">
              <Package
                className="w-10 h-10 text-brand-400"
                aria-hidden="true"
              />
            </span>
            <p className="text-body text-cream/80 mb-8">
              {t("products_page.no_products_found")}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={`min-h-11 px-6 py-2.5 rounded-buttons-pill bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide text-sm transition-colors ${FOCUS_RING}`}
                >
                  {t("products_page.clear_search")}
                </button>
              )}
              {selectedCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className={`min-h-11 px-6 py-2.5 rounded-buttons-pill bg-brand-800 border border-border text-cream/90 hover:bg-brand-700 hover:text-cream font-medium uppercase tracking-wide text-sm transition-colors ${FOCUS_RING}`}
                >
                  {t("products_page.view_all_categories")}
                </button>
              )}
            </div>
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default ProductsPage;
