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

/**
 * Catalogue card, matching the product entry.
 *
 * An ingredient is bought the same way a product is bought, so the two read as
 * one family: picture first, name carrying the card, price demoted to a spec
 * line under a hairline.
 */
const IngredientCard = ({ ingredient }) => {
  const translatedName = useTranslateDB(ingredient?.name);
  const translatedCategory = useTranslateDB(ingredient?.category);

  return (
    <Link
      to={`/ingredients/${ingredient.id}`}
      aria-label={`${translatedName}, view ingredient details`}
      className="group flex h-full flex-col overflow-hidden rounded-cards border border-border bg-brand-800 transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
    >
      <div className="h-44 w-full shrink-0 overflow-hidden bg-brand-700 sm:h-48">
        <LazyLoadImage
          alt=""
          src={`${API_BASE}${ingredient.imageUrl}`}
          effect="blur"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
          placeholderSrc={PLACEHOLDER_SRC}
          onError={(e) => {
            e.target.src = FALLBACK_SRC;
          }}
          wrapperClassName="w-full h-full"
          threshold={100}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {translatedCategory && (
          <span className="mb-3 text-meta uppercase tracking-[0.18em] text-brand-400">
            {translatedCategory}
          </span>
        )}

        <h3
          className="text-subheading text-cream uppercase leading-tight transition-colors group-hover:text-brand-400 line-clamp-2"
          title={translatedName}
        >
          {translatedName}
        </h3>

        <div className="mt-auto pt-5">
          <p className="border-t border-border pt-3 text-meta text-cream/60">
            Rp {new Intl.NumberFormat("id-ID").format(ingredient.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default IngredientCard;