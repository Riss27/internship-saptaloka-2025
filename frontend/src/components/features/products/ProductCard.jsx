import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-emerald-500/20 border border-emerald-100">
      <Link to={`/products/${product.id}`} className="block">
        <div className="w-full h-56 overflow-hidden bg-gray-100">
          <LazyLoadImage
            alt={product.name}
            src={`http://localhost:3000${product.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3ELoading...%3C/text%3E%3C/svg%3E"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Cpath d='M150 100h100v80h-100z' fill='%23d1d5db'/%3E%3Ccircle cx='170' cy='130' r='10' fill='%23f59e0b'/%3E%3Cpath d='M150 160l30-20 25 15 45-35v60h-100z' fill='%239ca3af'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%236b7280'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
            wrapperClassName="w-full h-full"
            threshold={100}
          />
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
