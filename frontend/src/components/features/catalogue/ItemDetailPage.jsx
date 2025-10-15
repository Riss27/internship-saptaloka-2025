import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiShoppingCart,
  FiTag,
  FiFileText,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";

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
      } catch (err) {
        console.error(`Gagal mengambil detail ${apiEndpoint}:`, err);
        setError(
          err.response?.data?.message || "Gagal memuat data. Silakan coba lagi."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, apiEndpoint]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen py-20 bg-white flex items-center justify-center">
        <div className="animate-pulse w-full max-w-4xl px-6">
          <div className="h-4 bg-slate-100 rounded-full w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-slate-100 h-80 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-100 rounded w-3/4"></div>
              <div className="h-6 bg-slate-100 rounded w-1/2"></div>
              <div className="h-10 bg-slate-100 rounded w-32 mt-6"></div>
              <div className="h-24 bg-slate-100 rounded mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-50 border border-red-100 rounded-full p-4">
              <FiAlertCircle className="text-red-500 text-4xl" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-800 text-white font-medium py-2.5 px-5 rounded-xl hover:bg-slate-900 transition"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => navigate(breadcrumbPath)}
              className="bg-white border border-slate-300 text-slate-700 font-medium py-2.5 px-5 rounded-xl hover:bg-slate-50 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NOT FOUND STATE
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Item Tidak Ditemukan
          </h2>
          <p className="text-slate-600 mb-6">
            Item yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <button
            onClick={() => navigate(breadcrumbPath)}
            className="bg-slate-800 text-white font-medium py-2.5 px-5 rounded-xl hover:bg-slate-900 transition"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-6 transition"
        >
          <FiArrowLeft />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 mb-6 bg-white px-4 py-2 rounded-full inline-block border border-slate-200 shadow-sm">
          <Link
            to={breadcrumbPath}
            className="hover:text-slate-800 transition font-medium"
          >
            {breadcrumbName}
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-800 font-medium">{item.name}</span>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl">
          {/* Image */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-inner relative overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-2xl m-4"></div>
            )}
            <img
              src={`${API_URL}${item.imageUrl}`}
              alt={`Gambar produk ${item.name}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x400?text=No+Image";
                setImageLoaded(true);
              }}
              className="w-full h-auto object-cover rounded-xl relative z-10 shadow"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                {item.name}
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-slate-700">
                {formatPrice(item.price)}
              </p>
            </div>

            {(item.linkShopee || item.linkTokopedia) && (
              <div className="flex flex-wrap gap-3">
                {item.linkShopee && (
                  <a
                    href={item.linkShopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition shadow"
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
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-2xl transition shadow"
                  >
                    <FiShoppingCart className="text-lg" />
                    <span>Beli di Tokopedia</span>
                  </a>
                )}
              </div>
            )}

            {item.category && (
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <FiTag className="text-slate-600" />
                <span className="text-slate-600 text-sm font-medium">
                  Kategori:
                </span>
                <span className="bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-slate-200">
                  {item.category}
                </span>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-3">
                <FiFileText className="text-slate-600" />
                <span>Deskripsi</span>
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 rounded-xl p-4 border border-slate-100">
                {item.description || "Tidak ada deskripsi tersedia."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
