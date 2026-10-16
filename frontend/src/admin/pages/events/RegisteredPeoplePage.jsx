import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Trash2 } from "lucide-react";

const RegisteredPeoplePage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState({ title: "Event", quota: 0 });
  const [registrations, setRegistrations] = useState([]);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `/api/events/${eventId}/registrations`,
      );
      setEvent(response.data.data || { title: "Event", quota: 0 });
      setRegistrations(response.data.data?.EventRegistrations || []);
    } catch (error) {
      console.error("Gagal mengambil data pendaftar:", error);
      // tetap set default biar halaman muncul
      setEvent({ title: "Event", quota: 0 });
      setRegistrations([]);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const deleteRegistration = async (id) => {
    if (window.confirm("Yakin ingin menghapus pendaftar ini?")) {
      try {
        await apiClient.delete(`/api/events/registrations/${id}`);
        fetchEventDetails();
      } catch (error) {
        console.error("Gagal menghapus pendaftar:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-cream break-words">
          Registered People for: {event.title}
        </h1>
        <p className="text-cream/60 mt-1">
          Total pendaftar: {registrations.length} / {event.quota}
        </p>
      </header>

      <div className="bg-brand-800/50 rounded-lg overflow-hidden">
        {/* The table keeps its column widths on a phone and scrolls inside the
            card instead of pushing the whole page sideways. */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-cream/80">
          <thead className="bg-brand-800">
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
                <td colSpan="6" className="p-4 text-center text-cream/60">
                  Belum ada pendaftar
                </td>
              </tr>
            ) : (
              registrations.map((reg, index) => (
                <tr
                  key={reg.id}
                  className="border-b border-border bg-brand-800"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 text-cream font-medium">{reg.name}</td>
                  <td className="p-4">{reg.email}</td>
                  <td className="p-4">{reg.phone}</td>
                  <td className="p-4">
                    <span className="bg-brand-600/40 text-cream px-2 py-1 rounded-full text-xs">
                      {reg.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteRegistration(reg.id)}
                      className="p-2 min-h-11 min-w-11 grid place-items-center text-red-500 text-red-400"
                      title="Hapus pendaftar"
                      aria-label={`Hapus pendaftar ${reg.name}`}
                    >
                      <Trash2 aria-hidden="true" className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegisteredPeoplePage;
