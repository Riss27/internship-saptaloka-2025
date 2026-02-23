import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { languageButtonVariants } from "./navAnimations";

const LANGS = ["id", "en"];

const LanguageSwitcher = ({ currentLang, onChange, isMobile = false }) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (lang) => {
    setImageErrors((prev) => ({ ...prev, [lang]: true }));
  };

  const getFlagEmoji = (lang) => {
    return lang === "id" ? "🇮🇩" : "🇬🇧";
  };

  return (
    <div className={`${isMobile ? "flex" : "hidden lg:flex"} items-center gap-3`}>
      {isMobile && <span className="text-gray-600 text-sm">Bahasa:</span>}
      {LANGS.map((lang) => (
        <motion.button
          key={lang}
          onClick={() => onChange(lang)}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
            currentLang === lang ? "border-emerald-700 bg-emerald-50" : "border-gray-300 hover:border-emerald-400 opacity-80 hover:opacity-100"
          }`}
          variants={languageButtonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          {imageErrors[lang] ? (
            <motion.span
              className="text-xl"
              animate={currentLang === lang ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {getFlagEmoji(lang)}
            </motion.span>
          ) : (
            <motion.img
              src={`https://flagcdn.com/w40/${lang === "id" ? "id" : "gb"}.png`}
              alt={lang.toUpperCase()}
              className="w-6 h-6 object-cover rounded-full"
              onError={() => handleImageError(lang)}
              animate={currentLang === lang ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
