/**
 * @file src/components/main/auth/Register.jsx
 * @description 회원가입 페이지 
 * 251217 v1.0.0 sara init 
 */

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../../context/LanguageContext";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    alert(t("registerSuccess"));
  };

  return (
    <div className="register-frame">
      <form className="register-box" onSubmit={onRegisterSubmit}>
        <h2 className="register-title">{t("registerTitle")}</h2>

        <p className="register-login-link">
          <span onClick={() => navigate("/login")}>{t("registerLoginLink")}</span>
        </p>

        <div className="register-form-grid">
          <div className="register-input-row">
            <input type="text" placeholder={t("registerFirstName")} className="register-input" required />
            <input type="text" placeholder={t("registerLastName")} className="register-input" required />
          </div>

          <input type="email" placeholder={t("registerEmail")} className="register-input" required />

          <input type="password" placeholder={t("registerPassword")} className="register-input" required />
          <input type="password" placeholder={t("registerConfirmPassword")} className="register-input" required />

          <div className="register-phone-row">
            <select className="register-country-select">
              <option value="82">{t("registerCountry")}</option>
            </select>
            <input type="tel" placeholder={t("registerPhoneNumber")} className="register-input" required />
          </div>

          <label className="register-agreement-label">
            <input type="checkbox" required />
            <span>{t("registerAgreement")}</span>
          </label>

          <button type="submit" className="register-submit-btn">
            {t("registerSubmit")}
          </button>
        </div>
      </form>
    </div>
  );
}