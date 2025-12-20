/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지 및 배송 상태 가이드(step img) 
 * 251217 v1.0.0 sara init 
 */

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import "./MyPage.css";

export default function MyPage({ isLoggedIn = false }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  if (!isLoggedIn) {
    return (
      <div className="mypage-frame mypage-frame--unauth">
        <div className="mypage-lock-box">
          <div className="lock-icon">🔒</div>
          <h2>{t('myPageLoginRequired')}</h2>
          <button className="mypage-login-btn" onClick={() => navigate('/login')}>{t('myPageLogin')}</button>
        </div>
      </div>
    );
  }

  // image_e71f63.png 기반 디자인
  return (
    <div className="mypage-frame">
      <div className="mypage-user-profile">
        <div className="profile-circle">👤</div>
        <div className="profile-info">
          <div className="user-name">홍*동</div>
          <div className="user-email">hong@ ricecake.com</div>
        </div>
      </div>

      <div className="mypage-status-card">
        <h3 className="status-title">{t('myPageStatusTitle')}</h3>
        <div className="status-progress-bar">
          <div className="progress-step is-done">✔<p>{t('myPageStatusStep1')}</p></div>
          <div className="progress-step is-done">✔<p>{t('myPageStatusStep2')}</p></div>
          <div className="progress-step is-active"><p>{t('myPageStatusStep3')}</p></div>
          <div className="progress-step"><p>{t('myPageStatusStep4')}</p></div>
        </div>
      </div>
    </div>
  );
}