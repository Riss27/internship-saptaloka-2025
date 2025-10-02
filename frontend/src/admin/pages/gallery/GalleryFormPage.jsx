import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiUpload, FiEdit, FiSave } from "react-icons/fi";

const GalleryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data jika ini mode edit
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`http://localhost:3000/api/gallery/${id}`)
        .then((response) => {
          const { title, imageUrl } = response.data.data;
          setTitle(title);
          setPreview(`http://localhost:3000/uploads/${imageUrl}`);
        })
        .catch((error) => {
          console.error("Gagal mengambil data gambar:", error);
          alert("Gagal memuat data gambar.");
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
    if (!title || (!imageFile && !isEditMode)) {
      alert("Judul dan gambar wajib diisi!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/gallery/${id}`, { title });
      } else {
        formData.append("image", imageFile);
        await axios.post("http://localhost:3000/api/gallery", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/gallery");
    } catch (error) {
      console.error("Gagal menyimpan gambar:", error);
      alert("Gagal menyimpan gambar. Cek console untuk detail.");
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
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-medium text-slate-300">
            Title
          </label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 bg-white/20 rounded border border-slate-500" />
        </div>

        {!isEditMode && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-slate-300">Image</label>
            <div className="flex items-center gap-4">
              <div className="w-48 h-48 flex items-center justify-center bg-white/10 rounded border-2 border-dashed border-slate-500">
                {preview ? <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" /> : <span className="text-slate-400 text-sm">Image Preview</span>}
              </div>
              <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md font-semibold text-white">
                <FiUpload />
                Choose File
                <input type="file" id="image-upload" name="image" onChange={handleFileChange} className="hidden" accept="image/*" required={!isEditMode} />
              </label>
            </div>
          </div>
        )}

        {isEditMode && preview && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-slate-300">Image Preview</label>
            <img src={preview} alt="Preview" className="max-w-xs max-h-48 object-contain rounded-lg bg-white/10 p-2" />
            <p className="text-xs text-slate-500 mt-2">Mengubah file gambar belum didukung. Hanya judul yang bisa diubah.</p>
          </div>
        )}

        <div className="mt-8">
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-bold text-lg flex items-center justify-center disabled:bg-blue-800">
            {isLoading ? (
              "Saving..."
            ) : isEditMode ? (
              <>
                <FiSave className="mr-2" /> SAVE CHANGES
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> ADD TO GALLERY
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryFormPage;
