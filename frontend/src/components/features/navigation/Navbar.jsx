import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../../context/useLanguage";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { language, changeLanguage, t } = useLanguage();
  const dropdownRef = useRef(null);

  // Menu items sekarang pake function t() untuk translate
  const menuItems = [
    { name: t("nav.home"), to: "/" },
    { name: t("nav.events"), to: "/events" },
    {
      name: t("nav.services"),
      dropdown: [
        { name: t("services.aromatherapy_workshop"), to: "/workshop/aromaterapi" },
        { name: t("services.perfume_workshop"), to: "/workshop/parfum" },
        { name: t("services.custom"), to: "/services/custom" },
        { name: t("services.lab_tools"), to: "/lab-tools" },
        { name: t("services.ingredients"), to: "/ingredients" },
        { name: t("services.products"), to: "/products" },
      ],
    },
    { name: t("nav.articles"), to: "/articles" },
    { name: t("nav.gallery"), to: "/gallery" },
    { name: t("nav.about"), to: "/about" },
    { name: t("nav.pos"), to: "/pos" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setMobileMenu(false);
    setDropdownOpen(null);
  };

  const renderMenuItem = (item, idx, isMobile = false) => {
    if (!item.dropdown) {
      return (
        <NavLink
          key={idx}
          to={item.to}
          onClick={handleNavClick}
          className={({ isActive }) =>
            isActive
              ? `py-2 px-3 rounded-lg text-emerald-700 font-semibold bg-emerald-50 ${isMobile ? "ml-2" : ""}`
              : `py-2 px-3 rounded-lg text-gray-700 hover:text-white hover:bg-emerald-700 font-medium transition-all ${isMobile ? "ml-2" : ""}`
          }
        >
          {item.name}
        </NavLink>
      );
    }

    return (
      <div key={idx} className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(dropdownOpen === idx ? null : idx)}
          aria-expanded={dropdownOpen === idx}
          className={`flex items-center justify-between w-full py-2 px-3 rounded-lg text-gray-700 font-medium transition-all hover:bg-emerald-50 hover:text-emerald-700 ${isMobile ? "ml-2" : "hover:bg-emerald-700 hover:text-white"}`}
        >
          {item.name}
          <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen === idx ? "rotate-180 text-emerald-700" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen === idx && (
          <div className={`absolute ${isMobile ? "left-0 mt-2 ml-2 flex flex-col" : "top-full left-0 w-56"} bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50`}>
            {item.dropdown.map((sub, i) => (
              <NavLink key={i} to={sub.to} onClick={handleNavClick} className={`block px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all`}>
                {sub.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img src="/Assets/asklogo2.png" alt="Logo" className="h-16 w-auto object-contain rounded-xl shadow-sm hover:scale-105 transition-transform" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">{menuItems.map((item, idx) => renderMenuItem(item, idx))}</div>

        {/* Language Switch */}
        <div className="hidden lg:flex items-center gap-2">
          {["id", "en"].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`w-8 h-6 rounded-full overflow-hidden border-2 transition shadow-sm hover:ring-2 hover:ring-emerald-700 ${language === lang ? "border-emerald-700" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              <img src={`https://flagcdn.com/w40/${lang === "id" ? "id" : "gb"}.png`} alt={lang.toUpperCase()} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto flex flex-col px-6 py-4 space-y-3">
            {menuItems.map((item, idx) => renderMenuItem(item, idx, true))}

            {/* Mobile Language */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
              <span className="text-gray-600 text-sm">{language === "id" ? "Bahasa:" : "Language:"}</span>
              {["id", "en"].map((lang) => (
                <button key={lang} onClick={() => changeLanguage(lang)} className={`w-8 h-6 rounded-full overflow-hidden border-2 transition ${language === lang ? "border-emerald-700" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={`https://flagcdn.com/w40/${lang === "id" ? "id" : "gb"}.png`} alt={lang.toUpperCase()} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
