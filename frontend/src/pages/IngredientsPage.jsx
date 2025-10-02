import React, { useState, useEffect } from "react";
import axios from "axios";
import IngredientCard from "../components/features/ingredients/IngredientCard";

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/ingredients")
      .then((response) => {
        setIngredients(response.data.data);
        setFilteredIngredients(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data bahan:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredIngredients(ingredients);
    } else {
      setFilteredIngredients(ingredients.filter((ing) => ing.category === selectedCategory));
    }
  }, [selectedCategory, ingredients]);

  if (isLoading) return <div className="text-center py-20 text-white">Loading Ingredients...</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Bahan Parfum & Aromaterapi</h1>
        <p className="text-slate-400">Jelajahi koleksi bahan baku berkualitas tinggi kami.</p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <button onClick={() => setSelectedCategory("All")} className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "All" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
          Semua
        </button>
        <button
          onClick={() => setSelectedCategory("Essential Oil")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "Essential Oil" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Essential Oil
        </button>
        <button
          onClick={() => setSelectedCategory("Non Essential Oil")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "Non Essential Oil" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Non-Essential Oil
        </button>
      </div>

      {filteredIngredients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredIngredients.map((ingredient) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400">Tidak ada bahan dalam kategori ini.</p>
      )}
    </div>
  );
};

export default IngredientsPage;
