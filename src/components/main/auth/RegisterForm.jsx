/**
 * @file src/components/main/auth/RegisterForm.jsx
 * @description 이메일 회원가입 페이지 
 * 251217 v1.0.0 sara init 
 */

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import "./RegisterForm.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    alert(t('registerSuccess'));
  };

  return (
    <div className="register-frame">
      <form className="register-box" onSubmit={onRegisterSubmit}>
        <h2 className="register-title">{t('registerTitle')}</h2>
        
        <p className="register-login-link">
          <span onClick={() => navigate('/login')}>{t('registerLoginLink')}</span>
        </p>

        <div className="register-form-grid">
          {/* 이름 및 성 입력 */}
          <div className="register-input-row">
            <input type="text" placeholder={t('registerFirstName')} className="register-input" required />
            <input type="text" placeholder={t('registerLastName')} className="register-input" required />
          </div>

          <input type="email" placeholder={t('registerEmail')} className="register-input register-input--full" required />
          
          <div className="register-password-group">
            <input type="password" placeholder={t('registerPassword')} className="register-input register-input--full" required />
            <span className="register-view-icon">👁️</span>
          </div>

          <div className="register-password-group">
            <input type="password" placeholder={t('registerConfirmPassword')} className="register-input register-input--full" required />
            <span className="register-view-icon">👁️</span>
          </div>

          {/* 국가 코드 및 전화번호 */}
          <div className="register-phone-row">
            <select className="register-country-select">
              <option value="82">{t('registerCountry')}</option>
            </select>
            <input type="tel" placeholder={t('registerPhoneNumber')} className="register-input" required />
          </div>

          <label className="register-agreement-label">
            <input type="checkbox" required />
            <span className="register-agreement-text">
              {t('registerAgreement')}
            </span>
          </label>

          <button type="submit" className="register-submit-btn">
            {t('registerSubmit')}
          </button>
        </div>
      </form>
    </div>
  );
}