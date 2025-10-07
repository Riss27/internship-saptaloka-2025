import React, { useState, useEffect } from "react";
import axios from "axios";
import LabToolCard from "../components/features/lab_tools/LabToolCard";
import { Search, X, Wrench } from "lucide-react";

const LabToolsPage = () => {
  const [labTools, setLabTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/lab-tools")
      .then((response) => {
        setLabTools(response.data.data);
        setFilteredTools(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data alat lab:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTools(labTools);
      return;
    }

    const filtered = labTools.filter((tool) => tool.name.toLowerCase().includes(searchQuery.toLowerCase()));

    setFilteredTools(filtered);
  }, [searchQuery, labTools]);

  const handleClearSearch = () => setSearchQuery("");

  if (isLoading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Lab Tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Alat Laboratorium</h1>
          <p className="text-slate-400">Sediakan laboratorium Anda dengan peralatan berkualitas tinggi.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari alat laboratorium berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            {searchQuery && (
              <button onClick={handleClearSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Info hasil pencarian */}
          {searchQuery && (
            <p className="text-slate-400 text-sm mt-3">
              Menampilkan <span className="text-cyan-400 font-semibold">{filteredTools.length}</span> dari <span className="text-white font-semibold">{labTools.length}</span> alat
            </p>
          )}
        </div>

        {/* Grid hasil */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredTools.map((tool) => (
              <LabToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Tidak ada alat yang cocok dengan pencarian "{searchQuery}".</p>
            <button onClick={handleClearSearch} className="text-cyan-400 hover:text-cyan-300 underline">
              Hapus pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabToolsPage;
