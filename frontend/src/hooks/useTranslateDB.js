import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import requestTranslation from "./translateClient";

/**
 * Returns the database text in the active language.
 *
 * Indonesian is the source language, so it needs no request at all. Any other
 * language goes through the batched client, which caches results and caches
 * failures so a failed lookup is not retried on every render.
 */
export const useTranslateDB = (text, isHTML = false) => {
  const { i18n } = useTranslation();
  const targetLanguage = i18n.language;
  const needsTranslation = targetLanguage !== "id" && Boolean(text);

  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (!text) {
      setTranslatedText(text);
      return;
    }

    if (!needsTranslation) {
      setTranslatedText(text);
      return;
    }

    let isMounted = true;
    requestTranslation(text, targetLanguage, isHTML).then((value) => {
      if (isMounted) setTranslatedText(value || text);
    });

    return () => {
      isMounted = false;
    };
  }, [text, targetLanguage, isHTML, needsTranslation]);

  return translatedText;
};
