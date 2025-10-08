import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LabToolCard = ({ tool }) => {
  return (
    <div className="bg-[#1A4D3E] rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-emerald-500/20">
      <Link to={`/lab-tools/${tool.id}`} className="block">
        <div className="w-full h-56 overflow-hidden bg-[#0F3A2E]">
          <LazyLoadImage
            alt={tool.name}
            src={`http://localhost:3000${tool.imageUrl}`}
            effect="blur"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230F3A2E' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2334D399'%3ELoading...%3C/text%3E%3C/svg%3E"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230F3A2E' width='400' height='300'/%3E%3Cpath d='M150 100h100v80h-100z' fill='%231A4D3E'/%3E%3Ccircle cx='170' cy='130' r='10' fill='%2334D399'/%3E%3Cpath d='M150 160l30-20 25 15 45-35v60h-100z' fill='%23065F46'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2334D399'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
            wrapperClassName="w-full h-full"
            threshold={100}
          />
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
