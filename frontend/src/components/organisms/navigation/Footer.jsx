import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiInstagram, FiPhone, FiMail, FiMapPin, FiArrowUp } from "react-icons/fi";

const Footer = () => {
  const [aboutInfo, setAboutInfo] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/about")
      .then((response) => setAboutInfo(response.data.data))
      .catch((error) => console.error("Gagal mengambil info kontak:", error));

    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer className="relative bg-[#184737] text-white pt-12 md:pt-16 pb-6 md:pb-8 mt-16 md:mt-20 border-t border-white/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-12">
            {/* Logo Section */}
            <div className="w-full flex items-center justify-center lg:col-span-2 py-8 md:py-0">
              {aboutInfo.logoFooter ? (
                <img src={`http://localhost:3000${aboutInfo.logoFooter}`} alt="Askreative Logo" className="max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56 w-auto object-contain" />
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#184737] font-bold text-2xl md:text-3xl lg:text-4xl">askr</span>
                </div>
              )}
            </div>

            {/* Hubungi Kami */}
            <div className="md:col-span-1">
              <h4 className="font-bold text-white text-base md:text-lg mb-4 md:mb-6 relative inline-block">
                Hubungi Kami
                <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-white/70" />
              </h4>
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
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-[#0d2a1f] transition-colors duration-300">
                      <item.icon className="w-4 h-4 md:w-5 md:h-5 text-[#184737] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 mb-0.5 md:mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-xs md:text-sm text-white hover:text-gray-300 transition-colors font-medium break-words block">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-xs md:text-sm text-white font-medium break-words">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sosial Media Kami */}
            <div className="md:col-span-1">
              <h4 className="font-bold text-white text-base md:text-lg mb-4 md:mb-6 relative inline-block">
                Sosial Media Kami
                <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-white/70" />
              </h4>
              <div className="flex items-center gap-3 md:gap-4">
                {aboutInfo.instagram && (
                  <a
                    href={aboutInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 bg-white text-[#184737] rounded-lg hover:bg-[#0d2a1f] hover:text-white transition-all duration-300 transform hover:scale-105"
                    aria-label="Instagram"
                  >
                    <FiInstagram className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-white/30 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
              <p className="text-xs md:text-sm text-gray-300 text-center md:text-left">
                © {new Date().getFullYear()} <span className="text-white font-semibold">Askreative Parfum</span>. All Rights Reserved.
              </p>
              <p className="text-xs md:text-sm text-gray-300 text-center md:text-right">Rebuild by Muhammad Faris Fathur Rohman.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-11 h-11 md:w-12 md:h-12 bg-white text-[#184737] rounded-full shadow-lg shadow-[#00000050] flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </>
  );
};

export default Footer;


