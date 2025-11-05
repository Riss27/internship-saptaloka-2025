import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ title, description, linkTo }) => {
  return (
    <Link to={linkTo} className="block bg-emerald-700 hover:bg-emerald-600 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-emerald-600/30">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && <p className="text-emerald-100 text-sm">{description}</p>}
    </Link>
  );
};

export default ServiceCard;
