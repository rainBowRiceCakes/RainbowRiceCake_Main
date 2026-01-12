/**
 * @file src/components/common/Hamburger01.jsx
 * @description hamburger menu
 * 251217 v1.0.0 sara init 
 */

import { useContext, useEffect } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import './Hamburger01.css';
import HamburgerIcon from './icons/HamburgerIcon';
import { FaXmark } from "react-icons/fa6";

export default function Hamburger01({ navItems, goSection, onClose }) {
  const { t } = useContext(LanguageContext);

  // 햄버거 열렸을 때 뒤 화면 스크롤 방지 + ESC로 닫기
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      {/* 오버레이: 화면 전체 고정 (어디서 열든 현재 뷰포트 기준) */}
      <div
        className="hamburger01-overlay"
        onClick={() => onClose?.()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,.35)",
        }}
      />

      {/* 패널 */}
      <nav className="hamburger01-nav" onClick={(e) => e.stopPropagation()}>
        {/* 상단 닫기 버튼 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--com-gap-md)",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              letterSpacing: "0.14em",
              fontSize: "40px",
              color: "var(--com-color-black)",
              textTransform: "uppercase",
            }}
          >
            MENU
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close menu"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              border: "none",
              background: "transparent",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <FaXmark />
          </button>
        </div>

        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.path || `#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              goSection(item.id, item.path);
              onClose?.(); // 이동 후 메뉴 닫기
            }}
            className="hamburger01-nav-item"
          >
            <div className="hamburger01-nav-icon">
              <HamburgerIcon icon={item.icon} />
            </div>
            <span className="hamburger01-nav-label">{t(item.key)}</span>
          </a>
        ))}
      </nav>
    </>
  );
}