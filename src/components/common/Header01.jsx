/**
 * @file src/components/common/Header01.jsx
 * @description 헤더 컴포넌트
 * 251216 v1.0.0 sara init 
 */

/**
 * HEADER01 (COM)
 * - LOGO 클릭: 로고 클릭 시 홈 상단으로 이동
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


import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header01.css";
import MainlogoImg from "../../assets/main-logo..png";

export default function Header01() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);

// 현재 위치가 모든 섹션이 모여있는 'MainShow'(/)인지 확인
  const isMainShow = useMemo(
    () => location.pathname === "/",
    [location.pathname]
  );

  const toggleMenu = (e) => {
    e?.stopPropagation?.();
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  /**
   * @description 섹션 이동 로직
   * MainShow(/)가 아니면 메인으로 이동 후 해당 섹션 id로 스크롤
   */
  const goSection = (sectionId) => {
    if (!isMainShow) {
      navigate(`/#${sectionId}`);
      return;
    }

    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  };

  // ✅ 로고 클릭 시 메인(MainShow)의 최상단으로 이동
  const onLogoClick = () => {
    if (isMainShow) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
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
          aria-label="Go MainShow"
        >
          <div className="header01-brand-img">
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

          <button
            type="button"
            className="header01-hamburger-button"
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            <span className="header01-bar" />
            <span className="header01-bar" />
            <span className="header01-bar" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div id="header-01-mobile" className="header01-mobile-dropdown-frame">
          <div className="header01-mobile-inner-group">
            <div className="header01-mobile-title-text">Explore Main</div>
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
              <Link to="/mypage" className="header01-mobile-action-button-link header01-mobile-action-button-link--solid" onClick={closeMenu}>
                MyPage
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}