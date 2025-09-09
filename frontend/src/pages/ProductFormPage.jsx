import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
    linkTokopedia: "",
    linkShopee: "",
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          // URL untuk mengambil data edit sekarang menjadi /catalogue/edit/:id
          const response = await axios.get(`http://localhost:3000/api/products/${id}`);
          setFormData(response.data.data);
        } catch (error) {
          console.error("Gagal mengambil detail produk:", error);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...formData, price: parseInt(formData.price) || 0 };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/products/${id}`, productData);
      } else {
        await axios.post("http://localhost:3000/api/products", productData);
      }

      navigate("/catalogue");
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Gagal menyimpan produk, silakan cek console.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <Link to="/catalogue" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold">
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-lg shadow-lg">
        <InputField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        <InputField label="Title" name="name" value={formData.name} onChange={handleChange} required />
        <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
        <InputField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} />
        <InputField label="Category" name="category" value={formData.category} onChange={handleChange} />
        <InputField label="Link Tokopedia" name="linkTokopedia" value={formData.linkTokopedia} onChange={handleChange} />
        <InputField label="Link Shopee" name="linkShopee" value={formData.linkShopee} onChange={handleChange} />

        <div className="mt-8">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-bold text-lg">
            {isEditMode ? "SAVE CHANGES" : "ADD"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Komponen InputField tidak ada perubahan
const InputField = ({ label, name, value, onChange, type = "text", required = false, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-2 font-medium">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full p-2 bg-white/20 rounded border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
      ></textarea>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full p-2 bg-white/20 rounded border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);

export default ProductFormPage;
