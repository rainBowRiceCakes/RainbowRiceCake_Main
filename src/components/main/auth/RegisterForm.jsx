/**
 * @file src/components/main/auth/RegisterForm.jsx
 * @description 이메일 회원가입 페이지 
 * 251217 v1.0.0 sara init 
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./RegisterForm.css";

export default function RegisterForm() {
  const navigate = useNavigate();

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    alert("회원가입 요청이 접수되었습니다.");
  }; // <--- 이 부분에 중괄호가 빠져있었습니다.

  return (
    <div className="register-frame">
      <form className="register-box" onSubmit={onRegisterSubmit}>
        <h2 className="register-title">이메일로 회원 가입</h2>
        
        <p className="register-login-link">
          <span onClick={() => navigate('/login')}>  이미 계정이 있으시다면 로그인하세요 → </span>
        </p>

        <div className="register-form-grid">
          {/* 이름 및 성 입력 */}
          <div className="register-input-row">
            <input type="text" placeholder="이름" className="register-input" required />
            <input type="text" placeholder="성" className="register-input" required />
          </div>

          <input type="email" placeholder="이메일" className="register-input register-input--full" required />
          
          <div className="register-password-group">
            <input type="password" placeholder="패스워드" className="register-input register-input--full" required />
            <span className="register-view-icon">👁️</span>
          </div>

          <div className="register-password-group">
            <input type="password" placeholder="패스워드 확인" className="register-input register-input--full" required />
            <span className="register-view-icon">👁️</span>
          </div>

          {/* 국가 코드 및 전화번호 */}
          <div className="register-phone-row">
            <select className="register-country-select">
              <option value="82">KR 대한민국 +82</option>
            </select>
            <input type="tel" placeholder="연락처 입력" className="register-input" required />
          </div>

          <label className="register-agreement-label">
            <input type="checkbox" required />
            <span className="register-agreement-text">
              이용 약관에 모두 동의합니다.
            </span>
          </label>

          <button type="submit" className="register-submit-btn">
            가입 하기
          </button>
        </div>
      </form>
    </div>
  );
}