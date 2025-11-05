import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";

const ArticleCard = ({ article }) => {
  const translatedTitle = useTranslateDB(article.title);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-slate-100">
      <Link to={`/articles/${article.id}`}>
        {/* Image Container */}
        <div className="w-full h-56 overflow-hidden bg-slate-100">
          <LazyLoadImage
            alt={article.title}
            src={`http://localhost:3000${article.featuredImageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            wrapperClassName="w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors" title={translatedTitle}>
            {translatedTitle}
          </h3>

          <div className="flex items-center text-slate-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
