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

/**
   * 커스텀 부드러운 스크롤 함수
   * @param {number} duration - 이동 시간 (ms). 값이 클수록 더 천천히 이동합니다.
   */
  const scrollToTop = (duration = 1000) => {
    const start = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing 함수 적용 (Cubic Out: 목적지에 가까울수록 천천히 멈춤)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, start * (1 - easeOutCubic));

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  if (!show) return null;

  return (
    <button
      type="button"
      className="topbutton01-button"
      style={{ bottom: bottomOffset }}
      onClick={() => scrollToTop(1200)} // 1.2초 동안 천천히 이동
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}