import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", formData);

      // Jika login berhasil, simpan token
      const { token } = response.data;
      localStorage.setItem("authToken", token);

      // Arahkan ke dashboard admin
      navigate("/admin");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
          <p className="mt-2 text-slate-400">Selamat datang kembali!</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 text-sm text-red-300 bg-red-800/50 border border-red-600 rounded-lg">{error}</div>}

          <div className="relative">
            <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 text-white bg-slate-700/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Email"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 text-white bg-slate-700/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-slate-600"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <FiLogIn className="mr-2" /> Sign In
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
