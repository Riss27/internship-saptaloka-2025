import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import PageHeader from "../components/atoms/layout/PageHeader";
import SectionHeading from "../components/atoms/layout/SectionHeading";
import { useTranslation } from "react-i18next";
// The lint config does not track JSX usage, so the motion import looks unused.

import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "../lib/motion";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

/**
 * About page.
 *
 * This page has the least to explain and the most to say, so it uses the same
 * masthead every other page uses and lets the writing carry it. The underline
 * that used to sit under the title is gone: a rule repeated under every heading
 * stops meaning anything. What is left is the short dashed mark the shared
 * section heading already draws, and that earns its place because there are
 * only two headings on the page.
 *
 * The contact details are printed like a colophon at the back of a book: a
 * label column, a value column, a hairline between entries. No coloured discs
 * and no icon tiles, because an address is not a button and should not be
 * dressed as one. The form is the single surface on the page, and its fields sit
 * one step lighter than the panel so they read as inputs rather than as holes
 * punched through it.
 */
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
  const prefersReducedMotion = useReducedMotion();

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
        <p className="text-body text-cream/80">Informasi tidak tersedia.</p>
      </div>
    );
  }

  // Every entry follows the same two-column shape, so the label column stays
  // straight down the page whether or not the value is a link. The mark sits
  // inline with the label rather than in a tile of its own.
  const contactEntries = [
    {
      icon: (
        <MapPin
          className="h-4 w-4 shrink-0 text-brand-400"
          aria-hidden="true"
        />
      ),
      label: t("about_page.address"),
      value: aboutInfo.address,
    },
    {
      icon: (
        <Phone className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
      ),
      label: t("about_page.phone"),
      value: aboutInfo.phone,
      href: `tel:${aboutInfo.phone}`,
    },
    {
      icon: (
        <Mail className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
      ),
      label: t("about_page.email"),
      value: aboutInfo.email,
      href: `mailto:${aboutInfo.email}`,
      wraps: "break-all",
    },
    ...(aboutInfo.instagram
      ? [
          {
            icon: (
              <Instagram
                className="h-4 w-4 shrink-0 text-brand-400"
                aria-hidden="true"
              />
            ),
            label: t("about_page.instagram"),
            value: t("about_page.visit_instagram"),
            href: aboutInfo.instagram,
            external: true,
          },
        ]
      : []),
  ];

  const fieldClass = `w-full bg-brand-700 border border-border rounded-inputs p-3 text-cream placeholder:text-cream/60 focus:border-brand-400 transition-colors ${FOCUS_RING}`;
  const labelClass =
    "block text-meta uppercase tracking-[0.18em] text-cream/60 mb-2";

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-28">
        <motion.div
          {...reveal(prefersReducedMotion)}
          className="grid grid-cols-1 gap-12 sm:gap-14 lg:grid-cols-2 lg:gap-20"
        >
          {/* Kolom kiri: intro + kolofon kontak. */}
          <div>
            <PageHeader
              title={t("about_page.about_us")}
              subtitle={aboutInfo.about}
            />

            <div>
              <SectionHeading title={t("about_page.contact_us")} />

              <dl className="border-t border-border">
                {contactEntries.map(
                  ({ icon, label, value, href, external, wraps }) => (
                    <div
                      key={label}
                      className="grid grid-cols-1 gap-1.5 border-t border-border py-5 first:border-t-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-baseline sm:gap-6"
                    >
                      <dt className="flex items-center gap-2.5 text-meta uppercase tracking-[0.18em] text-cream/60">
                        {icon}
                        {label}
                      </dt>
                      <dd className="min-w-0 text-body text-cream">
                        {href ? (
                          <a
                            href={href}
                            {...(external && {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
                            className={`inline-flex items-center min-h-11 hover:text-brand-400 transition-colors ${wraps || "break-words"} ${FOCUS_RING}`}
                          >
                            {value}
                          </a>
                        ) : (
                          <span className={wraps || "break-words"}>
                            {value}
                          </span>
                        )}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            </div>
          </div>

          {/* Kolom kanan: peta lokasi sejajar intro, formulir di bawahnya. */}
          <div className="space-y-12 sm:space-y-14">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-cards border border-border bg-brand-800">
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

            {/* The form is the one surface on this page. */}
            <div className="rounded-cards bg-brand-800 border border-border p-6 sm:p-8">
              <SectionHeading title={t("about_page.send_message")} />

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="about-name" className={labelClass}>
                    {t("about_page.full_name")}
                  </label>
                  <input
                    id="about-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("about_page.your_name")}
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="about-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="about-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="about-phone" className={labelClass}>
                    {t("about_page.phone_number")}
                  </label>
                  <input
                    id="about-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62 xxx xxxx xxxx"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="about-message" className={labelClass}>
                    {t("about_page.message")}
                  </label>
                  <textarea
                    id="about-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("about_page.write_message")}
                    rows={6}
                    className={`${fieldClass} resize-none`}
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
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
