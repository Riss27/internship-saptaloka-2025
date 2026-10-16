// frontend/src/pages/auth/LoginPage.jsx (FINAL)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../hooks/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, Mail, Lock } from "lucide-react";
import Wordmark from "../../components/atoms/brand/Wordmark";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/api/auth/login", formData);
      const { token } = response.data;

      // Gunakan fungsi login dari context
      login(token);
      // Navigasi akan otomatis dilakukan oleh useEffect setelah login berhasil
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-900 text-cream">
      <div className="w-full max-w-md p-8 space-y-8 bg-brand-700 border border-border rounded-lg">
        <div className="text-center">
          <Wordmark size="text-3xl" className="block text-cream mb-6" />
          <h2 className="text-heading-sm text-cream uppercase">Admin Login</h2>
          <p className="mt-2 text-cream/70">Selamat datang kembali!</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-300 bg-red-900/40 border border-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-cream/50"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 text-cream bg-brand-800 border border-border rounded-lg focus:outline-none focus:border-brand-400"
              placeholder="Email"
            />
          </div>

          <div className="relative">
            <Lock
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-cream/50"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 text-cream bg-brand-800 border border-border rounded-lg focus:outline-none focus:border-brand-400"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-cream bg-brand-600 hover:bg-brand-500 focus:outline-none focus:border-brand-400 disabled:bg-brand-800"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <LogIn aria-hidden="true" className="w-4 h-4 mr-2" /> Sign In
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
