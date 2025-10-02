import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/workshops/${id}`);
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
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!workshop) {
    return <div className="text-center py-20 text-white">Workshop tidak ditemukan.</div>;
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Bagian Deskripsi Utama Workshop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-1">
            <img src={`http://localhost:3000${workshop.imageUrl}`} alt={workshop.title} className="rounded-lg shadow-lg w-full object-cover" />
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{workshop.title}</h1>
            <div className="prose prose-invert text-slate-300" dangerouslySetInnerHTML={{ __html: workshop.description }} />
          </div>
        </div>

        {/* Bagian Daftar Kegiatan/Event */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-cyan-500 pb-2 inline-block">Kegiatan</h2>

          {workshop.Events && workshop.Events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workshop.Events.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id} className="group block">
                  <img src={`http://localhost:3000${event.imageBannerUrl}`} alt={`Poster ${event.title}`} className="rounded-lg shadow-lg w-full object-contain transform group-hover:scale-105 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Belum ada kegiatan yang terdaftar untuk workshop ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;
