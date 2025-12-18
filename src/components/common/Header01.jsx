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

import { useMemo, useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header01.css";
import MainlogoImg from "../../assets/main-logo.png";
import LoginIcon from "../../assets/resource/main-loginIcon.png";

const NAV_ITEMS = [
  { id: "info", label: "서비스 소개" },
  { id: "search", label: "지점 안내" },
  { id: "fee", label: "요금 안내" },
  { id: "dlvs", label: "배송 현황" },
  { id: "cs", label: "고객 센터" },
  { id: "ptns", label: "제휴 문의" },
];

export default function Header01() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const isMainShow = useMemo(() => location.pathname === "/", [location.pathname]);

  // 외부 클릭 시 닫기 로직
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && headerRef.current && !headerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const toggleMenu = (e) => {
    e?.stopPropagation?.();
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

const goSection = (sectionId) => {
    if (!isMainShow) {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeMenu();
  };

  const onLogoClick = () => {
    if (isMainShow) window.scrollTo({ top: 0, behavior: "smooth" });
    else navigate("/");
    closeMenu();
  };

  return (
    <header className="header01-frame" ref={headerRef}>
      <div className="header01-inner-group">
        {/* 1. Left: Logo */}
        <div className="header01-left-box">
          <button type="button" className="header01-logo-button" onClick={onLogoClick}>
            <div className="header01-brand-img">
              <img src={MainlogoImg} alt="logo" />
            </div>
          </button>
        </div>

        {/* 2. Right: Actions */}
        <div className="header01-actions-group">
          {/* 웹 화면 (900px 이상) */}
          <div className="header01-desktop-links">
            <button className="header01-lang-button">EN</button>
            <div className="header01-divider-v" />
            <button className="header01-lang-button">KO</button>
            <Link to="/login" className="header01-action-button-link">LOGIN</Link>
            <Link to="/mypage" className="header01-action-button-link header01-action-button-link--solid">MyPage</Link>
          </div>

          {/* 모바일 화면 (900px 미만) */}
          <div className="header01-mobile-icons-group">
          {/* 요청하신 로그인 아이콘 전용 컨테이너 (70x40) */}
          <div className="mainshow-header-login-box">
            <Link to="/login" className="header01-icon-login-btn">
              <img src={LoginIcon} alt="login-icon" className="header01-login-img" />
            </Link>
          </div>

            <button
              type="button"
              className={`header01-hamburger-button ${isOpen ? "is-active" : ""}`}
              onClick={toggleMenu}
            >
              <span className="header01-bar" />
              <span className="header01-bar" />
              <span className="header01-bar" />
            </button>
          </div>
        </div>
      </div>
        
        {/* Mobile dropdown: 여기에 6개 섹션 dot 메뉴 포함 */}
        {isOpen && (
          <div className="header01-mobile-dropdown-frame">
            <div className="header01-mobile-inner-group">
              <div className="header01-mobile-title-text">Menu</div>
              
              {/* 6개 섹션 이동 메뉴 */}
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

              <div className="header01-mobile-divider" />
            </div>
          </div>
        )}
    </header>
  );
}