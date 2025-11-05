import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";

const IngredientCard = ({ ingredient }) => {
  const translatedName = useTranslateDB(ingredient?.name);
  const translatedCategory = useTranslateDB(ingredient?.category);

  return (
    <div className="bg-white rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-slate-100">
      <Link to={`/ingredients/${ingredient.id}`} className="block">
        {/* Image Container */}
        <div className="w-full h-56 overflow-hidden bg-slate-100">
          <LazyLoadImage
            alt={ingredient.name}
            src={`http://localhost:3000${ingredient.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2394a3b8'%3ELoading...%3C/text%3E%3C/svg%3E"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Cpath d='M150 100h100v80h-100z' fill='%23cbd5e1'/%3E%3Ccircle cx='170' cy='130' r='10' fill='%2310b981'/%3E%3Cpath d='M150 160l30-20 25 15 45-35v60h-100z' fill='%2334d399'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
            wrapperClassName="w-full h-full"
            threshold={100}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold mb-2">{translatedCategory}</span>

          <h3 className="font-bold text-lg text-slate-800 mb-2 truncate group-hover:text-emerald-600 transition-colors" title={translatedName}>
            {translatedName}
          </h3>

          <p className="text-emerald-600 font-bold text-lg">Rp {new Intl.NumberFormat("id-ID").format(ingredient.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default IngredientCard;
