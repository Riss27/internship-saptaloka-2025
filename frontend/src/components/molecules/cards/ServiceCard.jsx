import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ title, description, linkTo }) => {
  return (
    <Link to={linkTo} className="block bg-emerald-700 hover:bg-emerald-600 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-emerald-600/30 h-full flex items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px]">
      <div className="px-2 sm:px-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 leading-tight">{title}</h3>
        {description && <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">{description}</p>}
      </div>
    </Link>
  );
};

export default ServiceCard;
