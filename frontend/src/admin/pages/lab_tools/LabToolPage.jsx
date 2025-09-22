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
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Lab Tools</h1>
        <Link to="/catalogue/lab-tools/add" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold text-white no-underline flex items-center">
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
