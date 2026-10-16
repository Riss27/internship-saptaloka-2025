import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

/**
 * Article card.
 *
 * An article is reading matter, not stock, so the words come first and the
 * picture is a small plate at the foot of the card rather than a banner above
 * it. The title also drops out of the uppercase voice the catalogue cards use,
 * which is what tells the eye that this is a different kind of thing.
 *
 * The date sits above the title as a small tracked label, the same position the
 * category label takes on a product, so the two cards share a skeleton without
 * sharing a shape.
 */
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
    <Link
      to={`/articles/${article.id}`}
      aria-label={`${translatedTitle}, read the article`}
      className="group flex h-full flex-col overflow-hidden rounded-cards border border-border bg-brand-800 transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
    >
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-4 flex items-center gap-2 text-meta uppercase tracking-[0.18em] text-brand-400">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          <time dateTime={article.publishedAt}>{formattedDate}</time>
        </p>

        <h3
          className="text-subheading text-cream leading-snug transition-colors group-hover:text-brand-400 line-clamp-3"
          title={translatedTitle}
        >
          {translatedTitle}
        </h3>
      </div>

      <div className="h-24 w-full shrink-0 overflow-hidden bg-brand-700 sm:h-28">
        <LazyLoadImage
          alt=""
          src={`${API_BASE}${article.featuredImageUrl}`}
          effect="blur"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
          wrapperClassName="w-full h-full"
        />
      </div>
    </Link>
  );
};

export default ArticleCard;