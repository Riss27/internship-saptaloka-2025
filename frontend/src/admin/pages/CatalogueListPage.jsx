import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus, FiFilter, FiChevronDown } from "react-icons/fi";
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
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
          <p className="text-slate-400 mt-1">Tambahkan, edit, atau hapus {itemType}.</p>
        </div>

        <div className="flex items-center gap-4">
          {categoryOptions && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiFilter size={16} />
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-56 p-2 pl-10 bg-slate-800 border border-slate-600 text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">Semua Kategori</option>
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <FiChevronDown className="h-5 w-5" />
              </div>
            </div>
          )}
          <Link to={`/admin/catalogue/${itemType}s/add`} className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-md font-semibold text-white no-underline flex items-center">
            <FiPlus className="mr-2" /> Add New
          </Link>
        </div>
      </header>

      <main>
        <GenericCatalogueList items={items} itemType={itemType} deleteItem={deleteItem} />
      </main>
    </div>
  );
};

export default CatalogueListPage;
