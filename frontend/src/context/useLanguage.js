import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

// Custom hook untuk menggunakan Language Context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
