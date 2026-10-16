import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import {
  Info,
  Tag,
  CircleDollarSign,
  Link as LinkIcon,
  Image as ImageIcon,
  Save,
  ChevronDown,
  Upload,
} from "lucide-react";
import RichTextEditor from "../RichTextEditor";
import API_BASE from "../../../lib/apiBase";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-cream/90">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/50">
        {icon}
      </span>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="6"
          placeholder={placeholder}
          className="w-full p-2 pl-10 bg-brand-800 text-cream border border-border rounded-lg focus:outline-none focus:border-brand-400"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2 pl-10 bg-brand-800 text-cream border border-border rounded-lg focus:outline-none focus:border-brand-400"
        />
      )}
    </div>
  </div>
);

const CatalogueForm = ({
  itemType,
  apiEndpoint,
  navigateBackUrl,
  categoryOptions,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    linkTokopedia: "",
    linkShopee: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);
  const itemTitle = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  useEffect(() => {
    if (isEditMode) {
      apiClient
        .get(`/api/${apiEndpoint}/${id}`)
        .then((response) => {
          const data = response.data.data;
          setFormData(data);
          if (data.imageUrl) {
            setPreviewImage(`${API_BASE}${data.imageUrl}`);
          }
        })
        .catch((error) =>
          console.error(`Gagal mengambil detail ${itemType}:`, error),
        );
    }
  }, [id, isEditMode, apiEndpoint, itemType]);

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
    Object.keys(formData).forEach((key) =>
      submissionData.append(key, formData[key] || ""),
    );

    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEditMode) {
        await apiClient.put(
          `/api/${apiEndpoint}/${id}`,
          submissionData,
          config,
        );
      } else {
        await apiClient.post(`/api/${apiEndpoint}`, submissionData, config);
      }

      navigate(navigateBackUrl);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          `Gagal menyimpan ${itemType}:`,
          error.response.data.message,
        );
        alert(`Gagal menyimpan: ${error.response.data.message}`);
      } else {
        console.error(`Gagal menyimpan ${itemType}:`, error);
        alert(`Gagal menyimpan. Pastikan semua kolom wajib diisi.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-cream">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold uppercase">
          {isEditMode ? `Edit ${itemTitle}` : `Add New ${itemTitle}`}
        </h1>
        <Link
          to={navigateBackUrl}
          className="bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md font-semibold text-cream no-underline"
        >
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-brand-700 p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4 uppercase">
              {itemTitle} Details
            </h2>
            <InputField
              label={`${itemTitle} Name`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={true}
              placeholder={`Contoh: 'Nama ${itemType}'`}
              icon={<Info aria-hidden="true" className="w-5 h-5" />}
            />
            <InputField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required={true}
              placeholder="Contoh: 150000"
              icon={<CircleDollarSign aria-hidden="true" className="w-5 h-5" />}
            />
            <div className="mb-6">
              <label className="block mb-2 font-medium text-cream/80">
                Description
              </label>
              <RichTextEditor
                content={formData.description}
                onUpdate={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder={`Deskripsi singkat ${itemType}...`}
                maxLength={1000}
              />
            </div>
          </div>

          <div className="bg-brand-700 p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4 uppercase">
              Organize
            </h2>

            {/* Tampilkan kategori hanya jika ada opsinya */}
            {categoryOptions && (
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block mb-2 font-medium text-cream/90"
                >
                  Category
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/50">
                    <Tag aria-hidden="true" className="w-5 h-5" />
                  </span>
                  <select
                    id="category"
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                    required={true}
                    className="w-full p-2 pl-10 bg-brand-800 text-cream border border-border rounded-lg focus:outline-none focus:border-brand-400 appearance-none"
                  >
                    <option value="" disabled>
                      -- Pilih Kategori --
                    </option>
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cream/50">
                    <ChevronDown aria-hidden="true" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="mb-2 font-medium text-cream/90 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                {itemTitle} Image
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="catalogue-upload"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  required={!isEditMode}
                />
                <label
                  htmlFor="catalogue-upload"
                  className="flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-brand-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Click to change image
                        </span>
                        <span className="text-cream/70 text-sm mt-1">
                          PNG, JPG up to 10MB
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-900 flex items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-brand-400"
                        />
                      </div>
                      <span className="block text-cream font-semibold mb-1">
                        Click to upload image
                      </span>
                      <span className="text-cream/70 text-sm">
                        or drag and drop
                      </span>
                      <p className="text-cream/50 text-xs mt-2">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <InputField
              label="Link Tokopedia"
              name="linkTokopedia"
              value={formData.linkTokopedia}
              onChange={handleChange}
              placeholder="https://..."
              icon={<LinkIcon aria-hidden="true" className="w-5 h-5" />}
            />
            <InputField
              label="Link Shopee"
              name="linkShopee"
              value={formData.linkShopee}
              onChange={handleChange}
              placeholder="https://..."
              icon={<LinkIcon aria-hidden="true" className="w-5 h-5" />}
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 py-3 rounded-lg font-bold text-lg flex items-center justify-center text-cream"
          >
            <Save aria-hidden="true" className="w-5 h-5 mr-2" />
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "SAVE CHANGES"
                : `ADD ${itemTitle.toUpperCase()}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatalogueForm;
