import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import './PWAInstallButton.css';
import { FaXmark } from 'react-icons/fa6';

const PWAInstallButton = () => {
  const { t } = useContext(LanguageContext);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const MainLogo = '/resource/main-logo.png';
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-install-overlay" onClick={handleClose}>
      <div className="pwa-install-container" onClick={(e) => e.stopPropagation()}>
        <button className="pwa-close-btn" onClick={handleClose} aria-label={t('pwaCloseAriaLabel')}>
          <FaXmark />
        </button>

        <div className="pwa-app-icon">
          <img src={MainLogo} alt={t('pwaAppLogoAlt')} />
        </div>

        <div className="pwa-text-group">
          <h3 className="pwa-title">{t('pwaInstallTitle')}</h3>
          <p className="pwa-description">
            {t('pwaInstallDescription')}
          </p>
        </div>
        
        <div className="pwa-button-group">
          <button className="pwa-btn-install" onClick={handleInstallClick}>
            {t('pwaInstallButton')}
          </button>
          <button className="pwa-btn-later" onClick={handleClose}>
            {t('pwaLaterButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;