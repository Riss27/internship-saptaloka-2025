import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";
import { Plus, Pencil, Search, Trash2 } from "lucide-react";
import API_BASE from "../../../lib/apiBase";
import Pagination from "../../../components/molecules/Pagination";
import SortableHeader from "../../components/SortableHeader";
import ConfirmDialog from "../../../components/atoms/feedback/ConfirmDialog";
import { useToast } from "../../../components/atoms/feedback/ToastProvider";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const ArticlePage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const [articles, setArticles] = useState([]);
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
      .get("/api/articles", {
        params: {
          page,
          limit: 12,
          ...(deferredSearch && { search: deferredSearch }),
          ...(sort && { sort, order }),
        },
      })
      .then((response) => {
        if (!active) return;
        setArticles(response.data.data);
        setMeta(response.data.meta || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Gagal mengambil data artikel:", err);
        setError("Gagal memuat data artikel. Silakan coba lagi.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, deferredSearch, sort, order, reloadKey]);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/articles/${deleteTarget.id}`);
      toast.success("Artikel berhasil dihapus.");
      setDeleteTarget(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error("Gagal menghapus artikel:", err);
      toast.error("Gagal menghapus artikel.");
    } finally {
      setIsDeleting(false);
    }
  };

  const start = meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const end = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cream">Kelola artikel</h1>
          <p className="text-cream/60 mt-1">
            Buat, edit, atau hapus artikel untuk website.
          </p>
        </div>

        {/* Add Button */}
        <Link
          to="/admin/articles/add"
          className={`inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-cream bg-brand-600 hover:bg-brand-500 transition-all duration-200 ${FOCUS_RING}`}
        >
          <Plus aria-hidden="true" className="w-5 h-5" />
          Tambah artikel
        </Link>
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
            placeholder="Cari artikel…"
            aria-label="Cari artikel"
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

      {/* Main Table */}
      <main>
        <div className="bg-brand-800/50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto" aria-busy={isLoading}>
            <table className="w-full text-left text-cream/80">
              <thead className="bg-brand-800">
                <tr className="border-b border-border">
                  <th className="p-4 font-semibold">Gambar</th>
                  <SortableHeader
                    label="Judul"
                    sortKey="title"
                    activeSort={sort}
                    order={order}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Penulis"
                    sortKey="author"
                    activeSort={sort}
                    order={order}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Tanggal terbit"
                    sortKey="publishedAt"
                    activeSort={sort}
                    order={order}
                    onSort={handleSort}
                  />
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  [0, 1, 2, 3].map((row) => (
                    <tr
                      key={row}
                      className="border-b border-border bg-brand-800"
                    >
                      <td className="p-4">
                        <div className="h-5 w-32 rounded bg-brand-700/40 animate-pulse" />
                      </td>
                      <td className="p-4">
                        <div className="h-5 w-48 rounded bg-brand-700/40 animate-pulse" />
                      </td>
                      <td className="p-4">
                        <div className="h-5 w-28 rounded bg-brand-700/40 animate-pulse" />
                      </td>
                      <td className="p-4">
                        <div className="h-5 w-28 rounded bg-brand-700/40 animate-pulse" />
                      </td>
                      <td className="p-4">
                        <div className="h-5 w-24 rounded bg-brand-700/40 animate-pulse" />
                      </td>
                    </tr>
                  ))}

                {!isLoading &&
                  articles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-border bg-brand-800 hover:bg-brand-700/60 transition-colors duration-200"
                    >
                      <td className="p-4 align-middle">
                        <img
                          src={`${API_BASE}${article.featuredImageUrl}`}
                          alt={article.title}
                          className="h-16 w-32 object-cover rounded-md border-2 border-border"
                        />
                      </td>
                      <td className="p-4 align-middle font-medium text-cream">
                        {article.title}
                      </td>
                      <td className="p-4 align-middle">{article.author}</td>
                      <td className="p-4 align-middle">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 align-middle text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="min-h-11 min-w-11 grid place-items-center p-2.5 rounded-full bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-all duration-200"
                            title="Edit"
                            aria-label={`Edit artikel ${article.title}`}
                          >
                            <Pencil aria-hidden="true" className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(article)}
                            className="min-h-11 min-w-11 grid place-items-center rounded-full text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
                            title="Hapus"
                            aria-label={`Hapus artikel ${article.title}`}
                          >
                            <Trash2 aria-hidden="true" className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!isLoading && articles.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-6 text-center text-cream/70 italic"
                    >
                      {deferredSearch
                        ? `Tidak ditemukan artikel yang cocok dengan "${deferredSearch}".`
                        : "Belum ada artikel yang ditambahkan."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus artikel?"
        message="Apakah Anda yakin ingin menghapus artikel ini?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default ArticlePage;
