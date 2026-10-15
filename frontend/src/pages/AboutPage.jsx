import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import { FiMapPin, FiPhone, FiMail, FiInstagram } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const AboutPage = () => {
  const { t } = useTranslation();
  const [aboutInfo, setAboutInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    apiClient
      .get("/api/about")
      .then((res) => {
        setAboutInfo(res.data.data || {});
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
    alert(
      `Pesan terkirim!\nNama: ${formData.name}\nEmail: ${formData.email}\nTelepon: ${formData.phone}\nPesan: ${formData.message}`,
    );
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-cream/80 text-lg">Loading...</p>
      </div>
    );
  }

  if (!aboutInfo) {
    return (
      <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 text-center">
        <p className="text-cream/80 text-lg">Informasi tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-brand-800 rounded-cards p-6 sm:p-8 border border-border">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-brand-400 mb-6 relative inline-block uppercase tracking-wide break-words">
              {t("about_page.about_us")}
              <span className="absolute -bottom-2 left-0 w-24 h-1 bg-brand-400 rounded-full" />
            </h1>
            <p className="text-cream/90 leading-relaxed text-base sm:text-lg break-words">
              {aboutInfo.about}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/*Map + Kontak */}
          <div className="space-y-6 sm:space-y-8">
            {/* Map Container */}
            <div className="w-full h-72 sm:h-80 md:h-96 rounded-cards overflow-hidden border border-border">
              <iframe
                title={t("about_page.contact_us")}
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
            <div className="bg-brand-800 rounded-cards p-6 border border-border">
              <h2 className="font-medium text-brand-400 text-xl mb-6 relative inline-block uppercase tracking-wide">
                {t("about_page.contact_us")}
                <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-brand-400" />
              </h2>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-11 h-11 bg-brand-600 rounded-inputs grid place-items-center">
                    <FiMapPin className="w-5 h-5 text-cream" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-cream/70 mb-1 font-medium uppercase tracking-wide">
                      {t("about_page.address")}
                    </p>
                    <p className="text-cream text-sm break-words">
                      {aboutInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-11 h-11 bg-brand-600 rounded-inputs grid place-items-center">
                    <FiPhone className="w-5 h-5 text-cream" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-cream/70 mb-1 font-medium uppercase tracking-wide">
                      {t("about_page.phone")}
                    </p>
                    <a
                      href={`tel:${aboutInfo.phone}`}
                      className={`inline-flex items-center min-h-11 text-cream hover:text-brand-400 transition-colors font-medium text-sm break-words ${FOCUS_RING}`}
                    >
                      {aboutInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-11 h-11 bg-brand-600 rounded-inputs grid place-items-center">
                    <FiMail className="w-5 h-5 text-cream" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-cream/70 mb-1 font-medium uppercase tracking-wide">
                      {t("about_page.email")}
                    </p>
                    <a
                      href={`mailto:${aboutInfo.email}`}
                      className={`inline-flex items-center min-h-11 text-cream hover:text-brand-400 transition-colors font-medium text-sm break-all ${FOCUS_RING}`}
                    >
                      {aboutInfo.email}
                    </a>
                  </div>
                </div>

                {aboutInfo.instagram && (
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-11 h-11 bg-brand-600 rounded-inputs grid place-items-center">
                      <FiInstagram className="w-5 h-5 text-cream" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-cream/70 mb-1 font-medium uppercase tracking-wide">
                        {t("about_page.instagram")}
                      </p>
                      <a
                        href={aboutInfo.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center min-h-11 text-cream hover:text-brand-400 transition-colors font-medium text-sm ${FOCUS_RING}`}
                      >
                        {t("about_page.visit_instagram")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*Form Kontak */}
          <div className="bg-brand-800 rounded-cards p-6 sm:p-8 border border-border">
            <h2 className="font-medium text-brand-400 text-xl mb-6 relative inline-block uppercase tracking-wide">
              {t("about_page.send_message")}
              <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-brand-400" />
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="about-name"
                  className="block text-sm font-medium text-cream/80 mb-2 uppercase tracking-wide"
                >
                  {t("about_page.full_name")}
                </label>
                <input
                  id="about-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("about_page.your_name")}
                  className={`w-full bg-brand-900 border border-border rounded-inputs p-3 text-cream placeholder:text-cream/60 focus:border-brand-400 transition-colors ${FOCUS_RING}`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="about-email"
                  className="block text-sm font-medium text-cream/80 mb-2 uppercase tracking-wide"
                >
                  Email
                </label>
                <input
                  id="about-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={`w-full bg-brand-900 border border-border rounded-inputs p-3 text-cream placeholder:text-cream/60 focus:border-brand-400 transition-colors ${FOCUS_RING}`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="about-phone"
                  className="block text-sm font-medium text-cream/80 mb-2 uppercase tracking-wide"
                >
                  {t("about_page.phone_number")}
                </label>
                <input
                  id="about-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+62 xxx xxxx xxxx"
                  className={`w-full bg-brand-900 border border-border rounded-inputs p-3 text-cream placeholder:text-cream/60 focus:border-brand-400 transition-colors ${FOCUS_RING}`}
                />
              </div>

              <div>
                <label
                  htmlFor="about-message"
                  className="block text-sm font-medium text-cream/80 mb-2 uppercase tracking-wide"
                >
                  {t("about_page.message")}
                </label>
                <textarea
                  id="about-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("about_page.write_message")}
                  rows={6}
                  className={`w-full bg-brand-900 border border-border rounded-inputs p-3 text-cream placeholder:text-cream/60 focus:border-brand-400 transition-colors resize-none ${FOCUS_RING}`}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full min-h-11 bg-brand-600 hover:bg-brand-700 text-cream py-3.5 rounded-buttons-pill font-medium uppercase tracking-wide transition-colors ${FOCUS_RING}`}
              >
                {t("about_page.send")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
