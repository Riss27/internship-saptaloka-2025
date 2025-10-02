import React, { useState, useEffect } from "react";
import axios from "axios";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect untuk fetch data dari API saat komponen pertama kali render
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/gallery")
      .then((response) => {
        setImages(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data galeri:", error);
        setIsLoading(false);
      });
  }, []); // Array kosong artinya efek ini hanya jalan sekali

  // Tampilkan loading state
  if (isLoading) {
    return <div className="text-center py-20 text-white">Loading Gallery...</div>;
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Galeri Kegiatan</h1>
          <p className="text-slate-400">Momen-momen berharga dari setiap workshop dan event kami.</p>
        </div>

        {/* Tampilkan pesan jika tidak ada gambar */}
        {images.length === 0 ? (
          <p className="text-center text-slate-400">Belum ada gambar di galeri saat ini.</p>
        ) : (
          // Grid untuk gambar
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-lg">
                <img src={`http://localhost:3000/uploads/${image.imageUrl}`} alt={image.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-semibold text-sm">{image.title}</p>
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
