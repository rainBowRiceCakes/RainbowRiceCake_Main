/**
 * @file src/components/main/auth/Login.jsx
 * @description 로그인 선택 및 이메일 로그인 폼 통합 페이지
 * 251217 v1.0.0 sara init 
 */

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('select'); // 'select', 'login'
  const { t } = useContext(LanguageContext);

  const onLoginSubmit = (e) => {
    e.preventDefault();
    alert("로그인 처리"); // This should be translated or replaced with a proper notification
  };

  // --- 1. 이메일 로그인 폼 화면 (보안 문제로 back 기능은 삭제 가눙)---
  if (mode === 'login') {
    return (
      <div className="login-frame">
        <form className="login-box" onSubmit={onLoginSubmit}>
          <h2 className="login-title">{t('loginTitle')}</h2>
          <div className="login-input-group">
            <input type="email" placeholder={t('loginEmailPlaceholder')} className="login-input" required />
            <div className="login-password-wrapper">
              <input type="password" placeholder={t('loginPasswordPlaceholder')} className="login-input" required />
              <span className="login-view-icon">👁️</span>
            </div>
            <label className="login-check-label">
              <input type="checkbox" /> <span>{t('loginStayLoggedIn')}</span>
            </label>
            <button type="submit" className="login-btn login-btn--mint">{t('loginTitle')}</button>
          </div>
          <div className="login-helper-links">
            <span>{t('loginFindEmail')}</span> | <span>{t('loginFindPassword')}</span>
          </div>
          <button type="button" className="login-back-btn" onClick={() => setMode('select')}>{t('loginGoBack')}</button>
        </form>
      </div>
    );
  }

  // --- 2. 초기 선택 화면 ---
  return (
    <div className="login-frame">
      <div className="login-box">
        <h2 className="login-title">{t('loginTitle')}</h2>
        <div className="login-select-group">
          <button className="login-select-btn" onClick={() => setMode('login')}>{t('loginWithEmail')}</button>
          <button className="login-select-btn login-select-btn--social">
            <span className="google-g">G</span> {t('loginWithGoogle')}
          </button>
          <div className="login-hr"><span>OR</span></div>
          <button className="login-select-btn login-select-btn--register" onClick={() => navigate('/register')}>
            {t('loginRegisterWithEmail')}
          </button>
        </div>
      </div>
    </div>
  );
};