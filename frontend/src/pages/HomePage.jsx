import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Carousel from "../components/features/homepage/Carousel";
import ProductCard from "../components/features/products/ProductCard";
import ArticleCard from "../components/features/articles/ArticleCard";
import ServiceCard from "../components/features/homepage/ServiceCard";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [productsRes, eventsRes, articlesRes, galleryRes] = await Promise.all([
          axios.get("http://localhost:3000/api/products"),
          axios.get("http://localhost:3000/api/events"),
          axios.get("http://localhost:3000/api/articles"),
          axios.get("http://localhost:3000/api/gallery"),
        ]);

        setFeaturedProducts(productsRes.data.data.slice(0, 4));
        setLatestEvents(eventsRes.data.data.slice(0, 3));
        setLatestArticles(articlesRes.data.data.slice(0, 3));
        setGalleryImages(galleryRes.data.data);
      } catch (error) {
        console.error("Gagal mengambil data homepage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const cardMotion = (index) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: index * 0.1, ease: "easeOut" },
    viewport: { once: true, margin: "-50px" },
  });

  const aromatherapyDesc = t("homepage.service_descriptions.aromatherapy");
  const perfumeWorkshopDesc = t("homepage.service_descriptions.perfume_workshop");
  const customPerfumeDesc = t("homepage.service_descriptions.custom_perfume");
  const productsDesc = t("homepage.service_descriptions.products");
  const labToolsDesc = t("homepage.service_descriptions.lab_tools");
  const ingredientsDesc = t("homepage.service_descriptions.ingredients");

  return (
    <div className="bg-emerald-50/20">
      <Carousel />
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-32">
        {/* Layanan Kami */}
        <section>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              {t("homepage.our_services")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("homepage.services_subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: t("services_dropdown.aromatherapy_workshop"), desc: aromatherapyDesc, link: "/workshop/aromaterapi" },
              { title: t("services_dropdown.perfume_workshop"), desc: perfumeWorkshopDesc, link: "/workshop/parfum" },
              { title: t("services_dropdown.custom_perfume"), desc: customPerfumeDesc, link: "/" },
              { title: t("services_dropdown.products"), desc: productsDesc, link: "/products" },
              { title: t("services_dropdown.lab_tools"), desc: labToolsDesc, link: "/lab-tools" },
              { title: t("services_dropdown.ingredients"), desc: ingredientsDesc, link: "/ingredients" },
            ].map((service, i) => (
              <motion.div key={i} {...cardMotion(i)}>
                <ServiceCard title={service.title} description={service.desc} linkTo={service.link} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Kegiatan Terbaru */}
        <section>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              {t("homepage.recent_activities")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestEvents.map((event, i) => (
              <motion.div key={event.id} {...cardMotion(i)}>
                <Link to={`/events/${event.id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100">
                    <div className="relative overflow-hidden">
                      <img 
                        src={`http://localhost:3000${event.imageBannerUrl}`} 
                        alt={`Banner kegiatan ${event.title}`} 
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p className="text-sm text-emerald-700 font-semibold">
                          {new Date(event.startDateTime).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            viewport={{ once: true }}
          >
            <Link to="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto group"
              >
                <span>{t("homepage.view_more_events") || "Lihat Semua Kegiatan"}</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Produk */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-transparent to-emerald-50/50 rounded-3xl -z-10"></div>
          
          <motion.div 
            className="text-center mb-16 pt-12"
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              {t("homepage.featured_products")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} {...cardMotion(i)}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Artikel Terbaru */}
        <section>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              {t("homepage.latest_articles")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article, i) => (
              <motion.div key={article.id} {...cardMotion(i)}>
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            viewport={{ once: true }}
          >
            <Link to="/articles">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto group"
              >
                <span>{t("homepage.view_more_articles") || "Lihat Lebih Banyak Artikel"}</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Galeri Kegiatan */}
        <section>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              {t("homepage.gallery")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.slice(0, 6).map((image, i) => (
              <motion.div 
                key={image.id} 
                {...cardMotion(i)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300 group cursor-pointer">
                  <img 
                    src={`http://localhost:3000${image.imageUrl}`} 
                    alt={image.title || "Foto kegiatan"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;