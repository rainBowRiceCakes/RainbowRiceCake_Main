/**
 * @file src/components/common/Header01.jsx
 * @description header01 jsx
 * 251216 v1.0.0 sara init 
 */

import { useMemo, useRef, useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MdExitToApp } from "react-icons/md";
import "./header01.css";
import Hamburger01 from "./Hamburger01";
import LanguageToggle from "./LanguageToggle";
import CustomAlertModal from "./CustomAlertModal"; // Import the custom modal
import { LanguageContext } from "../../context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from '../../store/slices/authSlice.js';
import { logoutThunk } from "../../store/thunks/authThunk.js";

// 6개 메뉴 설정
const NAV_ITEMS_CONFIG = [
  { id: "intro", key: "navIntro", icon: "info" },
  { id: "plans", key: "navPlans", icon: "plans" },
  { id: "branches", key: "navBranches", icon: "search" },
  { id: "support", key: "navSupport", icon: "cs" },
  { id: "promotion", key: "navPromotion", icon: "promotion" },
  { id: "partners", key: "navPartners", icon: "ptns" },
];

export default function Header01() {
  const { t } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' }); // State for custom modal
  const location = useLocation();
  const navigate = useNavigate();
  const mainLogo = "/resource/main-logo.png";
  const LoginIcon = "/resource/main-loginIcon.png";
  const dispatch = useDispatch();
  const { isLoggedIn, isAuthChecked } = useSelector(state => state.auth);
  const onlyTitleList = ['/login', '/mypage'];
  const onlyTitleFlg = onlyTitleList.some(path => path === location.pathname);

  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const hamburgerNavItems = useMemo(() => {
    const items = [
      ...NAV_ITEMS_CONFIG,
    ];
    if (isLoggedIn) {
      items.push({ id: "mypage", key: "headerMyPage", icon: "mypage", path: "/mypage" });
    }
    return items;
  }, [isLoggedIn]);

  const isMainShow = useMemo(() => location.pathname === "/" || location.pathname === "/home", [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen &&
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
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

  const goSection = (sectionId, path) => {
    if (path) {
      navigate(path);
    } else if (!isMainShow) {
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

  async function logout() {
    try {
      await dispatch(logoutThunk());
      setAlertModal({ isOpen: true, message: t('logoutSuccess') });
    } catch (error) {
      console.log('Logout failed:', error);
      setAlertModal({ isOpen: true, message: t('logoutFailed') });
    }
  }

  const handleLogoutAlertClose = () => {
    setAlertModal({ isOpen: false, message: '' });
    dispatch(clearAuth());
    navigate('/');
    setIsOpen(false);
  };

  return (
    <>
      <header className="header01-frame">
        <div className="header01-inner-group">
          <div className="header01-left-box">
            <div className="header01-logo-wrapper">
              <button type="button" className="header01-logo-button" onClick={onLogoClick}>
                <div className="header01-brand-img-container">
                  <img src={mainLogo} alt={t('headerLogoAlt')} className="header01-brand-img" />
                </div>
              </button>
            </div>
          </div>

          <div className="header01-actions-group">
            <LanguageToggle />
            {
              !onlyTitleFlg && (
                <div className="header01-desktop-links">
                  {/* 이제 isAuthChecked를 기다리지 않고 isLoggedIn 값에 따라 바로 그립니다. */}
                  {isLoggedIn ? (
                    <>
                      <button type="button" className="header01-action-button-link" onClick={logout}>
                        {t('headerLogout')}
                      </button>
                      <button type="button" className="header01-action-button-link header01-action-button-link--solid" onClick={() => navigate('/mypage')}>
                        {t('headerMyPage')}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="header01-action-button-link" onClick={() => navigate('/login')}>
                      {t('headerLogin')}
                    </button>
                  )}
                </div>
              )}

            <div className="header01-mobile-icons-group">
              {!isAuthChecked ? (
                <div style={{ width: '40px' }}></div> // 인증 확인 전까지 아이콘 자리를 비워둠
              ) : isLoggedIn ? (
                <>
                  <Link to="/mypage" className="header01-icon-mypage-btn" onClick={() => setIsOpen(false)}>
                    <img src={LoginIcon} alt={t('headerMyPageIconAlt')} className="header01-login-img" />
                  </Link>
                  <button type="button" className="header01-icon-logout-btn" onClick={logout}>
                    <MdExitToApp className="header01-logout-icon" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="header01-icon-login-btn" onClick={() => setIsOpen(false)}>
                  <img src={LoginIcon} alt={t('headerLoginIconAlt')} className="header01-login-img" />
                </Link>
              )}
              <button
                ref={hamburgerRef}
                type="button"
                className={`header01-hamburger-button ${isOpen ? "is-active" : ""}`}
                onClick={toggleMenu}
              >
                <span className="header01-bar header01-hamburger-bar1" />
                <span className="header01-bar header01-hamburger-bar2" />
                <span className="header01-bar header01-hamburger-bar3" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              className="header01-mobile-dropdown-frame"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="header01-mobile-inner-group">
                <div className="header01-mobile-header">
                  <div className="header01-mobile-title-text">{t('headerMenuTitle')}</div>
                  <button className="header01-close-btn" onClick={() => setIsOpen(false)}>{t('footerCloseX')}</button>
                </div>
                <Hamburger01 navItems={hamburgerNavItems} goSection={goSection} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CustomAlertModal
        isOpen={alertModal.isOpen}
        onClose={handleLogoutAlertClose}
        message={alertModal.message}
      />
    </>
  );
}