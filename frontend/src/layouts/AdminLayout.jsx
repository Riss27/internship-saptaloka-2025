import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiGrid,
  FiInfo,
  FiFileText,
  FiImage,
  FiLogOut,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../hooks/apiClient";
import API_BASE from "../lib/apiBase";

const AdminLayout = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [logoFooter, setLogoFooter] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch logoFooter dari endpoint About
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await apiClient.get("/api/about");
        const data = response.data;
        if (data?.data?.logoFooter) {
          setLogoFooter(`${API_BASE}${data.data.logoFooter}`);
        }
      } catch (error) {
        console.error("Gagal ambil logo footer:", error);
      }
    };
    fetchLogo();
  }, []);

  // Close dropdown when clicking outside (for collapsed sidebar)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        collapsed &&
        openDropdown &&
        !event.target.closest(".dropdown-container")
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed, openDropdown]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/homepage", name: "Homepage", icon: <FiHome /> },
    { path: "/admin/events", name: "Events", icon: <FiCalendar /> },
    { path: "/admin/workshop", name: "Workshop", icon: <FiBriefcase /> },
    {
      name: "Catalogue",
      icon: <FiGrid />,
      children: [
        {
          path: "/admin/catalogue/products",
          name: "Produk Parfume & Aromaterapi",
        },
        {
          path: "/admin/catalogue/ingredients",
          name: "Bahan Parfume & Aromaterapi",
        },
        {
          path: "/admin/catalogue/lab-tools",
          name: "Alat Laboratorium Skala Mikro",
        },
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
    <div className="flex h-screen bg-brand-800 text-cream transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"} bg-brand-900 text-cream flex flex-col transition-all duration-300 ease-in-out border-r border-border`}
      >
        {/* Logo */}
        <div
          className="h-20 flex items-center justify-center border-b border-border cursor-pointer transition-all duration-300"
          onClick={() => setCollapsed(!collapsed)}
        >
          {logoFooter ? (
            <img
              src={logoFooter}
              alt="Logo"
              className={`transition-all duration-300 object-contain ${collapsed ? "w-12 h-12" : "w-32 h-16"}`}
            />
          ) : (
            <>
              <h1
                className={`font-bold transition-all duration-300 ${collapsed ? "text-3xl tracking-wider" : "text-2xl scale-100"}`}
              >
                A
              </h1>
              {!collapsed && (
                <span className="text-2xl font-bold ml-1 transition-all duration-300">
                  skreative
                </span>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.name} className="dropdown-container relative">
                <button
                  onClick={() => handleDropdownToggle(item.name)}
                  className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg text-cream/90 bg-brand-700 text-cream transition-all duration-200 relative"
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-3 transition-transform duration-300 ${collapsed ? "scale-125" : "scale-100"}`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && item.name}
                  </div>
                  {!collapsed &&
                    (openDropdown === item.name ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    ))}
                </button>

                {/* Dropdown untuk sidebar normal */}
                {openDropdown === item.name && !collapsed && (
                  <div className="pl-8 pt-2 space-y-2">
                    {item.children.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 rounded-lg text-sm border-l-2 transition-colors ${isActive ? "bg-brand-700 text-cream border-brand-400" : "text-cream/80 bg-brand-700/60 text-cream border-transparent"}`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}

                {/* Dropdown untuk sidebar collapsed - muncul di samping */}
                {openDropdown === item.name && collapsed && (
                  <div className="absolute left-full top-0 ml-2 bg-brand-900 border border-border rounded-lg z-50 min-w-[250px]">
                    <div className="p-2 border-b border-border">
                      <span className="text-sm font-semibold text-cream uppercase">
                        {item.name}
                      </span>
                    </div>
                    <div className="p-2 space-y-1">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          onClick={() => setOpenDropdown(null)}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded text-sm transition-colors ${isActive ? "bg-brand-700 text-cream" : "text-cream/80 bg-brand-700/60 text-cream"}`
                          }
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin/homepage"}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg border-l-2 transition-all duration-200 ${isActive ? "bg-brand-700 text-cream border-brand-400" : "text-cream/90 bg-brand-700/60 text-cream border-transparent"}`
                }
              >
                <span
                  className={`mr-3 transition-transform duration-300 ${collapsed ? "scale-125" : "scale-100"}`}
                >
                  {item.icon}
                </span>
                {!collapsed && item.name}
              </NavLink>
            ),
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 transition-all duration-300"
          >
            <FiLogOut
              className={`transition-transform duration-300 ${collapsed ? "scale-150" : "scale-100 mr-3"}`}
            />
            {!collapsed && "Log Out"}
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
