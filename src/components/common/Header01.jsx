/**
 * @file src/components/common/Header01.jsx
 * @description header01 jsx
 * 251216 v1.0.0 sara init 
 */

import { useMemo, useRef, useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./header01.css";
import MainlogoImg from "../../assets/main-logo.png";
import LoginIcon from "../../assets/resource/main-loginIcon.png";
import Hamburger01 from "./Hamburger01";
import LanguageToggle from "../../hooks/useLanguageToggle";
import { LanguageContext } from "../../context/LanguageContext";

// 6개 메뉴 설정
const NAV_ITEMS_CONFIG = [
  { id: "info", key: "navServiceIntro", icon: "info.svg" },
  { id: "search", key: "navBranchInfo", icon: "search.svg" },
  { id: "fee", key: "navFeeInfo", icon: "fee.svg" },
  { id: "dlvs", key: "navDeliveryStatus", icon: "dlvs.svg" },
  { id: "cs", key: "navCustomerCenter", icon: "cs.svg" },
  { id: "ptns", key: "navPartnershipInquiry", icon: "ptns.svg" },
];

export default function Header01() {
  const { t } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // [중요] 드롭다운 영역과 햄버거 버튼 영역을 각각 참조하기 위한 ref
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isMainShow = useMemo(() => location.pathname === "/" || location.pathname === "/home", [location.pathname]);

  // [핵심 수정] 강력한 외부 클릭 감지 로직
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // 메뉴가 열려있고,
      if (isOpen && 
          // 클릭한 곳이 드롭다운 메뉴 내부가 아니고,
          dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          // 클릭한 곳이 햄버거 버튼 자체도 아닐 때만 닫음
          hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    // 마우스를 누르는 순간 감지
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]); // isOpen 상태가 변할 때마다 리스너 업데이트

  // 메뉴 토글 함수
  const toggleMenu = (e) => {
    // 이벤트 전파 중단 (부모 요소로 클릭 이벤트가 퍼지는 것 방지)
    e?.stopPropagation?.();
    setIsOpen((prev) => !prev);
  };

  // 섹션 이동 및 메뉴 닫기 함수
  const goSection = (sectionId) => {
    if (!isMainShow) {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false); 
  };

  const onLogoClick = () => {
    if (isMainShow) window.scrollTo({ top: 0, behavior: "smooth" });
    else navigate("/");
    setIsOpen(false);
  };

  return (
    <header className="header01-frame">
      <div className="header01-inner-group">
        <div className="header01-left-box">
          <button type="button" className="header01-logo-button" onClick={onLogoClick}>
            <div className="header01-brand-img-container">
              <img src={MainlogoImg} alt="logo" className="header01-brand-img" />
            </div>
          </button>
        </div>

        <div className="header01-actions-group">
          <LanguageToggle />
          <div className="header01-desktop-links">
            <Link to="/login" className="header01-action-button-link" onClick={() => setIsOpen(false)}>{t('headerLogin')}</Link>
            <Link to="/mypage" className="header01-action-button-link header01-action-button-link--solid" onClick={() => setIsOpen(false)}>{t('headerMyPage')}</Link>
          </div>

          <div className="header01-mobile-icons-group">
            <Link to="/login" className="header01-icon-login-btn" onClick={() => setIsOpen(false)}>
              <img src={LoginIcon} alt="login" className="header01-login-img" />
            </Link>
            {/* [중요] 햄버거 버튼에 ref 연결 */}
            <button 
              ref={hamburgerRef}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={dropdownRef} // [중요] 드롭다운 영역에 ref 연결
            className="header01-mobile-dropdown-frame"
            initial={{ x: "100%" }} // 오른쪽에서 등장
            animate={{ x: 0 }}
            exit={{ x: "100%" }} // 오른쪽으로 퇴장
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="header01-mobile-inner-group">
              <div className="header01-mobile-header">
                <div className="header01-mobile-title-text">{t('headerMenuTitle')}</div>
                {/* 닫기 버튼 */}
                <button className="header01-close-btn" onClick={() => setIsOpen(false)}>✕</button>
              </div>
              {/* Hamburger01에 설정값과 이동 함수 전달 */}
              <Hamburger01 navItems={NAV_ITEMS_CONFIG} goSection={goSection} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}