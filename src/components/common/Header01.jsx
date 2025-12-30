/**
 * @file src/components/common/Header01.jsx
 * @description header01 jsx
 * 251216 v1.0.0 sara init 
 */

import { useMemo, useRef, useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./header01.css";
import Hamburger01 from "./Hamburger01";
import LanguageToggle from "./LanguageToggle";
import { LanguageContext } from "../../context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from '../../store/slices/authSlice.js';
import { logoutThunk } from "../../store/thunks/authThunk.js";

// 6개 메뉴 설정
const NAV_ITEMS_CONFIG = [
  { id: "plans", key: "navPlans", icon: "info.svg" },
  { id: "branches", key: "navBranches", icon: "search.svg" },
  { id: "fee", key: "navFee", icon: "fee.svg" },
  { id: "support", key: "navSupport", icon: "cs.svg" },
  { id: "partners", key: "navPartners", icon: "ptns.svg" },
];

export default function Header01() {
  const { t } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mainLogo = "/resource/main-logo.png";
  const LoginIcon = "/resource/main-loginIcon.png";
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const onlyTitleList = ['/login', '/mypage'];
  const onlyTitleFlg = onlyTitleList.some(path => path === location.pathname);
  
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

  function redirectSocialLogin() {
    navigate('/login');
  }

  function redirectMypage() {
    navigate('/mypage');
  }

  async function logout() {
    try {
      navigate('/');
      const result = await dispatch(logoutThunk());
      if(result.type.endsWith('/rejected')) {
        throw result.payload;
      }
      dispatch(clearAuth());
    }
    catch(error) {
      console.log(error);
    }
  }

  return (
    <header className="header01-frame">
      <div className="header01-inner-group">
        <div className="header01-left-box">
          <button type="button" className="header01-logo-button" onClick={onLogoClick}>
            <div className="header01-brand-img-container">
              <img src={mainLogo} alt="logo" className="header01-brand-img" />
            </div>
          </button>
        </div>

        <div className="header01-actions-group">
          <LanguageToggle />
            {
              !onlyTitleFlg && (
                <div className="header01-desktop-links">
                {/* 가독성 좋은 삼항 연산자로 변경 */}
                {isLoggedIn ? (
                  <>
                    <button type="button" className="header01-action-button-link" onClick={logout}>
                      {t('headerLogout')}
                    </button>
                    <button type="button" className="header01-action-button-link header01-action-button-link--solid" onClick={redirectMypage}>
                      {t('headerMyPage')}
                    </button>
                  </>
                  ) : (
                    <>
                      <button type="button" className="header01-action-button-link" onClick={redirectSocialLogin}>
                        {t('headerLogin')}
                      </button>
                    </>
                  )} 
                </div>
              )
            }

          <div className="header01-mobile-icons-group">
            {/* 모바일에서도 로그인 여부에 따라 아이콘/동작 분기 처리 */}
            {isLoggedIn ? (
               // 로그인 상태: 클릭 시 로그아웃 실행
               <button type="button" className="header01-icon-login-btn" onClick={logout}>
                  {/* 로그아웃 아이콘이 따로 없다면 기존 아이콘 사용하거나 변경 필요 */}
                  <img src={LoginIcon} alt="logout" className="header01-login-img" />
               </button>
            ) : (
               // 비로그인 상태: 로그인 페이지로 이동
               <Link to="/login" className="header01-icon-login-btn" onClick={() => setIsOpen(false)}>
                 <img src={LoginIcon} alt="login" className="header01-login-img" />
               </Link>
            )}
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