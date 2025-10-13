import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMapPin, FiPhone, FiMail, FiInstagram } from "react-icons/fi";
import { useLanguage } from "../context/useLanguage";

const AboutPage = () => {
  const { t } = useLanguage(); // Ambil function translate
  const [aboutInfo, setAboutInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/about")
      .then((res) => {
        setAboutInfo(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data About:", err);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pesan terkirim!\nNama: ${formData.name}\nEmail: ${formData.email}\nTelepon: ${formData.phone}\nPesan: ${formData.message}`);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">{t("about.loading")}</p>
        </div>
      </div>
    );
  }

  if (!aboutInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <p className="text-gray-600">{t("about.no_info")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-emerald-50/20 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4 relative inline-block">
            {t("about.title")}
            <span className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-emerald-600 to-transparent rounded-full" />
          </h1>
          <p className="mt-8 text-gray-700 leading-relaxed text-lg">{aboutInfo.about}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map + Kontak */}
          <div className="space-y-8">
            {/* Map Container */}
            <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/10 border-2 border-emerald-200">
              <iframe
                src={
                  aboutInfo.mapEmbedUrl ||
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d386.0204289215479!2d107.5996643639368!3d-6.861282681385571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e77d124a74eb%3A0xf274d96636b2d4a3!2sAskreatif!5e0!3m2!1sen!2sid!4v1718340514789!5m2!1sen!2sid"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Info Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-500/5 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 text-xl mb-6 relative inline-block">
                {t("about.contact_us")}
                <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-emerald-600 to-transparent" />
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FiMapPin className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 font-medium">{t("about.address")}</p>
                    <p className="text-gray-700">{aboutInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FiPhone className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 font-medium">{t("about.phone")}</p>
                    <a href={`tel:${aboutInfo.phone}`} className="text-gray-700 hover:text-emerald-700 transition-colors font-medium">
                      {aboutInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FiMail className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 font-medium">{t("about.email")}</p>
                    <a href={`mailto:${aboutInfo.email}`} className="text-gray-700 hover:text-emerald-700 transition-colors font-medium break-all">
                      {aboutInfo.email}
                    </a>
                  </div>
                </div>

                {aboutInfo.instagram && (
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                      <FiInstagram className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-medium">{t("about.instagram")}</p>
                      <a href={aboutInfo.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                        {t("about.visit_instagram")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Kontak */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-500/5 border border-emerald-100">
            <h3 className="font-bold text-emerald-800 text-xl mb-6 relative inline-block">
              {t("about.send_message")}
              <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-emerald-600 to-transparent" />
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("about.form_name")}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("about.form_name_placeholder")}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("about.form_email")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("about.form_email_placeholder")}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("about.form_phone")}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("about.form_phone_placeholder")}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("about.form_message")}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("about.form_message_placeholder")}
                  rows={6}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {t("about.form_submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
