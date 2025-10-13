import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiUser } from "react-icons/fi";
import { useLanguage } from "../context/useLanguage";

const ArticleDetailPage = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20 text-white">
        {language === 'id' ? 'Artikel tidak ditemukan.' : 'Article not found.'}
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
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
    <div className="bg-slate-900 text-slate-300 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Artikel */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <FiUser />
              <span>{language === 'id' ? 'Oleh' : 'By'}: {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar />
              <span>
                {t('common.published')} {language === 'id' ? 'pada' : 'on'}: {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </header>

        {/* Gambar Utama */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img 
            src={`http://localhost:3000${article.featuredImageUrl}`} 
            alt={article.title} 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* Deskripsi Utama */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <p className="lead">{article.mainDescription}</p>
        </div>

        {/* Konten Artikel per Section */}
        <article className="space-y-12">
          {article.ArticleContents &&
            article.ArticleContents.map((content, index) => {
              const images = parseImageUrls(content.imageUrls);

              return (
                <section key={index}>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-l-4 border-cyan-400 pl-4">
                    {content.topic}
                  </h2>
                  <div 
                    className="prose prose-invert max-w-none" 
                    dangerouslySetInnerHTML={{ __html: content.description }} 
                  />

                  {images && images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {images.map((url, i) => (
                        <img 
                          key={i} 
                          src={`http://localhost:3000${url}`} 
                          alt={`${content.topic} ${i + 1}`} 
                          className="rounded-lg object-cover w-full" 
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