import React, { useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import apiClient from "../../../hooks/apiClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Ambil data slide dari backend
  useEffect(() => {
    apiClient
      .get("/api/landing-page")
      .then((res) => setSlides(res.data.data))
      .catch((err) => console.error("Gagal memuat data:", err));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Auto slide tiap 6 detik. Bergeser sendiri adalah gerak berulang, jadi
  // autoslide dimatikan ketika pembaca meminta reduced motion.
  useEffect(() => {
    if (slides.length > 1 && !prefersReducedMotion) {
      const timer = setInterval(nextSlide, 6000);
      return () => clearInterval(timer);
    }
  }, [slides.length, nextSlide, prefersReducedMotion]);

  if (slides.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col justify-center items-center gap-4 min-h-[60vh] bg-brand-900 text-cream/80"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-lg">Loading Carousel...</p>
      </div>
    );
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      className="relative w-full min-h-[60vh] h-[calc(100svh-var(--public-header-height,180px))] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 z-20 h-16 sm:h-20 bg-gradient-to-b from-brand-900/80 to-transparent flex items-center justify-end px-6 sm:px-12 lg:px-20 gap-3">
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-cream/80 mr-auto">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Show the previous slide"
          className={`h-11 w-11 grid place-items-center text-cream/80 hover:text-cream border border-cream/40 hover:border-cream rounded-full transition-colors ${FOCUS_RING}`}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Show the next slide"
          className={`h-11 w-11 grid place-items-center text-cream/80 hover:text-cream border border-cream/40 hover:border-cream rounded-full transition-colors ${FOCUS_RING}`}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Container slide */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => {
          // Hanya slide yang sedang tampil boleh dibaca pembaca layar, sehingga
          // halaman ini tetap punya tepat satu judul tingkat satu.
          const isActive = index === current;
          const Heading = isActive ? "h1" : "div";

          return (
            <div
              key={index}
              aria-hidden={!isActive}
              className="min-w-full h-full flex-shrink-0 relative"
            >
              <img
                src={`${API_BASE}${slide.imageUrl}`}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Teks */}
              <div className="absolute inset-0 flex flex-col justify-end items-start text-left px-6 sm:px-12 lg:px-20 pb-20 sm:pb-28">
                <Heading className="text-3xl sm:text-5xl lg:text-6xl font-medium text-cream mb-4 uppercase leading-[0.9] max-w-4xl">
                  {slide.heading}
                </Heading>
                <div className="w-16 border-t border-dashed border-cream/40 mb-4" />
                <p className="text-base sm:text-xl lg:text-2xl text-cream/90 max-w-3xl font-normal">
                  {slide.paragraph}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicator */}
      {/* Each dot keeps a 44px touch target, so a long slide list cannot be laid
          out as one row on a phone. The row scrolls inside its own track instead
          of widening the page. */}
      <div className="absolute bottom-6 left-0 right-0 sm:left-12 sm:right-auto lg:left-20 z-20">
        <div className="flex items-center gap-1 overflow-x-auto px-6 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show slide ${index + 1} of ${slides.length}`}
              aria-current={index === current ? "true" : undefined}
              className={`h-11 min-w-11 shrink-0 grid place-items-center px-1 ${FOCUS_RING}`}
            >
              <span
                aria-hidden="true"
                className={`block h-0.5 transition-all duration-300 motion-reduce:transition-none ${
                  index === current
                    ? "w-12 bg-cream"
                    : "w-6 bg-cream/50 hover:bg-cream/80"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
