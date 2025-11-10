import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer, TopNavbar } from "../components/organisms/navigation";

const PublicLayout = () => {
  const topNavRef = useRef(null);
  const mainNavRef = useRef(null);
  const [isTopVisible, setIsTopVisible] = useState(true);
  const [paddingTop, setPaddingTop] = useState(0);
  const [topNavHeight, setTopNavHeight] = useState(0);

  useEffect(() => {
    const updateHeights = () => {
      const topH = topNavRef.current?.clientHeight || 0;
      const mainH = mainNavRef.current?.clientHeight || 0;
      setTopNavHeight(topH);
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

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar ref={topNavRef} isVisible={isTopVisible} />
      <Navbar ref={mainNavRef} isTopNavbarVisible={isTopVisible} topNavbarHeight={topNavHeight} />
      <main style={{ paddingTop: `${paddingTop}px` }} className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
