import React, { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        ref={ref}
        className="w-full bg-brand-700 text-cream border-b border-border"
      >
        {/* The logo is decorative here because the main Navbar already renders it as the link back to the home page. */}
        {/* On a phone the stacked bars would eat a quarter of the screen, so below
            the small breakpoint the logo and the descriptor share one compact row.
            The logo is width capped because its artwork is wider than it is tall
            and an uncapped logo plus a two-line descriptor overflows a 360px
            viewport. */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 sm:gap-3 sm:py-1">
          <img
            src="/Assets/asklogo2.png"
            alt=""
            aria-hidden="true"
            className="h-7 sm:h-12 w-auto max-w-[6.5rem] sm:max-w-none shrink-0 object-contain"
          />
          <p className="sm:hidden min-w-0 text-[11px] font-medium uppercase leading-tight tracking-wide text-cream/90 text-center">
            Essential Oil Health and Beauty
          </p>
        </div>
        {/* The brand descriptor sits on a second bar so the two are read as one unit. */}
        <div className="hidden sm:flex justify-center px-4 py-1 bg-brand-800/70">
          <p className="text-sm font-medium uppercase tracking-wide text-cream/90 text-center">
            Essential Oil Health and Beauty
          </p>
        </div>
      </div>
    </MotionDiv>
  );
});

TopNavbar.displayName = "TopNavbar";
export default TopNavbar;