/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지 및 배송 상태 가이드(step img) 
 * 251217 v1.0.0 sara init 
 */

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../../context/LanguageContext";
import "./MyPage.css";

export default function MyPage({ isLoggedIn = false }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  if (!isLoggedIn) {
    return (
      <div className="mypage-frame mypage-frame--unauth">
        <div className="mypage-lock-box">
          <div className="mypage-lock-icon">🔒</div>
          <h2 className="mypage-lock-title">{t("myPageLoginRequired")}</h2>
          <button className="mypage-login-btn" onClick={() => navigate("/login")}>
            {t("myPageLogin")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-frame">
      <div className="mypage-profile-card">
        <div className="mypage-profile-circle">👤</div>
        <div>
          <div className="mypage-user-name">홍*동</div>
          <div className="mypage-user-email">hong@ricecake.com</div>
        </div>
      </div>

      <div className="mypage-status-card">
        <h3 className="mypage-status-title">{t("myPageStatusTitle")}</h3>
        <div className="mypage-status-progress">
          <div className="mypage-step is-done">✔ {t("myPageStatusStep1")}</div>
          <div className="mypage-step is-done">✔ {t("myPageStatusStep2")}</div>
          <div className="mypage-step is-active">{t("myPageStatusStep3")}</div>
          <div className="mypage-step">{t("myPageStatusStep4")}</div>
        </div>
      </div>
    </div>
  );
}