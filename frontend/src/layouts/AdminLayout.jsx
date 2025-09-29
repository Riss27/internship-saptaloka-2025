import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiHome, FiGrid, FiInfo, FiFileText, FiImage, FiLogOut, FiCalendar, FiBriefcase } from "react-icons/fi";

const AdminLayout = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { path: "/admin/homepage", name: "Homepage", icon: <FiHome /> },
    { path: "/admin/events", name: "Events", icon: <FiCalendar /> },
    { path: "/admin/workshop", name: "Workshop", icon: <FiBriefcase /> },
    {
      name: "Catalogue",
      icon: <FiGrid />,
      children: [
        { path: "/admin/catalogue/products", name: "Produk Parfume & Aromaterapi" },
        { path: "/admin/catalogue/ingredients", name: "Bahan Parfume & Aromaterapi" },
        { path: "/admin/catalogue/lab-tools", name: "Alat Laboratorium Skala Mikro" },
      ],
    },
    { path: "/admin/about", name: "About", icon: <FiInfo /> },
    { path: "/admin/articles", name: "Articles", icon: <FiFileText /> },
    { path: "/admin/gallery", name: "Gallery", icon: <FiImage /> },
  ];

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="flex h-screen bg-[#1A3A3A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F2626] text-white flex flex-col">
        {/* Logo / Title */}
        <div className="h-20 flex items-center justify-center bg-gray-900/50">
          <h1 className="text-2xl font-bold">Askreative</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.name}>
                <button onClick={() => handleDropdownToggle(item.name)} className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg hover:bg-gray-700/50">
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </div>
                  {openDropdown === item.name ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {openDropdown === item.name && (
                  <div className="pl-8 pt-2 space-y-2">
                    {item.children.map((sub) => (
                      <NavLink key={sub.name} to={sub.path} className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg text-sm ${isActive ? "bg-cyan-600/50" : "hover:bg-gray-700/50"}`}>
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.name} to={item.path} end={item.path === "/admin/homepage"} className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg ${isActive ? "bg-cyan-600/50" : "hover:bg-gray-700/50"}`}>
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            )
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700">
            <FiLogOut className="mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
