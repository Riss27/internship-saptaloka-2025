import React from "react";
import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const ComingSoonPage = () => {
  return (
    <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 sm:px-6 py-14 sm:py-16">
      <div className="max-w-xl w-full text-center">
        {/* Icon */}
        <span className="inline-grid place-items-center w-24 h-24 bg-brand-700 rounded-full mb-6">
          <Wrench className="w-11 h-11 text-brand-400" aria-hidden="true" />
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-brand-400 mb-4 uppercase tracking-wide">
          Segera Hadir!
        </h1>

        {/* Description */}
        <p className="text-cream/90 text-base sm:text-lg mb-10 leading-relaxed">
          Fitur ini sedang dalam tahap pengembangan dan akan segera kami
          luncurkan. Terima kasih atas kesabaran Anda!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/"
            className={`inline-flex items-center justify-center min-h-11 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide rounded-buttons-pill transition-colors ${FOCUS_RING}`}
          >
            Kembali ke Beranda
          </Link>

          <Link
            to="/products"
            className={`inline-flex items-center justify-center min-h-11 px-8 py-3 bg-brand-800 hover:bg-brand-700 text-brand-400 hover:text-cream font-medium uppercase tracking-wide rounded-buttons-pill border border-brand-500 transition-colors ${FOCUS_RING}`}
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
