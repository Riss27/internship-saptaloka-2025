import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiInstagram, FiPhone, FiMail, FiMapPin, FiArrowUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  const [aboutInfo, setAboutInfo] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/about")
      .then((response) => {
        setAboutInfo(response.data.data);
      })
      .catch((error) => console.error("Gagal mengambil info kontak:", error));

    // Scroll to top button visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Main Footer */}
      <footer className="relative bg-[#184737] text-white pt-16 pb-8 mt-20 border-t border-white/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {aboutInfo.logoFooter ? (
                  <img src={`http://localhost:3000${aboutInfo.logoFooter}`} alt="Askreative Logo" className="h-16 w-auto object-contain" />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-[#184737] font-bold text-xl">askr</span>
                  </div>
                )}
                <h3 className="font-bold text-white text-2xl">Askreative Parfum</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                {aboutInfo.about?.substring(0, 180) || "Menghadirkan aroma berkualitas premium untuk melengkapi gaya hidup Anda. Setiap produk dirancang dengan sentuhan kreatif dan inovatif."}...
              </p>

              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-300">Follow Us:</span>
                <a
                  href={aboutInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-white text-[#184737] rounded-lg hover:bg-[#0d2a1f] hover:text-white transition-all duration-300 transform hover:scale-105"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-lg mb-6 relative inline-block">
                Hubungi Kami
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/70" />
              </h4>
              <ul className="space-y-4">
                {[
                  { icon: FiMail, label: "Email", value: aboutInfo.email || "info@askreative.com", href: `mailto:${aboutInfo.email}` },
                  { icon: FiPhone, label: "Telepon", value: aboutInfo.phone || "+62 xxx xxxx xxxx", href: `tel:${aboutInfo.phone}` },
                  { icon: FiMapPin, label: "Lokasi", value: aboutInfo.address || "Indonesia" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-[#0d2a1f] transition-colors">
                      <item.icon className="w-5 h-5 text-[#184737]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-300 mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-white hover:text-gray-300 transition-colors font-medium break-all">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-white font-medium">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-300 text-center md:text-left">
                © {new Date().getFullYear()} <span className="text-white font-semibold">Askreative Parfum</span>. All Rights Reserved.
              </p>
              <p className="text-gray-300 text-center md:text-right">Rebuild by Muhammad Faris Fathur Rohman.</p>
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white text-[#184737] rounded-full shadow-lg shadow-[#00000050] flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Footer;
