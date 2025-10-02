import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import LabToolList from "../../components/LabToolList";

const LabToolPage = () => {
  const [labTools, setLabTools] = useState([]);

  const fetchLabTools = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/lab-tools");
      setLabTools(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data alat:", error);
    }
  };

  useEffect(() => {
    fetchLabTools();
  }, []);

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
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Lab Tools</h1>
          <p className="text-slate-400 mt-1">Tambahkan, edit, atau hapus alat-alat laboratorium.</p>
        </div>

        <Link to="/admin/catalogue/lab-tools/add" className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-md font-semibold text-white no-underline whitespace-nowrap flex items-center justify-center transition-colors duration-300">
          <FiPlus className="mr-2" /> Add New Tool
        </Link>
      </header>

      <main>
        <LabToolList labTools={labTools} deleteLabTool={deleteLabTool} />
      </main>
    </div>
  );
};

export default LabToolPage;
