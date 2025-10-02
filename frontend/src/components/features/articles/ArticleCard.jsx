import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  const snippet = article.mainDescription.substring(0, 100) + "...";

  return (
    <div className="bg-white rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-emerald-100">
      <Link to={`/articles/${article.id}`} title="Klik untuk baca lengkap">
        {/* Thumbnail gambar */}
        <div className="w-full h-48 overflow-hidden">
          <img
            src={`http://localhost:3000${article.featuredImageUrl}`}
            alt={`Gambar artikel ${article.title}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Konten artikel */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-emerald-800 truncate group-hover:text-emerald-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">by {article.author}</p>
          <p className="text-sm text-gray-700 mt-2 line-clamp-3">{snippet}</p>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
