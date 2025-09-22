import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import LabToolList from "../../components/LabToolList";

const LabToolPage = () => {
  const [labTools, setLabTools] = useState([]);

  useEffect(() => {
    fetchLabTools();
  }, []);

  const fetchLabTools = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/lab-tools");
      setLabTools(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data alat:", error);
    }
  };

  const deleteLabTool = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alat ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/lab-tools/${id}`);
        fetchLabTools();
      } catch (error) {
        console.error("Gagal menghapus alat:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Add Catalogue</h1>
        <Link to="/catalogue/lab-tools/add" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center no-underline">
          <FiPlus className="mr-2" /> Add New Tool
        </Link>
      </header>

      <LabToolList labTools={labTools} deleteLabTool={deleteLabTool} />
    </div>
  );
};

export default LabToolPage;
