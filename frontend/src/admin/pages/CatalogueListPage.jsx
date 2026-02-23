import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import GenericCatalogueList from "../components/catalogue/GenericCatalogueList";

const CatalogueListPage = ({ pageTitle, itemType, apiEndpoint, categoryOptions }) => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchItems = async () => {
    try {
      let url = `http://localhost:3000/api/${apiEndpoint}`;
      if (selectedCategory !== "All") {
        url += `?category=${selectedCategory}`;
      }
      const response = await axios.get(url);
      setItems(response.data.data);
    } catch (error) {
      console.error(`Gagal mengambil data ${itemType}:`, error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, apiEndpoint]);

  const deleteItem = async (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${itemType} ini?`)) {
      try {
        await axios.delete(`http://localhost:3000/api/${apiEndpoint}/${id}`);
        fetchItems();
      } catch (error) {
        console.error(`Gagal menghapus ${itemType}:`, error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{pageTitle}</h1>
            <p className="text-slate-400 text-lg">Tambahkan, edit, atau hapus {itemType}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-slate-500">
                Total {itemType}s: <span className="font-semibold text-cyan-400">{items.length}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
          {categoryOptions && (
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-56 p-2 bg-slate-800 border border-slate-600 text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">Semua Kategori</option>
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Link to={`/admin/catalogue/${apiEndpoint}/add`} className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold text-white no-underline flex items-center whitespace-nowrap transition-all duration-300">
            <FiPlus className="mr-2" size={18} /> Add New
          </Link>
          </div>
        </div>
      </header>

      <main>
        <GenericCatalogueList items={items} itemType={itemType} deleteItem={deleteItem} />
      </main>
    </div>
  );
};

export default CatalogueListPage;
