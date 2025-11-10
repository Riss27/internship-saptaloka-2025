import React, { forwardRef } from "react";
import { motion } from "framer-motion";

const TopNavbar = forwardRef(({ isVisible }, ref) => {
  const MotionDiv = motion.div;
  const variants = {
    visible: { y: 0 },
    hidden: { y: "-100%" },
  };

  return (
    <MotionDiv variants={variants} animate={isVisible ? "visible" : "hidden"} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed top-0 left-0 right-0 z-50">
      <div ref={ref} className="w-full bg-[#184737] text-white">
        {/* Baris 1: Logo */}
        <div className="flex justify-center py-2 border-b border-white/10">
          <img src="/Assets/asklogo2.png" alt="Ask Logo" className="h-12 object-contain" />
        </div>
        {/* Baris 2: Teks */}
        <div className="flex justify-center py-1 bg-[#0F2626]/50">
          <p className="text-sm tracking-wide">Essential Oil Health and Beauty</p>
        </div>
      </div>
    </MotionDiv>
  );
});

TopNavbar.displayName = "TopNavbar";
export default TopNavbar;
