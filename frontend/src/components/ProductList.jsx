import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // Pastikan Link diimpor

const ProductList = ({ products, handleDelete }) => {
  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-md backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/20 text-white">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-slate-400">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id} className="border-b border-slate-700 hover:bg-white/5">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-2">
                      {/* PERUBAHAN ADA DI BARIS INI */}
                      <Link to={`/catalogue/edit/${product.id}`}>
                        <button className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-md">
                          <FiEdit size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-md"
                      >
                        <FiTrash2 size={16} />
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

export default ProductList;