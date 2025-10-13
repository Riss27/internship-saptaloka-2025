import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiTag, FiFileText } from "react-icons/fi";
import { useLanguage } from "../../../context/useLanguage";

// Komponen ini menerima props untuk membuatnya dinamis
const ItemDetailPage = ({ apiEndpoint, breadcrumbName, breadcrumbPath }) => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        // Gunakan apiEndpoint dari props untuk fetch data
        const response = await axios.get(`http://localhost:3000/api/${apiEndpoint}/${id}`);
        setItem(response.data.data);
      } catch (error) {
        console.error(`Gagal mengambil detail ${apiEndpoint}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, apiEndpoint]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-white">
        {language === 'id' ? 'Item tidak ditemukan.' : 'Item not found.'}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-400 mb-6">
          <Link to={breadcrumbPath} className="hover:text-cyan-400">
            {breadcrumbName}
          </Link>
          <span className="mx-2">/</span>
          <span>{item.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-slate-800/50 rounded-lg p-8">
          {/* Image Section */}
          <div>
            <img 
              src={`http://localhost:3000${item.imageUrl}`} 
              alt={item.name} 
              className="w-full h-auto object-cover rounded-lg shadow-lg" 
            />
          </div>

          {/* Info Section */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{item.name}</h1>
            <p className="text-3xl font-semibold text-cyan-400 mb-6">
              Rp {new Intl.NumberFormat("id-ID").format(item.price)}
            </p>

            {/* E-commerce Links */}
            <div className="flex items-center gap-4 mb-8">
              {item.linkShopee && (
                <a 
                  href={item.linkShopee} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  <FiShoppingCart />
                  <span>
                    {language === 'id' ? 'Beli di Shopee' : 'Buy on Shopee'}
                  </span>
                </a>
              )}
              {item.linkTokopedia && (
                <a 
                  href={item.linkTokopedia} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  <FiShoppingCart />
                  <span>
                    {language === 'id' ? 'Beli di Tokopedia' : 'Buy on Tokopedia'}
                  </span>
                </a>
              )}
            </div>

            {/* Category - Tampilkan hanya jika ada */}
            {item.category && (
              <div className="flex items-center gap-3 mb-6">
                <FiTag className="text-slate-400" />
                <span className="text-slate-300 font-semibold">
                  {t('common.category')}:
                </span>
                <span className="bg-cyan-800/50 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="flex items-center gap-3 text-xl font-semibold text-white mb-3">
                <FiFileText />
                <span>{t('common.description')}</span>
              </h2>
              <div className="prose prose-invert text-slate-300 max-w-none whitespace-pre-line">
                {item.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;