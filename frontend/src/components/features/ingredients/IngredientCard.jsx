import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const IngredientCard = ({ ingredient }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-purple-500/20">
      <Link to={`/ingredients/${ingredient.id}`} className="block">
        <div className="w-full h-56 overflow-hidden bg-slate-900">
          <LazyLoadImage
            alt={ingredient.name}
            src={`http://localhost:3000${ingredient.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f172a' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2322d3ee'%3ELoading...%3C/text%3E%3C/svg%3E"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f172a' width='400' height='300'/%3E%3Cpath d='M150 100h100v80h-100z' fill='%231e293b'/%3E%3Ccircle cx='170' cy='130' r='10' fill='%23a78bfa'/%3E%3Cpath d='M150 160l30-20 25 15 45-35v60h-100z' fill='%234c1d95'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2322d3ee'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
            wrapperClassName="w-full h-full"
            threshold={100}
          />
        </div>
        <div className="p-4">
          <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full">{ingredient.category}</span>
          <h3 className="font-bold text-lg text-white mt-2 truncate" title={ingredient.name}>
            {ingredient.name}
          </h3>
          <p className="text-cyan-400 font-semibold mt-1">Rp {new Intl.NumberFormat("id-ID").format(ingredient.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default IngredientCard;
