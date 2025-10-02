import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/features/navigation/Navbar";
import Footer from "../components/features/navigation/Footer";

const PublicLayout = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-200">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
