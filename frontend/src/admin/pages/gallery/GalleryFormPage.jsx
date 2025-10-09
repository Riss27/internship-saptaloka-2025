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

        {/* Input Gambar (Sekarang selalu tampil) */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-slate-300">{isEditMode ? "Ganti Gambar (Opsional)" : "Upload Gambar"}</label>
          <div className="flex items-center gap-4">
            <div className="w-48 h-48 flex items-center justify-center bg-white/10 rounded border-2 border-dashed border-slate-500">
              {preview ? <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" /> : <FiImage className="text-slate-400" size={40} />}
            </div>
            <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md font-semibold text-white">
              <FiUpload />
              Choose File
              <input type="file" id="image-upload" name="image" onChange={handleFileChange} className="hidden" accept="image/*" required={!isEditMode} />
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
