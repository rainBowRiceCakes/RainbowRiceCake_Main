/**
 * @file src/components/common/PartnerApplyButton01.jsx
 * @description Floating button to apply for partnership. 제휴 신청 페이지로 이동하는 버튼!
 * 260101 v1.0.0 sara init 
 * 260112 v2.0.0 sara update - pill button (60x40) + ko/en text
 */

import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import './PartnerApplyButton01.css';

const PartnerApplyButton01 = () => {
  const { t, lang } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToPartners = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'partners' } });
    } else {
      const section = document.getElementById('partners');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 버튼 내부 텍스트 
    const labelText =
    lang === "ko" ? "라이더 / 파트너 모집" : "Rider, Partner Recruitment";

  return (
    <button
      type="button"
      className="partner-apply-button"
      onClick={scrollToPartners}
      aria-label={t("partnerApplyAriaLabel")}
    >
      <span className="partner-apply-button__text">{labelText}</span>
    </button>
  );
};

export default PartnerApplyButton01;
