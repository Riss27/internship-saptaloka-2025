import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ title, description, linkTo }) => {
  return (
    <Link
      to={linkTo}
      className="block bg-[#1A4D3E] p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-xl hover:bg-[#206656]"
    >
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-200/80 mb-1 text-sm">{description}</p>
    </Link>
  );
};

export default ServiceCard;
