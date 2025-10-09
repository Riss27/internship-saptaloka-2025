import React from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const GenericCatalogueList = ({ items, itemType, deleteItem }) => {
  const editPath = `/admin/catalogue/${itemType}s/edit/`;

  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-md backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead className="bg-white/20">
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
                <td colSpan="6" className="text-center p-4 text-slate-400">
                  No {itemType}s found.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-700 hover:bg-white/5 transition-colors duration-200">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img src={`http://localhost:3000${item.imageUrl}`} alt={item.name} className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 object-cover rounded-md border border-slate-700" />
                  </td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.category || "-"}</td>
                  <td className="p-3">Rp {new Intl.NumberFormat("id-ID").format(item.price)}</td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-3">
                      {/* Tombol Edit */}
                      <Link to={`${editPath}${item.id}`} className="p-2.5 rounded-full bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 transition-all duration-200 hover:scale-110" title="Edit Item">
                        <FiEdit size={18} />
                      </Link>

                      {/* Tombol Delete */}
                      <button onClick={() => deleteItem(item.id)} className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 hover:scale-110" title="Delete Item">
                        <FiTrash2 size={18} />
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
