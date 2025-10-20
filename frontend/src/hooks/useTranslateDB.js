// frontend/src/hooks/useTranslateDB.js
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const translationCache = new Map();

export const useTranslateDB = (text, isHTML = false) => {
  const { i18n } = useTranslation();
  const targetLanguage = i18n.language;

  // Selalu inisialisasi state dengan teks asli yang diterima.
  // Ini adalah fallback utama untuk mencegah teks hilang.
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    // Jika teks properti berubah (misalnya dari undefined ke string saat data dimuat),
    // perbarui state internal kita.
    if (text !== translatedText && !translationCache.has(`${text}|${targetLanguage}`)) {
      setTranslatedText(text);
    }

    // Jika bahasa target adalah Indonesia atau tidak ada teks, langsung kembalikan teks asli.
    if (targetLanguage === "id" || !text) {
      if (translatedText !== text) {
        setTranslatedText(text);
      }
      return;
    }

    const cacheKey = `${text}|${targetLanguage}`;
    if (translationCache.has(cacheKey)) {
      setTranslatedText(translationCache.get(cacheKey));
      return;
    }

    let isMounted = true;
    const translateText = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/translate", {
          text: text,
          target: targetLanguage,
          source: "id",
          format: isHTML ? "html" : "text",
        });

        const newTranslatedText = response.data.translatedText;
        if (isMounted && newTranslatedText) {
          translationCache.set(cacheKey, newTranslatedText);
          setTranslatedText(newTranslatedText);
        } else if (isMounted) {
          // Jika API mengembalikan hasil kosong, tetap gunakan teks asli.
          setTranslatedText(text);
        }
      } catch (error) {
        console.error("Translation API error:", error);
        if (isMounted) {
          // Jika terjadi error, pastikan untuk kembali ke teks asli.
          setTranslatedText(text);
        }
      }
    };

    translateText();

    return () => {
      isMounted = false;
    };
  }, [text, targetLanguage, isHTML, translatedText]);

  // Selalu kembalikan `translatedText` yang dijamin memiliki nilai.
  return translatedText;
};
