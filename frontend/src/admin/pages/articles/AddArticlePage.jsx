import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";

// TAMBAHKAN import untuk DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// TAMBAHKAN Calendar untuk ikon
import {
  Type,
  User,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Upload,
  Calendar,
} from "lucide-react";
import RichTextEditor from "../../components/RichTextEditor";
import API_BASE from "../../../lib/apiBase";
import FieldError from "../../../components/atoms/feedback/FieldError";
import ErrorBanner from "../../../components/atoms/feedback/ErrorBanner";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";
import UploadProgress from "../../components/UploadProgress";
import formatBytes from "../../../lib/formatBytes";
import { DATEPICKER_LOCALE, DATEPICKER_FORMAT } from "../../lib/datepickerId";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  required = false,
  error,
}) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-cream/80 transition-colors duration-300 focus-within:text-brand-400">
      {label}
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
          rows="8"
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      )}
    </div>
    <FieldError name={name} message={error} />
  </div>
);

const AddArticlePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // UBAH: Tambahkan `publishedAt` ke state awal
  const [article, setArticle] = useState({
    title: "",
    author: "",
    mainDescription: "",
    publishedAt: new Date(),
  });

  const [contents, setContents] = useState([
    { topic: "", description: "", images: [], previews: [] },
  ]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [previewFeaturedImage, setPreviewFeaturedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [uploadPhase, setUploadPhase] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      apiClient
        .get(`/api/articles/${id}`)
        .then((response) => {
          const fetchedArticle = response.data.data;
          setArticle({
            title: fetchedArticle.title,
            author: fetchedArticle.author,
            mainDescription: fetchedArticle.mainDescription,
            // UBAH: Tambahkan `publishedAt` dari data fetch
            publishedAt: fetchedArticle.publishedAt
              ? new Date(fetchedArticle.publishedAt)
              : new Date(),
          });
          if (fetchedArticle.featuredImageUrl) {
            setPreviewFeaturedImage(
              `${API_BASE}${fetchedArticle.featuredImageUrl}`,
            );
          }
          if (
            fetchedArticle.ArticleContents &&
            fetchedArticle.ArticleContents.length > 0
          ) {
            const fetchedContents = fetchedArticle.ArticleContents.map(
              (content) => {
                const parseImageUrls = (data) => {
                  if (!data) return [];
                  let parsed = data;
                  while (typeof parsed === "string") {
                    try {
                      parsed = JSON.parse(parsed);
                    } catch (e) {
                      console.error("Gagal parse imageUrls:", e);
                      return [];
                    }
                  }
                  return Array.isArray(parsed) ? parsed : [];
                };
                const imageUrls = parseImageUrls(content.imageUrls);
                return {
                  topic: content.topic,
                  description: content.description,
                  images: imageUrls,
                  previews: imageUrls.map((url) => `${API_BASE}${url}`),
                };
              },
            );
            setContents(fetchedContents);
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil detail artikel:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleArticleChange = (e) => {
    setArticle((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) =>
      e.target.name in prev ? { ...prev, [e.target.name]: "" } : prev,
    );
  };

  const handleContentChange = (index, e) => {
    const newContents = [...contents];
    newContents[index][e.target.name] = e.target.value;
    setContents(newContents);
  };

  const handleContentImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newContents = [...contents];
      const newImages = [...newContents[index].images, ...files];
      const newPreviews = newImages.map((img) =>
        typeof img === "string"
          ? `${API_BASE}${img}`
          : URL.createObjectURL(img),
      );

      newContents[index].images = newImages;
      newContents[index].previews = newPreviews;
      setContents(newContents);
    }
  };

  const removeContentImage = (contentIndex, imageIndex) => {
    const newContents = [...contents];
    newContents[contentIndex].images.splice(imageIndex, 1);
    newContents[contentIndex].previews.splice(imageIndex, 1);
    setContents(newContents);
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setPreviewFeaturedImage(URL.createObjectURL(file));
    }
  };

  const addContentSection = () =>
    setContents([
      ...contents,
      { topic: "", description: "", images: [], previews: [] },
    ]);
  const removeContentSection = (index) =>
    setContents(contents.filter((_, i) => i !== index));

  // Petakan errors[] backend ke state; sisa pesan tetap tampil di ErrorBanner.
  const applySaveError = (error) => {
    const data = error.response?.data;
    const apiErrors = Array.isArray(data?.errors) ? data.errors : [];
    const mapped = {};
    apiErrors.forEach(({ field, message }) => {
      if (field in article) mapped[field] = message;
    });
    setFieldErrors(mapped);

    let bannerMessage =
      data?.message || "Gagal menyimpan artikel. Periksa kembali isian Anda.";
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setSaveError("");

    const submissionData = new FormData();
    // Semua state di `article` otomatis ter-append, termasuk `publishedAt`
    Object.keys(article).forEach((key) =>
      submissionData.append(
        key,
        article[key] instanceof Date
          ? article[key].toISOString()
          : article[key],
      ),
    );

    if (featuredImage) {
      submissionData.append("featuredImage", featuredImage);
    }

    const contentData = contents.map((c) => {
      const newImageFiles = c.images.filter((img) => typeof img !== "string");
      const existingImageUrls = c.images.filter(
        (img) => typeof img === "string",
      );
      return {
        topic: c.topic,
        description: c.description,
        imageCount: newImageFiles.length,
        existingImageUrls: existingImageUrls,
      };
    });
    submissionData.append("contents", JSON.stringify(contentData));

    contents.forEach((c) => {
      c.images.forEach((image) => {
        if (typeof image !== "string") {
          submissionData.append("contentImages", image);
        }
      });
    });

    const hasFile = Boolean(featuredImage);
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
        ? await apiClient.put(`/api/articles/${id}`, submissionData, config)
        : await apiClient.post("/api/articles", submissionData, config);
      setUploadPhase(null);

      const uploadInfo = res.data?.uploadInfo;
      if (uploadInfo && uploadInfo.size < uploadInfo.originalSize) {
        toast.success(
          `Gambar dikompres: ${formatBytes(uploadInfo.originalSize)} → ${formatBytes(uploadInfo.size)} (WebP)`,
        );
      }
      toast.success("Artikel disimpan.");
      navigate("/admin/articles");
    } catch (error) {
      console.error(
        "Gagal menyimpan artikel:",
        error.response?.data || error.message,
      );
      if (hasFile) {
        setUploadPhase("failed");
        toast.error("Unggahan gagal. Coba lagi.");
      }
      applySaveError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-cream">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit artikel" : "Tambah artikel"}
        </h1>
        <Link
          to="/admin/articles"
          className="min-h-11 px-5 rounded-lg font-semibold text-cream bg-red-600 hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 inline-flex items-center no-underline"
        >
          Kembali
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <ErrorBanner
          title="Gagal menyimpan"
          message={saveError}
          onDismiss={() => setSaveError("")}
          className="mb-6"
        />
        <div className="bg-brand-800/50 p-4 sm:p-8 rounded-lg ">
          <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
            Detail artikel utama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <InputField
                label="Judul artikel"
                name="title"
                value={article.title}
                onChange={handleArticleChange}
                required={true}
                placeholder="Judul utama artikel..."
                icon={<Type aria-hidden="true" className="w-5 h-5" />}
                error={fieldErrors.title}
              />
              <InputField
                label="Penulis"
                name="author"
                value={article.author}
                onChange={handleArticleChange}
                required={true}
                placeholder="Nama penulis..."
                icon={<User aria-hidden="true" className="w-5 h-5" />}
                error={fieldErrors.author}
              />

              {/* TAMBAHKAN: Komponen DatePicker */}
              <div className="mb-6">
                <label className="block mb-2 font-medium text-cream/80 transition-colors duration-300 focus-within:text-brand-400">
                  Tanggal publikasi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
                    <Calendar aria-hidden="true" className="w-5 h-5" />
                  </span>
                  <DatePicker
                    selected={
                      article.publishedAt
                        ? new Date(article.publishedAt)
                        : new Date()
                    }
                    onChange={(date) =>
                      setArticle((prev) => ({ ...prev, publishedAt: date }))
                    }
                    locale={DATEPICKER_LOCALE}
                    dateFormat={DATEPICKER_FORMAT}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Waktu"
                    className="w-full min-h-11 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400"
                  />
                </div>
                <FieldError
                  name="publishedAt"
                  message={fieldErrors.publishedAt}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-cream/80 transition-colors duration-300 focus-within:text-brand-400">
                  Deskripsi utama
                </label>
                <RichTextEditor
                  content={article.mainDescription}
                  onUpdate={(value) =>
                    setArticle((prev) => ({ ...prev, mainDescription: value }))
                  }
                  placeholder="Deskripsi pembuka artikel..."
                  maxLength={5000}
                />
                <FieldError
                  name="mainDescription"
                  message={fieldErrors.mainDescription}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Gambar utama
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="featured-upload"
                  name="featuredImage"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                  accept="image/*"
                  required={!isEditMode}
                />
                <label
                  htmlFor="featured-upload"
                  className="relative flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  <UploadProgress
                    phase={uploadPhase}
                    percent={uploadPercent}
                  />
                  {previewFeaturedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewFeaturedImage}
                        alt="Pratinjau gambar utama"
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
                        Klik untuk mengunggah gambar utama
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
            </div>
          </div>
        </div>

        <div className="bg-brand-800/50 p-4 sm:p-8 rounded-lg ">
          <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
            Bagian konten
          </h2>
          <div className="space-y-6">
            {contents.map((content, index) => (
              <div
                key={index}
                className="bg-brand-800 border border-border rounded-lg p-6 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-brand-400 text-lg">
                    Bagian {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeContentSection(index)}
                    className="min-h-11 min-w-11 grid place-items-center p-1 text-red-500 text-red-400 bg-red-500/10 rounded-full"
                    aria-label={`Hapus bagian ${index + 1}`}
                  >
                    <Trash2 aria-hidden="true" className="w-5 h-5" />
                  </button>
                </div>
                <InputField
                  label="Topik"
                  name="topic"
                  value={content.topic}
                  onChange={(e) => handleContentChange(index, e)}
                  required={true}
                  placeholder="Judul sub-konten..."
                  icon={<Type aria-hidden="true" className="w-5 h-5" />}
                />
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-cream/80">
                    Deskripsi
                  </label>
                  <RichTextEditor
                    content={content.description}
                    onUpdate={(value) => {
                      const newContents = [...contents];
                      newContents[index].description = value;
                      setContents(newContents);
                    }}
                    placeholder="Isi sub-konten..."
                    maxLength={10000}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-2 font-medium text-cream/80">
                    Gambar
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 min-h-[7rem] bg-brand-800/70 p-4 rounded-md">
                    {content.previews.map((previewUrl, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img
                          src={previewUrl}
                          alt={`Pratinjau ${i + 1}`}
                          className="h-full w-full object-cover rounded-md border-2 border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeContentImage(index, i)}
                          className="absolute -top-2 -right-2 min-h-11 min-w-11 grid place-items-center p-1 bg-red-600 text-cream rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          aria-label="Hapus gambar"
                        >
                          <X aria-hidden="true" className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col justify-center items-center w-full h-full border-2 border-dashed border-border rounded-md cursor-pointer hover:border-brand-400 bg-brand-700/50 transition-colors">
                      <Upload
                        aria-hidden="true"
                        className="w-5 h-5 text-cream/60"
                      />
                      <span className="text-xs text-cream/60 mt-1">
                        Tambah lagi
                      </span>
                      <input
                        type="file"
                        name="contentImages"
                        onChange={(e) => handleContentImageChange(index, e)}
                        multiple
                        className="opacity-0 w-0 h-0"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addContentSection}
            className="w-full mt-6 border-2 border-dashed border-border border-brand-500 text-cream/80 text-brand-400 py-3 rounded-md font-semibold flex items-center justify-center transition-colors"
          >
            <Plus aria-hidden="true" className="w-5 h-5 mr-2" /> Tambah
            bagian konten
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center transition-colors duration-300"
          >
            {isLoading
              ? "Menyimpan…"
              : isEditMode
                ? "Simpan perubahan"
                : "Terbitkan artikel"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticlePage;
