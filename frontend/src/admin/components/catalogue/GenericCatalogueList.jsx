import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import API_BASE from "../../../lib/apiBase";

const GenericCatalogueList = ({ items, itemType, deleteItem }) => {
  const editPath = `/admin/catalogue/${itemType}s/edit/`;

  return (
    <div className="bg-brand-700 p-6 rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-cream">
          <thead className="bg-brand-600/30">
            <tr>
              <th className="p-3 font-semibold">No</th>
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-cream/60">
                  No {itemType}s found.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-border bg-brand-600/20 transition-colors duration-200"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img
                      src={`${API_BASE}${item.imageUrl}`}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 object-cover rounded-md border border-border"
                    />
                  </td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.category || "-"}</td>
                  <td className="p-3">
                    Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-3">
                      {/* Tombol Edit */}
                      <Link
                        to={`${editPath}${item.id}`}
                        className="min-h-11 min-w-11 grid place-items-center p-2.5 rounded-full bg-brand-600/30 text-brand-400 hover:bg-brand-600/50 hover:text-cream transition-all duration-200 hover:scale-110"
                        title="Edit Item"
                        aria-label="Edit Item"
                      >
                        <Pencil aria-hidden="true" className="w-5 h-5" />
                      </Link>

                      {/* Tombol Delete */}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="min-h-11 min-w-11 grid place-items-center p-2.5 rounded-full bg-red-700/30 text-red-400 hover:bg-red-700/50 hover:text-red-300 transition-all duration-200 hover:scale-110"
                        title="Delete Item"
                        aria-label="Delete Item"
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
    </div>
  );
};

export default GenericCatalogueList;
