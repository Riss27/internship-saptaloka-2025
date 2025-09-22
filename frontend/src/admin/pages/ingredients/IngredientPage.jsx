import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import IngredientList from "../../components/IngredientList";

const IngredientPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchIngredients = async () => {
    try {
      let url = "http://localhost:3000/api/ingredients";
      if (selectedCategory !== "All") {
        url += `?category=${selectedCategory}`;
      }
      const response = await axios.get(url);
      setIngredients(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data bahan:", error);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [selectedCategory]);

  const deleteIngredient = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus bahan ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/ingredients/${id}`);
        fetchIngredients();
      } catch (error) {
        console.error("Gagal menghapus bahan:", error);
      }
    }
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Manage Ingredients</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 p-2 pr-10 bg-slate-800 border border-slate-600 text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="All">Semua Kategori</option>
              <option value="Essential Oil">Essential Oil</option>
              <option value="Non Essential Oil">Non Essential Oil</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <FiChevronDown className="h-5 w-5" />
            </div>
          </div>
          <Link to="/catalogue/ingredients/add" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold text-white no-underline whitespace-nowrap">
            <FiPlus className="mr-2" /> Add New
          </Link>
        </div>
      </header>

      <main>
        <IngredientList ingredients={ingredients} deleteIngredient={deleteIngredient} />
      </main>
    </div>
  );
};

export default IngredientPage;
