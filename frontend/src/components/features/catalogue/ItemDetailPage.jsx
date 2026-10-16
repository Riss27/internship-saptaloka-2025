import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { ShoppingCart, Store, FileText, ArrowLeft, CircleAlert } from "lucide-react";
// The lint config does not track JSX usage, so the motion import looks unused.
 
import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "../../../lib/motion";
import { useTranslateDB } from "../../../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";
import RichTextDisplay from "../../common/RichTextDisplay";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

// The fallback keeps the brand tones instead of a grey service placeholder.
const IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%230f2626' width='400' height='400'/%3E%3Cpath d='M140 140h120v120h-120z' fill='%2316332e'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%238fd9be'%3ENo image available%3C/text%3E%3C/svg%3E";

/**
 * Catalogue item page, shared by products, ingredients and lab tools.
 *
 * One surface only: the photograph. The column beside it is not a panel, so the
 * name, the price, the specification and the description sit directly on the
 * page background and are separated by space and hairlines. An earlier version
 * wrapped a brand-800 card around a brand-700 block around a brand-900 well,
 * which made an ordinary catalogue entry look like a template.
 *
 * The name is the lead and takes the display size. The price sits directly under
 * it in the subheading voice, which is deliberately smaller: the loudest thing
 * on a product page should be what the thing is, not what it costs.
 */
const ItemDetailPage = ({ apiEndpoint, breadcrumbName, breadcrumbPath }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

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
        <div className="border-t border-border pt-14 sm:pt-16 text-center max-w-lg mx-auto">
          <span className="inline-grid place-items-center w-20 h-20 rounded-full border border-border mb-6">
            <CircleAlert
              className="w-10 h-10 text-brand-400"
              aria-hidden="true"
            />
          </span>
          <h1 className="text-heading-sm text-cream uppercase mb-4">
            {t("static.error_title")}
          </h1>
          <p className="text-body text-cream/80 mb-8 break-words">{error}</p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
            >
              {t("static.retry")}
            </button>
            <button
              type="button"
              onClick={() => navigate(breadcrumbPath)}
              className={`min-h-11 bg-brand-800 border border-border text-cream hover:bg-brand-700 hover:text-cream font-medium uppercase tracking-wide px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
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
        <div className="border-t border-border pt-14 sm:pt-16 text-center max-w-lg mx-auto">
          <h1 className="text-heading-sm text-cream uppercase mb-4">
            {t("static.not_found_title")}
          </h1>
          <p className="text-body text-cream/80 mb-8">{t("static.not_found_message")}</p>
          <button
            type="button"
            onClick={() => navigate(breadcrumbPath)}
            className={`min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
          >
            {t("static.back_to_list")}
          </button>
        </div>
      </div>
    );
  }

  // The two storefronts get different marks so they can be told apart at a
  // glance, since the palette has no room for either of their brand colours.
  const storeLinks = [
    {
      href: item.linkShopee,
      label: t("shopee"),
      icon: <ShoppingCart className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      href: item.linkTokopedia,
      label: t("tokopedia"),
      icon: <Store className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
  ].filter((link) => link.href);

  const hasSpecification = Boolean(item.category);

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
        {/* Way back and current position share one row, with a hairline under it
            so the reader is oriented before the item itself starts. */}
        <motion.div
          {...reveal(prefersReducedMotion)}
          className="mb-10 sm:mb-14 border-b border-border pb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`-ml-2 inline-flex items-center gap-2 min-h-11 px-2 text-meta uppercase tracking-[0.18em] text-cream/70 hover:text-cream transition-colors ${FOCUS_RING}`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t("back")}</span>
          </button>

          <nav
            aria-label="Breadcrumb"
            className="text-meta text-cream/60 min-w-0 break-words"
          >
            <Link
              to={breadcrumbPath}
              className={`text-cream/80 hover:text-brand-400 transition-colors ${FOCUS_RING}`}
            >
              {breadcrumbName}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-cream">{translatedName}</span>
          </nav>
        </motion.div>

        <motion.div
          {...reveal(prefersReducedMotion, 1)}
          className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-14 lg:items-start"
        >
          {/* The photograph is the only surface on this page. */}
          <div className="relative aspect-square overflow-hidden rounded-cards bg-brand-800">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-brand-700 animate-pulse motion-reduce:animate-none"></div>
            )}
            <img
              src={`${API_URL}${item.imageUrl}`}
              alt=""
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = IMAGE_FALLBACK;
                setImageLoaded(true);
              }}
              className="relative z-10 block h-full w-full object-cover"
            />
          </div>

          {/* Everything else is unboxed. */}
          <div>
            <h1 className="text-display text-cream uppercase break-words">
              {translatedName}
            </h1>

            <p className="mt-6 text-subheading text-cream/80">
              {formatPrice(item.price)}
            </p>

            {storeLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {storeLinks.map(({ href, label, icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide px-6 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
                  >
                    {icon}
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Specification rows sit on a fixed label column so several facts
                line up under each other instead of drifting with their text. */}
            {hasSpecification && (
              <dl className="mt-10 sm:mt-12">
                <div className="grid grid-cols-1 gap-1.5 border-t border-border py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                  <dt className="text-meta uppercase tracking-[0.18em] text-cream/60">
                    {t("static.category")}
                  </dt>
                  <dd className="text-body text-cream break-words">
                    {translatedCategory}
                  </dd>
                </div>
              </dl>
            )}

            <section className="mt-10 sm:mt-12">
              <h2 className="flex items-center gap-3 text-heading-sm text-cream uppercase">
                <FileText className="w-5 h-5 shrink-0 text-brand-400" aria-hidden="true" />
                <span>{t("static.description")}</span>
              </h2>
              <div
                className="w-16 border-t border-dashed border-brand-400/50 mt-5"
                aria-hidden="true"
              />
              <div className="mt-6 max-w-[68ch] text-body text-cream/90">
                <RichTextDisplay
                  content={translatedDescription || t("static.no_description")}
                />
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemDetailPage;