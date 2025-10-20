import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiUser } from "react-icons/fi";
import { useTranslateDB } from "../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";

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
        const response = await axios.get(`http://localhost:3000/api/articles/${id}`);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return <div className="text-center py-20 text-slate-700">{t("detail_pages.not_found")}</div>;
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
    <div className="bg-gradient-to-b from-emerald-50 to-white text-slate-700 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 leading-tight">{translatedTitle}</h1>
          <div className="flex items-center gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <FiUser />
              <span>
                {t("detail_pages.by")}: {article.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar />
              <span>
                {t("detail_pages.published_on")}: {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </header>

        {/* Gambar utama */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
          <img src={`http://localhost:3000${article.featuredImageUrl}`} alt={article.title} className="w-full h-auto object-cover" />
        </div>

        {/* Deskripsi utama */}
        <div className="prose prose-lg max-w-none mb-12 text-slate-600">
          <p className="lead">{translatedMainDescription}</p>
        </div>

        {/* Konten artikel */}
        <article className="space-y-12">
          {article.ArticleContents &&
            article.ArticleContents.map((content, index) => {
              const images = parseImageUrls(content.imageUrls);
              return (
                <section key={index}>
                  <h2 className="text-2xl font-bold text-emerald-700 mb-4 border-l-4 border-emerald-500 pl-4">{content.topic}</h2>
                  <div className="prose max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: content.description }} />
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {images.map((url, i) => (
                        <img key={i} src={`http://localhost:3000${url}`} alt={`${content.topic} ${i + 1}`} className="rounded-lg object-cover w-full shadow-md" />
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
