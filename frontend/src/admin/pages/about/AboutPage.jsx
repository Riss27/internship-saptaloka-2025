import React, { useState, useEffect } from "react";
import apiClient from "../../../hooks/apiClient";
import {
  Info,
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Image as ImageIcon,
  Save,
  Upload,
} from "lucide-react";
import API_BASE from "../../../lib/apiBase";
import FieldError from "../../../components/atoms/feedback/FieldError";
import ErrorBanner from "../../../components/atoms/feedback/ErrorBanner";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";
import UploadProgress from "../../components/UploadProgress";
import formatBytes from "../../../lib/formatBytes";

// Field yang punya input di halaman ini — error backend di luar daftar ini
// tetap tampil lewat ErrorBanner.
const EDITABLE_FIELDS = [
  "about",
  "address",
  "phone",
  "email",
  "instagram",
  "whatsapp",
];

// Komponen InputField dengan tambahan ikon
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
    <label className="block mb-2 font-medium text-cream/80">{label}</label>
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full min-h-11 p-2 pl-10 bg-brand-800 border rounded-md focus:outline-none focus:border-brand-400 ${error ? "border-red-400" : "border-border"}`}
        />
      )}
    </div>
    <FieldError name={name} message={error} />
  </div>
);

const AboutPage = () => {
  const [formData, setFormData] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [uploadPhase, setUploadPhase] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const { toast } = useToast();

  const fetchAboutInfo = async () => {
    try {
      const response = await apiClient.get("/api/about");
      setFormData(response.data.data || {});
      if (response.data.data?.logoFooter) {
        setPreviewLogo(`${API_BASE}${response.data.data.logoFooter}`);
      }
    } catch (error) {
      console.error("Gagal mengambil data About:", error);
    }
  };

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) =>
      name in prev ? { ...prev, [name]: "" } : prev,
    );
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setSaveError("");
    const submissionData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "logoFooter") {
        submissionData.append(key, formData[key] || "");
      }
    });

    if (logoFile) {
      submissionData.append("logoFooter", logoFile);
    }

    const hasFile = Boolean(logoFile);
    if (hasFile) {
      setUploadPhase("uploading");
      setUploadPercent(0);
    }

    try {
      const res = await apiClient.put("/api/about", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          if (!total) return;
          setUploadPercent(Math.round((loaded * 100) / total));
          if (loaded >= total) setUploadPhase("processing");
        },
      });
      setUploadPhase(null);

      const uploadInfo = res.data?.uploadInfo;
      if (uploadInfo && uploadInfo.size < uploadInfo.originalSize) {
        toast.success(
          `Gambar dikompres: ${formatBytes(uploadInfo.originalSize)} → ${formatBytes(uploadInfo.size)} (WebP)`,
        );
      }
      toast.success("Informasi berhasil diperbarui.");
      fetchAboutInfo();
    } catch (error) {
      console.error("Gagal memperbarui informasi:", error);
      if (hasFile) {
        setUploadPhase("failed");
        toast.error("Unggahan gagal. Coba lagi.");
      }

      const data = error.response?.data;
      const apiErrors = Array.isArray(data?.errors) ? data.errors : [];
      const mapped = {};
      apiErrors.forEach(({ field, message }) => {
        if (EDITABLE_FIELDS.includes(field)) mapped[field] = message;
      });
      setFieldErrors(mapped);

      let bannerMessage =
        data?.message || "Gagal memperbarui informasi. Periksa kembali isian Anda.";
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
      <h1 className="text-3xl font-bold mb-8">Tentang kami</h1>

      <ErrorBanner
        title="Gagal menyimpan"
        message={saveError}
        onDismiss={() => setSaveError("")}
        className="mb-6"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-brand-700 p-4 sm:p-8 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Informasi perusahaan
            </h2>
            <InputField
              label="Tentang"
              name="about"
              type="textarea"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tulis deskripsi tentang perusahaan..."
              icon={<Info aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.about}
            />
            <InputField
              label="Alamat"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Jalan, Kota, Kode Pos"
              icon={<MapPin aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.address}
            />
            <InputField
              label="Telepon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0812-3456-7890"
              icon={<Phone aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.phone}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="kontak@perusahaan.com"
              icon={<Mail aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.email}
            />
          </div>

          <div className="bg-brand-700 p-4 sm:p-8 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Media sosial & branding
            </h2>
            <InputField
              label="Tautan Instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
              icon={<Instagram aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.instagram}
            />
            <InputField
              label="Tautan WhatsApp (tautan API)"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="https://wa.me/6281234567890"
              icon={<MessageCircle aria-hidden="true" className="w-5 h-5" />}
              error={fieldErrors.whatsapp}
            />
            <div className="mb-6">
              <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Logo footer
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="logo-upload"
                  name="logoFooter"
                  onChange={handleLogoChange}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="logo-upload"
                  className="relative flex flex-col justify-center items-center w-full h-48 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  <UploadProgress phase={uploadPhase} percent={uploadPercent} />
                  {previewLogo ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewLogo}
                        alt="Pratinjau logo"
                        className="w-full h-full object-contain p-4 bg-brand-700"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Klik untuk mengubah logo
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
                        Klik untuk mengunggah logo
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

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center"
          >
            <Save aria-hidden="true" className="w-5 h-5 mr-2" />
            {isLoading ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPage;
