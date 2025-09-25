import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiDownload } from "react-icons/fi";

const RegisteredPeoplePage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState({ title: "Event", quota: 0 });
  const [registrations, setRegistrations] = useState([]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events/${eventId}`);
      setEvent(response.data.data || { title: "Event", quota: 0 });
      setRegistrations(response.data.data?.EventRegistrations || []);
    } catch (error) {
      console.error("Gagal mengambil data pendaftar:", error);
      // tetap set default biar halaman muncul
      setEvent({ title: "Event", quota: 0 });
      setRegistrations([]);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const deleteRegistration = async (id) => {
    if (window.confirm("Yakin ingin menghapus pendaftar ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/events/registrations/${id}`);
        fetchEventDetails();
      } catch (error) {
        console.error("Gagal menghapus pendaftar:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Registered People for: {event.title}</h1>
        <p className="text-slate-400 mt-1">
          Total pendaftar: {registrations.length} / {event.quota}
        </p>
      </header>

      <div className="bg-slate-800/50 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-slate-400">
                  Belum ada pendaftar
                </td>
              </tr>
            ) : (
              registrations.map((reg, index) => (
                <tr key={reg.id} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 text-white font-medium">{reg.name}</td>
                  <td className="p-4">{reg.email}</td>
                  <td className="p-4">{reg.phone}</td>
                  <td className="p-4">
                    <span className="bg-blue-600/50 text-blue-300 px-2 py-1 rounded-full text-xs">{reg.role}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => deleteRegistration(reg.id)} className="p-2 text-red-500 hover:text-red-400">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredPeoplePage;
