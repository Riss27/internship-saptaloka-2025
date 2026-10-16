import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import API_BASE from "../../../lib/apiBase";

const ProductCard = ({ product }) => {
  const translatedName = useTranslateDB(product?.name);
  const translatedCategory = useTranslateDB(product?.category);

  return (
    <div className="h-full flex flex-col bg-brand-800 rounded-cards overflow-hidden group border border-border">
      <Link
        to={`/products/${product.id}`}
        aria-label={`${translatedName}, view product details`}
        className="block h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        {/* Image Container */}
        <div className="w-full h-56 shrink-0 overflow-hidden bg-brand-700">
          <LazyLoadImage
            alt=""
            src={`${API_BASE}${product.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
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
            Rp {new Intl.NumberFormat("id-ID").format(product.price)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
