/**
 * @file src/components/common/PWAInstallButton.jsx
 * @description PWA Install Button UI (웹/앱)
 * 251219 v1.0.0 jun init 
 */

import { useState, useEffect } from 'react';
import './PWAInstallButton.css'; // 아래의 CSS 코드를 저장할 파일명

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // 1. 기본 브라우저 설치 프롬프트를 막습니다.
      e.preventDefault();
      // 2. 나중에 트리거하기 위해 이벤트를 저장합니다.
      setDeferredPrompt(e);
      // 3. 우리의 커스텀 설치 UI를 보여줍니다.
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // 설치 프롬프트를 실행합니다.
    deferredPrompt.prompt();

    // 유저가 설치를 수락했는지 거절했는지 기다립니다.
    const { outcome } = await deferredPrompt.userChoice;
    
    // 프롬프트는 한 번만 사용할 수으므로 초기화합니다.
    setDeferredPrompt(null);
    setIsVisible(false);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // UI가 보이지 않아야 할 상태면 렌더링하지 않습니다.
  if (!isVisible) return null;

  return (
    <div className="pwa-install-overlay">
      <div className="pwa-install-container">
        <div className="pwa-content">
          <div className="pwa-text-group">
            <h3 className="pwa-title">앱 설치하기</h3>
            <p className="pwa-description">
              앱을 설치하면 더 빠르고 간편하게<br />서비스를 이용하실 수 있습니다.
            </p>
          </div>
        </div>
        
        <div className="pwa-button-group">
          <button className="pwa-btn pwa-btn-close" onClick={handleClose}>
            나중에
          </button>
          <button className="pwa-btn pwa-btn-install" onClick={handleInstallClick}>
            설치하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;