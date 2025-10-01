import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const ServiceCard = ({ title, description, linkTo }) => {
  return (
    <div className="bg-[#1A4D3E] p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-200/80 mb-4 text-sm">{description}</p>
      <Link to={linkTo} className="text-white font-semibold inline-flex items-center group hover:text-green-300 transition-colors duration-300">
        Learn More
        <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default ServiceCard;
