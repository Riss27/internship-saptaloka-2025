import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const LANGS = [
  { code: "id", label: "ID", name: "Bahasa Indonesia" },
  { code: "en", label: "EN", name: "English" },
];

/**
 * Language picker.
 *
 * This used to be two circular flag badges pulled from an external image host.
 * On a dark canvas two faint outlined circles read as decoration rather than as
 * a control, the active state was hard to tell apart from the inactive one, and
 * every page load reached out to a third party for two tiny images.
 *
 * It is now a single text trigger that opens a short list, which matches the
 * rest of the header: navigation is type, and the only ornament in the system
 * is a hairline. No external requests, and the active language is named in full
 * inside the menu.
 */
const LanguageSwitcher = ({ currentLang, onChange, isMobile = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const active = LANGS.find((lang) => lang.code === currentLang) || LANGS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`${isMobile ? "w-full" : "relative"}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Language: ${active.name}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={[
          "flex items-center gap-1.5 min-h-11 px-1 transition-colors",
          "uppercase text-xs font-medium tracking-[0.14em]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
          open ? "text-cream" : "text-cream/70 hover:text-cream",
        ].join(" ")}
      >
        {active.label}
        <ChevronDown
          aria-hidden="true"
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className={`z-50 mt-1 w-48 overflow-hidden rounded-cards border border-border bg-brand-800 py-1 ${
            isMobile ? "relative" : "absolute right-0 top-full"
          }`}
        >
          {LANGS.map((lang) => {
            const isActive = lang.code === currentLang;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(lang.code);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400",
                    isActive
                      ? "text-cream"
                      : "text-cream/70 hover:bg-brand-700 hover:text-cream",
                  ].join(" ")}
                >
                  <span className="uppercase text-xs font-medium tracking-[0.14em]">
                    {lang.label}
                  </span>
                  <span className="text-sm">{lang.name}</span>
                  {isActive && (
                    <Check
                      aria-hidden="true"
                      className="w-4 h-4 text-brand-400"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
