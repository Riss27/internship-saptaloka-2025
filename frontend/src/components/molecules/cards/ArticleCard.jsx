import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

const ArticleCard = ({ article }) => {
  const translatedTitle = useTranslateDB(article.title);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="h-full flex flex-col bg-brand-800 rounded-cards overflow-hidden group border border-border">
      <Link
        to={`/articles/${article.id}`}
        aria-label={`${translatedTitle}, read the article`}
        className="block h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        {/* Image Container */}
        <div className="w-full h-56 shrink-0 overflow-hidden bg-brand-700">
          <LazyLoadImage
            alt=""
            src={`${API_BASE}${article.featuredImageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
            wrapperClassName="w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3
            className="font-medium text-lg text-cream mb-3 line-clamp-2 leading-snug uppercase transition-colors group-hover:text-brand-400"
            title={translatedTitle}
          >
            {translatedTitle}
          </h3>

          <div className="mt-auto flex items-center gap-2 text-cream/80 text-sm">
            <Calendar className="w-4 h-4 shrink-0 text-brand-400" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;