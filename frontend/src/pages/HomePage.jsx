import React, { useState, useEffect, useRef } from "react";
import apiClient from "../hooks/apiClient";
import { useDelayedLoading } from "../hooks/useDelayedLoading";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
// The lint config does not track JSX usage, so the motion import looks unused.

import { motion, useReducedMotion } from "framer-motion";
import { reveal, cardHover } from "../lib/motion";
import Carousel from "../components/organisms/home/Carousel";
import ProductCard from "../components/molecules/cards/ProductCard";
import ArticleCard from "../components/molecules/cards/ArticleCard";
import ServiceCard from "../components/molecules/cards/ServiceCard";
import Section from "../components/atoms/layout/Section";
import SectionHeading from "../components/atoms/layout/SectionHeading";
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
  const showLoader = useDelayedLoading(loading);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const galleryTrackRef = useRef(null);

  // Move the photo row by one full tile, which is the distance a reader expects
  // from an arrow on a carousel. On large screens the gallery is a grid and has
  // no arrows, so this is only reachable from the small-screen row.
  const scrollGallery = (direction) => {
    const track = galleryTrackRef.current;
    const tile = track?.firstElementChild;
    if (!track || !tile) return;
    track.scrollBy({
      left: direction * (tile.offsetWidth + 24),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

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

  /*
   * A quiet way past a band: a rule above a tracked label, with no filled pill
   * competing with the pictures underneath. The border warms on hover so the
   * row still reads as clickable without adding another shape to the page.
   */
  const ViewMore = ({ to, children }) => (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center border-t border-border pt-4 text-meta uppercase tracking-[0.18em] text-cream/70 transition-colors hover:border-brand-400 hover:text-brand-400 ${FOCUS_RING}`}
    >
      {children}
    </Link>
  );

  return (
    <div className="bg-brand-900 text-cream">
      <Carousel />

      {/* The hero renders immediately; only the sections below wait for data. */}
      {loading ? (
        showLoader ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
          <p className="text-cream/80 text-lg">Loading...</p>
        </div>
        ) : null
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-28">
          <div className="space-y-16 sm:space-y-24 lg:space-y-32">
            {/* 01 — Services, laid out as an index rather than a row of tiles. */}
            <Section>
              <SectionHeading
                index="01"
                title={t("homepage.our_services")}
                subtitle={t("homepage.services_subtitle")}
              />
              <div className="border-t border-border">
                {services.map((s, i) => (
                  <motion.div key={s.link} {...reveal(prefersReducedMotion, i)}>
                    <ServiceCard
                      title={s.title}
                      description={s.description}
                      linkTo={s.link}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* 02 — Events, one per row so the titles have room to be read. */}
            <Section divider>
              <SectionHeading
                index="02"
                title={t("homepage.recent_activities")}
                action={
                  <ViewMore to="/events">
                    {t("homepage.view_more_events")}
                  </ViewMore>
                }
              />
              {data.events.length > 0 ? (
                <ul className="border-t border-border">
                  {data.events.map((e, i) => (
                    <motion.li
                      key={e.id}
                      {...reveal(prefersReducedMotion, i)}
                      className="border-b border-border"
                    >
                      <Link
                        to={`/events/${e.id}`}
                        aria-label={`${e.title}, view event details`}
                        className="group grid gap-5 py-7 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-center sm:gap-10"
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden rounded-cards bg-brand-700 sm:aspect-[4/3]">
                          <img
                            src={`${API_BASE}${e.imageBannerUrl}`}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                          />
                        </div>
                        <div>
                          <p className="text-meta uppercase tracking-[0.18em] text-brand-400">
                            <time dateTime={e.startDateTime}>
                              {new Date(e.startDateTime).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </time>
                          </p>
                          <h3 className="mt-3 text-heading-sm leading-tight text-cream uppercase transition-colors group-hover:text-brand-400">
                            {e.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="border-t border-border pt-8 text-body text-cream/70">
                  {t("events_page.no_events", "Belum ada kegiatan saat ini.")}
                </p>
              )}
            </Section>

            {/* 03 — Products, a catalogue strip where the photograph leads. */}
            <Section divider>
              <SectionHeading
                index="03"
                title={t("homepage.featured_products")}
              />
              {data.products.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                  {data.products.map((p, i) => (
                    <motion.div
                      key={p.id}
                      {...cardHover(prefersReducedMotion)}
                      {...reveal(prefersReducedMotion, i)}
                      className="h-full"
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="border-t border-border pt-8 text-body text-cream/70">
                  {t("products_page.no_products_found")}
                </p>
              )}
            </Section>

            {/* 04 — Articles, words first and the picture pushed to the foot. */}
            <Section divider>
              <SectionHeading
                index="04"
                title={t("homepage.latest_articles")}
                action={
                  <ViewMore to="/articles">
                    {t("homepage.view_more_articles")}
                  </ViewMore>
                }
              />
              {data.articles.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
                  {data.articles.map((a, i) => (
                    <motion.div
                      key={a.id}
                      {...cardHover(prefersReducedMotion)}
                      {...reveal(prefersReducedMotion, i)}
                      className="h-full"
                    >
                      <ArticleCard article={a} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="border-t border-border pt-8 text-body text-cream/70">
                  {t(
                    "articles_page.no_articles_found",
                    "Belum ada artikel saat ini.",
                  )}
                </p>
              )}
            </Section>

            {/* 05 — Gallery. The photographs are the content, so the caption sits
                under the frame as a small left-aligned note. It is a grid on large
                screens and a scrollable row below that, with arrows that say the
                row can be moved. */}
            <Section divider>
              <SectionHeading
                index="05"
                title={t("homepage.gallery")}
                action={
                  <ViewMore to="/gallery">
                    {t("homepage.view_more_gallery")}
                  </ViewMore>
                }
              />
              <div className="relative">
                {/* Small screens scroll one row of photographs at a time. The
                    arrows and the edge fade say so; without them most visitors
                    never find out that the rest of the gallery is there. */}
                <div
                  ref={galleryTrackRef}
                  className="flex snap-x snap-proximity items-start gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 lg:hidden"
                >
                  {data.gallery.map((g, i) => (
                    <motion.figure
                      key={g.id}
                      {...reveal(prefersReducedMotion, Math.min(i, 3))}
                      className="w-[240px] shrink-0 snap-start sm:w-[300px]"
                    >
                      <div className="h-48 overflow-hidden rounded-cards bg-brand-700 sm:h-56">
                        <img
                          src={`${API_BASE}${g.imageUrl}`}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <figcaption className="mt-4 text-left text-meta text-cream/60">
                        {g.title}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>

                {/* From the large breakpoint up, every photograph is visible at
                    once. The strip was 2800px wide on a 1440px screen, so half
                    the gallery sat past the edge with nothing to indicate it. */}
                <div className="hidden lg:grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                  {data.gallery.map((g, i) => (
                    <motion.figure
                      key={g.id}
                      {...reveal(prefersReducedMotion, Math.min(i, 3))}
                    >
                      <div className="h-48 overflow-hidden rounded-cards bg-brand-700 sm:h-56">
                        <img
                          src={`${API_BASE}${g.imageUrl}`}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <figcaption className="mt-4 text-left text-meta text-cream/60">
                        {g.title}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>

                {data.gallery.length > 0 && (
                  <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
                    <button
                      type="button"
                      onClick={() => scrollGallery(-1)}
                      aria-label="Previous photographs"
                      className={`grid h-11 w-11 place-items-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:border-cream/60 hover:text-cream ${FOCUS_RING}`}
                    >
                      <ChevronLeft aria-hidden="true" size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollGallery(1)}
                      aria-label="Next photographs"
                      className={`grid h-11 w-11 place-items-center rounded-full border border-cream/30 text-cream/70 transition-colors hover:border-cream/60 hover:text-cream ${FOCUS_RING}`}
                    >
                      <ChevronRight aria-hidden="true" size={20} />
                    </button>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
