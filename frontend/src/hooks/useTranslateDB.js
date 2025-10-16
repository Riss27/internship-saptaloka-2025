// frontend/src/hooks/useTranslateDB.js
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

// Objek ini akan berfungsi sebagai cache sederhana di memori
const translationCache = new Map();

export const useTranslateDB = (text) => {
  const { i18n } = useTranslation();
  const targetLanguage = i18n.language;

  // Teks asli (Indonesia) akan selalu menjadi fallback
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    // Jangan terjemahkan jika targetnya adalah bahasa Indonesia
    // atau jika teksnya kosong
    if (targetLanguage === "id" || !text) {
      setTranslatedText(text);
      return;
    }

    const cacheKey = `${text}|${targetLanguage}`;

    // 1. Cek di cache terlebih dahulu
    if (translationCache.has(cacheKey)) {
      setTranslatedText(translationCache.get(cacheKey));
      return;
    }

    // 2. Jika tidak ada di cache, panggil API
    let isMounted = true;
    const translateText = async () => {
      try {
        const response = await axios.post("https://libretranslate.de/translate", {
          q: text,
          source: "id",
          target: targetLanguage,
          format: "text",
        });

        const newTranslatedText = response.data.translatedText;

        if (isMounted) {
          // 3. Simpan hasil ke cache dan update state
          translationCache.set(cacheKey, newTranslatedText);
          setTranslatedText(newTranslatedText);
        }
      } catch (error) {
        console.error("Translation API error:", error);
        // Jika gagal, tampilkan teks asli
        if (isMounted) {
          setTranslatedText(text);
        }
      }
    };

    translateText();

    return () => {
      isMounted = false;
    };
  }, [text, targetLanguage]);

  return translatedText;
};
