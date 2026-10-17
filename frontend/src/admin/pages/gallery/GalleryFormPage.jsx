import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Upload, Save, Image as ImageIcon } from "lucide-react";
import API_BASE from "../../../lib/apiBase";
import FieldError from "../../../components/atoms/feedback/FieldError";
import ErrorBanner from "../../../components/atoms/feedback/ErrorBanner";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";
import UploadProgress from "../../components/UploadProgress";
import formatBytes from "../../../lib/formatBytes";

const GalleryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [uploadPhase, setUploadPhase] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      apiClient
        .get(`/api/gallery/${id}`)
        .then((response) => {
          const { title, imageUrl } = response.data.data;
          setTitle(title);
          setPreview(`${API_BASE}${imageUrl}`);
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
      setImageError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSaveError("");

    // Validasi untuk mode 'add'
    if (!isEditMode && !imageFile) {
      setImageError("Gambar wajib diunggah.");
      return;
    }
    setImageError("");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    // Selalu kirim gambar jika ada file baru yang dipilih
    if (imageFile) {
      formData.append("image", imageFile);
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
        ? await apiClient.put(`/api/gallery/${id}`, formData, config)
        : await apiClient.post("/api/gallery", formData, config);
      setUploadPhase(null);

      const uploadInfo = res.data?.uploadInfo;
      if (uploadInfo && uploadInfo.size < uploadInfo.originalSize) {
        toast.success(
          `Gambar dikompres: ${formatBytes(uploadInfo.originalSize)} → ${formatBytes(uploadInfo.size)} (WebP)`,
        );
      }
      toast.success("Gambar disimpan.");
      navigate("/admin/gallery");
    } catch (error) {
      console.error("Gagal menyimpan gambar:", error);
      if (hasFile) {
        setUploadPhase("failed");
        toast.error("Unggahan gagal. Coba lagi.");
      }
      const data = error.response?.data;
      const apiErrors = Array.isArray(data?.errors) ? data.errors : [];
      const mapped = {};
      apiErrors.forEach(({ field, message }) => {
        if (field === "title") mapped.title = message;
      });
      setFieldErrors(mapped);

      let bannerMessage =
        data?.message || "Gagal menyimpan gambar. Periksa kembali isian Anda.";
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
    <div className="max-w-4xl mx-auto">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-cream">
          {isEditMode ? "Edit gambar" : "Tambah gambar ke galeri"}
        </h1>
        <Link
          to="/admin/gallery"
          className="bg-red-600 hover:bg-red-700 px-5 py-2 min-h-11 inline-flex items-center rounded-md font-semibold text-cream no-underline"
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
      <form
        onSubmit={handleSubmit}
        className="bg-brand-700 p-4 sm:p-8 rounded-lg text-cream"
      >
        {/* Input Judul */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 font-medium text-cream/80"
          >
            Judul
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) setFieldErrors({});
            }}
            required
            aria-invalid={fieldErrors.title ? true : undefined}
            aria-describedby={fieldErrors.title ? "title-error" : undefined}
            className={`w-full min-h-11 p-2 bg-brand-600/30 rounded border ${fieldErrors.title ? "border-red-400" : "border-border"}`}
          />
          <FieldError name="title" message={fieldErrors.title} />
        </div>

        {/* Input Gambar */}
        <div className="mb-6">
          <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
            <ImageIcon aria-hidden="true" className="w-5 h-5 text-brand-400" />
            {isEditMode ? "Ganti Gambar (Opsional)" : "Unggah Gambar"}
          </label>
          <div className="relative group">
            <input
              type="file"
              id="image-upload"
              name="image"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              aria-invalid={imageError ? true : undefined}
              aria-describedby={imageError ? "image-error" : undefined}
            />
            <label
              htmlFor="image-upload"
              className={`relative flex flex-col justify-center items-center w-full h-64 border-2 border-dashed rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden ${imageError ? "border-red-400" : "border-border"}`}
            >
              <UploadProgress phase={uploadPhase} percent={uploadPercent} />
              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Pratinjau gambar"
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
                    Klik untuk mengunggah gambar
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

        {/* Tombol Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 py-3 rounded-md font-bold text-lg flex items-center justify-center disabled:bg-brand-800"
          >
            <Save aria-hidden="true" className="w-5 h-5 mr-2" />
            {isLoading
              ? "Menyimpan…"
              : isEditMode
                ? "Simpan perubahan"
                : "Tambahkan ke galeri"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryFormPage;
