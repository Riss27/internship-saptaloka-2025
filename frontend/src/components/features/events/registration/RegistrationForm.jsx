import React, { useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiChevronDown, FiUsers } from "react-icons/fi";

const RegistrationForm = ({ eventId, participantRoles }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: participantRoles[0] || "Umum",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(`http://localhost:3000/api/events/${eventId}/register`, formData);
      setMessage({ type: "success", text: "Pendaftaran berhasil! Terima kasih telah mendaftar." });
      setFormData({ name: "", email: "", phone: "", role: participantRoles[0] || "Umum" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (message.type === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-center">
        <p className="font-semibold">Pendaftaran Berhasil!</p>
        <p className="text-sm">{message.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.type === "error" && <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">{message.text}</div>}

      <div className="relative">
        <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
        />
      </div>

      <div className="relative">
        <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          type="email"
          name="email"
          placeholder="Alamat Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
        />
      </div>

      <div className="relative">
        <FiPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          type="tel"
          name="phone"
          placeholder="Nomor Telepon"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
        />
      </div>

      <div className="relative">
        <FiUsers className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <select name="role" value={formData.role} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-10 appearance-none focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800">
          {participantRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
        {isLoading ? "Mengirim..." : "Daftar Sekarang"}
      </button>
    </form>
  );
};

export default RegistrationForm;
