/**
 * @file src/components/main/auth/Login.jsx
 * @description 소셜 로그인 페이지
 * 251217 v1.0.0 sara init
 * 251222 v2.0.0 jun 카카오 소셜 로그인으로 통합
 */

import { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import "./Login.css";

// --- 카카오톡 SVG 아이콘 컴포넌트 ---
const KakaoSvgIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.47715 3 2 6.36364 2 10.5C2 13.1523 3.85547 15.5117 6.73828 16.8711C6.52734 17.6367 5.98438 19.6172 5.875 20.0352C5.73438 20.5664 6.0625 20.5547 6.27344 20.4141C6.54297 20.2344 9.17578 18.4648 10.3125 17.6875C10.8633 17.7656 11.4219 17.8125 12 17.8125C17.5228 17.8125 22 14.4531 22 10.3125C22 6.17188 17.5228 3 12 3Z" fill="black"/>
  </svg>
);
// ------------------------------------

export default function Login() {
  // const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const handleKakaoLogin = () => {
    window.location.replace(`/api/auth/social/kakao`);
    // alert("카카오 로그인 기능을 연결해주세요.");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* 타이틀 */}
        <h2 className="login-title">{t('loginTitle', '로그인')}</h2>
        
        {/* 카카오 로그인 버튼 */}
        <button className="kakao-btn" onClick={handleKakaoLogin}>
          <span className="kakao-icon-wrapper">
            <KakaoSvgIcon />
          </span>
          <span className="kakao-btn-text">{t('loginWithKakao')}</span>
        </button>
      </div>
    </div>
  );
};