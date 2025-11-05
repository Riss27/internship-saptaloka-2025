import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Carousel from "../components/organisms/home/Carousel";
import ProductCard from "../components/molecules/cards/ProductCard";
import ArticleCard from "../components/molecules/cards/ArticleCard";
import ServiceCard from "../components/molecules/cards/ServiceCard";
import { useTranslation } from "react-i18next";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true },
});

const HomePage = () => {
  const [data, setData] = useState({
    products: [],
    events: [],
    articles: [],
    gallery: [],
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const [p, e, a, g] = await Promise.all([
          axios.get("http://localhost:3000/api/products"),
          axios.get("http://localhost:3000/api/events"),
          axios.get("http://localhost:3000/api/articles"),
          axios.get("http://localhost:3000/api/gallery"),
        ]);
        setData({
          products: p.data.data.slice(0, 4),
          events: e.data.data.slice(0, 3),
          articles: a.data.data.slice(0, 3),
          gallery: g.data.data.slice(0, 8),
        });
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-6" />
          <motion.p animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-emerald-700 font-semibold text-lg">
            Loading...
          </motion.p>
        </div>
      </motion.div>
    );

  const services = [
    { title: t("services_dropdown.aromatherapy_workshop"), link: "/workshop/aromaterapi" },
    { title: t("services_dropdown.perfume_workshop"), link: "/workshop/parfum" },
    { title: t("services_dropdown.custom_perfume"), link: "/" },
    { title: t("services_dropdown.products"), link: "/products" },
    { title: t("services_dropdown.lab_tools"), link: "/lab-tools" },
    { title: t("services_dropdown.ingredients"), link: "/ingredients" },
  ];

  const SectionTitle = ({ title, subtitle }) => (
    <motion.div {...fadeUp(0.1)} className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3">{title}</h2>
      {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
    </motion.div>
  );

  const ViewMoreButton = ({ to, children }) => (
    <motion.div {...fadeUp(0.2)} className="text-center mt-10">
      <Link to={to}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl">
          {children}
        </motion.button>
      </Link>
    </motion.div>
  );

  return (
    <motion.div className="bg-gradient-to-b from-white via-emerald-50/20 to-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Carousel />

      <div className="container mx-auto px-6 lg:px-10 py-20 space-y-20">
        {/* Services */}
        <motion.section {...fadeUp(0.1)} className="bg-gradient-to-br from-emerald-50 to-white p-10 rounded-3xl shadow-lg">
          <SectionTitle title={t("homepage.our_services")} subtitle={t("homepage.services_subtitle")} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ scale: 1.03, y: -6 }}>
                <ServiceCard title={s.title} linkTo={s.link} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Events */}
        <motion.section {...fadeUp(0.1)} className="bg-gradient-to-br from-white to-emerald-100/60 p-10 rounded-3xl shadow-lg">
          <SectionTitle title={t("homepage.recent_activities")} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.events.map((e, i) => (
              <motion.div key={e.id} {...fadeUp(i * 0.1)} whileHover={{ y: -6 }}>
                <Link to={`/events/${e.id}`} className="block rounded-2xl shadow-md overflow-hidden">
                  <img src={`http://localhost:3000${e.imageBannerUrl}`} alt={e.title} className="w-full h-56 object-cover" />
                  <div className="p-5">
                    <p className="text-emerald-600 font-semibold mb-2">
                      {new Date(e.startDateTime).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-bold text-xl text-gray-800 line-clamp-2">{e.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <ViewMoreButton to="/events">{t("homepage.view_more_events")}</ViewMoreButton>
        </motion.section>

        {/* Products */}
        <motion.section {...fadeUp(0.1)} className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-10 rounded-3xl shadow-lg">
          <SectionTitle title={t("homepage.featured_products")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.products.map((p, i) => (
              <motion.div key={p.id} {...fadeUp(i * 0.1)} whileHover={{ y: -6, scale: 1.03 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Articles */}
        <motion.section {...fadeUp(0.1)} className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-3xl shadow-lg">
          <SectionTitle title={t("homepage.latest_articles")} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.articles.map((a, i) => (
              <motion.div key={a.id} {...fadeUp(i * 0.1)} whileHover={{ y: -6 }}>
                <ArticleCard article={a} />
              </motion.div>
            ))}
          </div>
          <ViewMoreButton to="/articles">{t("homepage.view_more_articles")}</ViewMoreButton>
        </motion.section>

        {/* Gallery — Cinematic Horizontal Scroll */}
        <motion.section {...fadeUp(0.1)} className="bg-gradient-to-r from-emerald-50 via-white to-emerald-100 p-10 rounded-3xl shadow-xl">
          <SectionTitle title={t("homepage.gallery")} />
          <motion.div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide" whileTap={{ cursor: "grabbing" }}>
            {data.gallery.map((g, i) => (
              <motion.div key={g.id} {...fadeUp(i * 0.05)} whileHover={{ scale: 1.05 }} className="relative group flex-shrink-0 w-[350px] h-[220px] rounded-3xl overflow-hidden shadow-lg">
                <img src={`http://localhost:3000${g.imageUrl}`} alt={g.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
          <ViewMoreButton to="/gallery">{t("homepage.view_more_gallery")}</ViewMoreButton>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default HomePage;
