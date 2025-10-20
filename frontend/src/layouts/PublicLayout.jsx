import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/features/navigation/Navbar";
import Footer from "../components/features/navigation/Footer";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-emerald-50/70 text-slate-800">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
