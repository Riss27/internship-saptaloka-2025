import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { Calendar, User } from "lucide-react";
import RichTextDisplay from "../components/common/RichTextDisplay";
import { useTranslateDB } from "../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";
// The lint config does not track JSX usage, so the motion import looks unused.
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "../lib/motion";
import API_BASE from "../lib/apiBase";

/**
 * Article page.
 *
 * This is the one page here that is read rather than scanned, so it drops the
 * uppercase title voice the catalogue and event pages use and follows the same
 * lead as ArticleCard: the words come first and the picture is a plate.
 *
 * The photograph runs wider than the text so the page reads like a spread
 * rather than a phone screen. Everything written for a reader is held to
 * roughly 68 characters a line, because a wider measure is comfortable on a
 * monitor and hard to track on a laptop.
 */
const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

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
        <p className="text-body text-cream/80">{t("detail_pages.not_found")}</p>
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
    <div className="bg-brand-900 text-cream pt-6 sm:pt-8 pb-16 sm:pb-20 lg:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <article className="mx-auto max-w-4xl">
          <motion.figure
            {...reveal(prefersReducedMotion)}
            className="aspect-[16/9] overflow-hidden rounded-cards bg-brand-800"
          >
            <img
              src={`${API_BASE}${article.featuredImageUrl}`}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.figure>

          <motion.header
            {...reveal(prefersReducedMotion, 1)}
            className="mt-10 sm:mt-14 max-w-[68ch]"
          >
            <h1 className="text-display text-cream leading-[1.05] break-words">
              {translatedTitle}
            </h1>

            <div className="mt-7 border-t border-border pt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-meta text-cream/70">
              <p className="inline-flex items-center gap-2">
                <User className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span>
                  {t("detail_pages.by")}: {article.author}
                </span>
              </p>
              <p className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span>
                  {t("detail_pages.published_on")}:{" "}
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                </span>
              </p>
            </div>
          </motion.header>

          {/* The standfirst sets up the article, so it is the one paragraph on the
              site that speaks in the larger descriptive voice. */}
          <motion.div
            {...reveal(prefersReducedMotion, 2)}
            className="mt-10 sm:mt-14 max-w-[68ch]"
          >
            <div className="text-voice text-cream/90">
              <RichTextDisplay content={translatedMainDescription} />
            </div>

            {article.ArticleContents && article.ArticleContents.length > 0 && (
              <div className="mt-12 sm:mt-16 border-t border-border pt-10 sm:pt-14 space-y-12 sm:space-y-16">
                {article.ArticleContents.map((content, index) => {
                  const images = parseImageUrls(content.imageUrls);
                  return (
                    <section key={index}>
                      <h2 className="border-l border-brand-400 pl-4 text-heading-sm text-cream break-words">
                        {content.topic}
                      </h2>
                      <div className="mt-5 text-body text-cream/90">
                        <RichTextDisplay content={content.description} />
                      </div>
                      {images.length > 0 && (
                        <div className="mt-8 grid grid-cols-2 gap-4">
                          {images.map((url, i) => (
                            <img
                              key={i}
                              src={`${API_BASE}${url}`}
                              alt={`${content.topic} ${i + 1}`}
                              className="w-full h-40 sm:h-auto object-cover rounded-inputs"
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </motion.div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetailPage;