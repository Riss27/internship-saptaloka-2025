import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPlus, FiTrash2, FiEdit, FiImage, FiType, FiFileText, FiAlertCircle } from "react-icons/fi";

const Homepage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/api/landing-page");
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
        await axios.delete(`http://localhost:3000/api/landing-page/${id}`);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Memuat data slide...</p>
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Homepage Management</h1>
            <p className="text-slate-400 text-lg">Kelola konten carousel yang akan ditampilkan di halaman utama</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-slate-500">
                Total Slides: <span className="font-semibold text-cyan-400">{slides.length}</span>
              </span>
            </div>
          </div>

          <Link
            to="/homepage/add"
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 px-6 py-3 rounded-lg font-semibold text-white no-underline whitespace-nowrap flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105"
          >
            <FiPlus className="mr-2" size={18} />
            Tambah Slide Baru
          </Link>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <FiAlertCircle className="text-red-400 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-400 font-medium">Terjadi Kesalahan</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button onClick={fetchSlides} className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors duration-200">
            Coba Lagi
          </button>
        </div>
      )}

      <main>
        {slides.length === 0 ? (
          /* Empty State */
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiImage size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Belum Ada Slide Homepage</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">Mulai buat slide pertama Anda untuk menampilkan konten menarik di halaman utama website.</p>
              <Link to="/homepage/add" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200">
                <FiPlus size={18} />
                Buat Slide Pertama
              </Link>
            </div>
          </div>
        ) : (
          /* Slides List */
          <div className="space-y-6">
            {slides.map((slide, index) => (
              <div key={slide.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Slide Header */}
                <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border-b border-emerald-500/20 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
                      <h2 className="text-xl font-semibold text-white">Slide {index + 1}</h2>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Link to={`/homepage/edit/${slide.id}`} className="p-2.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-all duration-200 group/edit" title="Edit slide">
                        <FiEdit size={18} className="group-hover/edit:scale-110 transition-transform duration-200" />
                      </Link>
                      <button onClick={() => deleteSlide(slide.id)} className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/delete" title="Hapus slide">
                        <FiTrash2 size={18} className="group-hover/delete:scale-110 transition-transform duration-200" />
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
                          <FiType className="text-cyan-400" size={18} />
                          <h3 className="font-semibold text-white">Judul</h3>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                          <p className="text-slate-200 leading-relaxed">{slide.heading || <span className="text-slate-500 italic">Tidak ada judul</span>}</p>
                        </div>
                      </div>

                      {/* Paragraph */}
                      <div className="group/content">
                        <div className="flex items-center gap-2 mb-3">
                          <FiFileText className="text-green-400" size={18} />
                          <h3 className="font-semibold text-white">Deskripsi</h3>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                          <p className="text-slate-300 leading-relaxed text-sm">{slide.paragraph || <span className="text-slate-500 italic">Tidak ada deskripsi</span>}</p>
                        </div>
                      </div>
                    </div>

                    {/* Image Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FiImage className="text-purple-400" size={18} />
                        <h3 className="font-semibold text-white">Gambar</h3>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 h-fit">
                        {slide.imageUrl ? (
                          <div className="relative group/image">
                            <img
                              src={`http://localhost:3000${slide.imageUrl}`}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group-hover/image:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 rounded-lg transition-all duration-300"></div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-slate-600/30 rounded-lg flex items-center justify-center">
                            <div className="text-center text-slate-500">
                              <FiImage size={32} className="mx-auto mb-2" />
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
