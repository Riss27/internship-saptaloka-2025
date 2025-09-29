import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiType, FiFileText, FiImage, FiSave } from "react-icons/fi";

// Komponen InputField dengan Ikon
const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon, required = false }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-slate-300">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      {type === "textarea" ? (
        <textarea name={name} value={value || ""} onChange={onChange} rows="6" placeholder={placeholder} className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      ) : (
        <input type={type} name={name} value={value || ""} onChange={onChange} placeholder={placeholder} className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
  const [isDragOver, setIsDragOver] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`http://localhost:3000/api/landing-page/${id}`)
        .then((response) => {
          const data = response.data.data;
          setFormData(data);
          if (data.imageUrl) {
            setPreviewImage(`http://localhost:3000${data.imageUrl}`);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
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
        await axios.put(`http://localhost:3000/api/landing-page/${id}`, submissionData, config);
      } else {
        await axios.post("http://localhost:3000/api/landing-page", submissionData, config);
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

            <InputField label="Slide Heading" name="heading" value={formData.heading} onChange={handleChange} required={true} placeholder="Contoh: 'Welcome to Our Platform'" icon={<FiType />} />

            <InputField label="Paragraph" name="paragraph" type="textarea" value={formData.paragraph} onChange={handleChange} required={true} placeholder="Deskripsi singkat untuk slide..." icon={<FiFileText />} />

            {/* Character Counter */}
            <div className="text-sm text-slate-400 space-y-1">
              <div>Heading: {formData.heading?.length || 0}/100 karakter</div>
              <div>Paragraph: {formData.paragraph?.length || 0}/500 karakter</div>
            </div>
          </div>

          {/* Right Column - Image & Settings */}
          <div className="bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Slide Image</h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-slate-300">
                Slide Image
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div
                className={`mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg transition-colors ${isDragOver ? "border-blue-400 bg-blue-400/10" : "border-slate-600 bg-slate-800/50"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <div className="text-center text-slate-400">
                    <FiImage className="mx-auto h-12 w-12 mb-2" />
                    <span className="text-sm">{isDragOver ? "Drop image here" : "Image Preview"}</span>
                    <p className="text-xs mt-1">Drag & drop or click to upload</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full mt-4 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
              <p className="text-xs text-slate-500 mt-2">Supported formats: JPG, PNG, GIF (Max: 5MB)</p>
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
