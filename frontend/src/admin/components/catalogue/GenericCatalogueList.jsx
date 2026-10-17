import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import API_BASE from "../../../lib/apiBase";
import SortableHeader from "../SortableHeader";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const GenericCatalogueList = ({
  items,
  itemType,
  apiEndpoint,
  deleteItem,
  isLoading = false,
  hasSearch = false,
  sort = "",
  order = "desc",
  onSort,
  selectedIds = [],
  onToggleSelect,
  allSelectedOnPage = false,
  onToggleAll,
}) => {
  const editPath = `/admin/catalogue/${apiEndpoint}/edit/`;
  const headerCheckboxRef = useRef(null);

  // Indeterminate: sebagian (bukan semua) item halaman ini terpilih.
  useEffect(() => {
    if (headerCheckboxRef.current) {
      const selectedOnPage = items.filter((item) =>
        selectedIds.includes(item.id),
      ).length;
      headerCheckboxRef.current.indeterminate =
        selectedOnPage > 0 && selectedOnPage < items.length;
    }
  }, [items, selectedIds]);

  return (
    <div className="overflow-x-auto" aria-busy={isLoading}>
      <table className="w-full text-left text-cream">
        <thead className="bg-brand-800">
          <tr className="border-b border-border">
            <th className="p-4 w-12">
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                checked={allSelectedOnPage}
                onChange={onToggleAll}
                disabled={isLoading || items.length === 0}
                aria-label="Pilih semua item di halaman ini"
                className="h-5 w-5 rounded accent-brand-500"
              />
            </th>
            <th className="p-4 font-semibold">No</th>
            <th className="p-4 font-semibold">Gambar</th>
            <SortableHeader
              label="Judul"
              sortKey="name"
              activeSort={sort}
              order={order}
              onSort={onSort}
            />
            <th className="p-4 font-semibold">Kategori</th>
            <SortableHeader
              label="Harga"
              sortKey="price"
              activeSort={sort}
              order={order}
              onSort={onSort}
            />
            <th className="p-4 font-semibold text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [0, 1, 2, 3].map((row) => (
              <tr
                key={row}
                className="border-b border-border bg-brand-800/50"
              >
                <td className="p-4">
                  <div className="h-5 w-5 rounded bg-brand-700/40 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-5 w-8 rounded bg-brand-700/40 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-5 w-16 rounded bg-brand-700/40 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-5 w-40 rounded bg-brand-700/40 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-5 w-24 rounded bg-brand-700/40 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-5 w-20 rounded bg-brand-700/40 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-5 w-24 rounded bg-brand-700/40 animate-pulse" />
                </td>
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-6 text-cream/60">
                {hasSearch
                  ? `Tidak ditemukan ${itemType} yang cocok.`
                  : `Tidak ada ${itemType} yang ditemukan.`}
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-border bg-brand-800/50 hover:bg-brand-700/60 transition-colors duration-200 ${
                  selectedIds.includes(item.id) ? "bg-brand-700/60" : ""
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleSelect?.(item.id)}
                    aria-label={`Pilih ${item.name}`}
                    className="h-5 w-5 rounded accent-brand-500"
                  />
                </td>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  <img
                    src={`${API_BASE}${item.imageUrl}`}
                    alt={item.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 object-cover rounded-md border border-border"
                  />
                </td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.category || "-"}</td>
                <td className="p-4">
                  Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center gap-3">
                    {/* Tombol Edit */}
                    <Link
                      to={`${editPath}${item.id}`}
                      title="Edit"
                      aria-label={`Edit ${item.name}`}
                      className={`min-h-11 min-w-11 grid place-items-center p-2.5 rounded-full bg-brand-600/30 text-brand-400 hover:bg-brand-600/50 hover:text-cream transition-all duration-200 hover:scale-110 ${FOCUS_RING}`}
                    >
                      <Pencil aria-hidden="true" className="w-5 h-5" />
                    </Link>

                    {/* Tombol Delete */}
                    <button
                      type="button"
                      onClick={() => deleteItem(item)}
                      title="Hapus"
                      aria-label={`Hapus ${item.name}`}
                      className={`min-h-11 min-w-11 grid place-items-center rounded-full text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200 ${FOCUS_RING}`}
                    >
                      <Trash2 aria-hidden="true" className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenericCatalogueList;
