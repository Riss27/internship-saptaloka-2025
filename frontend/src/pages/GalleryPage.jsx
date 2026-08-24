import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import { FiImage } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    apiClient
      .get("/api/gallery")
      .then((response) => {
        setImages(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data galeri:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-700 text-lg">{t("gallery_page.loading", "Loading Gallery...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">{t("gallery_page.title")}</h1>
          <p className="text-slate-600">{t("gallery_page.subtitle")}</p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <FiImage className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">{t("gallery_page.no_images", "No images available in the gallery.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-xl shadow-md hover:shadow-emerald-200 transition-all overflow-hidden">
                <img src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${image.imageUrl}`} alt={image.title} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300" />
                <div className="p-3">
                  <p className="text-emerald-800 font-semibold text-center break-words leading-snug">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
