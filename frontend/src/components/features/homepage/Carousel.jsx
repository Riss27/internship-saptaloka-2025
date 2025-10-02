import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Mengambil data dari backend
    axios
      .get("http://localhost:3000/api/landing-page")
      .then((response) => {
        setSlides(response.data.data);
      })
      .catch((error) => {
        console.error("Gagal mengambil data landing page:", error);
      });
  }, []);

  // Fungsi untuk pindah ke slide sebelumnya
  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  // Fungsi untuk pindah ke slide berikutnya
  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  // Auto-play carousel
  useEffect(() => {
    if (slides.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000); // Ganti slide setiap 5 detik
      return () => clearInterval(slideInterval);
    }
  }, [current, slides]);

  if (slides.length === 0) {
    return <div className="flex justify-center items-center h-96 bg-slate-800 text-white">Loading Carousel...</div>;
  }

  return (
    <section className="relative w-full h-[85vh] overflow-hidden">
      {/* Tombol Navigasi */}
      <button onClick={prevSlide} className="absolute top-1/2 left-4 z-20 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
        <FiChevronLeft size={28} />
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 z-20 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
        <FiChevronRight size={28} />
      </button>

      {/* Kontainer Slide */}
      <div className="flex transition-transform ease-in-out duration-700 h-full" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
            <img src={`http://localhost:3000${slide.imageUrl}`} alt={slide.heading} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end items-center text-center p-8 md:p-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{slide.heading}</h1>
              <p className="text-lg md:text-xl text-slate-200 max-w-3xl drop-shadow-lg">{slide.paragraph}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indikator Titik */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div key={index} onClick={() => setCurrent(index)} className={`h-3 w-3 rounded-full cursor-pointer transition-all ${current === index ? "bg-white w-6" : "bg-white/50"}`}></div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
