import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

const GalleryFormPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageFile) {
      alert("Judul dan gambar wajib diisi!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageFile);

    try {
      await axios.post("http://localhost:3000/api/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/gallery");
    } catch (error) {
      console.error("Gagal menambah gambar:", error);
      alert("Gagal menambah gambar. Cek console untuk detail.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Add New Image to Gallery</h1>
        <Link to="/gallery" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold text-white no-underline">
          BACK
        </Link>
      </header>
      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-lg shadow-lg text-white">
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-medium text-slate-300">
            Title
          </label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 bg-white/20 rounded border border-slate-500" />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-slate-300">Image</label>
          <div className="flex items-center gap-4">
            <div className="w-48 h-48 flex items-center justify-center bg-white/10 rounded border-2 border-dashed border-slate-500">
              {preview ? <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" /> : <span className="text-slate-400 text-sm">Image Preview</span>}
            </div>
            <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md font-semibold text-white">
              <FiUpload />
              Choose File
              <input type="file" id="image-upload" name="image" onChange={handleFileChange} className="hidden" accept="image/*" required />
            </label>
          </div>
        </div>

        <div className="mt-8">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-bold text-lg">
            ADD TO GALLERY
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryFormPage;
