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
      <footer className="relative bg-gradient-to-b from-emerald-50 to-white text-gray-700 pt-16 pb-8 mt-20 border-t-2 border-emerald-200">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-emerald-50/20 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {aboutInfo.logoFooter ? (
                  <img src={`http://localhost:3000${aboutInfo.logoFooter}`} alt="Askreative Logo" className="h-16 w-auto object-contain" />
                ) : (
                  <div className="w-16 h-16 bg-emerald-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">askr</span>
                  </div>
                )}
                <h3 className="font-bold text-emerald-800 text-2xl">Askreative Parfum</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                {aboutInfo.about?.substring(0, 180) || "Menghadirkan aroma berkualitas premium untuk melengkapi gaya hidup Anda. Setiap produk dirancang dengan sentuhan kreatif dan inovatif."}...
              </p>

              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600">Follow Us:</span>
                <a
                  href={aboutInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-10 h-10 bg-emerald-100 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-5 h-5 text-emerald-700 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-emerald-800 text-lg mb-6 relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-600 to-transparent" />
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Beranda", path: "/" },
                  { name: "Produk", path: "/produk" },
                  { name: "Artikel", path: "/products" },
                  { name: "Tentang", path: "/tentang" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-600 hover:text-emerald-700 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-600 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-emerald-800 text-lg mb-6 relative inline-block">
                Hubungi Kami
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-600 to-transparent" />
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FiMail className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${aboutInfo.email}`} className="text-sm text-gray-700 hover:text-emerald-700 transition-colors break-all font-medium">
                      {aboutInfo.email || "info@askreative.com"}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FiPhone className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Telepon</p>
                    <a href={`tel:${aboutInfo.phone}`} className="text-sm text-gray-700 hover:text-emerald-700 transition-colors font-medium">
                      {aboutInfo.phone || "+62 xxx xxxx xxxx"}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FiMapPin className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                    <p className="text-sm text-gray-700 font-medium">{aboutInfo.address || "Indonesia"}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-emerald-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-sm text-gray-600 text-center md:text-left">
                © {new Date().getFullYear()} <span className="text-emerald-800 font-semibold">Askreative Parfum</span>. All Rights Reserved.
              </p>

              {/* Additional Links */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-emerald-700 transition-colors">
                  Privacy Policy
                </a>
                <span className="text-gray-300">•</span>
                <a href="#" className="hover:text-emerald-700 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Made with love badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              Made with <span className="text-red-500 animate-pulse">❤️</span> in Indonesia
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full shadow-2xl shadow-emerald-500/25 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5 group-hover:animate-bounce" />
        </button>
      )}
    </>
  );
};

export default Footer;
