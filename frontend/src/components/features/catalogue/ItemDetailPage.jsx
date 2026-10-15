import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import {
  FiShoppingCart,
  FiTag,
  FiFileText,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";
import RichTextDisplay from "../../common/RichTextDisplay";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

// The fallback keeps the brand tones instead of a grey service placeholder.
const IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%230f2626' width='400' height='400'/%3E%3Cpath d='M140 140h120v120h-120z' fill='%2316332e'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%238fd9be'%3ENo image available%3C/text%3E%3C/svg%3E";

const ItemDetailPage = ({ apiEndpoint, breadcrumbName, breadcrumbPath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useTranslation();

  const translatedName = useTranslateDB(item?.name);
  const translatedDescription = useTranslateDB(item?.description);
  const translatedCategory = useTranslateDB(item?.category);

  const API_URL = API_BASE;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get(`/api/${apiEndpoint}/${id}`);
        setItem(response.data.data);
      } catch (err) {
        console.error(`Gagal mengambil detail ${apiEndpoint}:`, err);
        setError(
          err.response?.data?.message ||
            "Gagal memuat data. Silakan coba lagi.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, apiEndpoint, API_URL]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // LOADING STATE
  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-cream/80 text-lg">Loading...</p>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 py-10 sm:py-12">
        <div className="bg-brand-800 border border-border rounded-cards p-6 sm:p-8 max-w-md w-full text-center">
          <span className="inline-grid place-items-center w-20 h-20 rounded-full bg-brand-700 border border-brand-400 mb-5">
            <FiAlertCircle className="w-10 h-10 text-brand-400" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-medium text-cream mb-2 uppercase tracking-wide">
            {t("static.error_title")}
          </h1>
          <p className="text-cream/80 mb-6 break-words">{error}</p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide py-2.5 px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
            >
              {t("static.retry")}
            </button>
            <button
              type="button"
              onClick={() => navigate(breadcrumbPath)}
              className={`min-h-11 bg-brand-800 border border-border text-cream hover:bg-brand-700 font-medium uppercase tracking-wide py-2.5 px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
            >
              {t("back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NOT FOUND STATE
  if (!item) {
    return (
      <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 py-10 sm:py-12">
        <div className="bg-brand-800 border border-border rounded-cards p-6 sm:p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-medium text-cream mb-2 uppercase tracking-wide">
            {t("static.not_found_title")}
          </h1>
          <p className="text-cream/80 mb-6">{t("static.not_found_message")}</p>
          <button
            type="button"
            onClick={() => navigate(breadcrumbPath)}
            className={`min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide py-2.5 px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
          >
            {t("static.back_to_list")}
          </button>
        </div>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <div className="py-10 sm:py-12 lg:py-20 bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* Tombol Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 min-h-11 text-cream/80 hover:text-cream transition-colors mb-4 sm:mb-6 ${FOCUS_RING}`}
        >
          <FiArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="font-medium uppercase tracking-wide text-sm">
            {t("back")}
          </span>
        </button>

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-cream/80 mb-6 bg-brand-800 px-4 py-2 rounded-full inline-block max-w-full border border-border"
        >
          <Link
            to={breadcrumbPath}
            className={`hover:text-cream transition-colors font-medium ${FOCUS_RING}`}
          >
            {breadcrumbName}
          </Link>
          <span className="mx-2 text-cream/60" aria-hidden="true">
            /
          </span>
          <span className="text-cream font-medium break-words">
            {translatedName}
          </span>
        </nav>

        {/* Main Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6 sm:gap-8 md:gap-10 bg-brand-800 rounded-cards p-5 sm:p-6 md:p-8 border border-border">
          {/* Image */}
          <div className="bg-brand-900 rounded-inputs p-4 relative overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-brand-700 animate-pulse motion-reduce:animate-none rounded-inputs m-4"></div>
            )}
            <img
              src={`${API_URL}${item.imageUrl}`}
              alt=""
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = IMAGE_FALLBACK;
                setImageLoaded(true);
              }}
              className="w-full h-auto object-cover rounded-inputs relative z-10"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="bg-brand-700 rounded-inputs p-5 border border-border">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-cream mb-2 uppercase tracking-wide leading-tight break-words">
                {translatedName}
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-cream">
                {formatPrice(item.price)}
              </p>
            </div>

            {/* Tombol E-commerce */}
            {(item.linkShopee || item.linkTokopedia) && (
              <div className="flex flex-wrap gap-3">
                {item.linkShopee && (
                  <a
                    href={item.linkShopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide py-3 px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
                  >
                    <FiShoppingCart className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{t("shopee")}</span>
                  </a>
                )}
                {item.linkTokopedia && (
                  <a
                    href={item.linkTokopedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide py-3 px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
                  >
                    <FiShoppingCart className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{t("tokopedia")}</span>
                  </a>
                )}
              </div>
            )}

            {/* Kategori */}
            {item.category && (
              <div className="flex items-center gap-3 bg-brand-700 rounded-inputs p-4 border border-border flex-wrap">
                <FiTag className="w-4 h-4 shrink-0 text-cream/80" aria-hidden="true" />
                <span className="text-cream/80 text-sm font-medium uppercase tracking-wide">
                  {t("static.category")}:
                </span>
                <span className="bg-brand-800 text-cream text-sm font-medium px-4 py-1.5 rounded-full border border-border uppercase">
                  {translatedCategory}
                </span>
              </div>
            )}

            {/* Deskripsi */}
            <div className="bg-brand-700 rounded-inputs p-5 border border-border">
              <h2 className="flex items-center gap-2.5 text-lg font-medium text-cream mb-3 uppercase tracking-wide">
                <FiFileText className="w-5 h-5 shrink-0 text-brand-400" aria-hidden="true" />
                <span>{t("static.description")}</span>
              </h2>
              <div className="text-cream/90 leading-relaxed bg-brand-900 rounded-inputs p-4 border border-border">
                <RichTextDisplay
                  content={translatedDescription || t("static.no_description")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
