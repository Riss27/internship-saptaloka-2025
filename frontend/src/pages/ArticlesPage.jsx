import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import ArticleCard from "../components/molecules/cards/ArticleCard";
import Pagination from "../components/molecules/Pagination";
import PageHeader from "../components/atoms/layout/PageHeader";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const ArticlesPage = () => {
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
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
      .get("/api/articles", {
        params: {
          page,
          limit: 12,
          ...(deferredSearch.trim() && { search: deferredSearch.trim() }),
        },
      })
      .then((response) => {
        if (!active) return;
        setFilteredArticles(response.data.data);
        setMeta(response.data.meta || null);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Gagal mengambil data artikel:", error);
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
        <p className="text-cream/80 text-lg">
          {t("articles_page.loading", "Loading Articles...")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-28">
        {/* Tanpa eyebrow: satu-satunya label section yang ada ("Articles") hanya
            akan mengulang judul halaman ini. */}
        <PageHeader
          title={t("articles_page.title")}
          subtitle={t("articles_page.subtitle")}
        >
          <div className="max-w-2xl mt-10">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 w-5 h-5"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label={t("articles_page.search_placeholder")}
                placeholder={t("articles_page.search_placeholder")}
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
          </div>
        </PageHeader>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="border-t border-border pt-14 sm:pt-16 text-center max-w-lg mx-auto">
            <span className="inline-grid place-items-center w-20 h-20 rounded-full border border-border mb-6">
              <Search className="w-10 h-10 text-brand-400" aria-hidden="true" />
            </span>
            <p className="text-body text-cream/80 mb-8">
              {t(
                "articles_page.no_articles_found",
                "No articles found matching your search",
              )}{" "}
              &ldquo;{searchQuery}&rdquo;
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

export default ArticlesPage;