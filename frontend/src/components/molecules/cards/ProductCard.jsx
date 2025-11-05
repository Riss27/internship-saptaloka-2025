import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslateDB } from "../../../hooks/useTranslateDB";

const ProductCard = ({ product }) => {
  const translatedName = useTranslateDB(product?.name);
  const translatedCategory = useTranslateDB(product?.category);

  return (
    // Gaya container utama diambil dari Code 1
    <div className="bg-emerald-900/70 backdrop-blur-md border border-emerald-400/20 rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-emerald-500/50">
      <Link to={`/products/${product.id}`} className="block">
        {/* Gaya container gambar & background diambil dari Code 1. Gradient overlay dihapus. */}
        <div className="w-full h-56 overflow-hidden bg-emerald-800/60">
          <LazyLoadImage
            alt={product.name}
            src={`http://localhost:3000${product.imageUrl}`}
            effect="blur"
            // Efek hover zoom disamakan dengan Code 1 (scale-110)
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            // Placeholder & Error SVG disamakan dengan Code 1
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%2306472c' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%236efacc'%3ELoading...%3C/text%3E%3C/svg%3E"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%2306472c' width='400' height='300'/%3E%3Cpath d='M150 100h100v80h-100z' fill='%2314583b'/%3E%3Ccircle cx='170' cy='130' r='10' fill='%236efacc'/%3E%3Cpath d='M150 160l30-20 25 15 45-35v60h-100z' fill='%2310b981'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%236efacc'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
            wrapperClassName="w-full h-full"
            threshold={100}
          />
        </div>

        {/* Padding & styling konten disamakan dengan Code 1 */}
        <div className="p-4">
          {/* Gaya tag kategori diubah dari amber ke putih */}
          <span className="text-xs bg-white text-emerald-900 px-2 py-1 rounded-full backdrop-blur-sm">{translatedCategory}</span>

          {/* Efek hover warna & drop-shadow di judul dihapus/disamakan */}
          <h3 className="font-semibold text-lg text-white mt-2 truncate drop-shadow-sm" title={translatedName}>
            {translatedName}
          </h3>

          {/* Warna teks & margin harga disamakan */}
          <p className="text-emerald-200 font-semibold mt-1">Rp {new Intl.NumberFormat("id-ID").format(product.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;


