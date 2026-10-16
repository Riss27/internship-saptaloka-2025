import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

/**
 * Catalogue card, used for a thing that can be bought.
 *
 * The photograph is the product, so it leads and everything under it stays
 * compact. The name carries the card. The price sits at the very bottom behind a
 * hairline as a plain spec line, because the loudest thing on a catalogue entry
 * should be what the thing is called, not what it costs.
 *
 * The whole tile is the link, so the focus ring wraps the entire card.
 */
const ProductCard = ({ product }) => {
  const translatedName = useTranslateDB(product?.name);
  const translatedCategory = useTranslateDB(product?.category);

  return (
    <Link
      to={`/products/${product.id}`}
      aria-label={`${translatedName}, view product details`}
      className="group flex h-full flex-col overflow-hidden rounded-cards border border-border bg-brand-800 transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
    >
      <div className="h-44 w-full shrink-0 overflow-hidden bg-brand-700 sm:h-48">
        <LazyLoadImage
          alt=""
          src={`${API_BASE}${product.imageUrl}`}
          effect="blur"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
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
            Rp {new Intl.NumberFormat("id-ID").format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;