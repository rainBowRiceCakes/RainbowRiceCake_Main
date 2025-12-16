/**
 * @file src/components/common/TopButton01.jsx
 * @description top 버튼 (웹/ 앱 공용)
 * 251216 v1.0.0 sara init 
 */

import "./TopButton01.css";
import { useState, useEffect } from 'react';

export default function TopButton01({ bottomOffset = 18 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!show) return null;

  return (
    <button
      type="button"
      className="topbutton01-button"
      style={{ bottom: bottomOffset }}
      onClick={goTop}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}