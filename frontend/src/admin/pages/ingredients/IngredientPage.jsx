import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import IngredientList from "../../components/IngredientList";

const IngredientPage = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/ingredients");
      setIngredients(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data bahan:", error);
    }
  };

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
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Add Catalogue</h1>
        <Link to="/catalogue/ingredients/add" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center no-underline">
          <FiPlus className="mr-2" /> Add New Ingredient
        </Link>
      </header>

      <IngredientList ingredients={ingredients} deleteIngredient={deleteIngredient} />
    </div>
  );
};

export default IngredientPage;
