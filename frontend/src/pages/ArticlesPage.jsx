// frontend/src/pages/ArticlesPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../components/features/articles/ArticleCard"; // Kita pakai lagi komponen card yang sudah ada

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Panggil API untuk mendapatkan semua artikel
    axios
      .get("http://localhost:3000/api/articles")
      .then((response) => {
        setArticles(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data artikel:", error);
        setIsLoading(false);
      });
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  // Tampilkan loading state
  if (isLoading) {
    return <div className="text-center py-20 text-white">Loading Articles...</div>;
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Artikel Terbaru</h1>
          <p className="text-slate-400">Jelajahi wawasan, tips, dan cerita dari dunia parfum dan aromaterapi.</p>
        </div>

        {articles.length === 0 ? (
          <p className="text-center text-slate-400">Belum ada artikel yang dipublikasikan.</p>
        ) : (
          // Grid untuk menampilkan semua artikel
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
