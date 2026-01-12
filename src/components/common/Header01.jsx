/**
 * @file src/components/common/Header01.jsx
 * @description header01 jsx
 * 251216 v1.0.0 sara init 
 */

import { useMemo, useRef, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdExitToApp } from "react-icons/md";
import "./header01.css";
import Hamburger01 from "./Hamburger01";
import LanguageToggle from "./LanguageToggle";
import CustomAlertModal from "./CustomAlertModal";
import { LanguageContext } from "../../context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice.js";
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
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "" });

  const location = useLocation();
  const navigate = useNavigate();
  const mainLogo = "/resource/main-logo.png";
  const LoginIcon = "/resource/main-loginIcon.png";

  const dispatch = useDispatch();
  const { isLoggedIn, isAuthChecked } = useSelector((state) => state.auth);

  const onlyTitleList = ["/login", "/mypage"];
  const onlyTitleFlg = onlyTitleList.some((path) => path === location.pathname);

  const hamburgerRef = useRef(null);

  const hamburgerNavItems = useMemo(() => {
    const items = [...NAV_ITEMS_CONFIG];
    if (isLoggedIn) {
      items.push({ id: "mypage", key: "headerMyPage", icon: "mypage", path: "/mypage" });
    }
    return items;
  }, [isLoggedIn]);

  const isMainShow = useMemo(
    () => location.pathname === "/" || location.pathname === "/home",
    [location.pathname]
  );

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
      setAlertModal({ isOpen: true, message: t("logoutSuccess") });
    } catch (error) {
      console.log("Logout failed:", error);
      setAlertModal({ isOpen: true, message: t("logoutFailed") });
    }
  }

  const handleLogoutAlertClose = () => {
    setAlertModal({ isOpen: false, message: "" });
    dispatch(clearAuth());
    navigate("/");
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
                  <img src={mainLogo} alt={t("headerLogoAlt")} className="header01-brand-img" />
                </div>
              </button>
            </div>
          </div>

          <div className="header01-actions-group">
            <LanguageToggle />

            {!onlyTitleFlg && (
              <div className="header01-desktop-links">
                {isLoggedIn ? (
                  <>
                    <button type="button" className="header01-action-button-link" onClick={logout}>
                      {t("headerLogout")}
                    </button>
                    <button
                      type="button"
                      className="header01-action-button-link header01-action-button-link--solid"
                      onClick={() => navigate("/mypage")}
                    >
                      {t("headerMyPage")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="header01-action-button-link"
                    onClick={() => navigate("/login")}
                  >
                    {t("headerLogin")}
                  </button>
                )}
              </div>
            )}

            <div className="header01-mobile-icons-group">
              {!isAuthChecked ? (
                <div style={{ width: "40px" }} />
              ) : isLoggedIn ? (
                <>
                  <Link to="/mypage" className="header01-icon-mypage-btn" onClick={() => setIsOpen(false)}>
                    <img src={LoginIcon} alt={t("headerMyPageIconAlt")} className="header01-login-img" />
                  </Link>
                  <button type="button" className="header01-icon-logout-btn" onClick={logout}>
                    <MdExitToApp className="header01-logout-icon" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="header01-icon-login-btn" onClick={() => setIsOpen(false)}>
                  <img src={LoginIcon} alt={t("headerLoginIconAlt")} className="header01-login-img" />
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
      </header>

      {/* ✅ 여기! motion dropdown 제거하고 Hamburger01을 직접 띄움 */}
      {isOpen && (
        <Hamburger01
          navItems={hamburgerNavItems}
          goSection={goSection}
          onClose={() => setIsOpen(false)}
        />
      )}

      <CustomAlertModal
        isOpen={alertModal.isOpen}
        onClose={handleLogoutAlertClose}
        message={alertModal.message}
      />
    </>
  );
}