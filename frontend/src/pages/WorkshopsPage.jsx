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
          setIsLoading(false);
          setNotFound(true);
        }
      } catch (error) {
        console.error(`Gagal mengambil data workshop ${category}:`, error);
        setIsLoading(false);
        setNotFound(true);
      }
    };

    findAndRedirect();
  }, [category, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-slate-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p>Mencari Workshop {category}...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="bg-gradient-to-b from-emerald-50 to-white min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 py-20 text-center text-slate-700">
          <div className="bg-emerald-100 inline-block p-6 rounded-full mb-6">
            <FiClock size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-emerald-800">Segera Hadir!</h1>
          <p className="text-slate-600 max-w-lg mx-auto">Saat ini belum ada workshop untuk kategori {category}. Pantau terus halaman ini untuk informasi terbaru!</p>
        </div>
      </div>
    );
  }

  return null;
};

export default WorkshopsPage;
