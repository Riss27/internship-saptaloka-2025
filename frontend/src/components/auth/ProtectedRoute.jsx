import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  // Tampilkan loading state saat AuthContext masih memeriksa token
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Jika sudah selesai loading dan ternyata tidak login, "tendang" ke /login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan halaman yang seharusnya (halaman admin)
  return <Outlet />;
};

export default ProtectedRoute;
