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

// Komponen InputField dengan tambahan ikon
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
          className="w-full p-2 pl-10 bg-brand-800 border border-border rounded-md focus:outline-none focus:border-brand-400"
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2 pl-10 bg-brand-800 border border-border rounded-md focus:outline-none focus:border-brand-400"
        />
      )}
    </div>
  </div>
);

const AboutPage = () => {
  const [formData, setFormData] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    const submissionData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "logoFooter") {
        submissionData.append(key, formData[key] || "");
      }
    });

    if (logoFile) {
      submissionData.append("logoFooter", logoFile);
    }

    try {
      await apiClient.put("/api/about", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Informasi berhasil diperbarui!");
      fetchAboutInfo();
    } catch (error) {
      console.error("Gagal memperbarui informasi:", error);
      alert("Gagal memperbarui informasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-cream">
      <h1 className="text-3xl font-bold mb-8">About</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-brand-700 p-8 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Company Information
            </h2>
            <InputField
              label="About Section"
              name="about"
              type="textarea"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tulis deskripsi tentang perusahaan..."
              icon={<Info aria-hidden="true" className="w-5 h-5" />}
            />
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Jalan, Kota, Kode Pos"
              icon={<MapPin aria-hidden="true" className="w-5 h-5" />}
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0812-3456-7890"
              icon={<Phone aria-hidden="true" className="w-5 h-5" />}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="kontak@perusahaan.com"
              icon={<Mail aria-hidden="true" className="w-5 h-5" />}
            />
          </div>

          <div className="bg-brand-700 p-8 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
              Social & Branding
            </h2>
            <InputField
              label="Instagram URL"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
              icon={<Instagram aria-hidden="true" className="w-5 h-5" />}
            />
            <InputField
              label="WhatsApp URL (API Link)"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="https://wa.me/6281234567890"
              icon={<MessageCircle aria-hidden="true" className="w-5 h-5" />}
            />
            <div className="mb-6">
              <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Logo Footer
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
                  className="flex flex-col justify-center items-center w-full h-48 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  {previewLogo ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewLogo}
                        alt="Logo Preview"
                        className="w-full h-full object-contain p-4 bg-brand-700"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Click to change logo
                        </span>
                        <span className="text-cream/80 text-sm mt-1">
                          PNG, JPG up to 10MB
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
                        Click to upload logo
                      </span>
                      <span className="text-cream/60 text-sm">
                        or drag and drop
                      </span>
                      <p className="text-cream/70 text-xs mt-2">
                        PNG, JPG up to 10MB
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
            {isLoading ? "Saving..." : "SAVE CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPage;
