import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";

const GalleryPage = () => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/gallery");
      setImages(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data galeri:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/gallery/${id}`);
        fetchImages();
      } catch (error) {
        console.error("Gagal menghapus gambar:", error);
      }
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gallery Management</h1>
        <Link to="/admin/gallery/add" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold text-white no-underline">
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
                <img src={`http://localhost:3000/uploads/${image.imageUrl}`} alt={image.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4">
                  <p className="text-white font-semibold text-center truncate px-2">{image.title}</p>
                  <div className="flex gap-4">
                    <Link to={`/admin/gallery/edit/${image.id}`} className="p-3 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white" title="Edit Title">
                      <FiEdit size={20} />
                    </Link>
                    <button onClick={() => handleDelete(image.id)} className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white">
                      <FiTrash2 size={20} />
                    </button>
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

export default GalleryPage;
