import React from "react";
import { NavLink, Outlet } from "react-router-dom";
// Impor ikon dari pustaka yang sudah kita install
import { FiHome, FiCalendar, FiBriefcase, FiGrid, FiInfo, FiFileText, FiImage, FiLogOut } from "react-icons/fi";

const MainLayout = () => {
  // Daftar menu untuk sidebar
  const menuItems = [
    { path: "/", name: "Homepage", icon: <FiHome /> },
    { path: "/events", name: "Events", icon: <FiCalendar /> },
    { path: "/workshop", name: "Workshop", icon: <FiBriefcase /> },
    { path: "/catalogue", name: "Catalogue", icon: <FiGrid /> },
    { path: "/about", name: "About", icon: <FiInfo /> },
    { path: "/articles", name: "Articles", icon: <FiFileText /> },
    { path: "/gallery", name: "Gallery", icon: <FiImage /> },
  ];

  return (
    <div className="flex h-screen bg-[#1A3A3A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F2626] text-white flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center bg-gray-900/50">
          <h1 className="text-2xl font-bold">ask</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              // Style akan aktif jika URL cocok
              className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${isActive ? "bg-cyan-600/50 text-white" : "hover:bg-gray-700/50"}`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200">
            <FiLogOut className="mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Di sini semua halaman (Homepage, Events, dll) akan ditampilkan */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
