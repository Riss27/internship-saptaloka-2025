import React, { useState, useEffect, useCallback, useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
// The lint config does not track JSX usage, so the motion import looks unused.
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import apiClient from "../../../hooks/apiClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE, DURATION } from "../../../lib/motion";
import API_BASE from "../../../lib/apiBase";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

// The counter is editorial, so the digits are padded to a fixed width and set
// with tabular figures. That way the number never shifts sideways as the slides
// change.
const pad = (n) => String(n).padStart(2, "0");

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);

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

  // The photograph drifts up slightly as the reader scrolls the hero away. The
  // image is drawn taller than its frame and pulled up by half that excess, so
  // there is always overscan above and below and the frame never shows a gap.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const slideShift = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  if (slides.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col justify-center items-center gap-4 min-h-[60vh] bg-brand-900 text-cream/80"
      >
        <div className="w-12 h-12 rounded-full border-2 border-border border-t-brand-400 animate-spin motion-reduce:animate-none"></div>
        <p className="text-body">Loading Carousel...</p>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      className="relative h-[calc(100svh-var(--public-header-height,180px))] min-h-[32rem] w-full overflow-hidden bg-brand-900 sm:min-h-[36rem]"
    >
      {/* Container slide */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
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
              className="relative h-full w-full min-w-full shrink-0"
            >
              <motion.img
                src={`${API_BASE}${slide.imageUrl}`}
                alt=""
                style={prefersReducedMotion ? undefined : { y: slideShift }}
                className="absolute left-0 top-[-6%] h-[112%] w-full object-cover"
              />

              {/* Two scrims rather than one, so the lockup keeps its contrast on
                  a bright photograph without flattening the whole image. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/45 to-transparent"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-brand-900/70 to-transparent"
              />

              {/* The lockup sits low and hard left, so the hero opens on the
                  photograph and the words arrive underneath it. */}
              <motion.div
                key={`${index}-lockup`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.panel, ease: EASE }}
                className="absolute inset-x-0 bottom-0 px-6 pb-36 sm:px-12 sm:pb-28 lg:max-w-4xl lg:px-10 lg:pb-20 lg:pr-56"
              >
                <Heading className="text-display uppercase text-cream">
                  {slide.heading}
                </Heading>
                <div
                  className="my-6 w-16 border-t border-dashed border-cream/40"
                  aria-hidden="true"
                />
                <p className="max-w-2xl text-voice text-cream/90">
                  {slide.paragraph}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Counter, indicators and arrows share one row that is pinned to the
          bottom edge. They live outside the slide track so they stay put while
          the photographs move. */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 sm:left-12 lg:left-10 lg:right-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <p
            aria-hidden="true"
            className="text-meta tabular-nums text-cream/70"
          >
            {pad(current + 1)}
            <span className="px-1.5 text-cream/40">/</span>
            {pad(slides.length)}
          </p>

          {/* Each indicator keeps a 44px touch target, so a long slide list
              cannot be laid out as one row on a phone. The row scrolls inside its
              own track instead of widening the page. */}
          <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Show slide ${index + 1} of ${slides.length}`}
                aria-current={index === current ? "true" : undefined}
                className={`grid h-11 min-w-11 shrink-0 place-items-center px-1 ${FOCUS_RING}`}
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Show the previous slide"
            className={`grid h-11 w-11 place-items-center rounded-full border border-cream/40 text-cream/80 transition-colors hover:border-cream hover:text-cream ${FOCUS_RING}`}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Show the next slide"
            className={`grid h-11 w-11 place-items-center rounded-full border border-cream/40 text-cream/80 transition-colors hover:border-cream hover:text-cream ${FOCUS_RING}`}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;