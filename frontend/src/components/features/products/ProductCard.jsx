import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-emerald-500/20 border border-emerald-100">
      <Link to={`/products/${product.id}`} className="block">
        <div className="w-full h-56 overflow-hidden">
          <LazyLoadImage alt={product.name} src={`http://localhost:3000${product.imageUrl}`} effect="blur" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="p-5">
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">{product.category}</span>
          <h3 className="font-bold text-lg text-emerald-800 mt-2 truncate group-hover:text-emerald-600 transition-colors" title={product.name}>
            {product.name}
          </h3>
          <p className="text-emerald-700 font-semibold mt-2">Rp {new Intl.NumberFormat("id-ID").format(product.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
