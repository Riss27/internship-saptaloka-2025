import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FiHome, FiCalendar, FiBriefcase, FiGrid, FiInfo, FiFileText, FiImage, FiLogOut } from "react-icons/fi";

const MainLayout = () => {
  // State untuk mengontrol visibilitas sub-menu
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);

  // Daftar menu utama
  const menuItems = [
    { path: "/", name: "Homepage", icon: <FiHome /> },
    { path: "/events", name: "Events", icon: <FiCalendar /> },
    { path: "/workshop", name: "Workshop", icon: <FiBriefcase /> },
  ];

  // Daftar sub-menu untuk Catalogue
  const catalogueSubItems = [
    { path: "/catalogue/products", name: "Produk Parfum" },
    { path: "/catalogue/bahan-baku", name: "Bahan Baku" },
    { path: "/catalogue/assets", name: "Assets" },
  ];

  return (
    <div className="flex h-screen bg-[#1A3A3A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F2626] text-white flex flex-col">
        <div className="h-20 flex items-center justify-center bg-gray-900/50">
          <h1 className="text-2xl font-bold">Askreative</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Render menu utama */}
          {menuItems.map((item) => (
            <NavLink key={item.name} to={item.path} end className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg ${isActive ? "bg-cyan-600/50" : "hover:bg-gray-700/50"}`}>
              <span className="mr-3">{item.icon}</span> {item.name}
            </NavLink>
          ))}

          {/* Tombol Dropdown untuk Catalogue */}
          <div>
            <button onClick={() => setIsCatalogueOpen(!isCatalogueOpen)} className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg hover:bg-gray-700/50">
              <div className="flex items-center">
                <span className="mr-3">
                  <FiGrid />
                </span>{" "}
                Catalogue
              </div>
              {isCatalogueOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {/* Tampilkan sub-menu jika isCatalogueOpen adalah true */}
            {isCatalogueOpen && (
              <div className="pl-8 pt-2 space-y-2">
                {catalogueSubItems.map((subItem) => (
                  <NavLink key={subItem.name} to={subItem.path} className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg text-sm ${isActive ? "bg-cyan-600/50" : "hover:bg-gray-700/50"}`}>
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Menu lainnya setelah Catalogue */}
          <NavLink to="/about" className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg ${isActive ? "bg-cyan-600/50" : "hover:bg-gray-700/50"}`}>
            <span className="mr-3">
              <FiInfo />
            </span>{" "}
            About
          </NavLink>
          <NavLink to="/articles" className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg ${isActive ? "bg-cyan-600/50" : "hover:bg-gray-700/50"}`}>
            <span className="mr-3">
              <FiFileText />
            </span>{" "}
            Articles
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg ${isActive ? "bg-cyan-600/50" : "hover:bg-gray-700/50"}`}>
            <span className="mr-3">
              <FiImage />
            </span>{" "}
            Gallery
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700">
            <FiLogOut className="mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
