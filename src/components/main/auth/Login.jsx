/**
 * @file src/components/main/auth/Login.jsx
 * @description 로그인 선택 및 이메일 로그인 폼 통합 페이지
 * 251217 v1.0.0 sara init 
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('select'); // 'select', 'login'

  const onLoginSubmit = (e) => {
    e.preventDefault();
    alert("로그인 처리");
  };

  // --- 1. 이메일 로그인 폼 화면 (보안 문제로 back 기능은 삭제 가눙)---
  if (mode === 'login') {
    return (
      <div className="login-frame">
        <form className="login-box" onSubmit={onLoginSubmit}>
          <h2 className="login-title">로그인</h2>
          <div className="login-input-group">
            <input type="email" placeholder="이메일을 입력해주세요." className="login-input" required />
            <div className="login-password-wrapper">
              <input type="password" placeholder="패스워드를 입력해주세요." className="login-input" required />
              <span className="login-view-icon">👁️</span>
            </div>
            <label className="login-check-label">
              <input type="checkbox" /> <span>로그인 상태 유지</span>
            </label>
            <button type="submit" className="login-btn login-btn--mint">로그인</button>
          </div>
          <div className="login-helper-links">
            <span>이메일 찾기</span> | <span>패스워드 찾기</span>
          </div>
          <button type="button" className="login-back-btn" onClick={() => setMode('select')}>뒤로가기</button>
        </form>
      </div>
    );
  }

  // --- 2. 초기 선택 화면 ---
  return (
    <div className="login-frame">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>
        <div className="login-select-group">
          <button className="login-select-btn" onClick={() => setMode('login')}>이메일로 로그인</button>
          <button className="login-select-btn login-select-btn--social">
            <span className="google-g">G</span> 구글 소셜 로그인
          </button>
          <div className="login-hr"><span>OR</span></div>
          <button className="login-select-btn login-select-btn--register" onClick={() => navigate('/register')}>
            이메일로 회원 가입
          </button>
        </div>
      </div>
    </div>
  );
};