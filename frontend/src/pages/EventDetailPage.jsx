import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import RegistrationForm from "../components/molecules/forms/RegistrationForm";
import Popup from "../components/atoms/feedback/Popup";
import RichTextDisplay from "../components/common/RichTextDisplay";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Users, CircleDollarSign } from "lucide-react";
// The lint config does not track JSX usage, so the motion import looks unused.
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "../lib/motion";
import API_BASE from "../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

// The public header is two stacked bars, and PublicLayout measures both. It
// publishes the collapsed main Navbar height plus a gutter as
// --public-sticky-offset. A sticky element only starts pinning once the reader
// has scrolled, which is also the moment the branding TopNavbar has slid away,
// so the sidebar pins against the Navbar that is still on screen. The 7rem
// fallback matches the measured desktop height if the variable is not ready.
// Pinning only applies from the large breakpoint up, because below it the
// sidebar is the first block in normal flow and has no room to travel.
const STICKY_OFFSET = "lg:sticky lg:top-[var(--public-sticky-offset,7rem)]";

// Status is signalled with surface tone instead of a separate red, so the
// badge stays inside the brand palette on every surface it appears on.
const getStatusBadge = (status) => {
  switch (status) {
    case "Open":
      return "bg-brand-600 text-cream";
    case "Coming Soon":
      return "bg-brand-600/70 text-cream";
    case "Closed":
    case "Finished":
      return "bg-brand-800 text-cream/80 border border-border";
    default:
      return "bg-brand-800 text-cream/80 border border-border";
  }
};

/**
 * Event page.
 *
 * The banner runs to the edge of the container and the title sits on top of it,
 * so the first thing the reader meets is the event itself rather than a card
 * wrapped around a picture. Below that there are two regions: the registration
 * panel, which is the only surface on the page, and the write-up, which is left
 * unboxed and held to a reading measure.
 *
 * On a phone the panel stays above the write-up because that is what people
 * came for; the order pair below only changes where each block is painted, the
 * document order is untouched.
 */
const EventDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/events/${id}`);
        setEvent(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail event:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseJsonSafe = (jsonString) => {
    try {
      let parsed = jsonString;
      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

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

  if (!event) {
    return (
      <div className="bg-brand-900 min-h-[60vh] flex items-center justify-center px-4 text-center">
        <p className="text-body text-cream/80">{t("detail_pages.event_not_found")}</p>
      </div>
    );
  }

  const participantRoles = parseJsonSafe(event.participantRoles);

  return (
    <>
      <div className="bg-brand-900 text-cream pt-6 sm:pt-8 pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <motion.header
              {...reveal(prefersReducedMotion)}
              className="relative overflow-hidden bg-brand-800"
            >
              <img
                src={`${API_BASE}${event.imageBannerUrl}`}
                alt=""
                className="h-64 sm:h-80 lg:h-[28rem] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/75 to-brand-900/10"></div>
              <div className="absolute inset-x-0 bottom-0 pb-7 sm:pb-9 lg:pb-11">
                <h1 className="text-heading text-cream uppercase max-w-4xl break-words">
                  {event.title}
                </h1>
              </div>
            </motion.header>

            {/* On a phone the detail panel and the register button come first. The
                reading order in the document is unchanged, only the visual order. */}
            <motion.div
              {...reveal(prefersReducedMotion, 1)}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 mt-12 sm:mt-16 lg:mt-20"
            >
              {/* Write-up. Nothing here is a panel; the hairline between the
                  introduction and the numbered sections is the only divider. */}
              <div className="order-2 lg:col-span-2 max-w-[68ch]">
                <div className="text-body text-cream/90">
                  <RichTextDisplay content={event.description} />
                </div>

                {event.EventContents && event.EventContents.length > 0 && (
                  <div className="mt-12 sm:mt-16 border-t border-border pt-10 sm:pt-14 space-y-12 sm:space-y-16">
                    {event.EventContents.map((content, index) => {
                      const images = parseJsonSafe(content.imageUrls);
                      return (
                        <section key={index}>
                          <h2 className="border-l border-brand-400 pl-4 text-heading-sm text-cream uppercase break-words">
                            {content.header}
                          </h2>
                          <div className="mt-5 text-body text-cream/90">
                            <RichTextDisplay content={content.content} />
                          </div>
                          {images.length > 0 && (
                            <div className="mt-8 grid grid-cols-2 gap-4">
                              {images.map((url, i) => (
                                <img
                                  key={i}
                                  src={`${API_BASE}${url}`}
                                  alt={`${content.header} ${i + 1}`}
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
              </div>

              {/* Details and registration. This is the one surface on the page
                  and the reason most people arrived, so it pins on a wide
                  screen while the write-up scrolls past it. */}
              <aside className="order-1 lg:col-span-1">
                <div
                  className={`${STICKY_OFFSET} bg-brand-800 rounded-cards border border-border p-5 sm:p-6`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-heading-sm text-cream uppercase">
                      {t("detail_pages.event_details")}
                    </h2>
                    {event.status && (
                      <span
                        className={`px-3 py-1 text-meta uppercase tracking-[0.14em] rounded-full ${getStatusBadge(event.status)}`}
                      >
                        {event.status}
                      </span>
                    )}
                  </div>

                  {/* Icon column plus a shared text column, so every fact starts
                      on the same line whatever length its value is. */}
                  <dl className="mt-6 border-t border-border">
                    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 border-t border-border py-4 first:border-t-0">
                      <Calendar
                        aria-hidden="true"
                        className="h-4 w-4 mt-0.5 shrink-0 text-brand-400"
                      />
                      <div className="min-w-0">
                        <dt className="text-meta uppercase tracking-[0.18em] text-cream/60">
                          {t("detail_pages.date_time")}
                        </dt>
                        <dd className="mt-1.5 text-body text-cream break-words">
                          {formatDate(event.startDateTime)} -{" "}
                          {formatDate(event.endDateTime)}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 border-t border-border py-4">
                      <MapPin
                        aria-hidden="true"
                        className="h-4 w-4 mt-0.5 shrink-0 text-brand-400"
                      />
                      <div className="min-w-0">
                        <dt className="text-meta uppercase tracking-[0.18em] text-cream/60">
                          {t("detail_pages.location")}
                        </dt>
                        <dd className="mt-1.5 text-body text-cream break-words">
                          {event.location}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 border-t border-border py-4">
                      <Users
                        aria-hidden="true"
                        className="h-4 w-4 mt-0.5 shrink-0 text-brand-400"
                      />
                      <div className="min-w-0">
                        <dt className="text-meta uppercase tracking-[0.18em] text-cream/60">
                          {t("detail_pages.quota")}
                        </dt>
                        <dd className="mt-1.5 text-body text-cream">
                          {event.registeredCount ?? 0} / {event.quota}{" "}
                          {t("detail_pages.participants")}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 border-t border-border py-4">
                      <CircleDollarSign
                        aria-hidden="true"
                        className="h-4 w-4 mt-0.5 shrink-0 text-brand-400"
                      />
                      <div className="min-w-0">
                        <dt className="text-meta uppercase tracking-[0.18em] text-cream/60">
                          {t("detail_pages.fee")}
                        </dt>
                        <dd className="mt-1.5 text-body text-cream">
                          {event.fee > 0
                            ? `Rp ${new Intl.NumberFormat("id-ID").format(event.fee)}`
                            : t("static.free")}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <div className="mt-6 border-t border-border pt-6">
                    {event.status === "Open" ? (
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className={`w-full min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide py-3 rounded-buttons-pill transition-colors ${FOCUS_RING}`}
                      >
                        {t("detail_pages.register_now")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full min-h-11 bg-brand-700 text-cream/70 font-medium uppercase tracking-wide py-3 rounded-buttons-pill cursor-not-allowed"
                      >
                        {event.status === "Coming Soon" &&
                          t("detail_pages.registration_soon")}
                        {event.status === "Closed" &&
                          t("detail_pages.registration_closed")}
                        {event.status === "Finished" &&
                          t("detail_pages.event_finished")}
                      </button>
                    )}
                  </div>
                </div>
              </aside>
            </motion.div>
          </div>
        </div>
      </div>

      <Popup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${t("detail_pages.registration_form_title")}: ${event.title}`}
      >
        <RegistrationForm
          eventId={event.id}
          participantRoles={participantRoles}
        />
      </Popup>
    </>
  );
};

export default EventDetailPage;