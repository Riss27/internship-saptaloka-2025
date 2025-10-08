import React from "react";
import { Link } from "react-router-dom";
// Impor LazyLoadImage dan CSS-nya
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ArticleCard = ({ article }) => {
  const snippet = article.mainDescription.substring(0, 100) + "...";

  return (
    <div className="bg-white rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-emerald-100">
      <Link to={`/articles/${article.id}`} title="Klik untuk baca lengkap">
        <div className="w-full h-56 overflow-hidden">
          <LazyLoadImage
            alt={`Gambar artikel ${article.title}`}
            src={`http://localhost:3000${article.featuredImageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
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