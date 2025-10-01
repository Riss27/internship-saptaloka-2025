import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/features/events/EventCard";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/events")
      .then((response) => {
        setEvents(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data events:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="text-center py-20 text-white">Loading Events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Kegiatan & Event</h1>
        <p className="text-slate-400">Ikuti berbagai kegiatan menarik yang kami selenggarakan.</p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400">Belum ada kegiatan yang tersedia saat ini.</p>
      )}
    </div>
  );
};

export default EventsPage;
