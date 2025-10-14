import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiTag, FiFileText, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

const ItemDetailPage = ({ apiEndpoint, breadcrumbName, breadcrumbPath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/api/${apiEndpoint}/${id}`);
        setItem(response.data.data);
      } catch (error) {
        console.error(`Gagal mengambil detail ${apiEndpoint}:`, error);
        setError(error.response?.data?.message || "Gagal memuat data. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, apiEndpoint]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen py-12 md:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-white/40 backdrop-blur-xl animate-pulse rounded-full w-48 mb-6"></div>

          {/* Main Card Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 shadow-2xl shadow-black/5">
            {/* Image Skeleton */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4">
              <div className="bg-white/60 animate-pulse h-64 md:h-96 rounded-2xl"></div>
            </div>

            {/* Info Skeleton */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-10 bg-white/50 backdrop-blur-sm animate-pulse rounded-2xl w-3/4"></div>
                <div className="h-8 bg-white/50 backdrop-blur-sm animate-pulse rounded-2xl w-1/2"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-11 bg-white/50 backdrop-blur-sm animate-pulse rounded-2xl w-32"></div>
                <div className="h-11 bg-white/50 backdrop-blur-sm animate-pulse rounded-2xl w-32"></div>
              </div>
              <div className="h-10 bg-white/50 backdrop-blur-sm animate-pulse rounded-2xl w-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-white/50 backdrop-blur-sm animate-pulse rounded-2xl w-32"></div>
                <div className="h-32 bg-white/50 backdrop-blur-sm animate-pulse rounded-2xl w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>

        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl shadow-black/5 max-w-md w-full text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-red-500/10 backdrop-blur-sm rounded-full p-4 border border-red-500/20">
              <FiAlertCircle className="text-red-600 text-4xl" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-900 text-white font-medium py-2.5 px-5 rounded-2xl transition-all hover:shadow-lg">
              Coba Lagi
            </button>
            <button onClick={() => navigate(breadcrumbPath)} className="bg-white/60 backdrop-blur-sm hover:bg-white/80 text-slate-700 font-medium py-2.5 px-5 rounded-2xl transition-all border border-white/80">
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl shadow-black/5 max-w-md w-full text-center relative z-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Item Tidak Ditemukan</h2>
          <p className="text-slate-600 mb-6">Item yang Anda cari tidak tersedia atau telah dihapus.</p>
          <button onClick={() => navigate(breadcrumbPath)} className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-900 text-white font-medium py-2.5 px-5 rounded-2xl transition-all hover:shadow-lg">
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background orbs - Apple style */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Add keyframes for blob animation */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button - Glass style */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-all mb-4 group bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 hover:bg-white/70 shadow-lg shadow-black/5"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Breadcrumb - Glass style */}
        <div className="text-sm text-slate-600 mb-6 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full inline-block border border-white/40">
          <Link to={breadcrumbPath} className="hover:text-slate-800 transition-colors font-medium">
            {breadcrumbName}
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-800 font-medium">{item.name}</span>
        </div>

        {/* Main Glass Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 shadow-2xl shadow-black/5">
          {/* Image Section - Inner glass */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-inner relative overflow-hidden">
            {/* Image glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl"></div>

            {!imageLoaded && <div className="absolute inset-0 bg-white/60 animate-pulse rounded-2xl m-4 backdrop-blur-sm"></div>}
            <img
              src={`${API_URL}${item.imageUrl}`}
              alt={`Gambar produk ${item.name}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                setImageLoaded(true);
              }}
              className="w-full h-auto object-cover rounded-xl relative z-10 shadow-lg"
            />
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Title & Price - Glass panel */}
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">{item.name}</h1>
              <p className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(item.price)}</p>
            </div>

            {/* CTA Buttons - Glass style */}
            {(item.linkShopee || item.linkTokopedia) && (
              <div className="flex flex-wrap gap-3">
                {item.linkShopee && (
                  <a
                    href={item.linkShopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition-all hover:shadow-xl hover:scale-105 border border-orange-400/50"
                  >
                    <FiShoppingCart className="text-lg" />
                    <span>Beli di Shopee</span>
                  </a>
                )}
                {item.linkTokopedia && (
                  <a
                    href={item.linkTokopedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600/90 backdrop-blur-sm hover:bg-green-700 text-white font-medium py-3 px-6 rounded-2xl transition-all hover:shadow-xl hover:scale-105 border border-green-500/50"
                  >
                    <FiShoppingCart className="text-lg" />
                    <span>Beli di Tokopedia</span>
                  </a>
                )}
              </div>
            )}

            {/* Category - Glass pill */}
            {item.category && (
              <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md rounded-2xl p-4 border border-white/50">
                <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                  <FiTag className="text-slate-600" />
                </div>
                <span className="text-slate-600 text-sm font-medium">Kategori:</span>
                <span className="bg-white/60 backdrop-blur-sm text-slate-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-white/70 shadow-sm">{item.category}</span>
              </div>
            )}

            {/* Description - Glass panel */}
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-5 border border-white/50">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-3">
                <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                  <FiFileText className="text-slate-600" />
                </div>
                <span>Deskripsi</span>
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">{item.description || "Tidak ada deskripsi tersedia."}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
