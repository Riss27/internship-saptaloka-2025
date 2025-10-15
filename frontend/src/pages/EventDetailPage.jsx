import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign } from "react-icons/fi";
import RegistrationForm from "../components/features/events/registration/RegistrationForm";
import Popup from "../components/ui/Popup";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/events/${id}`);
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
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center py-20 text-white">Event tidak ditemukan.</div>;
  }

  const participantRoles = parseJsonSafe(event.participantRoles);

  // Helper untuk status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-600/80 text-green-200";
      case "Coming Soon":
        return "bg-blue-600/80 text-blue-200";
      case "Closed":
      case "Finished":
        return "bg-slate-600/80 text-slate-300";
      default:
        return "bg-gray-600/80 text-gray-200";
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-emerald-50 to-white text-slate-700 min-h-screen pt-10 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="relative mb-8 text-center">
            <img src={`http://localhost:3000${event.imageBannerUrl}`} alt={event.title} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-50 via-emerald-50/70 to-transparent rounded-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 leading-tight">{event.title}</h1>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom utama */}
            <div className="lg:col-span-2">
              <div className="prose prose-invert prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: event.description }} />

              <article className="space-y-12">
                {event.EventContents &&
                  event.EventContents.map((content, index) => {
                    const images = parseJsonSafe(content.imageUrls);
                    return (
                      <section key={index}>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-l-4 border-cyan-400 pl-4">{content.header}</h2>
                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
                        {images.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {images.map((url, i) => (
                              <img key={i} src={`http://localhost:3000${url}`} alt={`${content.header} ${i + 1}`} className="rounded-lg object-cover w-full" />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
              </article>
            </div>

            {/* Sidebar Info & Registrasi */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <h3 className="text-xl font-bold text-emerald-800">Detail Event</h3>
                  {event.status && <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>{event.status}</span>}
                </div>

                <div className="flex items-start gap-3">
                  <FiCalendar className="text-emerald-800 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800">Tanggal & Waktu</p>
                    <p className="text-sm">
                      {formatDate(event.startDateTime)} - {formatDate(event.endDateTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-emerald-800 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800">Lokasi</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiUsers className="text-emerald-800 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800">Kuota</p>
                    <p className="text-sm">
                      {event.EventRegistrations.length} / {event.quota} Peserta
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiDollarSign className="text-emerald-800 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800">Biaya</p>
                    <p className="text-sm">{event.fee > 0 ? `Rp ${new Intl.NumberFormat("id-ID").format(event.fee)}` : "Gratis"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  {event.status === "Open" ? (
                    <>
                      <button onClick={() => setIsModalOpen(true)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Daftar Sekarang
                      </button>
                    </>
                  ) : (
                    <button disabled className="w-full bg-slate-600 text-slate-400 font-bold py-3 rounded-lg cursor-not-allowed">
                      {event.status === "Coming Soon" && "Pendaftaran Segera Dibuka"}
                      {event.status === "Closed" && "Pendaftaran Ditutup"}
                      {event.status === "Finished" && "Event Telah Selesai"}
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Popup Pendaftaran */}
      <Popup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Pendaftaran: ${event.title}`}>
        <RegistrationForm eventId={event.id} participantRoles={participantRoles} />
      </Popup>
    </>
  );
};

export default EventDetailPage;
