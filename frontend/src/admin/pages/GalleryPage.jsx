import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const GalleryPage = () => {
  const [images, setImages] = useState([]);

  // Fungsi untuk mengambil data dari backend
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/gallery');
      setImages(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data galeri:", error);
    }
  };

  // Jalankan fetchImages saat halaman dimuat
  useEffect(() => {
    fetchImages();
  }, []);

  // Fungsi untuk menghapus gambar
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/gallery/${id}`);
        fetchImages(); // Refresh data setelah hapus
      } catch (error) {
        console.error("Gagal menghapus gambar:", error);
      }
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gallery Management</h1>
        <Link to="/gallery/add" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold text-white no-underline">
          <FiPlus />
          Add New Image
        </Link>
      </header>
      
      <main>
        {images.length === 0 ? (
          <p className="text-slate-400 text-center">No images found in the gallery.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="group relative bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={`http://localhost:3000/uploads/${image.imageUrl}`} 
                  alt={image.title}
                  className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <p className="text-white font-semibold truncate">{image.title}</p>
                  <button 
                    onClick={() => handleDelete(image.id)}
                    className="self-end p-2 bg-red-600 hover:bg-red-700 rounded-full text-white"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GalleryPage;