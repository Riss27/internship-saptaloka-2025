import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiInfo, FiTag, FiDollarSign, FiFileText, FiLink, FiImage, FiSave, FiChevronDown } from "react-icons/fi";

// Komponen InputField dengan Ikon
const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-slate-300">{label}</label>
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

const AddProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", price: "", description: "", category: "", linkTokopedia: "", linkShopee: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`http://localhost:3000/api/products/${id}`)
        .then((response) => {
          const data = response.data.data;
          setFormData(data);
          if (data.imageUrl) {
            setPreviewImage(`http://localhost:3000${data.imageUrl}`);
          }
        })
        .catch((error) => console.error("Gagal mengambil detail produk:", error));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => submissionData.append(key, formData[key] || ""));
    if (imageFile) {
      submissionData.append("image", imageFile);
    }
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/products/${id}`, submissionData, config);
      } else {
        await axios.post("http://localhost:3000/api/products", submissionData, config);
      }
      navigate("/admin/catalogue/products");
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Gagal menyimpan. Pastikan semua kolom wajib diisi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <Link to="/admin/catalogue/products" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold text-white no-underline">
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Product Details</h2>
            <InputField label="Product Name" name="name" value={formData.name} onChange={handleChange} required={true} placeholder="Contoh: Parfum 'Senja'" icon={<FiInfo />} />
            <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required={true} placeholder="Contoh: 150000" icon={<FiDollarSign />} />
            <InputField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} required={true} placeholder="Deskripsi singkat produk..." icon={<FiFileText />} />
          </div>

          <div className="bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Organize</h2>
            <div className="mb-6">
              <label htmlFor="category" className="block mb-2 font-medium text-slate-300">
                Category
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FiTag />
                </span>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  required={true}
                  className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="" disabled>
                    -- Pilih Kategori --
                  </option>
                  <option value="Parfum">Parfum</option>
                  <option value="Aromaterapi">Aromaterapi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <FiChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-slate-300">Product Image</label>
              <div className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/50">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <div className="text-center text-slate-400">
                    <FiImage className="mx-auto h-12 w-12" />
                    <span>Image Preview</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full mt-4 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>
            <InputField label="Link Tokopedia" name="linkTokopedia" value={formData.linkTokopedia} onChange={handleChange} placeholder="https://..." icon={<FiLink />} />
            <InputField label="Link Shopee" name="linkShopee" value={formData.linkShopee} onChange={handleChange} placeholder="https://..." icon={<FiLink />} />
          </div>
        </div>
        <div className="mt-8">
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-3 rounded-md font-bold text-lg flex items-center justify-center">
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : isEditMode ? "SAVE CHANGES" : "ADD PRODUCT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
