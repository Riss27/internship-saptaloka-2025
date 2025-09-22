import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import axios from "axios";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // State `imageUrl` dihapus dari sini
  const [formData, setFormData] = useState({ name: "", price: "", description: "", category: "", linkTokopedia: "", linkShopee: "" });
  // State baru untuk menampung file gambar
  const [imageFile, setImageFile] = useState(null);
  // State baru untuk menampilkan preview gambar
  const [previewImage, setPreviewImage] = useState("");
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`http://localhost:3000/api/products/${id}`)
        .then((response) => {
          const productData = response.data.data;
          setFormData(productData);
          // Jika sudah ada gambar, tampilkan sebagai preview
          if (productData.imageUrl) {
            setPreviewImage(`http://localhost:3000${productData.imageUrl}`);
          }
        })
        .catch((error) => console.error("Gagal mengambil detail produk:", error));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk input file gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("File dipilih:", file);

    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);

      console.log("URL Preview dibuat:", previewUrl);
      setPreviewImage(previewUrl);
    }
  };

  // `handleSubmit` diubah untuk mengirim FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("price", parseInt(formData.price) || 0);
    submissionData.append("description", formData.description);
    submissionData.append("category", formData.category);
    submissionData.append("linkTokopedia", formData.linkTokopedia);
    submissionData.append("linkShopee", formData.linkShopee);

    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/products/${id}`, submissionData, config);
      } else {
        await axios.post("http://localhost:3000/api/products", submissionData, config);
      }
      navigate("/catalogue/products");
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Gagal menyimpan. Pastikan semua kolom wajib diisi, termasuk gambar.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <Link to="/catalogue/products" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold text-white no-underline">
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-lg shadow-lg text-white">
        {/* Input URL diganti menjadi input file */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-slate-300">Product Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
          {previewImage && <img src={previewImage} alt="Preview" className="mt-4 rounded-md max-h-48" />}
        </div>

        <InputField label="Title" name="name" value={formData.name} onChange={handleChange} required={true} placeholder="Nama produk..." />
        <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required={true} placeholder="Contoh: 50000" />
        <InputField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} required={true} placeholder="Deskripsi produk..." />

        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 font-medium text-slate-300">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              required={true}
              className="w-full p-2 pr-10 bg-slate-800 border border-slate-600 text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="" disabled className="bg-slate-800 text-white">
                -- Pilih Kategori --
              </option>
              <option className="bg-slate-800 text-white" value="Parfum">
                Parfum
              </option>
              <option className="bg-slate-800 text-white" value="Aromaterapi">
                Aromaterapi
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <FiChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        <InputField label="Link Tokopedia" name="linkTokopedia" value={formData.linkTokopedia} onChange={handleChange} placeholder="https://..." />
        <InputField label="Link Shopee" name="linkShopee" value={formData.linkShopee} onChange={handleChange} placeholder="https://..." />

        <div className="mt-8">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-bold text-lg">
            {isEditMode ? "SAVE CHANGES" : "ADD"}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", required = false, placeholder }) => (
  <div className="mb-4">
    <label className="block mb-2 font-medium text-slate-300">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        rows="4"
        placeholder={placeholder}
        className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    ) : (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    )}
  </div>
);

export default AddProductPage;
