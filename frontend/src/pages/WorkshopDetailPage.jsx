import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import RichTextDisplay from "../components/common/RichTextDisplay";
import { useTranslateDB } from "../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";
import API_BASE from "../lib/apiBase";

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // menggunakan hook translasi
  const translatedTitle = useTranslateDB(workshop?.title);
  const translatedDescription = useTranslateDB(workshop?.description);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/workshops/${id}`);
        setWorkshop(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail workshop:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkshop();
  }, [id]);

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

  if (!workshop) {
    return (
      <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 text-center">
        <p className="text-cream/80 text-lg">
          {t("detail_pages.not_found_workshop", "Workshop tidak ditemukan.")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-10 sm:mb-16 items-center">
          {/* Gambar Workshop */}
          <div className="md:col-span-1">
            <img
              src={`${API_BASE}${workshop.imageUrl}`}
              alt=""
              className="rounded-cards w-full h-56 md:h-auto object-cover bg-brand-800"
            />
          </div>

          {/* Info Workshop */}
          <div className="md:col-span-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-brand-400 mb-4 uppercase tracking-wide leading-tight break-words">
              {translatedTitle}
            </h1>
            <RichTextDisplay
              content={translatedDescription}
              className="text-cream/90"
            />
          </div>
        </div>

        {/* Kegiatan Terkait */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-medium text-brand-400 mb-6 sm:mb-8 border-b-2 border-brand-500 pb-3 inline-block uppercase tracking-wide">
            {t("detail_pages.related_events", "Kegiatan Terkait")}
          </h2>
          {workshop.Events && workshop.Events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
              {workshop.Events.map((event) => (
                <Link
                  to={`/events/${event.id}`}
                  key={event.id}
                  aria-label={`${event.title}, view event details`}
                  className="group flex flex-col h-full block bg-brand-800 rounded-cards overflow-hidden border border-border transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                >
                  <div className="h-48 shrink-0 overflow-hidden">
                    <img
                      src={`${API_BASE}${event.imageBannerUrl}`}
                      alt=""
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-medium text-lg text-cream group-hover:text-brand-400 transition-colors uppercase tracking-wide leading-snug line-clamp-2 break-words">
                      {event.title}
                    </h3>
                    <p className="mt-auto pt-2 text-sm text-cream/80">
                      {new Date(event.startDateTime).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-cream/80">
              {t(
                "detail_pages.no_related_events",
                "Belum ada kegiatan yang terdaftar untuk workshop ini.",
              )}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;
