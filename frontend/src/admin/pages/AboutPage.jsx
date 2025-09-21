import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSave, FiUpload } from "react-icons/fi";

const AboutPage = () => {
  // State untuk menyimpan data teks dari form
  const [formData, setFormData] = useState({
    about: "",
    address: "",
    phone: "",
    email: "",
    instagram: "",
    whatsapp: "",
    logoFooter: "", // Untuk menyimpan nama file logo yang sudah ada
  });

  // State terpisah khusus untuk file yang akan di-upload
  const [logoFile, setLogoFile] = useState(null);
  // State untuk menampilkan preview gambar yang baru dipilih
  const [logoPreview, setLogoPreview] = useState("");

  // Fungsi untuk mengambil data dari backend
  const fetchAboutContent = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/about");
      if (response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data About:", error);
    }
  };

  // Jalankan fungsi fetch saat halaman pertama kali dimuat
  useEffect(() => {
    fetchAboutContent();
  }, []);

  // Fungsi untuk menangani perubahan data teks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk menangani saat user memilih file gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file); // Simpan object filenya
      setLogoPreview(URL.createObjectURL(file)); // Buat URL sementara untuk preview
    }
  };

  // Fungsi untuk menyimpan SEMUA perubahan (teks dan file)
  const handleSave = async () => {
    // Gunakan FormData karena kita akan mengirim file
    const submissionData = new FormData();

    // Tambahkan semua data teks dari state ke FormData
    submissionData.append("about", formData.about);
    submissionData.append("address", formData.address);
    submissionData.append("phone", formData.phone);
    submissionData.append("email", formData.email);
    submissionData.append("instagram", formData.instagram);
    submissionData.append("whatsapp", formData.whatsapp);

    // Jika ada file baru yang dipilih, tambahkan ke FormData
    if (logoFile) {
      submissionData.append("logoFooter", logoFile);
    }

    try {
      // Kirim FormData ke backend dengan header yang tepat
      await axios.put("http://localhost:3000/api/about", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert('Konten "About" berhasil disimpan!');
      // Refresh data dari server setelah berhasil menyimpan
      fetchAboutContent();
      setLogoPreview(""); // Hapus preview setelah save
    } catch (error) {
      console.error("Gagal menyimpan konten About:", error);
      alert("Gagal menyimpan. Cek console untuk detail.");
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">About</h1>
        <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold text-white">
          <FiSave />
          Save Changes
        </button>
      </header>

      <div className="space-y-8">
        {/* Section: Tentang Kami */}
        <Section title="Tentang Kami">
          <InputField label="About" name="about" type="textarea" value={formData.about} onChange={handleChange} />
        </Section>

        {/* Section: Kontak */}
        <Section title="Kontak">
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
        </Section>

        {/* Section: Alamat */}
        <Section title="Alamat">
          <InputField label="Address" name="address" type="textarea" value={formData.address} onChange={handleChange} />
        </Section>

        {/* Section: Sosial Media */}
        <Section title="Sosial Media">
          <InputField label="Instagram" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Contoh: https://instagram.com/akun" />
          <InputField label="Whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Contoh: 6281234567890 (tanpa +)" />
        </Section>

        {/* Section: Logo Footer */}
        <Section title="Logo Footer">
          <FileUploadField label="Upload Logo" name="logoFooter" onChange={handleFileChange} currentImageUrl={formData.logoFooter ? `http://localhost:3000/uploads/${formData.logoFooter}` : null} previewUrl={logoPreview} />
        </Section>
      </div>
    </div>
  );
};

// Komponen helper untuk Section
const Section = ({ title, children }) => (
  <div className="bg-white/10 p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold text-cyan-400 mb-4 pb-2 border-b border-slate-600">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

// Komponen helper untuk Input
const InputField = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block mb-2 font-medium text-slate-300">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea id={name} name={name} value={value || ""} onChange={onChange} placeholder={placeholder} rows="5" className="w-full p-2 bg-white/20 rounded border border-slate-500 text-white"></textarea>
    ) : (
      <input type={type} id={name} name={name} value={value || ""} onChange={onChange} placeholder={placeholder} className="w-full p-2 bg-white/20 rounded border border-slate-500 text-white" />
    )}
  </div>
);

// Komponen untuk File Upload
const FileUploadField = ({ label, name, onChange, currentImageUrl, previewUrl }) => {
  const displayImage = previewUrl || currentImageUrl;

  return (
    <div>
      <label htmlFor={name} className="block mb-2 font-medium text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 flex items-center justify-center bg-white/10 rounded border-2 border-dashed border-slate-500">
          {displayImage ? <img src={displayImage} alt="Logo Preview" className="max-w-full max-h-full object-contain" /> : <span className="text-slate-400 text-sm">No Image</span>}
        </div>
        <label htmlFor={name} className="cursor-pointer flex items-center gap-2 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md font-semibold text-white">
          <FiUpload />
          Choose File
          <input type="file" id={name} name={name} onChange={onChange} className="hidden" accept="image/png, image/jpeg, image/gif, image/svg+xml" />
        </label>
      </div>
      {previewUrl && <p className="text-xs text-yellow-400 mt-2">Gambar baru dipilih. Klik "Save Changes" untuk menyimpan.</p>}
    </div>
  );
};

export default AboutPage;
