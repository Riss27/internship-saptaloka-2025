import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { FiPlus } from "react-icons/fi";
import WorkshopList from "../../components/WorkshopList";

const WorkshopPage = () => {
  const [workshops, setWorkshops] = useState([]);

  const fetchWorkshops = async () => {
    try {
      const response = await apiClient.get("/api/workshops?source=admin");
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
        await apiClient.delete(`/api/workshops/${id}`);
        fetchWorkshops();
      } catch (error) {
        console.error("Gagal menghapus workshop:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Workshops</h1>
            <p className="text-slate-400 text-lg">Kelola semua workshop yang menggabungkan beberapa event</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-slate-500">
                Total Workshops: <span className="font-semibold text-cyan-400">{workshops.length}</span>
              </span>
            </div>
          </div>
          <Link to="/admin/workshop/add" className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold text-white no-underline whitespace-nowrap flex items-center justify-center transition-all duration-300">
            <FiPlus className="mr-2" size={18} /> New Workshop
          </Link>
        </div>
      </header>

      <main>
        <WorkshopList workshops={workshops} deleteWorkshop={deleteWorkshop} />
      </main>
    </div>
  );
};

export default WorkshopPage;
