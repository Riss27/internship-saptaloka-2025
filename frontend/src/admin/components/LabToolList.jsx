import React from "react";
import { Link } from "react-router-dom";

const LabToolList = ({ labTools, deleteLabTool }) => {
  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full text-left text-white">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {labTools.map((tool) => (
            <tr key={tool.id} className="border-b border-slate-700 hover:bg-slate-800">
              <td className="p-3">
                <img src={`http://localhost:3000${tool.imageUrl}`} alt={tool.name} className="h-12 w-12 object-cover rounded-md" />
              </td>
              <td className="p-3 font-medium">{tool.name}</td>
              <td className="p-3">{tool.category}</td>
              <td className="p-3">Rp {new Intl.NumberFormat("id-ID").format(tool.price)}</td>
              <td className="p-3">
                <Link to={`/catalogue/lab-tools/edit/${tool.id}`} className="text-yellow-400 hover:text-yellow-300 mr-4 no-underline">
                  Edit
                </Link>
                <button onClick={() => deleteLabTool(tool.id)} className="text-red-500 hover:text-red-400 font-semibold">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabToolList;
