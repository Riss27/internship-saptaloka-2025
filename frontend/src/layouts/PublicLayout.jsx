import React from "react";
import { Outlet } from "react-router-dom";

// Komponen Navbar dan Footer (kita buat placeholder dulu)
const Navbar = () => (
  <header className="bg-gray-800 text-white p-4">
    <nav className="container mx-auto flex justify-between">
      <a href="/" className="font-bold text-xl">
        Askreative Parfum
      </a>
      <div>
        <a href="/" className="mr-4">
          Home
        </a>
        <a href="/about" className="mr-4">
          About
        </a>
        <a href="/products" className="mr-4">
          Products
        </a>
        <a href="/workshops" className="mr-4">
          Workshops
        </a>
        <a href="/articles">Articles</a>
      </div>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 mt-8">
    <div className="container mx-auto text-center">&copy; {new Date().getFullYear()} Askreative Parfum. All Rights Reserved.</div>
  </footer>
);

const PublicLayout = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        {/* Di sini semua konten halaman akan ditampilkan */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
