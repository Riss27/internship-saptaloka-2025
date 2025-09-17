import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";

const ParfumPage = () => {
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
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Produk Parfum dan Aromaterapi</h1>
      </header>

      <main>
        <div className="mb-6">
          <Link to="/catalogue/products/add" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold text-white no-underline">
            Add New Product
          </Link>
        </div>
        <ProductList products={products} handleDelete={handleDelete} />
      </main>
    </div>
  );
};

export default ParfumPage;
