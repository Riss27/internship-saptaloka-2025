import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiInfo, FiMapPin, FiPhone, FiMail, FiInstagram, FiMessageCircle, FiImage, FiSave } from "react-icons/fi";

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
      const response = await axios.get("http://localhost:3000/api/about");
      setFormData(response.data.data);
      if (response.data.data.logoFooter) {
        setPreviewLogo(`http://localhost:3000${response.data.data.logoFooter}`);
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
      await axios.put("http://localhost:3000/api/about", submissionData, {
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
              <label className="block mb-2 font-medium text-slate-300">Logo Footer</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FiImage />
                </span>
                <input
                  type="file"
                  name="logoFooter"
                  onChange={handleLogoChange}
                  className="w-full pl-10 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
              </div>
              {previewLogo && <img src={previewLogo} alt="Logo Preview" className="mt-4 rounded-md max-h-24 bg-white p-2" />}
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
