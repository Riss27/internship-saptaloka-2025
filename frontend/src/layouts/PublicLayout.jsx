import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
// The lint config does not track JSX usage, so the motion imports look unused.
 
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Navbar, Footer, TopNavbar } from "../components/organisms/navigation";
import { pageTransition } from "../lib/motion";

// The header is two bars stacked together: the branding TopNavbar and the main
// Navbar. We measure both and publish the result as CSS custom properties so any
// sticky or fixed element inside a public page can clear the real height
// instead of hard-coding a guess.
const STICKY_GUTTER = 24;

const PublicLayout = () => {
  const topNavRef = useRef(null);
  const mainNavRef = useRef(null);
  const [isTopVisible, setIsTopVisible] = useState(true);
  const [paddingTop, setPaddingTop] = useState(0);
  const [topNavHeight, setTopNavHeight] = useState(0);
  const [mainNavHeight, setMainNavHeight] = useState(0);

  // The route pathname keys the page transition, so navigating fades the old
  // page out before the new one arrives instead of swapping them instantly.
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // Every navigation starts at the top. Without this the browser restores the
  // previous scroll position and a route change looks like a glitch.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const updateHeights = () => {
      const topH = topNavRef.current?.clientHeight || 0;
      const mainH = mainNavRef.current?.clientHeight || 0;
      setTopNavHeight(topH);
      setMainNavHeight(mainH);
      setPaddingTop(topH + mainH);
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  useEffect(() => {
    if (topNavHeight === 0) return;

    const handleScroll = () => {
      setIsTopVisible(window.scrollY < topNavHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [topNavHeight]);

  // A sticky element only starts pinning once the reader has scrolled, which is
  // also the moment the TopNavbar has already slid away. So sticky offsets track
  // the collapsed main Navbar plus a gutter, while --public-header-height keeps
  // the full combined height for anything that needs to clear both bars.
  const layoutVars = {
    "--public-header-height": `${paddingTop}px`,
    "--public-nav-height": `${mainNavHeight}px`,
    "--public-sticky-offset": `${mainNavHeight + STICKY_GUTTER}px`,
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-brand-900 text-cream"
      style={layoutVars}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-buttons-outlined focus:bg-brand-600 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:uppercase focus:tracking-wide focus:text-cream"
      >
        Skip to main content
      </a>

      <TopNavbar ref={topNavRef} isVisible={isTopVisible} />
      <Navbar
        ref={mainNavRef}
        isTopNavbarVisible={isTopVisible}
        topNavbarHeight={topNavHeight}
      />
      <main
        id="main-content"
        style={{ paddingTop: `${paddingTop}px` }}
        className="flex-grow"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            {...pageTransition(prefersReducedMotion)}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
