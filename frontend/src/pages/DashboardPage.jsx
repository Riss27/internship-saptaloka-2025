import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Gunakan Link untuk navigasi
import ProductList from "../components/ProductList";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Add Catalogue</h1>
      </header>

      <main>
        <div className="mb-6">
          {/* Ubah 'to' menjadi '/catalogue/add' */}
          <Link to="/catalogue/add" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold">
            Add New Product
          </Link>
        </div>
        <ProductList products={products} handleDelete={handleDelete} />
      </main>
    </div>
  );
};

export default DashboardPage;
