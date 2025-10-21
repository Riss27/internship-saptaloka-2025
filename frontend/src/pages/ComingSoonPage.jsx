import React from "react";
import { FiTool } from "react-icons/fi";
import { Link } from "react-router-dom";

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        {/* Icon */}
        <div className="inline-flex p-6 bg-emerald-100 rounded-full mb-6">
          <FiTool className="w-12 h-12 text-emerald-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-emerald-800 mb-4">
          Segera Hadir!
        </h1>

        {/* Description */}
        <p className="text-slate-600 text-base sm:text-lg mb-10 leading-relaxed">
          Fitur ini sedang dalam tahap pengembangan dan akan segera kami luncurkan. Terima kasih atas kesabaran Anda!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Kembali ke Beranda
          </Link>
          
          <Link 
            to="/products" 
            className="px-8 py-3 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold rounded-lg border-2 border-emerald-600 transition-all duration-300"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;