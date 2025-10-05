import React from "react";
import { FiX } from "react-icons/fi";

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Konten Popup */}
      <div
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header Popup */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
            <FiX size={20} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Popup;
