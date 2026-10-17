import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Trash2,
  Save,
  Type,
  Users,
  MapPin,
  CircleDollarSign,
  Calendar,
  Image as ImageIcon,
  X,
  Upload,
  Tag,
  ChevronDown,
  ToggleLeft,
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
  icon,
  as = "input",
  options = [],
  error,
  ...props
}) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-cream/80">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
        {icon}
      </span>

      {as === "select" ? (
        <>
          <select
            name={name}
            value={value}
            onChange={onChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
            className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 appearance-none ${error ? "border-red-400" : "border-border"}`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-cream/60 pointer-events-none w-4 h-4"
          />
        </>
      ) : (
        <input
          {...props}
          name={name}
          value={value || ""}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      )}
    </div>
    <FieldError name={name} message={error} />
  </div>
);

const AddEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState({
    title: "",
    quota: 1,
    location: "",
    fee: 0,
    description: "",
    startDateTime: new Date(),
    endDateTime: new Date(),
    category: "",
    status: "Coming Soon",
  });
  const [imageBanner, setImageBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState("");
  const [roles, setRoles] = useState(["Umum"]);
  const [newRole, setNewRole] = useState("");
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
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
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    setIsLoading(true);
    apiClient
      .get(`/api/events/${id}`)
      .then((res) => {
        const fetched = res.data.data || {};
        setEvent({
          title: fetched.title || "",
          quota: fetched.quota || 1,
          location: fetched.location || "",
          fee: fetched.fee || 0,
          description: fetched.description || "",
          startDateTime: fetched.startDateTime
            ? new Date(fetched.startDateTime)
            : new Date(),
          endDateTime: fetched.endDateTime
            ? new Date(fetched.endDateTime)
            : new Date(),
          category: fetched.category || "",
          status: fetched.status || "Coming Soon",
        });
        if (fetched.imageBannerUrl)
          setPreviewBanner(`${API_BASE}${fetched.imageBannerUrl}`);
        if (fetched.participantRoles) {
          try {
            const parsedRoles = Array.isArray(fetched.participantRoles)
              ? fetched.participantRoles
              : JSON.parse(fetched.participantRoles);
            setRoles(parsedRoles);
          } catch {
            setRoles(["Umum"]);
          }
        }
        if (Array.isArray(fetched.EventContents)) {
          const parseJsonSafe = (data) => {
            if (!data) return [];
            let parsed = data;
            while (typeof parsed === "string") {
              try {
                parsed = JSON.parse(parsed);
              } catch {
                return [];
              }
            }
            return Array.isArray(parsed) ? parsed : [];
          };

          const fetchedContents = fetched.EventContents.map((c) => {
            const imageUrls = parseJsonSafe(c.imageUrls);
            return {
              header: c.header || "",
              content: c.content || "",
              images: imageUrls,
              previews: imageUrls.map((url) => `${API_BASE}${url}`),
            };
          });
          setContents(fetchedContents);
        }
      })
      .catch((err) => console.error("Gagal mengambil data event:", err))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  const handleEventChange = (e) => {
    setEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) =>
      e.target.name in prev ? { ...prev, [e.target.name]: "" } : prev,
    );
  };
  const handleDescriptionChange = (value) =>
    setEvent((prev) => ({ ...prev, description: value }));
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageBanner(file);
      setPreviewBanner(URL.createObjectURL(file));
    }
  };
  const addRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole("");
    }
  };
  const removeRole = (index) => setRoles(roles.filter((_, i) => i !== index));
  const addContentSection = () =>
    setContents([
      ...contents,
      { header: "", content: "", images: [], previews: [] },
    ]);
  const removeContentSection = (index) =>
    setContents(contents.filter((_, i) => i !== index));
  const handleContentTextChange = (index, field, value) => {
    const newContents = [...contents];
    newContents[index][field] = value;
    setContents(newContents);
  };
  const handleContentImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newContents = [...contents];
    newContents[index].images.push(...files);
    newContents[index].previews = newContents[index].images.map((f) =>
      typeof f === "string" ? f : URL.createObjectURL(f),
    );
    setContents(newContents);
  };
  const removeContentImage = (cIndex, iIndex) => {
    const newContents = [...contents];
    newContents[cIndex].images.splice(iIndex, 1);
    newContents[cIndex].previews.splice(iIndex, 1);
    setContents(newContents);
  };

  // Petakan errors[] backend ke state; sisa pesan tetap tampil di ErrorBanner.
  const applySaveError = (error) => {
    const data = error.response?.data;
    const apiErrors = Array.isArray(data?.errors) ? data.errors : [];
    const mapped = {};
    apiErrors.forEach(({ field, message }) => {
      if (field in event) mapped[field] = message;
    });
    setFieldErrors(mapped);

    let bannerMessage =
      data?.message || "Gagal menyimpan event. Periksa kembali isian Anda.";
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
    Object.keys(event).forEach((key) =>
      formData.append(
        key,
        event[key] instanceof Date
          ? event[key].toISOString()
          : event[key],
      ),
    );
    if (imageBanner) formData.append("imageBanner", imageBanner);
    formData.append("participantRoles", JSON.stringify(roles));
    const contentData = contents.map((c) => {
      const newFiles = c.images.filter((img) => typeof img !== "string");
      const existingUrls = c.images
        .filter((img) => typeof img === "string")
        .map((url) => url.replace(API_BASE, ""));
      return {
        header: c.header,
        content: c.content,
        imageCount: newFiles.length,
        existingImageUrls: existingUrls,
      };
    });
    formData.append("contents", JSON.stringify(contentData));
    contents.forEach((c) =>
      c.images.forEach((img) => {
        if (typeof img !== "string") formData.append("contentImages", img);
      }),
    );

    const hasFile = Boolean(imageBanner);
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
        ? await apiClient.put(`/api/events/${id}`, formData, config)
        : await apiClient.post("/api/events", formData, config);
      setUploadPhase(null);

      const uploadInfo = res.data?.uploadInfo;
      if (uploadInfo && uploadInfo.size < uploadInfo.originalSize) {
        toast.success(
          `Gambar dikompres: ${formatBytes(uploadInfo.originalSize)} → ${formatBytes(uploadInfo.size)} (WebP)`,
        );
      }
      toast.success("Event disimpan.");
      navigate("/admin/events");
    } catch (err) {
      console.error("Gagal menyimpan event:", err.response?.data || err);
      if (hasFile) {
        setUploadPhase("failed");
        toast.error("Unggahan gagal. Coba lagi.");
      }
      applySaveError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-cream">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit event" : "Tambah event"}
        </h1>
        <Link
          to="/admin/events"
          className="bg-red-600 hover:bg-red-700 px-5 py-2 min-h-11 inline-flex items-center rounded-md font-semibold no-underline"
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
            Detail event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <InputField
                label="Judul event"
                name="title"
                value={event.title}
                onChange={handleEventChange}
                icon={<Type aria-hidden="true" className="w-5 h-5" />}
                required
                placeholder="Judul event..."
                error={fieldErrors.title}
              />
              <InputField
                as="select"
                label="Kategori"
                name="category"
                value={event.category}
                onChange={handleEventChange}
                icon={<Tag aria-hidden="true" className="w-5 h-5" />}
                error={fieldErrors.category}
                options={[
                  { value: "", label: "-- Tanpa Kategori --" },
                  ...categories.map((cat) => ({
                    value: cat.name,
                    label: cat.name,
                  })),
                ]}
              />
              <InputField
                label="Lokasi"
                name="location"
                value={event.location}
                onChange={handleEventChange}
                icon={<MapPin aria-hidden="true" className="w-5 h-5" />}
                required
                placeholder="Lokasi event..."
                error={fieldErrors.location}
              />
              <div className="mb-6">
                <label className="block mb-2 font-medium text-cream/80">
                  Status
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
                    <ToggleLeft aria-hidden="true" className="w-5 h-5" />
                  </span>
                  <select
                    name="status"
                    value={event.status}
                    onChange={handleEventChange}
                    aria-invalid={
                      fieldErrors.status ? true : undefined
                    }
                    aria-describedby={
                      fieldErrors.status ? "status-error" : undefined
                    }
                    className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${fieldErrors.status ? "border-red-400" : "border-border"}`}
                  >
                    <option value="Coming Soon">Segera hadir</option>
                    <option value="Open">Pendaftaran dibuka</option>
                    <option value="Closed">Ditutup</option>
                    <option value="Finished">Selesai</option>
                  </select>
                </div>
                <FieldError name="status" message={fieldErrors.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Kuota"
                  name="quota"
                  type="number"
                  min="1"
                  value={event.quota}
                  onChange={handleEventChange}
                  icon={<Users aria-hidden="true" className="w-5 h-5" />}
                  required
                  error={fieldErrors.quota}
                />
                <InputField
                  label="Biaya"
                  name="fee"
                  type="number"
                  min="0"
                  value={event.fee}
                  onChange={handleEventChange}
                  icon={
                    <CircleDollarSign aria-hidden="true" className="w-5 h-5" />
                  }
                  required
                  error={fieldErrors.fee}
                />
              </div>
            </div>

            {/* IMPROVED BANNER UPLOAD */}
            <div>
              <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Banner event
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="banner-upload"
                  name="imageBanner"
                  onChange={handleBannerChange}
                  className="hidden"
                  accept="image/*"
                  required={!isEditMode}
                />
                <label
                  htmlFor="banner-upload"
                  className="relative flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  <UploadProgress phase={uploadPhase} percent={uploadPercent} />
                  {previewBanner ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewBanner}
                        alt="Pratinjau banner"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Klik untuk mengubah banner
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
                        Klik untuk mengunggah banner
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
              {previewBanner && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewBanner("");
                    setImageBanner(null);
                  }}
                  className="mt-3 w-full min-h-11 py-2 px-4 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 aria-hidden="true" className="w-5 h-5" />
                  Hapus banner
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 font-medium text-cream/80">
              Deskripsi
            </label>
            <RichTextEditor
              content={event.description}
              onUpdate={handleDescriptionChange}
              maxLength={5000}
            />
            <FieldError name="description" message={fieldErrors.description} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <label className="flex mb-2 font-medium text-cream/80 items-center">
                <Calendar aria-hidden="true" className="w-5 h-5 mr-2" />{" "}
                Tanggal & waktu mulai
              </label>
              <DatePicker
                selected={event.startDateTime}
                onChange={(date) =>
                  setEvent((prev) => ({ ...prev, startDateTime: date }))
                }
                showTimeSelect
                locale={DATEPICKER_LOCALE}
                dateFormat={DATEPICKER_FORMAT}
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Waktu"
                className="w-full min-h-11 p-2 bg-brand-800 border border-border rounded-md"
              />
              <FieldError
                name="startDateTime"
                message={fieldErrors.startDateTime}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-cream/80 items-center">
                <Calendar aria-hidden="true" className="w-5 h-5 mr-2" />{" "}
                Tanggal & waktu selesai
              </label>
              <DatePicker
                selected={event.endDateTime}
                onChange={(date) =>
                  setEvent((prev) => ({ ...prev, endDateTime: date }))
                }
                showTimeSelect
                locale={DATEPICKER_LOCALE}
                dateFormat={DATEPICKER_FORMAT}
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Waktu"
                className="w-full min-h-11 p-2 bg-brand-800 border border-border rounded-md"
              />
              <FieldError
                name="endDateTime"
                message={fieldErrors.endDateTime}
              />
            </div>
          </div>
        </div>

        <div className="bg-brand-800/50 p-4 sm:p-8 rounded-lg ">
          <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
            Peran peserta
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Contoh: Mahasiswa"
              className="flex-grow min-h-11 p-2 bg-brand-800 border border-border rounded-md focus:outline-none focus:border-brand-400 "
            />
            <button
              type="button"
              onClick={addRole}
              className="bg-brand-600 hover:bg-brand-500 px-4 py-2 min-h-11 rounded-md font-semibold transition-colors"
            >
              Tambah peran
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
            {roles.map((role, index) => (
              <span
                key={index}
                className="flex items-center bg-brand-700 px-3 py-1 rounded-full text-sm"
              >
                {role}{" "}
                <button
                  type="button"
                  onClick={() => removeRole(index)}
                  className="ml-2 -my-2.5 min-h-11 min-w-11 grid place-items-center text-cream"
                  title={`Hapus peran ${role}`}
                  aria-label={`Hapus peran ${role}`}
                >
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </span>
            ))}
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
                  label="Judul bagian"
                  name="header"
                  value={content.header}
                  onChange={(e) =>
                    handleContentTextChange(index, "header", e.target.value)
                  }
                  icon={<Type aria-hidden="true" className="w-5 h-5" />}
                  placeholder="Judul bagian..."
                />
                <div>
                  <label className="block mb-2 font-medium text-cream/80">
                    Konten
                  </label>
                  <RichTextEditor
                    content={content.content}
                    onUpdate={(value) =>
                      handleContentTextChange(index, "content", value)
                    }
                    maxLength={10000}
                  />
                </div>

                {/* IMPROVED CONTENT IMAGES */}
                <div className="mt-6">
                  <label className="mb-3 font-medium text-cream/80 flex items-center gap-2">
                    <ImageIcon
                      aria-hidden="true"
                      className="w-5 h-5 text-brand-400"
                    />
                    Gambar bagian
                  </label>
                  <div className="bg-brand-800/70 p-4 rounded-lg border border-border">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {content.previews.map((p, i) => (
                        <div
                          key={i}
                          className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border border-brand-500 transition-all"
                        >
                          <img
                            src={p}
                            alt={`Pratinjau ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Kept visible on phones: hover does not exist there,
                              and the delete control must stay reachable. */}
                          <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeContentImage(index, i)}
                              className="min-h-11 min-w-11 grid place-items-center p-2 bg-red-600 hover:bg-red-700 text-cream rounded-full transition-colors"
                              aria-label={`Hapus gambar ${i + 1}`}
                            >
                              <Trash2 aria-hidden="true" className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Upload Button */}
                      <label className="aspect-square flex flex-col justify-center items-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-brand-400 bg-brand-700/50 transition-all group">
                        <Upload
                          aria-hidden="true"
                          className="w-5 h-5 text-cream/60 group-hover:text-brand-400 transition-colors mb-2"
                        />
                        <span className="text-xs text-cream/60 group-hover:text-brand-400 transition-colors text-center px-2">
                          Tambah gambar
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleContentImageChange(index, e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {content.previews.length === 0 && (
                      <p className="text-center text-cream/70 text-sm mt-2">
                        Belum ada gambar yang diunggah
                      </p>
                    )}
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
                : "Buat event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventPage;
