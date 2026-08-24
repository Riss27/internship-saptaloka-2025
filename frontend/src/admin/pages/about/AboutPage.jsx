import React, { useState, useEffect } from "react";
import apiClient from "../../../hooks/apiClient";
import { FiInfo, FiMapPin, FiPhone, FiMail, FiInstagram, FiMessageCircle, FiImage, FiSave, FiUploadCloud } from "react-icons/fi";

// Komponen InputField dengan tambahan ikon
const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-slate-300">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="8"
          placeholder={placeholder}
          className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      setFormData(response.data.data);
      if (response.data.data.logoFooter) {
        setPreviewLogo(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${response.data.data.logoFooter}`);
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
    <div className="max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">About</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Company Information</h2>
            <InputField label="About Section" name="about" type="textarea" value={formData.about} onChange={handleChange} placeholder="Tulis deskripsi tentang perusahaan..." icon={<FiInfo />} />
            <InputField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Jalan, Kota, Kode Pos" icon={<FiMapPin />} />
            <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="0812-3456-7890" icon={<FiPhone />} />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="kontak@perusahaan.com" icon={<FiMail />} />
          </div>

          <div className="bg-white/10 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Social & Branding</h2>
            <InputField label="Instagram URL" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/username" icon={<FiInstagram />} />
            <InputField label="WhatsApp URL (API Link)" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="https://wa.me/6281234567890" icon={<FiMessageCircle />} />
            <div className="mb-6">
              <label className="mb-2 font-medium text-slate-300 flex items-center gap-2">
                <FiImage className="text-cyan-400" />
                Logo Footer
              </label>
              <div className="relative group">
                <input type="file" id="logo-upload" name="logoFooter" onChange={handleLogoChange} className="hidden" accept="image/*" />
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col justify-center items-center w-full h-48 border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden"
                >
                  {previewLogo ? (
                    <div className="relative w-full h-full">
                      <img src={previewLogo} alt="Logo Preview" className="w-full h-full object-contain p-4 bg-white/10" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <FiUploadCloud className="h-12 w-12 text-white mb-2" />
                        <span className="text-white font-semibold">Click to change logo</span>
                        <span className="text-slate-300 text-sm mt-1">PNG, JPG up to 10MB</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <FiUploadCloud className="h-10 w-10 text-cyan-400" />
                      </div>
                      <span className="block text-slate-200 font-semibold mb-1">Click to upload logo</span>
                      <span className="text-slate-400 text-sm">or drag and drop</span>
                      <p className="text-slate-500 text-xs mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center">
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : "SAVE CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPage;
