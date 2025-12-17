/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지 및 배송 상태 가이드(step img) 
 * 251217 v1.0.0 sara init 
 */

import { useNavigate } from 'react-router-dom';
import "./MyPage.css";

export default function MyPage({ isLoggedIn = false }) {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="mypage-frame mypage-frame--unauth">
        <div className="mypage-lock-box">
          <div className="lock-icon">🔒</div>
          <h2>로그인이 필요해요</h2>
          <button className="mypage-login-btn" onClick={() => navigate('/login')}>로그인</button>
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
        <h3 className="status-title">배송/보관 중인 짐 현황</h3>
        <div className="status-progress-bar">
          <div className="progress-step is-done">✔<p>예약 확정</p></div>
          <div className="progress-step is-done">✔<p>픽업 완료</p></div>
          <div className="progress-step is-active"><p>이동 중</p></div>
          <div className="progress-step"><p>보관 중</p></div>
        </div>
      </div>
    </div>
  );
}