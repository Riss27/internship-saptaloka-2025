import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import API_BASE from "../../../lib/apiBase";
import Pagination from "../../../components/molecules/Pagination";
import ConfirmDialog from "../../../components/atoms/feedback/ConfirmDialog";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";
import ReorderButtons from "../../components/ReorderButtons";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const GalleryPage = () => {
  const { toast } = useToast();
  const reducedMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const [images, setImages] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

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
      .get("/api/gallery", {
        params: {
          page,
          limit: 12,
          ...(deferredSearch && { search: deferredSearch }),
          ...(sort && { sort, order }),
        },
      })
      .then((response) => {
        if (!active) return;
        setImages(response.data.data);
        setMeta(response.data.meta || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Gagal mengambil data galeri:", err);
        setError("Gagal memuat data galeri. Silakan coba lagi.");
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
      await apiClient.delete(`/api/gallery/${deleteTarget.id}`);
      toast.success("Gambar berhasil dihapus.");
      setDeleteTarget(null);
      setSelectedIds((ids) => ids.filter((id) => id !== deleteTarget.id));
      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error("Gagal menghapus gambar:", err);
      toast.error("Gagal menghapus gambar.");
    } finally {
      setIsDeleting(false);
    }
  };

  const allSelectedOnPage =
    images.length > 0 && images.every((img) => selectedIds.includes(img.id));

  const toggleAll = () => {
    if (allSelectedOnPage) {
      setSelectedIds((ids) =>
        ids.filter((id) => !images.some((img) => img.id === id)),
      );
    } else {
      setSelectedIds((ids) => [
        ...new Set([...ids, ...images.map((img) => img.id)]),
      ]);
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length > 100) {
      toast.error("Maksimal 100 item per penghapusan massal.");
      return;
    }
    setIsBulkDeleting(true);
    try {
      const response = await apiClient.post("/api/gallery/bulk-delete", {
        ids: selectedIds,
      });
      const deleted = response.data?.deleted ?? selectedIds.length;
      toast.success(`${deleted} gambar berhasil dihapus.`);
      setSelectedIds([]);
      setShowBulkConfirm(false);
      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error("Gagal menghapus gambar terpilih:", err);
      toast.error("Gagal menghapus gambar terpilih.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Ambil daftar id global (urutan bawaan, tanpa search/sort) agar
  // penyimpanan urutan tidak merusak urutan di luar halaman aktif.
  const fetchAllImageIds = async () => {
    const ids = [];
    let currentPage = 1;
    let totalPages = 1;
    do {
      const response = await apiClient.get("/api/gallery", {
        params: { page: currentPage, limit: 100 },
      });
      ids.push(...(response.data.data || []).map((img) => img.id));
      totalPages = response.data.meta?.totalPages || 1;
      currentPage += 1;
    } while (currentPage <= totalPages);
    return ids;
  };

  // Geser posisi optimistik di state lokal, lalu simpan urutan penuh ke server.
  const moveImage = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    const previous = images;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    try {
      const globalIds = await fetchAllImageIds();
      const movedIds = [images[index].id, images[target].id];
      const positions = movedIds
        .map((id) => globalIds.indexOf(id))
        .filter((pos) => pos !== -1);
      if (positions.length === 2) {
        const [a, b] = positions;
        [globalIds[a], globalIds[b]] = [globalIds[b], globalIds[a]];
      }
      await apiClient.patch("/api/gallery/order", {
        ids: globalIds,
      });
      toast.success("Urutan diperbarui.");
      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error("Gagal memperbarui urutan:", err);
      setImages(previous);
      toast.error("Gagal memperbarui urutan.");
    }
  };

  const start = meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const end = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div>
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-cream">Kelola galeri</h1>
        <Link
          to="/admin/gallery/add"
          className={`flex min-h-11 items-center gap-2 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-md font-semibold text-cream no-underline ${FOCUS_RING}`}
        >
          <Plus aria-hidden="true" className="w-5 h-5" />
          Tambah gambar
        </Link>
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
            placeholder="Cari gambar…"
            aria-label="Cari gambar"
            className="w-full min-h-11 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400 text-cream"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-cream/70" htmlFor="gallery-sort">
            Urutkan
          </label>
          <select
            id="gallery-sort"
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
            <option value="createdAt:asc">Tanggal (lama ke baru)</option>
            <option value="createdAt:desc">Tanggal (baru ke lama)</option>
            <option value="id:asc">ID (kecil ke besar)</option>
            <option value="id:desc">ID (besar ke kecil)</option>
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10"
          >
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                className="bg-brand-800 rounded-lg overflow-hidden"
                aria-hidden="true"
              >
                <div className="h-48 w-full bg-brand-700/40 animate-pulse" />
                <div className="p-3">
                  <div className="h-5 w-3/4 rounded bg-brand-700/40 animate-pulse" />
                </div>
              </div>
            ))}
            <span className="sr-only">Memuat gambar…</span>
          </div>
        ) : images.length === 0 ? (
          <p className="text-cream/60 text-center py-12">
            {deferredSearch
              ? `Tidak ditemukan gambar yang cocok dengan "${deferredSearch}".`
              : "Belum ada gambar di galeri."}
          </p>
        ) : (
          <>
            {/* Bulk toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex min-h-11 items-center gap-2 text-sm text-cream/80">
                <input
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={toggleAll}
                  aria-label="Pilih semua gambar di halaman ini"
                  className="h-5 w-5 rounded accent-brand-500"
                />
                Pilih semua di halaman ini
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`bg-brand-800 rounded-lg overflow-hidden transition-colors ${
                    selectedIds.includes(image.id) ? "bg-brand-700/60" : ""
                  }`}
                >
                  <img
                    src={`${API_BASE}${image.imageUrl}`}
                    alt={image.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <label className="inline-flex min-h-11 items-center gap-2 text-cream/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(image.id)}
                          onChange={() => toggleOne(image.id)}
                          aria-label={`Pilih gambar ${image.title}`}
                          className="h-5 w-5 rounded accent-brand-500"
                        />
                        <span className="sr-only">Pilih</span>
                      </label>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/gallery/edit/${image.id}`}
                          className="min-h-11 min-w-11 grid place-items-center p-2 bg-yellow-600 hover:bg-yellow-700 rounded-full text-cream"
                          title="Edit judul"
                          aria-label={`Edit judul ${image.title}`}
                        >
                          <Pencil aria-hidden="true" className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(image)}
                          className="min-h-11 min-w-11 grid place-items-center rounded-full text-red-400 bg-red-500/10 hover:bg-red-500/20"
                          title="Hapus gambar"
                          aria-label={`Hapus gambar ${image.title}`}
                        >
                          <Trash2 aria-hidden="true" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-cream font-semibold truncate">
                      {image.title}
                    </p>
                    <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2">
                      <span className="text-meta text-cream/50">
                        Posisi {index + 1}
                      </span>
                      <ReorderButtons
                        isFirst={index === 0}
                        isLast={index === images.length - 1}
                        onMove={(delta) => moveImage(index, delta)}
                        itemName={image.title}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
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

      {/* Bulk selection bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 bottom-4 md:left-auto md:right-6 z-40 rounded-cards border border-border bg-brand-700 px-4 py-3 flex items-center justify-between gap-4"
          >
            <span aria-live="polite" className="text-sm text-cream/90">
              {selectedIds.length} dipilih
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className={`min-h-11 px-4 rounded-buttons-outlined border border-border text-sm font-medium text-cream/90 hover:border-brand-400 transition-colors ${FOCUS_RING}`}
              >
                Batalkan pilihan
              </button>
              <button
                type="button"
                onClick={() => setShowBulkConfirm(true)}
                className={`min-h-11 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-semibold text-cream inline-flex items-center gap-2 transition-colors ${FOCUS_RING}`}
              >
                <Trash2 aria-hidden="true" className="w-4 h-4" />
                Hapus terpilih
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus gambar?"
        message="Apakah Anda yakin ingin menghapus gambar ini?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

      <ConfirmDialog
        isOpen={showBulkConfirm}
        title="Hapus gambar terpilih?"
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} gambar ini?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkConfirm(false)}
        loading={isBulkDeleting}
      />
    </div>
  );
};

export default GalleryPage;
