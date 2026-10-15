import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ title, description, linkTo }) => {
  return (
    <Link
      to={linkTo}
      className="block bg-brand-800 hover:bg-brand-700 p-5 sm:p-6 md:p-8 rounded-cards text-center border border-border transition-colors h-full flex items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
    >
      <div className="px-2 sm:px-4">
        <h3 className="text-lg sm:text-xl font-medium text-cream mb-2 sm:mb-3 leading-tight uppercase tracking-wide">
          {title}
        </h3>
        {description && (
          <p className="text-cream/80 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;