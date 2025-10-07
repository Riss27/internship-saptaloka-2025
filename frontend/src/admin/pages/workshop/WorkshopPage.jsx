import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import WorkshopList from "../../components/WorkshopList";

const WorkshopPage = () => {
  const [workshops, setWorkshops] = useState([]);

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/workshops?source=admin");
      setWorkshops(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data workshop:", error);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const deleteWorkshop = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus workshop ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/workshops/${id}`);
        fetchWorkshops();
      } catch (error) {
        console.error("Gagal menghapus workshop:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Workshops</h1>
          <p className="text-slate-400 mt-1">Kelola semua workshop yang menggabungkan beberapa event.</p>
        </div>
        <Link to="/admin/workshop/add" className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-md font-semibold text-white no-underline whitespace-nowrap flex items-center justify-center transition-colors duration-300">
          <FiPlus className="mr-2" /> New Workshop
        </Link>
      </header>

      <main>
        <WorkshopList workshops={workshops} deleteWorkshop={deleteWorkshop} />
      </main>
    </div>
  );
};

export default WorkshopPage;
