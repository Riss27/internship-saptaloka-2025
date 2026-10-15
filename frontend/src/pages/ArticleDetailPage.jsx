import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { FiCalendar, FiUser } from "react-icons/fi";
import RichTextDisplay from "../components/common/RichTextDisplay";
import { useTranslateDB } from "../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";
import API_BASE from "../lib/apiBase";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const translatedTitle = useTranslateDB(article?.title);
  const translatedMainDescription = useTranslateDB(article?.mainDescription);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/articles/${id}`);
        setArticle(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail artikel:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-cream/80 text-lg">Loading...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 text-center">
        <p className="text-cream/80 text-lg">{t("detail_pages.not_found")}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const parseImageUrls = (data) => {
    if (!data) return [];
    let parsed = data;
    while (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        console.error("Gagal parse imageUrls:", e);
        return [];
      }
    }
    return Array.isArray(parsed) ? parsed : [];
  };

  return (
    <div className="bg-brand-900 text-cream pt-6 sm:pt-8 pb-16 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-4xl">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-cream mb-4 leading-tight uppercase tracking-wide break-words">
            {translatedTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-cream/80 text-sm">
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 shrink-0 text-brand-400" aria-hidden="true" />
              <span>
                {t("detail_pages.by")}: {article.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar
                className="w-4 h-4 shrink-0 text-brand-400"
                aria-hidden="true"
              />
              <span>
                {t("detail_pages.published_on")}:{" "}
                {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </header>

        {/* Gambar utama */}
        <div className="mb-8 rounded-cards overflow-hidden bg-brand-800">
          <img
            src={`${API_BASE}${article.featuredImageUrl}`}
            alt=""
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Deskripsi utama */}
        <div className="mb-8 sm:mb-12">
          <RichTextDisplay
            content={translatedMainDescription}
            className="text-cream/90 text-base sm:text-lg"
          />
        </div>

        {/* Konten artikel */}
        <article className="space-y-8 sm:space-y-12">
          {article.ArticleContents &&
            article.ArticleContents.map((content, index) => {
              const images = parseImageUrls(content.imageUrls);
              return (
                <section key={index}>
                  <h2 className="text-xl sm:text-2xl font-medium text-brand-400 mb-4 border-l-4 border-brand-400 pl-4 uppercase tracking-wide break-words">
                    {content.topic}
                  </h2>
                  <RichTextDisplay
                    content={content.description}
                    className="text-cream/90"
                  />
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {images.map((url, i) => (
                        <img
                          key={i}
                          src={`${API_BASE}${url}`}
                          alt={`${content.topic} ${i + 1}`}
                          className="rounded-cards object-cover w-full h-40 sm:h-auto"
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
        </article>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
