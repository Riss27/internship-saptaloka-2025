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
        {/* This bar states what the business is; the wordmark itself lives in the
            main Navbar below. Showing the mark in both places read as a mistake
            rather than as emphasis, and it made the header taller for nothing. */}
        <p className="px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-cream/70 sm:text-[11px]">
          Essential Oil Health and Beauty
        </p>
      </div>
    </MotionDiv>
  );
});

TopNavbar.displayName = "TopNavbar";
export default TopNavbar;
