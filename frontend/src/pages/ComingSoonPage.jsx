import React from "react";
import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/atoms/layout/PageHeader";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const ComingSoonPage = () => {
  return (
    <div className="bg-brand-900 min-h-[60vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-28">
        {/* Mark hollow dengan garis rambut, bukan lingkaran berisi, supaya
            sekilas seerat dengan bagian atas halaman daftar lainnya. */}
        <span className="inline-grid place-items-center w-20 h-20 rounded-full border border-border mb-10">
          <Wrench className="w-9 h-9 text-brand-400" aria-hidden="true" />
        </span>

        <PageHeader
          title="Segera Hadir!"
          subtitle="Fitur ini sedang dalam tahap pengembangan dan akan segera kami luncurkan. Terima kasih atas kesabaran Anda!"
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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