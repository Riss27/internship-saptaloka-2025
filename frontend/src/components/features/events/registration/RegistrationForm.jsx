import React, { useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiChevronDown, FiUsers } from "react-icons/fi";
import { useLanguage } from "../../../../context/useLanguage";

const RegistrationForm = ({ eventId, participantRoles }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: participantRoles[0] || (language === 'id' ? 'Umum' : 'General'),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(`http://localhost:3000/api/events/${eventId}/register`, formData);
      
      const successMessage = language === 'id' 
        ? 'Pendaftaran berhasil! Terima kasih telah mendaftar.' 
        : 'Registration successful! Thank you for registering.';
      
      setMessage({ type: "success", text: successMessage });
      
      // Kosongkan form setelah berhasil
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        role: participantRoles[0] || (language === 'id' ? 'Umum' : 'General')
      });
    } catch (error) {
      // Ambil pesan error dari backend atau gunakan default
      const backendMessage = error.response?.data?.message;
      const defaultError = language === 'id' 
        ? 'Terjadi kesalahan. Silakan coba lagi.' 
        : 'An error occurred. Please try again.';
      
      setMessage({ 
        type: "error", 
        text: backendMessage || defaultError 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Jika pendaftaran sudah berhasil, tampilkan pesan saja
  if (message.type === "success") {
    return (
      <div className="bg-green-800/50 border border-green-600 text-green-300 p-4 rounded-lg text-center">
        <p className="font-semibold">
          {language === 'id' ? 'Pendaftaran Berhasil!' : 'Registration Successful!'}
        </p>
        <p className="text-sm">{message.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tampilkan pesan error jika ada */}
      {message.type === "error" && (
        <div className="bg-red-800/50 border border-red-600 text-red-300 p-3 rounded-lg text-sm">
          {message.text}
        </div>
      )}

      {/* Input Name */}
      <div className="relative">
        <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          name="name"
          placeholder={language === 'id' ? 'Nama Lengkap' : 'Full Name'}
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-cyan-500 outline-none text-white placeholder-slate-400"
        />
      </div>

      {/* Input Email */}
      <div className="relative">
        <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          type="email"
          name="email"
          placeholder={language === 'id' ? 'Alamat Email' : 'Email Address'}
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-cyan-500 outline-none text-white placeholder-slate-400"
        />
      </div>

      {/* Input Phone */}
      <div className="relative">
        <FiPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          type="tel"
          name="phone"
          placeholder={language === 'id' ? 'Nomor Telepon' : 'Phone Number'}
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-cyan-500 outline-none text-white placeholder-slate-400"
        />
      </div>

      {/* Select Role */}
      <div className="relative">
        <FiUsers className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          required 
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 pl-10 appearance-none focus:ring-2 focus:ring-cyan-500 outline-none text-white"
        >
          {participantRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      <button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading 
          ? (language === 'id' ? 'Mengirim...' : 'Submitting...') 
          : (language === 'id' ? 'Daftar Sekarang' : 'Register Now')
        }
      </button>
    </form>
  );
};

export default RegistrationForm;