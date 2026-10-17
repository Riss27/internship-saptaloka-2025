import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "../../../components/atoms/feedback/ConfirmDialog";
import ExportCsvButton from "../../components/ExportCsvButton";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";

const RegisteredPeoplePage = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [event, setEvent] = useState({ title: "Event", quota: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `/api/events/${eventId}/registrations`,
      );
      setEvent(response.data.data || { title: "Event", quota: 0 });
      setRegistrations(response.data.data?.EventRegistrations || []);
      setError(null);
    } catch (error) {
      console.error("Gagal mengambil data pendaftar:", error);
      setError("Gagal memuat data pendaftar. Silakan coba lagi.");
      // tetap set default biar halaman muncul
      setEvent({ title: "Event", quota: 0 });
      setRegistrations([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    setIsLoading(true);
    fetchEventDetails();
  }, [fetchEventDetails, reloadKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/events/registrations/${deleteTarget.id}`);
      toast.success("Pendaftar berhasil dihapus.");
      setDeleteTarget(null);
      setReloadKey((key) => key + 1);
    } catch (error) {
      console.error("Gagal menghapus pendaftar:", error);
      toast.error("Gagal menghapus pendaftar.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream break-words">
            Pendaftar event: {event.title}
          </h1>
          <p className="text-cream/60 mt-1">
            Total pendaftar: {registrations.length} / {event.quota}
          </p>
        </div>
        <span
          title={
            registrations.length === 0 ? "Tidak ada data untuk diekspor." : ""
          }
        >
          <ExportCsvButton
            rows={registrations}
            headers={["Nama", "Email", "Acara", "Tanggal daftar"]}
            mapRow={(reg) => [
              reg.name,
              reg.email,
              event.title,
              formatDate(reg.createdAt),
            ]}
            filename={`pendaftar-event-${event.id || eventId}-${new Date().toISOString().slice(0, 10)}.csv`}
            disabled={registrations.length === 0}
            onExported={() => toast.success("Ekspor CSV berhasil diunduh.")}
          />
        </span>
      </header>

      {/* Error state */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex flex-wrap items-center gap-3">
          <div>
            <p className="text-red-400 font-medium">Terjadi kesalahan</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="ml-auto min-h-11 px-4 rounded-buttons-outlined border border-border text-sm font-medium text-cream/90 hover:border-brand-400 transition-colors"
          >
            Muat ulang
          </button>
        </div>
      )}

      <div className="bg-brand-800/50 rounded-lg overflow-hidden">
        {/* The table keeps its column widths on a phone and scrolls inside the
            card instead of pushing the whole page sideways. */}
        <div className="overflow-x-auto" aria-busy={isLoading}>
          <table className="w-full text-left text-cream/80">
          <thead className="bg-brand-800">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Email</th>
              <th className="p-4">Telepon</th>
              <th className="p-4">Peran</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [0, 1, 2, 3].map((row) => (
                <tr key={row} className="border-b border-border bg-brand-800">
                  <td className="p-4">
                    <div className="h-5 w-8 rounded bg-brand-700/40 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-5 w-40 rounded bg-brand-700/40 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-5 w-48 rounded bg-brand-700/40 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-5 w-32 rounded bg-brand-700/40 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-5 w-20 rounded bg-brand-700/40 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-5 w-10 rounded bg-brand-700/40 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-cream/60">
                  Belum ada pendaftar
                </td>
              </tr>
            ) : (
              registrations.map((reg, index) => (
                <tr
                  key={reg.id}
                  className="border-b border-border bg-brand-800 hover:bg-brand-700/60 transition-colors duration-200"
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
                      type="button"
                      onClick={() => setDeleteTarget(reg)}
                      className="min-h-11 min-w-11 grid place-items-center rounded-full text-red-400 bg-red-500/10 hover:bg-red-500/20"
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus pendaftar?"
        message="Yakin ingin menghapus pendaftar ini?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default RegisteredPeoplePage;
