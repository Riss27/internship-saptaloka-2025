import React, { useState, useEffect } from "react";
import axios from "axios";
import LabToolCard from "../components/features/lab_tools/LabToolCard";

const LabToolsPage = () => {
  const [labTools, setLabTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/lab-tools")
      .then((response) => {
        setLabTools(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data alat lab:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="text-center py-20 text-white">Loading Lab Tools...</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#E6F4F1] mb-2">
          Alat Laboratorium
        </h1>
        <p className="text-[#A7C4BD]">
          Sediakan laboratorium Anda dengan peralatan berkualitas.
        </p>
      </div>

      {labTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {labTools.map((tool) => (
            <LabToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#A7C4BD]">
          Belum ada alat laboratorium yang ditambahkan.
        </p>
      )}
    </div>
  );
};

export default LabToolsPage;
