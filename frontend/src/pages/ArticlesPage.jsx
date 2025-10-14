import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../components/features/articles/ArticleCard";
import { Search, X } from "lucide-react";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/articles")
      .then((response) => {
        const sortedArticles = response.data.data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data artikel:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) => article.title?.toLowerCase().includes(searchQuery.toLowerCase()) || article.mainDescription?.toLowerCase().includes(searchQuery.toLowerCase()) || article.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  const handleClearSearch = () => setSearchQuery("");

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-700 text-lg">Loading Articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">Artikel Terbaru</h1>
          <p className="text-slate-600 mb-8">Jelajahi wawasan, tips, dan cerita dari dunia parfum dan aromaterapi.</p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari artikel berdasarkan judul, penulis, atau konten..."
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
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">Tidak ada artikel yang cocok dengan pencarian "{searchQuery}"</p>
            <button onClick={handleClearSearch} className="text-emerald-600 hover:text-emerald-800 underline">
              Hapus pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
