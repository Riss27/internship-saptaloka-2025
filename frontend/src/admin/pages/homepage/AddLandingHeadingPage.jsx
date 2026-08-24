import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { FiType, FiFileText, FiImage, FiSave, FiUploadCloud } from "react-icons/fi";

// Komponen InputField dengan Ikon
const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon, required = false, maxLength }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-slate-300">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      {type === "textarea" ? (
        <textarea name={name} value={value || ""} onChange={onChange} rows="6" placeholder={placeholder} maxLength={maxLength} className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      ) : (
        <input type={type} name={name} value={value || ""} onChange={onChange} placeholder={placeholder} maxLength={maxLength} className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      )}
    </div>
  </div>
);

const AddLandingHeadingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ heading: "", paragraph: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [_isDragOver, setIsDragOver] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      apiClient
        .get(`/api/landing-page/${id}`)
        .then((response) => {
          const data = response.data.data;
          setFormData(data);
          if (data.imageUrl) {
            setPreviewImage(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${data.imageUrl}`);
          }
        })
        .catch((error) => console.error("Gagal mengambil detail slide:", error));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const _handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const _handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const _handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    submissionData.append("heading", formData.heading || "");
    submissionData.append("paragraph", formData.paragraph || "");
    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEditMode) {
        await apiClient.put(`/api/landing-page/${id}`, submissionData, config);
      } else {
        await apiClient.post("/api/landing-page", submissionData, config);
      }
      navigate("/admin/homepage");
    } catch (error) {
      console.error("Gagal menyimpan slide:", error);
      alert("Gagal menyimpan. Pastikan semua kolom wajib diisi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Slide" : "Add New Slide"}</h1>
        <Link to="/admin/homepage" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold text-white no-underline">
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Slide Details */}
          <div className="lg:col-span-2 bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Slide Details</h2>

            <InputField label="Slide Heading" name="heading" value={formData.heading} onChange={handleChange} required={true} placeholder="Contoh: 'Welcome to Our Platform'" icon={<FiType />} maxLength={100} />

            <InputField label="Paragraph" name="paragraph" type="textarea" value={formData.paragraph} onChange={handleChange} required={true} placeholder="Deskripsi singkat untuk slide..." icon={<FiFileText />} maxLength={500} />

            {/* Character Counter */}
            <div className="text-sm space-y-1">
              <div className={formData.heading?.length >= 100 ? "text-red-400" : "text-slate-400"}>
                Heading: {formData.heading?.length || 0}/100 karakter
              </div>
              <div className={formData.paragraph?.length >= 500 ? "text-red-400" : "text-slate-400"}>
                Paragraph: {formData.paragraph?.length || 0}/500 karakter
              </div>
            </div>
          </div>

          {/* Right Column - Image & Settings */}
          <div className="bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Slide Image</h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="mb-2 font-medium text-slate-300 flex items-center gap-2">
                <FiImage className="text-cyan-400" />
                Slide Image
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative group">
                <input type="file" id="slide-upload" name="image" onChange={handleImageChange} className="hidden" accept="image/*" />
                <label
                  htmlFor="slide-upload"
                  className="flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden"
                >
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img src={previewImage} alt="Slide Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <FiUploadCloud className="h-12 w-12 text-white mb-2" />
                        <span className="text-white font-semibold">Click to change image</span>
                        <span className="text-slate-300 text-sm mt-1">PNG, JPG up to 10MB</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <FiUploadCloud className="h-10 w-10 text-cyan-400" />
                      </div>
                      <span className="block text-slate-200 font-semibold mb-1">Click to upload slide image</span>
                      <span className="text-slate-400 text-sm">or drag and drop</span>
                      <p className="text-slate-500 text-xs mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center transition-colors">
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FiSave className="mr-2" />
            )}
            {isLoading ? "Saving..." : isEditMode ? "SAVE CHANGES" : "ADD SLIDE"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLandingHeadingPage;
