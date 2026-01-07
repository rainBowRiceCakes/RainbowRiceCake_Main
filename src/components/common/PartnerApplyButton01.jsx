/**
 * @file src/components/common/PartnerApplyButton01.jsx
 * @description Floating button to apply for partnership. 제휴 신청 페이지로 이동하는 버튼!
 * 260101 sara init 
 */

import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import './PartnerApplyButton01.css';

const PartnerIcon = () => {
  return (
    <svg 
        width="60%" 
        height="60%" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
      <path d="M8 12l2-2a3 3 0 0 1 4 0l2 2" />
      <path d="M4 13l3.5-3.5 4.5 4.5-3.5 3.5L4 13Z" />
      <path d="M20 13l-3.5-3.5-4.5 4.5 3.5 3.5L20 13Z" />
    </svg>
  );
};

const PartnerApplyButton01 = () => {
  const { t } = useContext(LanguageContext);
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

  return (
    <button
      type="button"
      className="partner-apply-button"
      onClick={scrollToPartners}
      aria-label={t('partnerApplyAriaLabel')}
    >
      <PartnerIcon />
    </button>
  );
};

export default PartnerApplyButton01;
