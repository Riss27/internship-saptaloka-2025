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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const gridItemMotion = (index) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: index * 0.15, ease: "easeOut" },
    viewport: { once: true },
  });

  // Service descriptions from translations
  const aromatherapyDesc = t("homepage.service_descriptions.aromatherapy");
  const perfumeWorkshopDesc = t("homepage.service_descriptions.perfume_workshop");
  const customPerfumeDesc = t("homepage.service_descriptions.custom_perfume");
  const productsDesc = t("homepage.service_descriptions.products");
  const labToolsDesc = t("homepage.service_descriptions.lab_tools");
  const ingredientsDesc = t("homepage.service_descriptions.ingredients");

  return (
    <div>
      <Carousel />
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-24">
        {/* Layanan Kami */}
        <section>
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-2" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("homepage.our_services")}
          </motion.h2>
          <motion.p className="text-center text-gray-600 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("homepage.services_subtitle")}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t("services_dropdown.aromatherapy_workshop"), desc: aromatherapyDesc, link: "/workshop/aromaterapi" },
              { title: t("services_dropdown.perfume_workshop"), desc: perfumeWorkshopDesc, link: "/workshop/parfum" },
              { title: t("services_dropdown.custom_perfume"), desc: customPerfumeDesc, link: "/" },
              { title: t("services_dropdown.products"), desc: productsDesc, link: "/products" },
              { title: t("services_dropdown.lab_tools"), desc: labToolsDesc, link: "/lab-tools" },
              { title: t("services_dropdown.ingredients"), desc: ingredientsDesc, link: "/ingredients" },
            ].map((service, i) => (
              <motion.div key={i} {...gridItemMotion(i)}>
                <ServiceCard title={service.title} description={service.desc} linkTo={service.link} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Kegiatan Terbaru */}
        <section className="bg-slate-100 p-8 rounded-2xl overflow-hidden">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("homepage.recent_activities")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestEvents.map((event, i) => (
              <motion.div key={event.id} {...gridItemMotion(i)} whileHover={{ scale: 1.03, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group border border-gray-200 cursor-pointer">
                  <Link to={`/events/${event.id}`}>
                    <img src={`http://localhost:3000${event.imageBannerUrl}`} alt={`Banner kegiatan ${event.title}`} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" loading="lazy" />
                    <div className="p-4">
                      <p className="text-sm text-emerald-700 font-medium">
                        {new Date(event.startDateTime).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="font-bold text-lg text-gray-700 mt-1 truncate">{event.title}</h3>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Produk Unggulan */}
        <section>
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("homepage.featured_products")}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} {...gridItemMotion(i)}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Artikel Terbaru */}
        <section className="bg-slate-100 p-8 rounded-2xl">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("homepage.latest_articles")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article, i) => (
              <motion.div key={article.id} {...gridItemMotion(i)}>
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Galeri Kegiatan */}
        <section>
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("homepage.gallery")}
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.slice(0, 6).map((image, i) => (
              <motion.div key={image.id} {...gridItemMotion(i)}>
                <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-emerald-50 hover:bg-emerald-50/80 transition-colors">
                  <img src={`http://localhost:3000${image.imageUrl}`} alt={image.title || "Foto kegiatan"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" loading="lazy" />
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
