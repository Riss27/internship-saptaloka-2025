import React from "react";
import { Link } from "react-router-dom";

const IngredientCard = ({ ingredient }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-purple-500/20">
      <Link to={`/ingredients/${ingredient.id}`} className="block">
        <div className="w-full h-56 overflow-hidden">
          <img src={`http://localhost:3000${ingredient.imageUrl}`} alt={ingredient.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
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
