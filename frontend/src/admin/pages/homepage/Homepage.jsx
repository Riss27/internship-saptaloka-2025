import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import {
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
  Type,
  FileText,
  CircleAlert,
} from "lucide-react";
import API_BASE from "../../../lib/apiBase";

const Homepage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/landing-page");
      const sortedSlides = response.data.data.sort((a, b) => a.id - b.id);
      setSlides(sortedSlides);
    } catch (error) {
      console.error("Gagal mengambil data slide:", error);
      setError("Gagal memuat data slide. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const deleteSlide = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus slide ini?")) {
      try {
        await apiClient.delete(`/api/landing-page/${id}`);
        setSlides(slides.filter((slide) => slide.id !== id));
        // Optional: Show success notification
      } catch (error) {
        console.error("Gagal menghapus slide:", error);
        setError("Gagal menghapus slide. Silakan coba lagi.");
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-cream/60">Memuat data slide...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cream mb-2">
              Homepage Management
            </h1>
            <p className="text-cream/60 text-lg">
              Kelola konten carousel yang akan ditampilkan di halaman utama
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-cream/70">
                Total Slides:{" "}
                <span className="font-semibold text-brand-400">
                  {slides.length}
                </span>
              </span>
            </div>
          </div>

          <Link
            to="/admin/homepage/add"
            className="bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-lg font-semibold text-cream no-underline whitespace-nowrap flex items-center justify-center transition-all duration-300 hover:scale-105 transform"
          >
            <Plus aria-hidden="true" className="w-5 h-5 mr-2" />
            Tambah Slide Baru
          </Link>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <CircleAlert
            aria-hidden="true"
            className="text-red-400 flex-shrink-0 w-5 h-5"
          />
          <div>
            <p className="text-red-400 font-medium">Terjadi Kesalahan</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchSlides}
            className="ml-auto min-h-11 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors duration-200"
          >
            Coba Lagi
          </button>
        </div>
      )}

      <main>
        {slides.length === 0 ? (
          /* Empty State */
          <div className="bg-gradient-to-br from-brand-700/60 to-brand-800/60 border border-border rounded-xl p-6 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-brand-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon
                  aria-hidden="true"
                  className="text-cream/60 w-10 h-10"
                />
              </div>
              <h3 className="text-xl font-semibold text-cream mb-3">
                Belum Ada Slide Homepage
              </h3>
              <p className="text-cream/60 mb-6 leading-relaxed">
                Mulai buat slide pertama Anda untuk menampilkan konten menarik
                di halaman utama website.
              </p>
              <Link
                to="/admin/homepage/add"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-lg font-medium text-cream transition-colors duration-200"
              >
                <Plus aria-hidden="true" className="w-5 h-5" />
                Buat Slide Pertama
              </Link>
            </div>
          </div>
        ) : (
          /* Slides List */
          <div className="space-y-6">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-gradient-to-br from-brand-700/70 to-brand-800/50 border border-border rounded-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Slide Header */}
                <div className="bg-gradient-to-r from-brand-600/20 to-brand-500/20 border-b border-brand-500/20 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-cream font-bold text-sm">
                        {index + 1}
                      </div>
                      <h2 className="text-xl font-semibold text-cream">
                        Slide {index + 1}
                      </h2>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/homepage/edit/${slide.id}`}
                        className="min-h-11 min-w-11 grid place-items-center p-2.5 text-yellow-400 text-yellow-300 bg-yellow-500/10 rounded-lg transition-all duration-200 group/edit"
                        title="Edit slide"
                        aria-label="Edit slide"
                      >
                        <Pencil
                          aria-hidden="true"
                          className="w-5 h-5 group-hover/edit:scale-110 transition-transform duration-200"
                        />
                      </Link>
                      <button
                        onClick={() => deleteSlide(slide.id)}
                        className="min-h-11 min-w-11 grid place-items-center p-2.5 text-red-400 text-red-300 bg-red-500/10 rounded-lg transition-all duration-200 group/delete"
                        title="Hapus slide"
                        aria-label="Hapus slide"
                      >
                        <Trash2
                          aria-hidden="true"
                          className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-200"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Text Content */}
                    <div className="space-y-6">
                      {/* Heading */}
                      <div className="group/content">
                        <div className="flex items-center gap-2 mb-3">
                          <Type
                            aria-hidden="true"
                            className="text-brand-400 w-5 h-5"
                          />
                          <h3 className="font-semibold text-cream">Judul</h3>
                        </div>
                        <div className="bg-brand-700/30 rounded-lg p-4 border border-border/30">
                          <p className="text-cream/80 leading-relaxed">
                            {slide.heading || (
                              <span className="text-cream/70 italic">
                                Tidak ada judul
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Paragraph */}
                      <div className="group/content">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText
                            aria-hidden="true"
                            className="text-brand-400 w-5 h-5"
                          />
                          <h3 className="font-semibold text-cream">
                            Deskripsi
                          </h3>
                        </div>
                        <div className="bg-brand-700/30 rounded-lg p-4 border border-border/30">
                          <p className="text-cream/80 leading-relaxed text-sm">
                            {slide.paragraph || (
                              <span className="text-cream/70 italic">
                                Tidak ada deskripsi
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Image Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon
                          aria-hidden="true"
                          className="text-brand-400 w-5 h-5"
                        />
                        <h3 className="font-semibold text-cream">Gambar</h3>
                      </div>
                      <div className="bg-brand-700/30 rounded-lg p-4 border border-border/30 h-fit">
                        {slide.imageUrl ? (
                          <div className="relative group/image">
                            <img
                              src={`${API_BASE}${slide.imageUrl}`}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg transition-all duration-300 group-hover/image:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 rounded-lg transition-all duration-300"></div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-brand-700/30 rounded-lg flex items-center justify-center">
                            <div className="text-center text-cream/70">
                              <ImageIcon
                                aria-hidden="true"
                                className="mx-auto mb-2 w-10 h-10"
                              />
                              <p className="text-sm">Tidak ada gambar</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
