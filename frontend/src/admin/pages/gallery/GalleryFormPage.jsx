import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiUpload, FiSave, FiImage } from "react-icons/fi";

const GalleryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`http://localhost:3000/api/gallery/${id}`)
        .then((response) => {
          const { title, imageUrl } = response.data.data;
          setTitle(title);
          setPreview(`http://localhost:3000${imageUrl}`);
        })
        .catch((error) => {
          console.error("Gagal mengambil data gambar:", error);
          navigate("/admin/gallery");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    // Selalu kirim gambar jika ada file baru yang dipilih
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Validasi untuk mode 'add'
    if (!isEditMode && !imageFile) {
      alert("Gambar wajib diisi!");
      setIsLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/gallery/${id}`, formData, config);
      } else {
        await axios.post("http://localhost:3000/api/gallery", formData, config);
      }
      navigate("/admin/gallery");
    } catch (error) {
      console.error("Gagal menyimpan gambar:", error);
      alert("Gagal menyimpan gambar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{isEditMode ? "Edit Image" : "Add New Image to Gallery"}</h1>
        <Link to="/admin/gallery" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold text-white no-underline">
          BACK
        </Link>
      </header>
      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-lg shadow-lg text-white">
        {/* Input Judul */}
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-medium text-slate-300">
            Title
          </label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 bg-white/20 rounded border border-slate-500" />
        </div>

        {/* Input Gambar */}
        <div className="mb-6">
          <label className="mb-2 font-medium text-slate-300 flex items-center gap-2">
            <FiImage className="text-cyan-400" />
            {isEditMode ? "Ganti Gambar (Opsional)" : "Upload Gambar"}
          </label>
          <div className="relative group">
            <input type="file" id="image-upload" name="image" onChange={handleFileChange} className="hidden" accept="image/*" required={!isEditMode} />
            <label
              htmlFor="image-upload"
              className="flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden"
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <FiUpload className="h-12 w-12 text-white mb-2" />
                    <span className="text-white font-semibold">Click to change image</span>
                    <span className="text-slate-300 text-sm mt-1">PNG, JPG up to 10MB</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                    <FiUpload className="h-10 w-10 text-cyan-400" />
                  </div>
                  <span className="block text-slate-200 font-semibold mb-1">Click to upload image</span>
                  <span className="text-slate-400 text-sm">or drag and drop</span>
                  <p className="text-slate-500 text-xs mt-2">PNG, JPG up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="mt-8">
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-bold text-lg flex items-center justify-center disabled:bg-blue-800">
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : isEditMode ? "SAVE CHANGES" : "ADD TO GALLERY"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryFormPage;
