import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // Ambil data dari backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/landing-page")
      .then((response) => setSlides(response.data.data))
      .catch((error) => console.error("Gagal mengambil data landing page:", error));
  }, []);

  // Navigasi slide
  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Auto-play
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [slides, current, nextSlide]);

  if (slides.length === 0) {
    return <div className="flex justify-center items-center h-screen bg-emerald-50/70 text-gray-600">Loading Carousel...</div>;
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Tombol Navigasi */}
      <button onClick={prevSlide} className="absolute top-1/2 left-5 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition">
        <FiChevronLeft size={28} />
      </button>

      <button onClick={nextSlide} className="absolute top-1/2 right-5 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition">
        <FiChevronRight size={28} />
      </button>

      {/* Slide Container */}
      <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
            <img src={`http://localhost:3000${slide.imageUrl}`} alt={slide.heading} className="w-full h-full object-cover" />

            {/* Overlay & Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end items-center text-center p-6 md:p-12">
              <div className="max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{slide.heading}</h1>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed">{slide.paragraph}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indikator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <div key={index} onClick={() => setCurrent(index)} className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${current === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"}`}></div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
