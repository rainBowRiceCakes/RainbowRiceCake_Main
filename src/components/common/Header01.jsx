/**
 * @file src/components/common/Header01.jsx
 * @description 헤더
 * 251216 v1.0.0 sara init 
 */

/**
 * HEADER01 (COM)
 * - LOGO 클릭: 변화 없음
 * - LOGIN 클릭: 로그인 페이지 이동
 * - MyPage 클릭: 내 정보 화면 이동
 */

const NAV_ITEMS = [
  { id: "info", label: "서비스 소개" },
  { id: "fee", label: "지점안내/요금안내" },
  { id: "deliverys", label: "배송현황" },
  { id: "cs", label: "고객센터" },
  { id: "partners", label: "제휴문의" },
];


import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header01.css";
import MainlogoImg from "../../assets/main-logo..png";

export default function Header01() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const isHome = useMemo(
    () => location.pathname === "/" || location.pathname === "/home",
    [location.pathname]
  );

  // 라우트 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (e) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  const toggleMenu = (e) => {
    e?.stopPropagation?.();
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  const goSection = (sectionId) => {
    // 홈이 아니면 홈으로 이동하면서 hash 전달 → Home에서 스크롤
    if (!isHome) {
      navigate(`/#${sectionId}`);
      return;
    }

    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  };

  const onLogoClick = () => {
    navigate("/");
    closeMenu();
  };

  return (
    <header className="header01-frame" ref={headerRef}>
      <div className="header01-inner-group">
        {/* Left: Logo */}
        <button
          type="button"
          className="header01-logo-button"
          onClick={onLogoClick}
          aria-label="Go Home"
        >
          <div className="header01-brand-img">
            {/* ✅ 텍스트 대신 이미지 태그 추가 */}
            <img src={MainlogoImg} alt="logo" /> 
          </div>
        </button>

        {/* Center: Nav (Desktop) */}
        <nav className="header01-nav-desktop" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="header01-nav-link-button"
              onClick={() => goSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="header01-actions-group">
          <Link to="/login" className="header01-action-button-link" onClick={closeMenu}>
            LOGIN
          </Link>
          <Link
            to="/mypage"
            className="header01-action-button-link header01-action-button-link--solid"
            onClick={closeMenu}
          >
            MyPage
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="header01-hamburger-button"
            onClick={toggleMenu}
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="header-01-mobile"
          >
            <span className="header01-bar" />
            <span className="header01-bar" />
            <span className="header01-bar" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div
          id="header-01-mobile"
          className="header01-mobile-dropdown-frame"
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="header01-mobile-inner-group">
            <div className="header01-mobile-title-text">Explore</div>

            <div className="header01-mobile-list-group">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="header01-mobile-item-button"
                  onClick={() => goSection(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="header01-mobile-actions-group">
              <Link to="/login" className="header01-mobile-action-button-link" onClick={closeMenu}>
                LOGIN
              </Link>
              <Link
                to="/mypage"
                className="header01-mobile-action-button-link header01-mobile-action-button-link--solid"
                onClick={closeMenu}
              >
                MyPage
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}