import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Type, FileText, Image as ImageIcon, Save, Upload } from "lucide-react";
import API_BASE from "../../../lib/apiBase";
import FieldError from "../../../components/atoms/feedback/FieldError";
import ErrorBanner from "../../../components/atoms/feedback/ErrorBanner";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";
import UploadProgress from "../../components/UploadProgress";
import formatBytes from "../../../lib/formatBytes";

// Komponen InputField dengan Ikon
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  required = false,
  maxLength,
  error,
}) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-cream/80">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
        {icon}
      </span>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="6"
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      )}
    </div>
    <FieldError name={name} message={error} />
  </div>
);

const AddLandingHeadingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ heading: "", paragraph: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [uploadPhase, setUploadPhase] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      apiClient
        .get(`/api/landing-page/${id}`)
        .then((response) => {
          const data = response.data.data;
          setFormData(data);
          if (data.imageUrl) {
            setPreviewImage(`${API_BASE}${data.imageUrl}`);
          }
        })
        .catch((error) =>
          console.error("Gagal mengambil detail slide:", error),
        );
    }
  }, [id, isEditMode]);

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
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Ukuran file maksimal 5 MB.");
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        setImageError("File harus berupa gambar.");
        return;
      }

      setImageError("");
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
    submissionData.append("heading", formData.heading || "");
    submissionData.append("paragraph", formData.paragraph || "");
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
        ? await apiClient.put(
            `/api/landing-page/${id}`,
            submissionData,
            config,
          )
        : await apiClient.post("/api/landing-page", submissionData, config);
      setUploadPhase(null);

      const uploadInfo = res.data?.uploadInfo;
      if (uploadInfo && uploadInfo.size < uploadInfo.originalSize) {
        toast.success(
          `Gambar dikompres: ${formatBytes(uploadInfo.originalSize)} → ${formatBytes(uploadInfo.size)} (WebP)`,
        );
      }
      toast.success("Slide disimpan.");
      navigate("/admin/homepage");
    } catch (error) {
      console.error("Gagal menyimpan slide:", error);
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
          {isEditMode ? "Edit slide" : "Tambah slide"}
        </h1>
        <Link
          to="/admin/homepage"
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
          {/* Left Column - Slide Details */}
          <div className="lg:col-span-2 bg-brand-700 p-4 sm:p-8 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Detail slide
            </h2>

            <InputField
              label="Judul slide"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              required={true}
              placeholder="Contoh: 'Selamat datang di platform kami'"
              icon={<Type aria-hidden="true" className="w-5 h-5" />}
              maxLength={100}
              error={fieldErrors.heading}
            />

            <InputField
              label="Paragraf"
              name="paragraph"
              type="textarea"
              value={formData.paragraph}
              onChange={handleChange}
              required={true}
              placeholder="Deskripsi singkat untuk slide..."
              icon={<FileText aria-hidden="true" className="w-5 h-5" />}
              maxLength={500}
              error={fieldErrors.paragraph}
            />

            {/* Character Counter */}
            <div className="text-sm space-y-1">
              <div
                className={
                  formData.heading?.length >= 100
                    ? "text-red-400"
                    : "text-cream/60"
                }
              >
                Judul: {formData.heading?.length || 0}/100 karakter
              </div>
              <div
                className={
                  formData.paragraph?.length >= 500
                    ? "text-red-400"
                    : "text-cream/60"
                }
              >
                Paragraf: {formData.paragraph?.length || 0}/500 karakter
              </div>
            </div>
          </div>

          {/* Right Column - Image & Settings */}
          <div className="bg-brand-700 p-4 sm:p-8 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Gambar slide
            </h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Gambar slide
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="slide-upload"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  aria-invalid={imageError ? true : undefined}
                  aria-describedby={imageError ? "image-error" : undefined}
                />
                <label
                  htmlFor="slide-upload"
                  className={`relative flex flex-col justify-center items-center w-full h-64 border-2 border-dashed rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden ${imageError ? "border-red-400" : "border-border"}`}
                >
                  <UploadProgress phase={uploadPhase} percent={uploadPercent} />
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewImage}
                        alt="Pratinjau slide"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Klik untuk mengubah gambar
                        </span>
                        <span className="text-cream/80 text-sm mt-1">
                          PNG, JPG maksimal 10 MB
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-800 flex items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-brand-400"
                        />
                      </div>
                      <span className="block text-cream/80 font-semibold mb-1">
                        Klik untuk mengunggah gambar slide
                      </span>
                      <span className="text-cream/60 text-sm">
                        atau seret dan lepas
                      </span>
                      <p className="text-cream/70 text-xs mt-2">
                        PNG, JPG maksimal 10 MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
              <FieldError name="image" message={imageError} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-cream"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Save aria-hidden="true" className="w-5 h-5 mr-2" />
            )}
            {isLoading
              ? "Menyimpan…"
              : isEditMode
                ? "Simpan perubahan"
                : "Tambah slide"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLandingHeadingPage;
