import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import { Link } from "react-router-dom";
// The lint config does not track JSX usage, so the motion import looks unused.
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import { reveal, cardHover } from "../lib/motion";
import Carousel from "../components/organisms/home/Carousel";
import ProductCard from "../components/molecules/cards/ProductCard";
import ArticleCard from "../components/molecules/cards/ArticleCard";
import ServiceCard from "../components/molecules/cards/ServiceCard";
import { useTranslation } from "react-i18next";
import API_BASE from "../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const HomePage = () => {
  const [data, setData] = useState({
    products: [],
    events: [],
    articles: [],
    gallery: [],
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    (async () => {
      try {
        const [p, e, a, g] = await Promise.all([
          apiClient.get("/api/products"),
          apiClient.get("/api/events"),
          apiClient.get("/api/articles"),
          apiClient.get("/api/gallery"),
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

  // Reveal timing and hover behaviour come from the shared motion vocabulary in
  // lib/motion.js, so every section on this page moves on the same curve.
  const fadeUp = (index) => reveal(prefersReducedMotion, index);
  const hoverLift = () => cardHover(prefersReducedMotion);

  if (loading) {
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

  const services = [
    {
      title: t("services_dropdown.workshop_kami", "Workshop Kami"),
      description: t(
        "homepage.workshop_description",
        "Ikuti berbagai workshop parfum & aromaterapi bersama kami.",
      ),
      link: "/workshops",
    },
    {
      title: t("services_dropdown.products", "Produk Kami"),
      description: t(
        "homepage.products_description",
        "Jelajahi berbagai produk parfum dan aromaterapi berkualitas.",
      ),
      link: "/products",
    },
    {
      title: t("services_dropdown.ingredients", "Bahan Baku"),
      description: t(
        "homepage.ingredients_description",
        "Temukan bahan-bahan alami dan premium untuk kreasi parfum Anda.",
      ),
      link: "/ingredients",
    },
    {
      title: t("services_dropdown.lab_tools", "Peralatan Lab"),
      description: t(
        "homepage.lab_tools_description",
        "Dapatkan berbagai peralatan laboratorium untuk mendukung workshop Anda.",
      ),
      link: "/lab-tools",
    },
    {
      title: t("services_dropdown.custom_perfume", "Custom Perfume"),
      description: t(
        "homepage.custom_perfume_description",
        "Buat parfum khusus sesuai selera Anda dengan bantuan ahli kami.",
      ),
      link: "/pos",
    },
  ];

  const SectionTitle = ({ title, subtitle }) => (
    <motion.div {...fadeUp(0.1)} className="text-center mb-8 sm:mb-10 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-cream mb-3 uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="text-cream/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );

  const ViewMoreButton = ({ to, children }) => (
    <motion.div {...fadeUp(0.2)} className="text-center mt-8 sm:mt-12">
      <Link
        to={to}
        className={`inline-flex items-center justify-center min-h-11 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide rounded-buttons-pill transition-colors ${FOCUS_RING}`}
      >
        {children}
      </Link>
    </motion.div>
  );

  return (
    <motion.div
      className="bg-brand-900 text-cream"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
    >
      <Carousel />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-20 space-y-12 sm:space-y-16 md:space-y-20">
        {/* Services Section */}
        <motion.section
          {...fadeUp(0.1)}
          className="bg-brand-800 p-5 sm:p-6 md:p-8 lg:p-10 rounded-cards border border-border"
        >
          <SectionTitle
            title={t("homepage.our_services")}
            subtitle={t("homepage.services_subtitle")}
          />
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* First Row - 3 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {services.slice(0, 3).map((s, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.1)}
                  {...hoverLift()}
                  className="h-full"
                >
                  <ServiceCard
                    title={s.title}
                    description={s.description}
                    linkTo={s.link}
                  />
                </motion.div>
              ))}
            </div>

            {/* Second Row - 2 Cards Centered */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
              {services.slice(3, 5).map((s, i) => (
                <motion.div
                  key={i + 3}
                  {...fadeUp((i + 3) * 0.1)}
                  {...hoverLift()}
                  className="h-full w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-20px)] lg:max-w-none"
                >
                  <ServiceCard
                    title={s.title}
                    description={s.description}
                    linkTo={s.link}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Events Section */}
        <motion.section
          {...fadeUp(0.1)}
          className="bg-brand-800 p-5 sm:p-6 md:p-8 lg:p-10 rounded-cards border border-border"
        >
          <SectionTitle title={t("homepage.recent_activities")} />
          {data.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {data.events.map((e, i) => (
                <motion.div
                  key={e.id}
                  {...fadeUp(i * 0.1)}
                  {...hoverLift()}
                  className="h-full"
                >
                  <Link
                    to={`/events/${e.id}`}
                    aria-label={`${e.title}, view event details`}
                    className="group flex flex-col h-full rounded-cards overflow-hidden bg-brand-900 border border-border transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                  >
                    <div className="aspect-video shrink-0 overflow-hidden bg-brand-700">
                      <img
                        src={`${API_BASE}${e.imageBannerUrl}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-brand-400 font-medium mb-2 text-sm uppercase tracking-wide">
                        {new Date(e.startDateTime).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="font-medium text-lg sm:text-xl text-cream line-clamp-2 uppercase leading-snug transition-colors group-hover:text-brand-400">
                        {e.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-cream/80">
              {t("events_page.no_events", "Belum ada kegiatan saat ini.")}
            </p>
          )}
          <ViewMoreButton to="/events">
            {t("homepage.view_more_events")}
          </ViewMoreButton>
        </motion.section>

        {/* Products Section */}
        <motion.section
          {...fadeUp(0.1)}
          className="bg-brand-800 p-5 sm:p-6 md:p-8 lg:p-10 rounded-cards border border-border"
        >
          <SectionTitle title={t("homepage.featured_products")} />
          {data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {data.products.map((p, i) => (
                <motion.div
                  key={p.id}
                  {...fadeUp(i * 0.1)}
                  {...hoverLift()}
                  className="h-full"
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-cream/80">
              {t("products_page.no_products_found")}
            </p>
          )}
        </motion.section>

        {/* Articles Section */}
        <motion.section
          {...fadeUp(0.1)}
          className="bg-brand-800 p-5 sm:p-6 md:p-8 lg:p-10 rounded-cards border border-border"
        >
          <SectionTitle title={t("homepage.latest_articles")} />
          {data.articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {data.articles.map((a, i) => (
                <motion.div
                  key={a.id}
                  {...fadeUp(i * 0.1)}
                  {...hoverLift()}
                  className="h-full"
                >
                  <ArticleCard article={a} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-cream/80">
              {t(
                "articles_page.no_articles_found",
                "Belum ada artikel saat ini.",
              )}
            </p>
          )}
          <ViewMoreButton to="/articles">
            {t("homepage.view_more_articles")}
          </ViewMoreButton>
        </motion.section>

        {/* Gallery Section */}
        <motion.section {...fadeUp(0.1)}>
          <SectionTitle title={t("homepage.gallery")} />
          <motion.div
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            whileTap={prefersReducedMotion ? {} : { cursor: "grabbing" }}
          >
            {data.gallery.map((g, i) => (
              <motion.figure
                key={g.id}
                {...fadeUp(i * 0.05)}
                {...hoverLift()}
                className="relative group flex-shrink-0 w-[280px] sm:w-[350px] h-[220px] rounded-cards overflow-hidden snap-center bg-brand-700"
              >
                <img
                  src={`${API_BASE}${g.imageUrl}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {/* A touch screen never fires hover, so the caption stays visible
                    on phones and only fades in from the small breakpoint up. */}
                <div className="absolute inset-0 bg-brand-900/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none" />
                <figcaption className="absolute bottom-4 left-4 right-4 text-cream opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none">
                  <p className="font-medium text-base sm:text-lg uppercase leading-snug break-words">
                    {g.title}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
          <ViewMoreButton to="/gallery">
            {t("homepage.view_more_gallery")}
          </ViewMoreButton>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default HomePage;
