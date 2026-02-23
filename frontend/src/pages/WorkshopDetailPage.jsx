import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import RichTextDisplay from "../components/common/RichTextDisplay";
import { useTranslateDB } from "../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";

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
        const response = await axios.get(`http://localhost:3000/api/workshops/${id}`);
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!workshop) {
    return <div className="text-center py-20 text-slate-700">{t("detail_pages.not_found_workshop", "Workshop tidak ditemukan.")}</div>;
  }

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-center">
          {/* Gambar Workshop */}
          <div className="md:col-span-1">
            <img src={`http://localhost:3000${workshop.imageUrl}`} alt={workshop.title} className="rounded-2xl shadow-2xl w-full object-cover" />
          </div>

          {/* Info Workshop */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">{translatedTitle}</h1>
            <RichTextDisplay content={translatedDescription} className="prose-lg text-slate-600" />
          </div>
        </div>

        {/* Kegiatan Terkait */}
        <div>
          <h2 className="text-3xl font-bold text-emerald-800 mb-8 border-b-2 border-emerald-300 pb-3 inline-block">{t("detail_pages.related_events", "Kegiatan Terkait")}</h2>
          {workshop.Events && workshop.Events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workshop.Events.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id} className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={`http://localhost:3000${event.imageBannerUrl}`} alt={`Poster ${event.title}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(event.startDateTime).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">{t("detail_pages.no_related_events", "Belum ada kegiatan yang terdaftar untuk workshop ini.")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;
