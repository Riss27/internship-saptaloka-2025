import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  House,
  LayoutDashboard,
  LayoutGrid,
  Info,
  FileText,
  Image as ImageIcon,
  LogOut,
  Menu,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Wordmark from "../components/atoms/brand/Wordmark";

const AdminLayout = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  // Below md the sidebar sits off-canvas and is opened from the header bar.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  // The collapsed rail only exists at md and up. If the window is resized past
  // that breakpoint while the rail is collapsed, drop the state so the mobile
  // drawer keeps its full-width menu and inline submenus.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleBreakpoint = () => {
      if (!mq.matches) setCollapsed(false);
    };
    mq.addEventListener("change", handleBreakpoint);
    return () => mq.removeEventListener("change", handleBreakpoint);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin",
      name: "Dashboard",
      icon: <LayoutDashboard aria-hidden="true" className="w-4 h-4" />,
    },
    {
      path: "/admin/homepage",
      name: "Homepage",
      icon: <House aria-hidden="true" className="w-4 h-4" />,
    },
    {
      path: "/admin/events",
      name: "Events",
      icon: <Calendar aria-hidden="true" className="w-4 h-4" />,
    },
    {
      path: "/admin/workshop",
      name: "Workshop",
      icon: <Briefcase aria-hidden="true" className="w-4 h-4" />,
    },
    {
      name: "Catalogue",
      icon: <LayoutGrid aria-hidden="true" className="w-4 h-4" />,
      children: [
        {
          path: "/admin/catalogue/products",
          name: "Products",
        },
        {
          path: "/admin/catalogue/ingredients",
          name: "Ingredients",
        },
        {
          path: "/admin/catalogue/lab-tools",
          name: "Lab Tools",
        },
      ],
    },
    {
      path: "/admin/about",
      name: "About",
      icon: <Info aria-hidden="true" className="w-4 h-4" />,
    },
    {
      path: "/admin/articles",
      name: "Articles",
      icon: <FileText aria-hidden="true" className="w-4 h-4" />,
    },
    {
      path: "/admin/gallery",
      name: "Gallery",
      icon: <ImageIcon aria-hidden="true" className="w-4 h-4" />,
    },
  ];

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="flex h-screen bg-brand-800 text-cream transition-all duration-300">
      {/* Sidebar. On phones and small tablets it is an off-canvas drawer so the
          content keeps the full width; from md up it is the static rail it has
          always been. */}
      <aside
        id="admin-sidebar"
        className={`w-64 ${collapsed ? "md:w-20" : "md:w-64"} bg-brand-900 text-cream flex flex-col transition-all duration-300 ease-in-out border-r border-border fixed inset-y-0 left-0 z-40 md:static md:z-auto ${mobileNavOpen ? "translate-x-0 visible" : "-translate-x-full invisible md:translate-x-0 md:visible"}`}
      >
        {/* Brand lockup. Collapsing the rail only exists from md up, where the
            rail has room; below that the sidebar is the off-canvas drawer. */}
        <button
          type="button"
          className="hidden md:flex h-20 items-center justify-center border-b border-border cursor-pointer transition-all duration-300 hover:bg-brand-800 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          <Wordmark
            size={collapsed ? "text-lg" : "text-xl"}
            className="text-cream"
          />
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.name} className="dropdown-container relative">
                <button
                  onClick={() => handleDropdownToggle(item.name)}
                  className="w-full min-h-11 flex justify-between items-center px-4 py-2.5 rounded-lg text-cream/90 bg-brand-700 text-cream transition-all duration-200 relative"
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
                      <ChevronUp aria-hidden="true" />
                    ) : (
                      <ChevronDown aria-hidden="true" className="w-4 h-4" />
                    ))}
                </button>

                {/* Dropdown untuk sidebar normal */}
                {openDropdown === item.name && !collapsed && (
                  <div className="pl-8 pt-2 space-y-2">
                    {item.children.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        onClick={() => setMobileNavOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center min-h-11 px-4 py-2 rounded-lg text-sm border-l-2 transition-colors ${isActive ? "bg-brand-700 text-cream border-brand-400" : "text-cream/80 bg-brand-700/60 text-cream border-transparent"}`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}

                {/* Dropdown untuk sidebar collapsed - muncul di samping */}
                {openDropdown === item.name && collapsed && (
                  <div className="hidden md:block absolute left-full top-0 ml-2 bg-brand-900 border border-border rounded-lg z-50 min-w-[250px]">
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
                end={item.path === "/admin"}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center min-h-11 px-4 py-2.5 rounded-lg border-l-2 transition-all duration-200 ${isActive ? "bg-brand-700 text-cream border-brand-400" : "text-cream/90 bg-brand-700/60 text-cream border-transparent"}`
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
            className="flex items-center justify-center w-full min-h-11 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 transition-all duration-300"
          >
            <LogOut
              aria-hidden="true"
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "scale-150" : "scale-100 mr-3"}`}
            />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      {/* Scrim for the off-canvas drawer: tapping outside closes it. */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-brand-900/70 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Drawer trigger. Below md the sidebar lives off-canvas, so this bar
            carries the menu button and the brand. */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open sidebar menu"
            aria-expanded={mobileNavOpen}
            aria-controls="admin-sidebar"
            className="h-11 w-11 grid place-items-center rounded-lg text-cream hover:bg-brand-700 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
          <Wordmark size="text-lg" className="text-cream" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
