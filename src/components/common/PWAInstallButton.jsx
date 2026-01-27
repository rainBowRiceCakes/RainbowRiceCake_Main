/**
 * @file src/components/common/PWAInstallButton.jsx
 * @description PWA Install Button UI (Refined Monochrome Design)
 * 251228 v1.0.0 sara init
 * 260113 v2.0.0 sara update
 * 260127 v3.0.0 sara update pwa persist "later" dismissal
 */

import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import './PWAInstallButton.css';
import { FaXmark } from 'react-icons/fa6';

const DismissKey = "pwaInstallDismiss";

const PWAInstallButton = () => {
  const { t } = useContext(LanguageContext);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const MainLogo = "/resource/main-logo.png";

  const getDismissed = () => {
    try {
      return localStorage.getItem(DismissKey) === "true";
    } catch (err) {
      console.error("[PWA] failed to read dismiss flag:", err);
      return false;
    }
  };

  const setDismissed = () => {
    try {
      localStorage.setItem(DismissKey, "true");
    } catch (err) {
      console.error("[PWA] failed to persist dismiss flag:", err);
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      if (getDismissed()) return;

      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    let choice;
    try {
      choice = await deferredPrompt.userChoice;
    } catch (err) {
      console.error("[PWA] userChoice failed:", err);
      // userChoice에서 에러가 나도, 사용자가 흐름을 닫았을 수 있으니 재노출 방지 처리
      setDismissed();
      setDeferredPrompt(null);
      setIsVisible(false);
      return;
    }

    // accepted / dismissed 상관없이: 한 번 선택했으면 다음부터 안 뜨게
    console.log("[PWA] install choice:", choice);
    setDismissed();

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    // X / 오버레이 클릭도 "나중에"로 간주 → 다음부터 안 뜨게
    setDismissed();
    setIsVisible(false);
  };

  const handleLater = () => {
    setDismissed();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-install-overlay" onClick={handleClose}>
      <div className="pwa-install-container" onClick={(e) => e.stopPropagation()}>
        <button className="pwa-close-btn" onClick={handleClose} aria-label={t("pwaCloseAriaLabel")}>
          <FaXmark />
        </button>

        <div className="pwa-app-icon">
          <img src={MainLogo} alt={t("pwaAppLogoAlt")} />
        </div>

        <div className="pwa-text-group">
          <h3 className="pwa-title">{t("pwaInstallTitle")}</h3>
          <p className="pwa-description">{t("pwaInstallDescription")}</p>
        </div>

        <div className="pwa-button-group">
          <button className="pwa-btn-install" onClick={handleInstallClick}>
            {t("pwaInstallButton")}
          </button>
          <button className="pwa-btn-later" onClick={handleLater}>
            {t("pwaLaterButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;