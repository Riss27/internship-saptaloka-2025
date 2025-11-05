import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // Ambil data slide dari backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/landing-page")
      .then((res) => setSlides(res.data.data))
      .catch((err) => console.error("Gagal memuat data:", err));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Auto slide tiap 6 detik
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, 6000);
      return () => clearInterval(timer);
    }
  }, [slides.length, nextSlide]);

  if (slides.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading Carousel...
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Tombol navigasi */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-10 z-30 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transform -translate-y-1/2"
      >
        <FiChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-10 z-30 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transform -translate-y-1/2"
      >
        <FiChevronRight size={32} />
      </button>

      {/* Container slide */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full flex-shrink-0 relative"
          >
            <img
              src={`http://localhost:3000${slide.imageUrl}`}
              alt={slide.heading}
              className="w-full h-full object-cover"
            />

            {/* Teks */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-12 bg-black/20">
              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-md">
                {slide.heading}
              </h1>
              <p className="text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                {slide.paragraph}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-10 bg-white"
                : "w-6 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;


