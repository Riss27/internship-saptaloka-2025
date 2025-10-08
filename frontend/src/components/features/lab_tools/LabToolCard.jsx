import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LabToolCard = ({ tool }) => {
  return (
    <div className="bg-[#1A4D3E] rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-emerald-500/20">
      <Link to={`/lab-tools/${tool.id}`} className="block">
        <div className="w-full h-56 overflow-hidden">
          <LazyLoadImage alt={tool.name} src={`http://localhost:3000${tool.imageUrl}`} effect="blur" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-[#E6F4F1] mt-2 truncate group-hover:text-emerald-300 transition-colors" title={tool.name}>
            {tool.name}
          </h3>
          <p className="text-emerald-400 font-semibold mt-1">Rp {new Intl.NumberFormat("id-ID").format(tool.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default LabToolCard;
