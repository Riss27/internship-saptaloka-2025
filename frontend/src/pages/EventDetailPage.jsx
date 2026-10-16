import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import RegistrationForm from "../components/molecules/forms/RegistrationForm";
import Popup from "../components/atoms/feedback/Popup";
import RichTextDisplay from "../components/common/RichTextDisplay";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Users, CircleDollarSign } from "lucide-react";
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

const EventDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <p className="text-cream/80 text-lg">
          {t("detail_pages.event_not_found")}
        </p>
      </div>
    );
  }

  const participantRoles = parseJsonSafe(event.participantRoles);

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

  return (
    <>
      <div className="bg-brand-900 text-cream pt-6 sm:pt-8 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-5xl">
          <header className="relative mb-8">
            <img
              src={`${API_BASE}${event.imageBannerUrl}`}
              alt=""
              className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-cards"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/70 to-transparent rounded-cards"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-cream uppercase leading-tight tracking-wide break-words">
                {event.title}
              </h1>
            </div>
          </header>

          {/* On a phone the detail panel and the register button come first. The
              reading order in the document is unchanged, only the visual order. */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Kolom utama */}
            <div className="order-2 lg:col-span-2">
              <RichTextDisplay
                content={event.description}
                className="text-cream/90 mb-8 sm:mb-12"
              />
              <article className="space-y-8 sm:space-y-12">
                {event.EventContents &&
                  event.EventContents.map((content, index) => {
                    const images = parseJsonSafe(content.imageUrls);
                    return (
                      <section key={index}>
                        <h2 className="text-xl sm:text-2xl font-medium text-brand-400 mb-4 border-l-4 border-brand-400 pl-4 uppercase tracking-wide break-words">
                          {content.header}
                        </h2>
                        <RichTextDisplay
                          content={content.content}
                          className="text-cream/90"
                        />
                        {images.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {images.map((url, i) => (
                              <img
                                key={i}
                                src={`${API_BASE}${url}`}
                                alt={`${content.header} ${i + 1}`}
                                className="rounded-cards object-cover w-full h-40 sm:h-auto"
                              />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
              </article>
            </div>

            {/* Sidebar Info & Registrasi */}
            <aside className="order-1 lg:col-span-1">
              <div
                className={`${STICKY_OFFSET} bg-brand-800 rounded-cards p-5 sm:p-6 border border-border space-y-4`}
              >
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-border pb-3">
                  <h2 className="text-lg sm:text-xl font-medium text-brand-400 uppercase tracking-wide">
                    {t("detail_pages.event_details")}
                  </h2>
                  {event.status && (
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full uppercase ${getStatusBadge(event.status)}`}
                    >
                      {event.status}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <Calendar
                    aria-hidden="true"
                    className="w-4 h-4 mt-0.5 shrink-0 text-brand-400"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-brand-400 uppercase text-xs tracking-wide">
                      {t("detail_pages.date_time")}
                    </p>
                    <p className="text-sm text-cream">
                      {formatDate(event.startDateTime)} -{" "}
                      {formatDate(event.endDateTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="w-4 h-4 mt-0.5 shrink-0 text-brand-400"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-brand-400 uppercase text-xs tracking-wide">
                      {t("detail_pages.location")}
                    </p>
                    <p className="text-sm text-cream break-words">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users
                    aria-hidden="true"
                    className="w-4 h-4 mt-0.5 shrink-0 text-brand-400"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-brand-400 uppercase text-xs tracking-wide">
                      {t("detail_pages.quota")}
                    </p>
                    <p className="text-sm text-cream">
                      {event.registeredCount ?? 0} / {event.quota}{" "}
                      {t("detail_pages.participants")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CircleDollarSign
                    aria-hidden="true"
                    className="w-4 h-4 mt-0.5 shrink-0 text-brand-400"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-brand-400 uppercase text-xs tracking-wide">
                      {t("detail_pages.fee")}
                    </p>
                    <p className="text-sm text-cream">
                      {event.fee > 0
                        ? `Rp ${new Intl.NumberFormat("id-ID").format(event.fee)}`
                        : t("static.free")}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
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
