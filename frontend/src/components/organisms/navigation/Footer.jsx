import React, { useState, useEffect } from "react";
import apiClient from "../../../hooks/apiClient";
import {
  FiInstagram,
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUp,
} from "react-icons/fi";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const Footer = () => {
  const [aboutInfo, setAboutInfo] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    apiClient
      .get("/api/about")
      .then((response) => setAboutInfo(response.data.data || {}))
      .catch((error) => console.error("Gagal mengambil info kontak:", error));

    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scrolling is a large continuous movement, so it is swapped for an
  // instant jump when the reader prefers reduced motion.
  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <footer className="relative bg-brand-700 text-cream pt-10 md:pt-14 pb-6 md:pb-8 mt-12 md:mt-20 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-12">
            {/* Logo Section */}
            <div className="w-full flex items-center justify-center lg:col-span-2 py-6 md:py-0">
              {aboutInfo.logoFooter ? (
                <img
                  src={`${API_BASE}${aboutInfo.logoFooter}`}
                  alt="Askreative Logo"
                  className="max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56 w-auto max-w-[70%] sm:max-w-none object-contain"
                />
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-brand-800 rounded-cards flex items-center justify-center">
                  <span className="text-brand-400 font-medium text-2xl md:text-3xl lg:text-4xl uppercase tracking-wide">
                    askr
                  </span>
                </div>
              )}
            </div>

            {/* Hubungi Kami */}
            <div className="md:col-span-1">
              <h2 className="font-medium text-cream text-base md:text-lg uppercase tracking-wide mb-6 relative inline-block">
                Hubungi Kami
                <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-brand-400" />
              </h2>
              <ul className="space-y-3 md:space-y-4">
                {[
                  {
                    icon: FiMail,
                    label: "Email",
                    value: aboutInfo.email || "info@askreative.com",
                    href: `mailto:${aboutInfo.email || "info@askreative.com"}`,
                  },
                  {
                    icon: FiPhone,
                    label: "Telepon",
                    value: aboutInfo.phone || "+62 xxx xxxx xxxx",
                    href: `tel:${aboutInfo.phone || ""}`,
                  },
                  {
                    icon: FiMapPin,
                    label: "Lokasi",
                    value: aboutInfo.address || "Indonesia",
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 group">
                    <div className="shrink-0 w-11 h-11 bg-brand-600 rounded-inputs grid place-items-center">
                      <item.icon
                        className="w-5 h-5 text-cream"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      <p className="text-xs uppercase tracking-wide text-cream/70">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`inline-flex items-center min-h-11 break-words text-sm font-medium text-cream transition-colors hover:text-brand-400 ${FOCUS_RING}`}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-cream font-medium break-words">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sosial Media Kami */}
            <div className="md:col-span-1">
              <h2 className="font-medium text-cream text-base md:text-lg uppercase tracking-wide mb-6 relative inline-block">
                Sosial Media Kami
                <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-brand-400" />
              </h2>
              <div className="flex items-center gap-3">
                {aboutInfo.instagram && (
                  <a
                    href={aboutInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-11 h-11 bg-brand-600 text-cream rounded-inputs hover:bg-brand-400 hover:text-brand-900 transition-colors duration-300 motion-reduce:transition-none ${FOCUS_RING}`}
                    aria-label="Askreative Parfum on Instagram"
                  >
                    <FiInstagram className="w-5 h-5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-border pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
              <p className="text-xs md:text-sm text-cream/70 text-center md:text-left">
                © {new Date().getFullYear()}{" "}
                <span className="text-cream font-medium">
                  Askreative Parfum
                </span>
                . All Rights Reserved.
              </p>
              <p className="text-xs md:text-sm text-cream/70 text-center md:text-right">
                Rebuild by Muhammad Faris Fathur Rohman.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-11 h-11 bg-brand-600 text-cream rounded-full grid place-items-center transition-colors duration-300 hover:bg-brand-400 hover:text-brand-900 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none ${FOCUS_RING}`}
          aria-label="Scroll back to the top of the page"
        >
          <FiArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </>
  );
};

export default Footer;
