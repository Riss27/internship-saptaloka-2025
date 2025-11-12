import React, { useState, useRef, useEffect, forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { logoVariants, menuItemVariants, dropdownVariants, mobileMenuVariants, mobileItemVariants } from "./navAnimations";

const Navbar = forwardRef(({ isTopNavbarVisible, topNavbarHeight }, ref) => {
  const { t, i18n } = useTranslation();

  const menuItems = [
    { name: t("navbar.home"), to: "/" },
    { name: t("navbar.events"), to: "/events" },
    {
      name: t("navbar.services"),
      dropdown: [
        { name: t("services_dropdown.workshop_kami", "Workshop Kami"), to: "/workshops" },
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
    <motion.header
      className="bg-white/95 backdrop-blur-sm shadow fixed w-full z-40 border-b border-gray-200"
      ref={ref}
      animate={{ top: isTopNavbarVisible ? topNavbarHeight : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav className="container mx-auto flex justify-between items-center px-6 py-3">
        <NavLink to="/" className="flex items-center">
          <motion.img src="/Assets/asklogo2.png" alt="Logo" className="h-16 w-auto object-contain rounded-xl shadow-sm" variants={logoVariants} initial="initial" whileHover="hover" />
        </NavLink>

        <div className="hidden lg:flex items-center gap-6">{menuItems.map((item, idx) => renderMenuItem(item, idx))}</div>

        <LanguageSwitcher currentLang={i18n.resolvedLanguage} onChange={changeLanguage} />

        <motion.button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2" whileTap={{ scale: 0.9 }}>
          <motion.svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ rotate: mobileMenu ? 90 : 0 }} transition={{ duration: 0.3 }}>
            {mobileMenu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </motion.svg>
        </motion.button>
      </nav>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div className="lg:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden" variants={mobileMenuVariants} initial="hidden" animate="visible" exit="hidden">
            <div className="container mx-auto flex flex-col px-6 py-4 space-y-3">
              {menuItems.map((item, idx) => renderMenuItem(item, idx, true))}

              <motion.div className="pt-3 border-t border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: menuItems.length * 0.05 } }}>
                <LanguageSwitcher currentLang={i18n.resolvedLanguage} onChange={changeLanguage} isMobile />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
