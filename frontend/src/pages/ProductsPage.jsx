import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/features/products/ProductCard";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil semua data produk dari backend
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data); // Awalnya tampilkan semua
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data produk:", error);
        setIsLoading(false);
      });
  }, []);

  // Fungsi untuk filter produk
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  if (isLoading) {
    return <div className="text-center py-20 text-white">Loading Products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Halaman */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Koleksi Kami</h1>
        <p className="text-slate-400">Jelajahi berbagai pilihan parfum dan aromaterapi yang kami tawarkan.</p>
      </div>

      {/* Tombol Filter Kategori */}
      <div className="flex justify-center gap-4 mb-12">
        <button onClick={() => setSelectedCategory("All")} className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "All" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
          Semua
        </button>
        <button
          onClick={() => setSelectedCategory("Parfum")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "Parfum" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Parfum
        </button>
        <button
          onClick={() => setSelectedCategory("Aromaterapi")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${selectedCategory === "Aromaterapi" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Aromaterapi
        </button>
      </div>

      {/* Galeri Produk */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400">Tidak ada produk dalam kategori ini.</p>
      )}
    </div>
  );
};

export default ProductsPage;
