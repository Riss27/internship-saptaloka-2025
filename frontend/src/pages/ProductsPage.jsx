import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/features/products/ProductCard";
import { Search, X, Package } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil semua data produk dari backend
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data produk:", error);
        setIsLoading(false);
      });
  }, []);

  // Fungsi untuk filter produk berdasarkan kategori DAN search query
  useEffect(() => {
    let filtered = products;

    // Filter berdasarkan kategori
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter berdasarkan search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) => {
        const nameMatch = product.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const descriptionMatch = product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const categoryMatch = product.category
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        
        return nameMatch || descriptionMatch || categoryMatch;
      });
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  // Handler untuk clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Koleksi Kami</h1>
          <p className="text-slate-400 mb-8">
            Jelajahi berbagai pilihan parfum dan aromaterapi yang kami tawarkan.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Results Info */}
            {(searchQuery || selectedCategory !== "All") && (
              <p className="text-slate-400 text-sm mt-3">
                Menampilkan <span className="text-cyan-400 font-semibold">{filteredProducts.length}</span> dari{" "}
                <span className="text-white font-semibold">{products.length}</span> produk
              </p>
            )}
          </div>
        </div>

        {/* Tombol Filter Kategori */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedCategory === "All"
                ? "bg-cyan-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedCategory("Parfum")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedCategory === "Parfum"
                ? "bg-cyan-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Parfum
          </button>
          <button
            onClick={() => setSelectedCategory("Aromaterapi")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedCategory === "Aromaterapi"
                ? "bg-cyan-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
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
          <div className="text-center py-12">
            {searchQuery || selectedCategory !== "All" ? (
              <div>
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">
                  {searchQuery
                    ? `Tidak ada produk yang cocok dengan pencarian "${searchQuery}"${
                        selectedCategory !== "All" ? ` dalam kategori ${selectedCategory}` : ""
                      }`
                    : `Tidak ada produk dalam kategori ${selectedCategory}.`}
                </p>
                <div className="flex gap-3 justify-center mt-4">
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Hapus pencarian
                    </button>
                  )}
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Lihat semua kategori
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Tidak ada produk tersedia saat ini.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;