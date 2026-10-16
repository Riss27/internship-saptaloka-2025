import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { languageButtonVariants } from "./navAnimations";

const LANGS = [
  { code: "id", flag: "🇮🇩", name: "Bahasa Indonesia" },
  { code: "en", flag: "🇬🇧", name: "English" },
];

/**
 * Language picker.
 *
 * Two round buttons, each one tap to switch directly. No menu, because a
 * control that hides its own options is the wrong shape for a choice with only
 * two options.
 *
 * The active one is unmistakable: a filled surface, a solid ring and full
 * opacity, against a hollow outlined button for everything else. The previous
 * version differed only in opacity and a faint border, which on a dark canvas
 * meant the active language was easy to miss.
 */
const LanguageSwitcher = ({ currentLang, onChange, isMobile = false }) => {
  const [imageErrors, setImageErrors] = useState({});
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`${isMobile ? "flex" : "hidden lg:flex"} items-center gap-1.5`}
    >
      {LANGS.map((lang) => {
        const isActive = currentLang === lang.code;
        const flagUrl = `https://flagcdn.com/w40/${lang.code === "id" ? "id" : "gb"}.png`;

        return (
          <motion.button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            aria-label={lang.name}
            aria-pressed={isActive}
            title={lang.name}
            className={[
              "grid h-11 w-11 place-items-center rounded-full overflow-hidden",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
              isActive
                ? "bg-brand-600 ring-1 ring-brand-400"
                : "bg-transparent ring-1 ring-border hover:ring-brand-500",
            ].join(" ")}
            variants={languageButtonVariants}
            initial="initial"
            whileHover={prefersReducedMotion ? "initial" : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
          >
            {imageErrors[lang.code] ? (
              <span className="text-base leading-none" aria-hidden="true">
                {lang.flag}
              </span>
            ) : (
              <img
                src={flagUrl}
                alt=""
                aria-hidden="true"
                width="20"
                height="20"
                className="h-5 w-5 object-cover"
                onError={() =>
                  setImageErrors((prev) => ({ ...prev, [lang.code]: true }))
                }
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
