import React, { useState, useRef, useEffect, forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
// The lint config does not track JSX usage, so the motion import looks unused.
 
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import Wordmark from "../../atoms/brand/Wordmark";
import { ChevronDown } from "lucide-react";
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
                // Navigation is text, not buttons. A container on every item
                // turned the header into a row of pills; the active state is a
                // hairline rule instead, which is what the system calls for.
                "relative flex items-center min-h-11 py-2 transition-colors",
                "uppercase text-xs font-medium tracking-[0.14em]",
                isMobile ? "w-full px-2 justify-between" : "px-1",
                FOCUS_RING,
                isActive
                  ? "text-cream after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-brand-400"
                  : "text-cream/70 hover:text-cream",
              ].join(" ")
            }
          >
            {item.name}
          </NavLink>
        </motion.div>
      );
    }

    const panelId = `nav-dropdown-${idx}`;
    const open = dropdownOpen === idx;

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
        <button
          type="button"
          onClick={() => setDropdownOpen(open ? null : idx)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={panelId}
          className={[
            "relative flex items-center gap-1.5 min-h-11 py-2 transition-colors",
            "uppercase text-xs font-medium tracking-[0.14em]",
            isMobile ? "w-full px-2" : "px-1",
            FOCUS_RING,
            open
              ? "text-cream after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-brand-400"
              : "text-cream/70 hover:text-cream",
          ].join(" ")}
        >
          {item.name}
          <ChevronDown
            aria-hidden="true"
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
        </button>

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
              {item.dropdown.map((sub) => (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    [
                      "flex items-center min-h-11 px-3 transition-colors",
                      "uppercase text-xs font-medium tracking-[0.14em]",
                      FOCUS_RING,
                      isActive
                        ? "text-cream border-l border-brand-400 pl-2.5"
                        : "text-cream/70 hover:text-cream border-l border-transparent pl-2.5",
                    ].join(" ")
                  }
                >
                  {sub.name}
                </NavLink>
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
          aria-label="Ask Scent Lab, back to the home page"
          className={`flex items-center shrink-0 ${FOCUS_RING}`}
        >
          <motion.span
            className="block"
            variants={logoVariants}
            initial="initial"
            whileHover={prefersReducedMotion ? "initial" : "hover"}
          >
            <Wordmark size="text-xl lg:text-2xl" className="text-cream" />
          </motion.span>
        </NavLink>

        <div className="hidden lg:flex items-center gap-7 xl:gap-9">
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
