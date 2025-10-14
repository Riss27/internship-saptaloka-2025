import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/features/navigation/Navbar";
import Footer from "../components/features/navigation/Footer";

const PublicLayout = () => {
  return (
    <div className="bg-white min-h-screen text-slate-800">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
