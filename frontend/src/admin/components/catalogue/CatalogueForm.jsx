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
import FieldError from "../../../components/atoms/feedback/FieldError";
import ErrorBanner from "../../../components/atoms/feedback/ErrorBanner";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";
import UploadProgress from "../UploadProgress";
import formatBytes from "../../../lib/formatBytes";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  error,
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 text-cream border rounded-lg focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 text-cream border rounded-lg focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      )}
    </div>
    <FieldError name={name} message={error} />
  </div>
);

const ITEM_NOUNS = {
  product: "Produk",
  ingredient: "Bahan",
  "lab tool": "Alat lab",
};

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [uploadPhase, setUploadPhase] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const { toast } = useToast();
  const isEditMode = Boolean(id);
  const itemTitle = ITEM_NOUNS[itemType] ?? itemType;
  const itemLower = itemTitle.toLowerCase();

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
    setFieldErrors((prev) =>
      name in prev ? { ...prev, [name]: "" } : prev,
    );
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
    setFieldErrors({});
    setSaveError("");
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) =>
      submissionData.append(key, formData[key] || ""),
    );

    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    const hasFile = Boolean(imageFile);
    if (hasFile) {
      setUploadPhase("uploading");
      setUploadPercent(0);
    }

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          if (!total) return;
          setUploadPercent(Math.round((loaded * 100) / total));
          if (loaded >= total) setUploadPhase("processing");
        },
      };

      const res = isEditMode
        ? await apiClient.put(`/api/${apiEndpoint}/${id}`, submissionData, config)
        : await apiClient.post(`/api/${apiEndpoint}`, submissionData, config);
      setUploadPhase(null);

      const uploadInfo = res.data?.uploadInfo;
      if (uploadInfo && uploadInfo.size < uploadInfo.originalSize) {
        toast.success(
          `Gambar dikompres: ${formatBytes(uploadInfo.originalSize)} → ${formatBytes(uploadInfo.size)} (WebP)`,
        );
      }
      toast.success(`${itemTitle} disimpan.`);

      navigate(navigateBackUrl);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          `Gagal menyimpan ${itemType}:`,
          error.response.data.message,
        );
      } else {
        console.error(`Gagal menyimpan ${itemType}:`, error);
      }
      if (hasFile) {
        setUploadPhase("failed");
        toast.error("Unggahan gagal. Coba lagi.");
      }

      const data = error.response?.data;
      const apiErrors = Array.isArray(data?.errors) ? data.errors : [];
      const mapped = {};
      apiErrors.forEach(({ field, message }) => {
        if (field in formData) mapped[field] = message;
      });
      setFieldErrors(mapped);

      let bannerMessage =
        data?.message || "Gagal menyimpan. Periksa kembali isian Anda.";
      if (apiErrors.length && data?.message) {
        let rest = data.message;
        Object.values(mapped).forEach((m) => {
          rest = rest.split(m).join(" ");
        });
        rest = rest
          .replace(/\s+/g, " ")
          .replace(/^[\s,;:.]+|[\s,;:.]+$/g, "")
          .trim();
        bannerMessage = rest;
      }
      setSaveError(bannerMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-cream">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? `Edit ${itemLower}` : `Tambah ${itemLower}`}
        </h1>
        <Link
          to={navigateBackUrl}
          className="min-h-11 px-4 rounded-buttons-outlined border border-border text-sm font-medium text-cream/90 hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 inline-flex items-center no-underline"
        >
          Kembali
        </Link>
      </header>

      <ErrorBanner
        title="Gagal menyimpan"
        message={saveError}
        onDismiss={() => setSaveError("")}
        className="mb-6"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-brand-700 p-4 sm:p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Detail {itemLower}
            </h2>
            <InputField
              label={`Nama ${itemLower}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={true}
              placeholder={`Contoh: 'Nama ${itemLower}'`}
              icon={<Info aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.name}
            />
            <InputField
              label="Harga"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required={true}
              placeholder="Contoh: 150000"
              icon={<CircleDollarSign aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.price}
            />
            <div className="mb-6">
              <label className="block mb-2 font-medium text-cream/80">
                Deskripsi
              </label>
              <RichTextEditor
                content={formData.description}
                onUpdate={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder={`Deskripsi singkat ${itemLower}...`}
                maxLength={1000}
              />
              <FieldError
                name="description"
                message={fieldErrors.description}
              />
            </div>
          </div>

          <div className="bg-brand-700 p-4 sm:p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Pengaturan
            </h2>

            {/* Tampilkan kategori hanya jika ada opsinya */}
            {categoryOptions && (
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block mb-2 font-medium text-cream/90"
                >
                  Kategori
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
                    aria-invalid={
                      fieldErrors.category ? true : undefined
                    }
                    aria-describedby={
                      fieldErrors.category ? "category-error" : undefined
                    }
                    className={`w-full min-h-11 p-2 pl-10 bg-brand-800 text-cream border rounded-lg focus:outline-none focus:border-brand-400 appearance-none ${fieldErrors.category ? "border-red-400" : "border-border"}`}
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
                <FieldError name="category" message={fieldErrors.category} />
              </div>
            )}

            <div className="mb-6">
              <label className="mb-2 font-medium text-cream/90 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Gambar {itemLower}
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
                  className="relative flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  <UploadProgress phase={uploadPhase} percent={uploadPercent} />
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewImage}
                        alt="Pratinjau gambar"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-brand-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Klik untuk mengubah gambar
                        </span>
                        <span className="text-cream/70 text-sm mt-1">
                          PNG, JPG maksimal 10 MB
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
                        Klik untuk mengunggah gambar
                      </span>
                      <span className="text-cream/70 text-sm">
                        atau seret dan lepas
                      </span>
                      <p className="text-cream/50 text-xs mt-2">
                        PNG, JPG maksimal 10 MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <InputField
              label="Tautan Tokopedia"
              name="linkTokopedia"
              value={formData.linkTokopedia}
              onChange={handleChange}
              placeholder="https://..."
              icon={<LinkIcon aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.linkTokopedia}
            />
            <InputField
              label="Tautan Shopee"
              name="linkShopee"
              value={formData.linkShopee}
              onChange={handleChange}
              placeholder="https://..."
              icon={<LinkIcon aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.linkShopee}
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
              ? "Menyimpan…"
              : isEditMode
                ? "Simpan perubahan"
                : `Tambah ${itemLower}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatalogueForm;
