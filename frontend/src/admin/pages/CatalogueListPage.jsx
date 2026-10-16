import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../hooks/apiClient";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import GenericCatalogueList from "../components/catalogue/GenericCatalogueList";

const CatalogueListPage = ({
  pageTitle,
  itemType,
  apiEndpoint,
  categoryOptions,
}) => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchItems = useCallback(async () => {
    try {
      let url = `/api/${apiEndpoint}`;
      if (selectedCategory !== "All") {
        url += `?category=${selectedCategory}`;
      }
      const response = await apiClient.get(url);
      setItems(response.data.data);
    } catch (error) {
      console.error(`Gagal mengambil data ${itemType}:`, error);
    }
  }, [apiEndpoint, selectedCategory, itemType]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const deleteItem = async (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${itemType} ini?`)) {
      try {
        await apiClient.delete(`/api/${apiEndpoint}/${id}`);
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
            <h1 className="text-3xl md:text-4xl font-bold text-cream mb-2">
              {pageTitle}
            </h1>
            <p className="text-cream/60 text-lg">
              Tambahkan, edit, atau hapus {itemType}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-cream/70">
                Total {itemType}s:{" "}
                <span className="font-semibold text-brand-400">
                  {items.length}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {categoryOptions && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-56 p-2 bg-brand-800 border border-border text-cream/80 rounded-md focus:outline-none focus:border-brand-400 "
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
            <Link
              to={`/admin/catalogue/${apiEndpoint}/add`}
              className="bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-lg font-semibold text-cream no-underline flex items-center whitespace-nowrap transition-all duration-300"
            >
              <Plus aria-hidden="true" className="w-5 h-5 mr-2" /> Add New
            </Link>
          </div>
        </div>
      </header>

      <main>
        <GenericCatalogueList
          items={items}
          itemType={itemType}
          deleteItem={deleteItem}
        />
      </main>
    </div>
  );
};

export default CatalogueListPage;
