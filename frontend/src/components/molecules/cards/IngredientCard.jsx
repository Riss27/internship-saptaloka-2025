import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

// The fallback placeholders are inline SVGs, so their colours are written as
// literals. They use the same brand tones as the page instead of a generic grey.
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f2626' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%238fd9be'%3ELoading...%3C/text%3E%3C/svg%3E";

const FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f2626' width='400' height='300'/%3E%3Cpath d='M150 100h100v80h-100z' fill='%2316332e'/%3E%3Ccircle cx='170' cy='130' r='10' fill='%232e9c74'/%3E%3Cpath d='M150 160l30-20 25 15 45-35v60h-100z' fill='%232e9c74'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%238fd9be'%3EImage not found%3C/text%3E%3C/svg%3E";

const IngredientCard = ({ ingredient }) => {
  const translatedName = useTranslateDB(ingredient?.name);
  const translatedCategory = useTranslateDB(ingredient?.category);

  return (
    <div className="h-full flex flex-col bg-brand-800 rounded-cards overflow-hidden group border border-border">
      <Link
        to={`/ingredients/${ingredient.id}`}
        aria-label={`${translatedName}, view ingredient details`}
        className="block h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        {/* Image Container */}
        <div className="w-full h-56 shrink-0 overflow-hidden bg-brand-700">
          <LazyLoadImage
            alt=""
            src={`${API_BASE}${ingredient.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
            placeholderSrc={PLACEHOLDER_SRC}
            onError={(e) => {
              e.target.src = FALLBACK_SRC;
            }}
            wrapperClassName="w-full h-full"
            threshold={100}
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {translatedCategory && (
            <span className="self-start text-xs bg-brand-600 text-cream px-3 py-1 rounded-full font-medium mb-2 uppercase">
              {translatedCategory}
            </span>
          )}

          <h3
            className="font-medium text-lg text-cream mb-2 truncate uppercase transition-colors group-hover:text-brand-400"
            title={translatedName}
          >
            {translatedName}
          </h3>

          <p className="mt-auto text-cream font-semibold text-lg">
            Rp {new Intl.NumberFormat("id-ID").format(ingredient.price)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default IngredientCard;
