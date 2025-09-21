import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import { FiChevronDown } from "react-icons/fi"; // Impor ikon

const ParfumPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // State untuk menyimpan kategori terpilih

  // Fungsi fetchProducts sekarang dinamis berdasarkan kategori
  const fetchProducts = async () => {
    try {
      let url = "http://localhost:3000/api/products";
      if (selectedCategory !== "All") {
        url += `?category=${selectedCategory}`; // Tambahkan query parameter jika bukan "All"
      }
      const response = await axios.get(url);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    }
  };

  // useEffect akan berjalan lagi setiap kali selectedCategory berubah
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        fetchProducts(); // Panggil ulang fetchProducts agar daftar terupdate
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
      }
    }
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Produk Parfum dan Aromaterapi</h1>

        {/* --- UI UNTUK FILTER DAN TOMBOL ADD --- */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 p-2 pr-10 bg-slate-800 border border-slate-600 text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option className="bg-slate-800 text-white" value="All">
                Semua Kategori
              </option>
              <option className="bg-slate-800 text-white" value="Parfum">
                Parfum
              </option>
              <option className="bg-slate-800 text-white" value="Aromaterapi">
                Aromaterapi
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <FiChevronDown className="h-5 w-5" />
            </div>
          </div>
          <Link to="/catalogue/products/add" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold text-white no-underline whitespace-nowrap">
            Add New Product
          </Link>
        </div>
      </header>

      <main>
        <ProductList products={products} handleDelete={handleDelete} />
      </main>
    </div>
  );
};

export default ParfumPage;
