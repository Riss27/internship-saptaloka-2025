import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Plus, Trash2, Pencil } from "lucide-react";
import API_BASE from "../../../lib/apiBase";

const GalleryPage = () => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await apiClient.get("/api/gallery");
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
        await apiClient.delete(`/api/gallery/${id}`);
        fetchImages();
      } catch (error) {
        console.error("Gagal menghapus gambar:", error);
      }
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cream">Gallery Management</h1>
        <Link
          to="/admin/gallery/add"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-md font-semibold text-cream no-underline"
        >
          <Plus aria-hidden="true" className="w-5 h-5" />
          Add New Image
        </Link>
      </header>

      <main>
        {images.length === 0 ? (
          <p className="text-cream/60 text-center">
            No images found in the gallery.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-brand-800 rounded-lg overflow-hidden  transition-colors"
              >
                <img
                  src={`${API_BASE}${image.imageUrl}`}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 flex justify-between items-center">
                  <p className="text-cream font-semibold truncate max-w-[70%]">
                    {image.title}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/gallery/edit/${image.id}`}
                      className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-full text-cream"
                      title="Edit Title"
                      aria-label="Edit Title"
                    >
                      <Pencil aria-hidden="true" className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-cream"
                      title="Delete Image"
                      aria-label="Delete Image"
                    >
                      <Trash2 aria-hidden="true" className="w-4 h-4" />
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
