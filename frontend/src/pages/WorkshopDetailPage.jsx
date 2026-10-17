import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { useDelayedLoading } from "../hooks/useDelayedLoading";
import RichTextDisplay from "../components/common/RichTextDisplay";
import Section from "../components/atoms/layout/Section";
import SectionHeading from "../components/atoms/layout/SectionHeading";
import { useTranslateDB } from "../hooks/useTranslateDB";
import { useTranslation } from "react-i18next";
// The lint config does not track JSX usage, so the motion import looks unused.
 
import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "../lib/motion";
import API_BASE from "../lib/apiBase";

/**
 * Workshop page.
 *
 * A workshop is a small programme, so the page is short: the photograph, the
 * name, and what it says. The title is set at the page heading size and kept in
 * cream, the same colour the other detail pages use, so a single workshop reads
 * as a single subject rather than as one section of a larger catalogue.
 *
 * The activities underneath are a quieter band than a gallery of cards. They
 * are separated by a hairline and laid out as rows, which lets a long activity
 * name wrap instead of being clipped to two lines.
 */
const WorkshopDetailPage = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const showLoader = useDelayedLoading(isLoading);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  // menggunakan hook translasi
  const translatedTitle = useTranslateDB(workshop?.title);
  const translatedDescription = useTranslateDB(workshop?.description);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/workshops/${id}`);
        setWorkshop(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail workshop:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkshop();
  }, [id]);

  if (isLoading) {
    return showLoader ? (
      <div
        role="status"
        aria-live="polite"
        className="bg-brand-900 min-h-[60vh] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-cream/80 text-lg">Loading...</p>
      </div>
    ) : null;
  }

  if (!workshop) {
    return (
      <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 text-center">
        <p className="text-body text-cream/80">
          {t("detail_pages.not_found_workshop", "Workshop tidak ditemukan.")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            {...reveal(prefersReducedMotion)}
            className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-5 md:gap-12 items-start"
          >
            {/* The photograph is the one surface in this region. */}
            <div className="md:col-span-2 aspect-[4/3] overflow-hidden rounded-cards bg-brand-800">
              <img
                src={`${API_BASE}${workshop.imageUrl}`}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="md:col-span-3">
              {/* The dashed mark belongs to section headings, not to the title
                  of the page, so the title here stays clean like every other
                  masthead on the site. */}
              <h1 className="text-heading text-cream uppercase break-words">
                {translatedTitle}
              </h1>
              <div className="mt-6 max-w-[68ch] text-body text-cream/90">
                <RichTextDisplay content={translatedDescription} />
              </div>
            </div>
          </motion.div>

          <Section divider className="mt-14 sm:mt-20 pt-12 sm:pt-16">
            <SectionHeading
              title={t("detail_pages.related_events", "Kegiatan Terkait")}
            />
            {workshop.Events && workshop.Events.length > 0 ? (
              <ul className="border-t border-border">
                {workshop.Events.map((event, index) => (
                  <motion.li
                    key={event.id}
                    {...reveal(prefersReducedMotion, index + 1)}
                    className="border-b border-border"
                  >
                    <Link
                      to={`/events/${event.id}`}
                      aria-label={`${event.title}, view event details`}
                      className="group grid gap-5 py-7 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-center sm:gap-10"
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden rounded-cards bg-brand-700">
                        <img
                          src={`${API_BASE}${event.imageBannerUrl}`}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-meta uppercase tracking-[0.18em] text-brand-400">
                          <time dateTime={event.startDateTime}>
                            {new Date(event.startDateTime).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </time>
                        </p>
                        <h3 className="mt-3 text-heading-sm leading-tight text-cream uppercase transition-colors group-hover:text-brand-400 break-words">
                          {event.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="border-t border-border pt-8 text-body text-cream/70">
                {t(
                  "detail_pages.no_related_events",
                  "Belum ada kegiatan yang terdaftar untuk workshop ini.",
                )}
              </p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;