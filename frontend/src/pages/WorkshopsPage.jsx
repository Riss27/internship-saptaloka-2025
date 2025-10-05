import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiClock } from "react-icons/fi";

const WorkshopsPage = ({ category }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const findAndRedirect = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/workshops?category=${category}`);
        const workshops = response.data.data;

        if (workshops && workshops.length > 0) {
          const latestWorkshop = workshops[0];
          navigate(`/workshops/${latestWorkshop.id}`, { replace: true });
        } else {
          // Jika tidak ada workshop, set notFound menjadi true
          setIsLoading(false);
          setNotFound(true);
        }
      } catch (error) {
        console.error(`Gagal mengambil data workshop ${category}:`, error);
        setIsLoading(false);
        setNotFound(true); // Anggap not found jika API error
      }
    };

    findAndRedirect();
  }, [category, navigate]);

  // Tampilan Loading awal
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p>Mencari Workshop {category}...</p>
      </div>
    );
  }

  // Tampilan jika workshop tidak ditemukan (Coming Soon)
  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <div className="bg-slate-800/50 inline-block p-6 rounded-full mb-6">
          <FiClock size={40} className="text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Segera Hadir!</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Saat ini belum ada workshop untuk kategori {category}. Pantau terus halaman ini untuk informasi terbaru!</p>
      </div>
    );
  }

  // Fallback (seharusnya tidak pernah tampil, tapi bagus untuk jaga-jaga)
  return null;
};

export default WorkshopsPage;
