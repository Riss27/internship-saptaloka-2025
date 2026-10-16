import React, { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Wordmark from "../../atoms/brand/Wordmark";

const TopNavbar = forwardRef(({ isVisible }, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionDiv = motion.div;

  // Sliding the bar away is a large movement, so it is skipped entirely when the
  // reader has asked for reduced motion. The bar simply stays where it is.
  const variants = prefersReducedMotion
    ? { visible: { y: 0 }, hidden: { y: 0 } }
    : {
        visible: { y: 0 },
        hidden: { y: "-100%" },
      };

  return (
    <MotionDiv
      variants={variants}
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeInOut",
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        ref={ref}
        className="w-full bg-brand-700 text-cream border-b border-border"
      >
        {/* The wordmark is decorative here because the main Navbar already carries
            the link back to the home page. On a phone the two stacked bars would
            eat a quarter of the screen, so below the small breakpoint the mark and
            the descriptor share one compact row. */}
        <div className="flex items-center justify-center gap-3 px-4 py-2 sm:py-1">
          <Wordmark size="text-lg sm:text-xl" className="text-cream" />
          <p className="sm:hidden min-w-0 text-[11px] font-medium uppercase leading-tight tracking-[0.12em] text-cream/70 text-center">
            Essential Oil Health and Beauty
          </p>
        </div>
        {/* The brand descriptor sits on a second bar so the two read as one unit. */}
        <div className="hidden sm:flex justify-center px-4 py-1.5 bg-brand-900/50">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/70 text-center">
            Essential Oil Health and Beauty
          </p>
        </div>
      </div>
    </MotionDiv>
  );
});

TopNavbar.displayName = "TopNavbar";
export default TopNavbar;
