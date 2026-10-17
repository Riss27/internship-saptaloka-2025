import React, { useEffect, useState } from "react";
import apiClient from "../../hooks/apiClient";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import GenericCatalogueList from "../components/catalogue/GenericCatalogueList";
import Pagination from "../../components/molecules/Pagination";
import ConfirmDialog from "../../components/atoms/feedback/ConfirmDialog";
import { useToast } from "../../components/atoms/feedback/ToastProvider";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const CatalogueListPage = ({
  pageTitle,
  itemType,
  apiEndpoint,
  categoryOptions,
}) => {
  const { toast } = useToast();
  const reducedMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
      .get(`/api/${apiEndpoint}`, {
        params: {
          page,
          limit: 12,
          ...(selectedCategory !== "All" && { category: selectedCategory }),
          ...(deferredSearch && { search: deferredSearch }),
          ...(sort && { sort, order }),
        },
      })
      .then((response) => {
        if (!active) return;
        setItems(response.data.data);
        setMeta(response.data.meta || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        console.error(`Gagal mengambil data ${itemType}:`, err);
        setError(`Gagal memuat data ${itemType}. Silakan coba lagi.`);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    apiEndpoint,
    itemType,
    selectedCategory,
    page,
    deferredSearch,
    sort,
    order,
    reloadKey,
  ]);

  // Klik kolom aktif: asc -> desc -> hapus sort.
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

  // Ganti kategori: reset halaman & pilihan.
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
    setSelectedIds([]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/${apiEndpoint}/${deleteTarget.id}`);
      toast.success(`${itemType} berhasil dihapus.`);
      setDeleteTarget(null);
      setSelectedIds((ids) => ids.filter((id) => id !== deleteTarget.id));
      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error(`Gagal menghapus ${itemType}:`, err);
      toast.error(`Gagal menghapus ${itemType}.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const allSelectedOnPage =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  const toggleAll = () => {
    if (allSelectedOnPage) {
      setSelectedIds((ids) =>
        ids.filter((id) => !items.some((item) => item.id === id)),
      );
    } else {
      setSelectedIds((ids) => [
        ...new Set([...ids, ...items.map((item) => item.id)]),
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
      const response = await apiClient.post(`/api/${apiEndpoint}/bulk-delete`, {
        ids: selectedIds,
      });
      const deleted = response.data?.deleted ?? selectedIds.length;
      toast.success(`${deleted} ${itemType} berhasil dihapus.`);
      setSelectedIds([]);
      setShowBulkConfirm(false);
      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error(`Gagal menghapus ${itemType} terpilih:`, err);
      toast.error(`Gagal menghapus ${itemType} terpilih.`);
    } finally {
      setIsBulkDeleting(false);
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
              {pageTitle}
            </h1>
            <p className="text-cream/60 text-lg">
              Tambahkan, edit, atau hapus {itemType}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-cream/70">
                Total {itemType}:{" "}
                <span className="font-semibold text-brand-400">
                  {meta ? meta.total : items.length}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {categoryOptions && (
              <div className="relative w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  aria-label="Filter kategori"
                  className="w-full md:w-56 min-h-11 p-2 bg-brand-800 border border-border text-cream/80 rounded-md focus:outline-none focus:border-brand-400 "
                >
                  <option value="All">Semua Kategori</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Link
              to={`/admin/catalogue/${apiEndpoint}/add`}
              className={`min-h-11 bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-lg font-semibold text-cream no-underline flex items-center whitespace-nowrap transition-all duration-300 ${FOCUS_RING}`}
            >
              <Plus aria-hidden="true" className="w-5 h-5 mr-2" /> Tambah
            </Link>
          </div>
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Cari ${itemType}…`}
            aria-label={`Cari ${itemType}`}
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
            className={`ml-auto min-h-11 px-4 rounded-buttons-outlined border border-border text-sm font-medium text-cream/90 hover:border-brand-400 transition-colors ${FOCUS_RING}`}
          >
            Muat ulang
          </button>
        </div>
      )}

      <main>
        <div className="bg-brand-800/50 rounded-lg overflow-hidden">
          <GenericCatalogueList
            items={items}
            itemType={itemType}
            apiEndpoint={apiEndpoint}
            isLoading={isLoading}
            hasSearch={Boolean(deferredSearch)}
            sort={sort}
            order={order}
            onSort={handleSort}
            selectedIds={selectedIds}
            onToggleSelect={toggleOne}
            allSelectedOnPage={allSelectedOnPage}
            onToggleAll={toggleAll}
            deleteItem={(item) => setDeleteTarget(item)}
          />
        </div>

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
      </main>

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
        title={`Hapus ${itemType}?`}
        message={`Apakah Anda yakin ingin menghapus ${itemType} ini?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

      <ConfirmDialog
        isOpen={showBulkConfirm}
        title="Hapus item terpilih?"
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} ${itemType} ini?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkConfirm(false)}
        loading={isBulkDeleting}
      />
    </div>
  );
};

export default CatalogueListPage;
