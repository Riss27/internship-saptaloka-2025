import React, { useState } from "react";
// The lint config does not track JSX usage, so the motion import looks unused.
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import { languageButtonVariants } from "./navAnimations";

const LANGS = ["id", "en"];

// Each flag gets a full language name rather than a two-letter code, because
// "ID" and "EN" read as acronyms to a screen reader.
const LANG_LABELS = {
  id: "Bahasa Indonesia",
  en: "English",
};

const LanguageSwitcher = ({ currentLang, onChange, isMobile = false }) => {
  const [imageErrors, setImageErrors] = useState({});
  const prefersReducedMotion = useReducedMotion();

  const handleImageError = (lang) => {
    setImageErrors((prev) => ({ ...prev, [lang]: true }));
  };

  const getFlagEmoji = (lang) => {
    return lang === "id" ? "🇮🇩" : "🇬🇧";
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className={`${isMobile ? "flex" : "hidden lg:flex"} items-center gap-2`}
    >
      {isMobile && <span className="text-cream/80 text-sm mr-1">Bahasa:</span>}
      {LANGS.map((lang) => {
        const isActive = currentLang === lang;
        return (
          <motion.button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            aria-label={LANG_LABELS[lang]}
            aria-pressed={isActive}
            className={[
              "h-11 w-11 flex items-center justify-center rounded-full border-2 transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
              isActive
                ? "border-brand-400 bg-brand-600/40"
                : "border-border opacity-80 hover:opacity-100",
            ].join(" ")}
            variants={languageButtonVariants}
            initial="initial"
            whileHover={prefersReducedMotion ? "initial" : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
          >
            {imageErrors[lang] ? (
              <motion.span
                className="text-xl"
                aria-hidden="true"
                animate={
                  isActive && !prefersReducedMotion
                    ? { rotate: [0, 10, -10, 0] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {getFlagEmoji(lang)}
              </motion.span>
            ) : (
              <motion.img
                src={`https://flagcdn.com/w40/${lang === "id" ? "id" : "gb"}.png`}
                alt=""
                aria-hidden="true"
                className="w-6 h-6 object-cover rounded-full"
                onError={() => handleImageError(lang)}
                animate={
                  isActive && !prefersReducedMotion
                    ? { rotate: [0, 10, -10, 0] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
