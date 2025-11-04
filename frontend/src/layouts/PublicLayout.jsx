import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components/organisms/navigation";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
