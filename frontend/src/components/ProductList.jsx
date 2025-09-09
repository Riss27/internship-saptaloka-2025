import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = () => {
  // 'useState' untuk menyimpan data produk
  const [products, setProducts] = useState([]);

  // 'useEffect' untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Meminta data ke backend menggunakan Axios
        const response = await axios.get("http://localhost:3000/api/products");
        // Menyimpan data yang didapat ke dalam state 'products'
        setProducts(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchProducts();
  }, []); // Array kosong artinya efek ini hanya berjalan sekali

  return (
    <div>
      <h2>Daftar Parfum</h2>
      {products.length === 0 ? (
        <p>Belum ada produk...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - Rp {product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
