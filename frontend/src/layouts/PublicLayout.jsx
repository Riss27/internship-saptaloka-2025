import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar, Footer, TopNavbar } from "../components/organisms/navigation";

// The header is two bars stacked together: the branding TopNavbar and the main
// Navbar. We measure both and publish the result as CSS custom properties so any
// sticky or fixed element inside a public page can clear the real height
// instead of hard-coding a guess.
const STICKY_GUTTER = 24;

// First paint cannot wait for the measurement pass, so the layout reserves the
// static header height up front: TopNavbar 28px (py-2 8+8 padding + ~12px
// 10px/normal line, border excluded) + main Navbar 60px (py-2 8+8 nav padding
// + 44px control row) = 88px. The useEffect below overwrites it with the
// measured value, so the correction is a ~0px shift instead of a jump from 0.
const INITIAL_HEADER_HEIGHT = 88;

const PublicLayout = () => {
  const topNavRef = useRef(null);
  const mainNavRef = useRef(null);
  const [isTopVisible, setIsTopVisible] = useState(true);
  const [paddingTop, setPaddingTop] = useState(INITIAL_HEADER_HEIGHT);
  const [topNavHeight, setTopNavHeight] = useState(0);
  const [mainNavHeight, setMainNavHeight] = useState(0);

  const location = useLocation();

  // Every navigation starts at the top. Without this the browser restores the
  // previous scroll position and a route change looks like a glitch.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // useLayoutEffect, not useEffect: the header height has to be correct in
  // the very first paint. An effect runs after the browser has already drawn,
  // so the page painted with the estimated 88px and then jumped to the
  // measured height - a layout shift on every load.
  useLayoutEffect(() => {
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
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
