import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [language, setLanguage] = useState("id");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setMobileMenu(false);
    setDropdown(false);
  };

  const menuItems = [
    { name: "Beranda", to: "/" },
    { name: "Kegiatan", to: "/events" },
    {
      name: "Layanan",
      dropdown: [
        { name: "Workshop Aromaterapi", to: "/workshop/aromaterapi" },
        { name: "Workshop Parfum", to: "/workshop/parfum" },
        { name: "Buat Parfum & Aromaterapi", to: "/services/custom" },
        { name: "Alat Laboratorium", to: "/lab-tools" },
        { name: "Bahan Parfum & Aromaterapi", to: "/ingredients" },
        { name: "Produk Parfum & Aromaterapi", to: "/products" },
      ],
    },
    { name: "Artikel", to: "/articles" },
    { name: "Galeri", to: "/gallery" },
    { name: "Tentang", to: "/about" },
    { name: "POS", to: "/pos" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <div className="w-16 h-16 bg-emerald-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">askr</span>
          </div>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item, idx) =>
            item.dropdown ? (
              <div className="relative" key={idx} ref={dropdownRef}>
                <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-1 text-gray-700 hover:text-emerald-700 font-medium">
                  {item.name}
                  <svg className={`w-4 h-4 transition-transform ${dropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transition-all duration-200 ease-out opacity-100">
                    {item.dropdown.map((sub, i) => (
                      <NavLink key={i} to={sub.to} onClick={handleNavClick} className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={idx} to={item.to} className={({ isActive }) => (isActive ? "text-emerald-700 font-semibold" : "text-gray-700 hover:text-emerald-700 font-medium")}>
                {item.name}
              </NavLink>
            )
          )}
        </div>

        {/* Language */}
        <div className="hidden lg:flex items-center gap-2">
          {["id", "en"].map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)} className={`w-8 h-6 rounded border-2 overflow-hidden transition ${language === lang ? "border-emerald-700" : "border-transparent opacity-60 hover:opacity-100"}`}>
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
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-out">
          <div className="container mx-auto flex flex-col px-6 py-4 space-y-3">
            {menuItems.map((item, idx) =>
              item.dropdown ? (
                <div key={idx}>
                  <button onClick={() => setDropdown(!dropdown)} className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-emerald-700 font-medium">
                    {item.name}
                    <svg className={`w-4 h-4 transition-transform ${dropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdown && (
                    <div className="flex flex-col ml-4 mt-2 space-y-2">
                      {item.dropdown.map((sub, i) => (
                        <NavLink key={i} to={sub.to} onClick={handleNavClick} className="text-gray-600 hover:text-emerald-700 py-1">
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={idx} to={item.to} onClick={handleNavClick} className={({ isActive }) => (isActive ? "text-emerald-700 font-semibold py-2" : "text-gray-700 hover:text-emerald-700 py-2")}>
                  {item.name}
                </NavLink>
              )
            )}

            {/* Mobile Language */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
              <span className="text-gray-600 text-sm">Bahasa:</span>
              {["id", "en"].map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} className={`w-8 h-6 rounded overflow-hidden border-2 transition ${language === lang ? "border-emerald-700" : "border-transparent opacity-60"}`}>
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