import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductList from "../../components/ProductList";
import { FiChevronDown, FiPlus, FiFilter } from "react-icons/fi";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      let url = "http://localhost:3000/api/products";
      if (selectedCategory !== "All") {
        url += `?category=${selectedCategory}`;
      }
      const response = await axios.get(url);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Products</h1>
          <p className="text-slate-400 mt-1">Tambahkan, edit, atau hapus produk parfum dan aromaterapi.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <FiFilter size={16} />
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-56 p-2 pl-10 bg-slate-800 border border-slate-600 text-slate-200 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
            >
              <option value="All">Semua Kategori</option>
              <option value="Parfum">Parfum</option>
              <option value="Aromaterapi">Aromaterapi</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <FiChevronDown className="h-5 w-5" />
            </div>
          </div>
          <Link to="/catalogue/products/add" className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-md font-semibold text-white no-underline whitespace-nowrap flex items-center justify-center transition-colors duration-300">
            <FiPlus className="mr-2" /> Add New
          </Link>
        </div>
      </header>

      <main>
        <ProductList products={products} handleDelete={handleDelete} />
      </main>
    </div>
  );
};

export default ProductPage;
