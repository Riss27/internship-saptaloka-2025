// EventPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Plus, Search } from "lucide-react";
import EventList from "../../components/EventList";
import Pagination from "../../../components/molecules/Pagination";
import ConfirmDialog from "../../../components/atoms/feedback/ConfirmDialog";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";

const EventPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const isFirstLoad = useRef(true);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ambil data event (paginated)
  const fetchEvents = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/events`, {
        params: {
          page,
          limit: 12,
          // Search hanya dikirim kalau ada isinya
          ...(deferredSearch && { search: deferredSearch }),
          ...(sort && { sort, order }),
        },
      });
      setEvents(response.data.data);
      setMeta(response.data.meta || null);
      setError(null);
    } catch (error) {
      console.error("Gagal mengambil data event:", error);
      setError("Gagal memuat data event. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [page, deferredSearch, sort, order]);

  // Debounce kata kunci pencarian; reset halaman ke 1 bersamaan dengan
  // kata kunci yang dikirim, supaya tidak do-fetch. Fetch pertama tidak
  // melewati debounce ini karena deferredSearch sudah kosong saat mount.
  useEffect(() => {
    const handler = setTimeout(() => {
      if (isFirstLoad.current) isFirstLoad.current = false;
      else setPage(1);
      setDeferredSearch(searchTerm.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Refetch langsung tiap page/sort/kata kunci berubah
  useEffect(() => {
    setIsLoading(true);
    fetchEvents();
  }, [fetchEvents, reloadKey]);

  // Klik kolom aktif: asc -> desc -> hapus sort
  const handleSort = (key) => {
    const next = new URLSearchParams(searchParams);
    if (sort !== key) {
      next.set("sort", key);
      next.set("order", "asc");
    } else if (order === "asc") {
      next.set("order", "desc");
    } else {
      next.delete("sort");
      next.delete("order");
    }
    setSearchParams(next, { replace: true });
    setPage(1);
  };

  // Hapus event
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/events/${deleteTarget.id}`);
      toast.success("Event berhasil dihapus.");
      setDeleteTarget(null);
      setReloadKey((key) => key + 1);
    } catch (error) {
      console.error("Gagal menghapus event:", error);
      toast.error("Gagal menghapus event.");
    } finally {
      setIsDeleting(false);
    }
  };

  const start = meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const end = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cream mb-2">
              Kelola event
            </h1>
            <p className="text-cream/60 text-lg">
              Kelola semua event yang akan diselenggarakan
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-cream/70">
                Total event:{" "}
                <span className="font-semibold text-brand-400">
                  {meta ? meta.total : events.length}
                </span>
              </span>
            </div>
          </div>
          <Link
            to="/admin/events/add"
            className="min-h-11 bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-lg font-semibold text-cream no-underline whitespace-nowrap flex items-center justify-center transition-all duration-300"
          >
            <Plus aria-hidden="true" className="w-5 h-5 mr-2" /> Tambah event
          </Link>
        </div>
      </header>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
            <Search aria-hidden="true" className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari event…"
            aria-label="Cari event"
            className="w-full md:w-1/3 min-h-11 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400 text-cream"
          />
        </div>
      </div>

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

      {/* Loading state: cegah empty-state berkedip sebelum data datang */}
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-gradient-to-br from-brand-700/60 to-brand-800/60 rounded-xl border border-border flex flex-col items-center justify-center gap-4 py-20"
        >
          <div
            aria-hidden="true"
            className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"
          />
          <p className="text-cream/70 text-sm">Memuat event...</p>
        </div>
      ) : (
        <>
          {/* Render table via EventList */}
          <EventList
            events={events}
            total={meta ? meta.total : events.length}
            hasSearch={Boolean(deferredSearch)}
            sort={sort}
            order={order}
            onSort={handleSort}
            deleteEvent={(event) => setDeleteTarget(event)}
          />

          {meta && meta.total > 0 && (
            <div className="[&_button]:normal-case [&_button]:tracking-normal">
              <Pagination
                meta={meta}
                onPageChange={setPage}
                prevLabel="Sebelumnya"
                nextLabel="Berikutnya"
                itemLabel={`Menampilkan ${start}–${end} dari ${meta.total}`}
              />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus event?"
        message="Apakah Anda yakin ingin menghapus event ini? Semua data pendaftar juga akan terhapus."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default EventPage;
