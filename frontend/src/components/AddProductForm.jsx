import React, { useState } from "react";
import axios from "axios";

const AddProductForm = ({ onProductAdded }) => {
  // State untuk setiap input field
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Fungsi yang dijalankan saat form di-submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    try {
      const newProduct = {
        name,
        description,
        price: parseInt(price), // Pastikan harga adalah angka
        imageUrl,
      };
      // Kirim data ke backend
      await axios.post("http://localhost:3000/api/products", newProduct);

      // Panggil fungsi onProductAdded untuk refresh daftar produk
      onProductAdded();

      // Kosongkan form setelah berhasil
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } catch (error) {
      console.error("Gagal menambahkan produk:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-800 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-white">Tambah Parfum Baru</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input untuk Nama */}
        <input
          type="text"
          placeholder="Nama Parfum"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
        {/* Input untuk Harga */}
        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
      </div>
      {/* Input untuk Deskripsi */}
      <textarea
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mt-4 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        rows="3"
        required
      ></textarea>
      {/* Input untuk URL Gambar */}
      <input
        type="text"
        placeholder="URL Gambar (Opsional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full mt-4 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      {/* Tombol Submit */}
      <button type="submit" className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
        Tambah Produk
      </button>
    </form>
  );
};

export default AddProductForm;
