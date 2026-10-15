import React, { useState, useRef, useEffect, forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
// The lint config does not track JSX usage, so the motion import looks unused.
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  logoVariants,
  menuItemVariants,
  dropdownVariants,
  mobileMenuVariants,
  mobileItemVariants,
} from "./navAnimations";

// Every interactive control in the header shares the same visible keyboard
// focus treatment. On a dark canvas a cream focus ring is impossible to miss.
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const Navbar = forwardRef(({ isTopNavbarVisible, topNavbarHeight }, ref) => {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const menuItems = [
    { name: t("navbar.home"), to: "/" },
    { name: t("navbar.events"), to: "/events" },
    {
      name: t("navbar.services"),
      dropdown: [
        {
          name: t("services_dropdown.workshop_kami", "Workshop Kami"),
          to: "/workshops",
        },
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

  // Escape closes the open dropdown so it can be dismissed without a pointer.
  useEffect(() => {
    if (dropdownOpen === null && !mobileMenu) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(null);
        setMobileMenu(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen, mobileMenu]);

  const handleNavClick = () => {
    setMobileMenu(false);
    setDropdownOpen(null);
  };

  const renderMenuItem = (item, idx, isMobile = false) => {
    if (!item.dropdown) {
      return (
        <motion.div
          key={idx}
          variants={isMobile ? mobileItemVariants : menuItemVariants}
          initial={isMobile ? "hidden" : "initial"}
          animate={isMobile ? "visible" : "initial"}
          whileHover={!isMobile && !prefersReducedMotion ? "hover" : {}}
          custom={idx}
        >
          <NavLink
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              [
                "flex items-center min-h-11 relative py-2 px-3 rounded-buttons-outlined uppercase text-xs font-medium tracking-wide transition-colors",
                isMobile ? "w-full px-4 justify-between" : "",
                FOCUS_RING,
                isActive
                  ? "bg-brand-600 text-cream"
                  : "text-cream/80 hover:bg-brand-700 hover:text-cream",
              ].join(" ")
            }
          >
            {item.name}
          </NavLink>
        </motion.div>
      );
    }

    const panelId = `nav-dropdown-${idx}`;

    return (
      <motion.div
        key={idx}
        className="relative"
        ref={dropdownRef}
        variants={isMobile ? mobileItemVariants : {}}
        initial={isMobile ? "hidden" : "initial"}
        animate={isMobile ? "visible" : "initial"}
        custom={idx}
      >
        <motion.button
          type="button"
          onClick={() => setDropdownOpen(dropdownOpen === idx ? null : idx)}
          aria-expanded={dropdownOpen === idx}
          aria-haspopup="true"
          aria-controls={panelId}
          className={[
            "flex items-center justify-between gap-2 min-h-11 py-2 px-3 rounded-buttons-outlined uppercase text-xs font-medium tracking-wide transition-colors",
            isMobile ? "w-full px-4" : "",
            FOCUS_RING,
            dropdownOpen === idx
              ? "bg-brand-600 text-cream"
              : "text-cream/80 hover:bg-brand-700 hover:text-cream",
          ].join(" ")}
          whileHover={!isMobile && !prefersReducedMotion ? { scale: 1.02 } : {}}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        >
          {item.name}
          <motion.svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            animate={{ rotate: dropdownOpen === idx ? 180 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {dropdownOpen === idx && (
            <motion.div
              id={panelId}
              className={`absolute ${
                isMobile
                  ? "left-0 right-0 mt-1 flex flex-col"
                  : "top-full left-0 w-56"
              } bg-brand-700 text-cream rounded-cards border border-border py-2 z-50`}
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
                    transition: { delay: prefersReducedMotion ? 0 : i * 0.05 },
                  }}
                  whileHover={prefersReducedMotion ? {} : { x: 5 }}
                >
                  <NavLink
                    to={sub.to}
                    onClick={handleNavClick}
                    className={`flex items-center min-h-11 px-4 rounded-buttons-outlined text-cream/80 transition-colors hover:bg-brand-800 hover:text-cream ${FOCUS_RING}`}
                  >
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
      className="bg-brand-800/95 backdrop-blur-sm fixed w-full z-40 border-b border-border text-cream"
      ref={ref}
      animate={{ top: isTopNavbarVisible ? topNavbarHeight : 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 300, damping: 30 }
      }
    >
      <nav
        aria-label="Main navigation"
        className="container mx-auto flex justify-between items-center gap-3 px-4 sm:px-6 lg:px-8 py-2 sm:py-3"
      >
        <NavLink
          to="/"
          aria-label="Askreative Parfum, back to the home page"
          className={`flex items-center shrink-0 ${FOCUS_RING}`}
        >
          <motion.img
            src="/Assets/asklogo2.png"
            alt=""
            aria-hidden="true"
            className="h-10 sm:h-12 lg:h-16 w-auto max-w-[8rem] sm:max-w-none object-contain"
            variants={logoVariants}
            initial="initial"
            whileHover={prefersReducedMotion ? "initial" : "hover"}
          />
        </NavLink>

        <div className="hidden lg:flex items-center gap-6">
          {menuItems.map((item, idx) => renderMenuItem(item, idx))}
        </div>

        <LanguageSwitcher
          currentLang={i18n.resolvedLanguage}
          onChange={changeLanguage}
        />

        <motion.button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label={mobileMenu ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenu}
          aria-controls="mobile-menu"
          className={`lg:hidden h-11 w-11 shrink-0 grid place-items-center rounded-buttons-outlined text-cream/80 hover:bg-brand-700 hover:text-cream transition-colors ${FOCUS_RING}`}
          whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
        >
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            animate={{ rotate: mobileMenu ? 90 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            {mobileMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </motion.svg>
        </motion.button>
      </nav>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            id="mobile-menu"
            className="lg:hidden bg-brand-800 border-t border-border overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="container mx-auto flex flex-col px-4 sm:px-6 py-4 space-y-2">
              {menuItems.map((item, idx) => renderMenuItem(item, idx, true))}

              <motion.div
                className="pt-4 border-t border-border mt-2"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: prefersReducedMotion ? 0 : menuItems.length * 0.05,
                  },
                }}
              >
                <LanguageSwitcher
                  currentLang={i18n.resolvedLanguage}
                  onChange={changeLanguage}
                  isMobile
                />
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
