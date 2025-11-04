import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const menuItems = [
    { name: t("navbar.home"), to: "/" },
    { name: t("navbar.events"), to: "/events" },
    {
      name: t("navbar.services"),
      dropdown: [
        { name: t("services_dropdown.aromatherapy_workshop"), to: "/workshop/aromaterapi" },
        { name: t("services_dropdown.perfume_workshop"), to: "/workshop/parfum" },
        { name: t("services_dropdown.custom_perfume"), to: "/pos" },
        { name: t("services_dropdown.lab_tools"), to: "/lab-tools" },
        { name: t("services_dropdown.ingredients"), to: "/ingredients" },
        { name: t("services_dropdown.products"), to: "/products" },
      ],
    },
    { name: t("navbar.articles"), to: "/articles" },
    { name: t("navbar.gallery"), to: "/gallery" },
    { name: t("navbar.about"), to: "/about" },
    { name: "POS", to: "/pos" },
  ];

  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

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

  // Animation Variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 },
    },
  };

  const menuItemVariants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15 },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const mobileItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    }),
  };

  const languageButtonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  const renderMenuItem = (item, idx, isMobile = false) => {
    if (!item.dropdown) {
      return (
        <motion.div key={idx} variants={isMobile ? mobileItemVariants : menuItemVariants} initial={isMobile ? "hidden" : "initial"} animate={isMobile ? "visible" : "initial"} whileHover={!isMobile ? "hover" : {}} custom={idx}>
          <NavLink
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? `py-2 px-3 rounded-lg text-emerald-700 font-semibold bg-emerald-50 ${isMobile ? "ml-2" : ""} block relative overflow-hidden`
                : `py-2 px-3 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 font-medium transition-all ${isMobile ? "ml-2" : ""} block relative overflow-hidden`
            }
          >
            {item.name}
          </NavLink>
        </motion.div>
      );
    }

    return (
      <motion.div key={idx} className="relative" ref={dropdownRef} variants={isMobile ? mobileItemVariants : {}} initial={isMobile ? "hidden" : "initial"} animate={isMobile ? "visible" : "initial"} custom={idx}>
        <motion.button
          onClick={() => setDropdownOpen(dropdownOpen === idx ? null : idx)}
          aria-expanded={dropdownOpen === idx}
          className={`flex items-center justify-between w-full py-2 px-3 rounded-lg text-gray-700 font-medium transition-all hover:bg-emerald-50 hover:text-emerald-700 ${isMobile ? "ml-2" : "hover:bg-emerald-700 hover:text-white"}`}
          whileHover={!isMobile ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          {item.name}
          <motion.svg className={`w-4 h-4 ml-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ rotate: dropdownOpen === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {dropdownOpen === idx && (
            <motion.div
              className={`absolute ${isMobile ? "left-0 mt-2 ml-2 flex flex-col" : "top-full left-0 w-56"} bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50`}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {item.dropdown.map((sub, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: i * 0.05 },
                  }}
                  whileHover={{ x: 5, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                >
                  <NavLink to={sub.to} onClick={handleNavClick} className={`block px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-700 transition-all`}>
                    {sub.name}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.header className="bg-white/95 backdrop-blur-sm shadow sticky top-0 z-50 border-b border-gray-200" variants={navbarVariants} initial="hidden" animate="visible">
      <nav className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <motion.img src="/Assets/asklogo2.png" alt="Logo" className="h-16 w-auto object-contain rounded-xl shadow-sm" variants={logoVariants} initial="initial" whileHover="hover" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">{menuItems.map((item, idx) => renderMenuItem(item, idx))}</div>

        {/* Language Switch */}
        <div className="hidden lg:flex items-center gap-3">
          {["id", "en"].map((lang) => (
            <motion.button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                i18n.resolvedLanguage === lang ? "border-emerald-700 bg-emerald-50" : "border-gray-300 hover:border-emerald-400 opacity-80 hover:opacity-100"
              }`}
              variants={languageButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.img
                src={`https://flagcdn.com/w40/${lang === "id" ? "id" : "gb"}.png`}
                alt={lang.toUpperCase()}
                className="w-6 h-6 object-cover rounded-full"
                animate={i18n.resolvedLanguage === lang ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <motion.button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2" whileTap={{ scale: 0.9 }}>
          <motion.svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ rotate: mobileMenu ? 90 : 0 }} transition={{ duration: 0.3 }}>
            {mobileMenu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </motion.svg>
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div className="lg:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden" variants={mobileMenuVariants} initial="hidden" animate="visible" exit="hidden">
            <div className="container mx-auto flex flex-col px-6 py-4 space-y-3">
              {menuItems.map((item, idx) => renderMenuItem(item, idx, true))}

              {/* Mobile Language */}
              <motion.div className="flex items-center gap-3 pt-3 border-t border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: menuItems.length * 0.05 } }}>
                <span className="text-gray-600 text-sm">Bahasa:</span>
                {["id", "en"].map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      i18n.resolvedLanguage === lang ? "border-emerald-700 bg-emerald-50" : "border-gray-300 hover:border-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                    variants={languageButtonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <img src={`https://flagcdn.com/w40/${lang === "id" ? "id" : "gb"}.png`} alt={lang.toUpperCase()} className="w-6 h-6 object-cover rounded-full" />
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;


