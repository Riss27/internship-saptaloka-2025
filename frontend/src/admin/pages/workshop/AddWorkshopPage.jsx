import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import {
  Save,
  Type,
  Image as ImageIcon,
  SquareCheck,
  Square,
  Tag,
  Plus,
  X,
  Upload,
} from "lucide-react";
import RichTextEditor from "../../components/RichTextEditor";
import API_BASE from "../../../lib/apiBase";
import FieldError from "../../../components/atoms/feedback/FieldError";
import ErrorBanner from "../../../components/atoms/feedback/ErrorBanner";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";
import UploadProgress from "../../components/UploadProgress";
import formatBytes from "../../../lib/formatBytes";

const InputField = ({ label, name, value, onChange, icon, error, ...props }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-cream/80">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
        {icon}
      </span>
      <input
        {...props}
        name={name}
        value={value || ""}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
      />
    </div>
    <FieldError name={name} message={error} />
  </div>
);

const AddWorkshopPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [workshop, setWorkshop] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [groupedEvents, setGroupedEvents] = useState({});
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [uploadPhase, setUploadPhase] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  };

  useEffect(() => {
    fetchCategories();

    apiClient
      .get("/api/events?search=")
      .then((response) => {
        const events = response.data.data;
        const grouped = events.reduce((acc, event) => {
          const category = event.category || "Tanpa Kategori";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(event);
          return acc;
        }, {});
        setGroupedEvents(grouped);
      })
      .catch((error) => console.error("Gagal mengambil data events:", error));

    if (isEditMode) {
      apiClient
        .get(`/api/workshops/${id}`)
        .then((response) => {
          const fetched = response.data.data;
          setWorkshop({
            title: fetched.title,
            description: fetched.description,
            category: fetched.category,
          });
          setPreviewImage(`${API_BASE}${fetched.imageUrl}`);
          setSelectedEventIds(new Set(fetched.Events.map((e) => e.id)));
        })
        .catch((error) =>
          console.error("Gagal mengambil data workshop:", error),
        );
    }
  }, [id, isEditMode]);

  const handleWorkshopChange = (e) => {
    setWorkshop((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) =>
      e.target.name in prev ? { ...prev, [e.target.name]: "" } : prev,
    );
  };
  const handleDescriptionChange = (value) =>
    setWorkshop((prev) => ({ ...prev, description: value }));
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const handleEventSelect = (eventId) => {
    const newSelectedIds = new Set(selectedEventIds);
    if (newSelectedIds.has(eventId)) {
      newSelectedIds.delete(eventId);
    } else {
      newSelectedIds.add(eventId);
    }
    setSelectedEventIds(newSelectedIds);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryError("Nama kategori tidak boleh kosong.");
      return;
    }
    setCategoryError("");

    setIsAddingCategory(true);
    try {
      const response = await apiClient.post("/api/categories", {
        name: newCategoryName.trim(),
      });

      // Refresh categories
      await fetchCategories();

      // Set the newly created category as selected
      setWorkshop((prev) => ({ ...prev, category: response.data.data.name }));

      // Close modal and reset form
      setShowCategoryModal(false);
      setNewCategoryName("");

      toast.success("Kategori berhasil ditambahkan.");
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
      toast.error(
        error.response?.data?.message || "Gagal menambahkan kategori.",
      );
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Petakan errors[] backend ke state; sisa pesan tetap tampil di ErrorBanner.
  const applySaveError = (error) => {
    const data = error.response?.data;
    const apiErrors = Array.isArray(data?.errors) ? data.errors : [];
    const mapped = {};
    apiErrors.forEach(({ field, message }) => {
      if (field in workshop) mapped[field] = message;
    });
    setFieldErrors(mapped);

    let bannerMessage =
      data?.message || "Gagal menyimpan workshop. Periksa kembali isian Anda.";
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
    const formData = new FormData();
    formData.append("title", workshop.title);
    formData.append("description", workshop.description);
    formData.append("category", workshop.category);
    if (image) formData.append("imageUrl", image);
    formData.append("eventIds", JSON.stringify(Array.from(selectedEventIds)));

    const hasFile = Boolean(image);
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
        ? await apiClient.put(`/api/workshops/${id}`, formData, config)
        : await apiClient.post("/api/workshops", formData, config);
      setUploadPhase(null);

      const uploadInfo = res.data?.uploadInfo;
      if (uploadInfo && uploadInfo.size < uploadInfo.originalSize) {
        toast.success(
          `Gambar dikompres: ${formatBytes(uploadInfo.originalSize)} → ${formatBytes(uploadInfo.size)} (WebP)`,
        );
      }
      toast.success("Workshop disimpan.");
      navigate("/admin/workshop");
    } catch (error) {
      console.error("Gagal menyimpan workshop:", error.response?.data || error);
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
          {isEditMode ? "Edit workshop" : "Tambah workshop"}
        </h1>
        <Link
          to="/admin/workshop"
          className="min-h-11 px-5 rounded-lg font-semibold text-cream bg-red-600 hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 inline-flex items-center no-underline"
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
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-800/50 p-4 sm:p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Detail workshop
            </h2>
            <InputField
              label="Judul workshop"
              name="title"
              value={workshop.title}
              onChange={handleWorkshopChange}
              icon={<Type aria-hidden="true" className="w-5 h-5" />}
              required
              placeholder="Judul workshop..."
              error={fieldErrors.title}
            />

            <div className="mb-6">
              <label className="block mb-2 font-medium text-cream/80">
                Kategori
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full sm:flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
                    <Tag aria-hidden="true" className="w-5 h-5" />
                  </span>
                  <select
                    name="category"
                    value={workshop.category}
                    onChange={handleWorkshopChange}
                    required
                    aria-invalid={
                      fieldErrors.category ? true : undefined
                    }
                    aria-describedby={
                      fieldErrors.category ? "category-error" : undefined
                    }
                    className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${fieldErrors.category ? "border-red-400" : "border-border"}`}
                  >
                    <option value="" disabled>
                      -- Pilih Kategori Workshop --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-brand-600 hover:bg-brand-500 px-4 py-2 min-h-11 rounded-md font-semibold text-cream flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Plus aria-hidden="true" className="w-5 h-5" /> Tambah
                  Kategori
                </button>
              </div>
              <FieldError name="category" message={fieldErrors.category} />
            </div>

            <div>
              <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Poster workshop
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="poster-upload"
                  name="imageUrl"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  required={!isEditMode}
                />
                <label
                  htmlFor="poster-upload"
                  className="relative flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  <UploadProgress phase={uploadPhase} percent={uploadPercent} />
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewImage}
                        alt="Pratinjau poster"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Klik untuk mengubah poster
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
                        Klik untuk mengunggah poster
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
            <div className="mt-6">
              <label className="block mb-2 font-medium text-cream/80">
                Deskripsi
              </label>
              <RichTextEditor
                content={workshop.description}
                onUpdate={handleDescriptionChange}
                maxLength={5000}
              />
              <FieldError name="description" message={fieldErrors.description} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-brand-800/50 p-4 sm:p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Pilih event
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {workshop.category ? (
                Object.keys(groupedEvents)
                  .filter(
                    (category) =>
                      category === workshop.category ||
                      category === "Tanpa Kategori",
                  )
                  .map((category) => (
                    <div key={category}>
                      <h3 className="font-semibold text-brand-400 mb-2 sticky top-0 bg-brand-800/50 py-1">
                        {category}
                      </h3>
                      <div className="space-y-3">
                        {groupedEvents[category].map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventSelect(event.id)}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedEventIds.has(event.id) ? "bg-brand-600/30 border-brand-500" : "bg-brand-800 border-border hover:border-brand-500"}`}
                          >
                            {selectedEventIds.has(event.id) ? (
                              <SquareCheck
                                aria-hidden="true"
                                className="text-brand-400 mr-4 flex-shrink-0 w-5 h-5"
                              />
                            ) : (
                              <Square
                                aria-hidden="true"
                                className="text-cream/70 mr-4 flex-shrink-0 w-5 h-5"
                              />
                            )}
                            <img
                              src={`${API_BASE}${event.imageBannerUrl}`}
                              alt={event.title}
                              className="w-16 h-10 object-cover rounded-md"
                            />
                            <div className="ml-4">
                              <p className="font-semibold text-cream text-sm">
                                {event.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-cream/70 p-8">
                  <p>
                    Pilih kategori workshop terlebih dahulu untuk melihat event
                    yang relevan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 py-3 rounded-md font-bold text-lg flex items-center justify-center"
          >
            <Save aria-hidden="true" className="w-5 h-5 mr-2" />
            {isLoading
              ? "Menyimpan…"
              : isEditMode
                ? "Simpan perubahan"
                : "Buat workshop"}
          </button>
        </div>
      </form>

      {/* Modal Tambah Kategori */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cream">
                Tambah Kategori Baru
              </h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName("");
                  setCategoryError("");
                }}
                className="min-h-11 min-w-11 grid place-items-center text-cream/60 hover:text-cream"
                aria-label="Tutup modal tambah kategori"
              >
                <X aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label
                  htmlFor="new-category-name"
                  className="block mb-2 font-medium text-cream/80"
                >
                  Nama Kategori
                </label>
                <input
                  type="text"
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (categoryError) setCategoryError("");
                  }}
                  placeholder="Masukkan nama kategori..."
                  aria-invalid={categoryError ? true : undefined}
                  aria-describedby={
                    categoryError ? "new-category-name-error" : undefined
                  }
                  className={`w-full min-h-11 p-2 bg-brand-900 border rounded-md focus:outline-none focus:border-brand-400 text-cream ${categoryError ? "border-red-400" : "border-border"}`}
                  autoFocus
                />
                <FieldError
                  name="new-category-name"
                  message={categoryError}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName("");
                    setCategoryError("");
                  }}
                  className="px-4 py-2 min-h-11 bg-brand-700 hover:bg-brand-600 rounded-md font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAddingCategory || !newCategoryName.trim()}
                  className="px-4 py-2 min-h-11 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed rounded-md font-semibold transition-colors"
                >
                  {isAddingCategory ? "Menambahkan…" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWorkshopPage;
