import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Plus, Search } from "lucide-react";
import WorkshopList from "../../components/WorkshopList";
import Pagination from "../../../components/molecules/Pagination";
import ConfirmDialog from "../../../components/atoms/feedback/ConfirmDialog";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const WorkshopPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const [workshops, setWorkshops] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce pencarian; halaman kembali ke 1 tiap kata kunci berubah.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDeferredSearch(searchInput.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    apiClient
      .get("/api/workshops", {
        params: {
          source: "admin",
          page,
          limit: 12,
          ...(deferredSearch && { search: deferredSearch }),
          ...(sort && { sort, order }),
        },
      })
      .then((response) => {
        if (!active) return;
        setWorkshops(response.data.data);
        setMeta(response.data.meta || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Gagal mengambil data workshop:", err);
        setError("Gagal memuat data workshop. Silakan coba lagi.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, deferredSearch, sort, order, reloadKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/workshops/${deleteTarget}`);
      toast.success("Workshop berhasil dihapus.");
      setDeleteTarget(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error("Gagal menghapus workshop:", err);
      toast.error("Gagal menghapus workshop.");
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
              Kelola workshop
            </h1>
            <p className="text-cream/60 text-lg">
              Kelola semua workshop yang menggabungkan beberapa event
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-cream/70">
                Total workshop:{" "}
                <span className="font-semibold text-brand-400">
                  {meta ? meta.total : workshops.length}
                </span>
              </span>
            </div>
          </div>
          <Link
            to="/admin/workshop/add"
            className={`min-h-11 bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-lg font-semibold text-cream no-underline whitespace-nowrap flex items-center justify-center transition-all duration-300 ${FOCUS_RING}`}
          >
            <Plus aria-hidden="true" className="w-5 h-5 mr-2" /> Tambah workshop
          </Link>
        </div>
      </header>

      {/* Search bar + sort */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
            <Search aria-hidden="true" className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari workshop…"
            aria-label="Cari workshop"
            className="w-full min-h-11 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400 text-cream"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-cream/70" htmlFor="workshop-sort">
            Urutkan
          </label>
          <select
            id="workshop-sort"
            value={sort ? `${sort}:${order}` : ""}
            onChange={(e) => {
              const [field, fieldOrder] = e.target.value.split(":");
              const next = new URLSearchParams(searchParams);
              if (field) {
                next.set("sort", field);
                next.set("order", fieldOrder);
              } else {
                next.delete("sort");
                next.delete("order");
              }
              setSearchParams(next, { replace: true });
              setPage(1);
            }}
            className="min-h-11 p-2 bg-brand-800 border border-border text-cream/80 rounded-md focus:outline-none focus:border-brand-400"
          >
            <option value="">Urutan bawaan</option>
            <option value="createdAt:asc">Tanggal dibuat (lama ke baru)</option>
            <option value="createdAt:desc">Tanggal dibuat (baru ke lama)</option>
            <option value="title:asc">Judul (A ke Z)</option>
            <option value="title:desc">Judul (Z ke A)</option>
          </select>
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
            className={`ml-auto min-h-11 px-4 rounded-buttons-outlined border border-border text-sm font-medium text-cream/90 hover:border-brand-400 transition-colors ${FOCUS_RING}`}
          >
            Muat ulang
          </button>
        </div>
      )}

      <main aria-busy={isLoading}>
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="space-y-6"
          >
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="bg-brand-800/50 rounded-lg overflow-hidden flex flex-col md:flex-row"
                aria-hidden="true"
              >
                <div className="w-full md:w-1/3 h-48 md:h-auto bg-brand-700/40 animate-pulse" />
                <div className="p-6 flex-1 space-y-4">
                  <div className="h-7 w-2/3 rounded bg-brand-700/40 animate-pulse" />
                  <div className="h-5 w-full rounded bg-brand-700/40 animate-pulse" />
                  <div className="h-5 w-4/5 rounded bg-brand-700/40 animate-pulse" />
                </div>
              </div>
            ))}
            <span className="sr-only">Memuat workshop…</span>
          </div>
        ) : (
          <WorkshopList
            workshops={workshops}
            deleteWorkshop={(id) => setDeleteTarget(id)}
          />
        )}
      </main>

      {!isLoading && meta && meta.total > 0 && (
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus workshop?"
        message="Apakah Anda yakin ingin menghapus workshop ini?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default WorkshopPage;
