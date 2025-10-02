import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkshopCard from "../components/features/workshops/WorkshopCard";

//
const WorkshopsPage = ({ category }) => {
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/workshops?category=${category}`)
      .then((response) => {
        // Filter hanya workshop dengan status "published"
        const publishedWorkshops = response.data.data.filter((ws) => ws.status === "published");
        setWorkshops(publishedWorkshops);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(`Gagal mengambil data workshop ${category}:`, error);
        setIsLoading(false);
      });
  }, [category]);

  if (isLoading) {
    return <div className="text-center py-20 text-white">Loading Workshops...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        {/* Judul dan deskripsi */}
        <h1 className="text-4xl font-bold text-white mb-2">Workshop {category}</h1>
        <p className="text-slate-400">Ikuti paket workshop pilihan untuk mendalami seni {category.toLowerCase()}.</p>
      </div>

      {workshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400">Belum ada workshop {category} yang tersedia saat ini.</p>
      )}
    </div>
  );
};

export default WorkshopsPage;
