import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import { useDelayedLoading } from "../hooks/useDelayedLoading";
import Pagination from "../components/molecules/Pagination";
import PageHeader from "../components/atoms/layout/PageHeader";
import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import API_BASE from "../lib/apiBase";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const showLoader = useDelayedLoading(isLoading);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    apiClient
      .get(`/api/gallery?page=${page}&limit=12`)
      .then((response) => {
        setImages(response.data.data);
        setMeta(response.data.meta || null);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data galeri:", error);
        setIsLoading(false);
      });
  }, [page]);

  if (isLoading) {
    return showLoader ? (
      <div
        role="status"
        aria-live="polite"
        className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-cream/80 text-lg">
          {t("gallery_page.loading", "Loading Gallery...")}
        </p>
      </div>
    ) : null;
  }

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-28">
        <PageHeader
          eyebrow={t("homepage.recent_activities")}
          title={t("gallery_page.title")}
          subtitle={t("gallery_page.subtitle")}
        />

        {images.length === 0 ? (
          <div className="border-t border-border pt-14 sm:pt-16 text-center max-w-lg mx-auto">
            <span className="inline-grid place-items-center w-20 h-20 rounded-full border border-border mb-6">
              <ImageIcon
                className="w-10 h-10 text-brand-400"
                aria-hidden="true"
              />
            </span>
            <p className="text-body text-cream/80">
              {t(
                "gallery_page.no_images",
                "No images available in the gallery.",
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {images.map((image) => (
              <figure
                key={image.id}
                className="flex flex-col bg-brand-800 border border-border rounded-cards overflow-hidden"
              >
                <img
                  src={`${API_BASE}${image.imageUrl}`}
                  alt=""
                  className="w-full h-40 sm:h-56 shrink-0 object-cover"
                />
                {/* Keterangan rata kiri supaya mengikuti sisi masthead, dan
                    setingkat meta supaya gambar tetap yangeriah. */}
                <figcaption className="p-3 sm:p-4 text-meta text-cream/80 break-words leading-snug uppercase tracking-wide">
                  {image.title}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default GalleryPage;