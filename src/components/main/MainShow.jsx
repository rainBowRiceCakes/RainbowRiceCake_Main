/**
 * @file src/components/main/MainShow.jsx
 * @description 메인 페이지(app) 
 * 251216 v1.0.0 sara init 
 */
import { useState, useEffect, useRef, useContext } from 'react';

import MainCover from './sections/MainCover.jsx';
import MainInfo from './sections/MainInfo.jsx';              // 1. 서비스 소개
import MainPTNSSearch from './sections/MainPTNSSearch.jsx';  // 2. 지점안내
import MainFee from './sections/MainFee.jsx';                // 3. 요금안내
import MainDLVS from './sections/MainDLVS.jsx';              // 4. 배송현황
import MainCS from './sections/MainCS.jsx';                  // 5. 고객센터
import MainPTNS from './sections/MainPTNS.jsx';              // 6. 제휴문의
import './MainShow.css';
import { LanguageContext } from '../../context/LanguageContext.jsx';

export default function MainShow() {
  const { t } = useContext(LanguageContext);
  const [activeSection, setActiveSection] = useState(0);
  
  const sectionConfig = [
    { id: 'info', key: 'navServiceIntro' },
    { id: 'search', key: 'navBranchInfo' },
    { id: 'fee', key: 'navFeeInfo' },
    { id: 'dlvs', key: 'navDeliveryStatus' },
    { id: 'cs', key: 'navCustomerCenter' },
    { id: 'ptns', key: 'navPartnershipInquiry' },
  ];

  const sections = sectionConfig.map(s => s.id);
  const sectionLabels = sectionConfig.map(s => t(s.key));

  const observer = useRef(null);
  
  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    }, { threshold: 0.5 });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.current.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.current.unobserve(el);
      });
    };
  }, [sections]);

return (
    <div className="mainshow-page-container">
      {/* 커버이미지 + 배송조회 섹션 */}
      <MainCover />

    {/* 우측 플로팅 내비게이션 */}
      <nav className="mainshow-floating-nav">
        <div className="mainshow-nav-group">
          {sections.map((id, index) => (
            <div 
              key={id} 
              className="mainshow-nav-item"
              onClick={() => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="mainshow-nav-label-box">
                <span className={`mainshow-nav-text ${activeSection === index ? 'active' : ''}`}>
                  {sectionLabels[index]}
                </span>
              </div>
              <div className={`mainshow-nav-dot ${activeSection === index ? 'active' : ''}`} />
            </div>
          ))}
        </div>
      </nav>

      {/* 1. 서비스 소개 섹션 */}
      <div id="info" className="mainshow-section-frame"><MainInfo /></div>

      {/* 2. 지점 안내 섹션 */}
      <div id="search" className="mainshow-section-frame"><MainPTNSSearch /></div>

      {/* 3. 가격 안내 섹션 */}
      <div id="fee" className="mainshow-section-frame"><MainFee /></div>

      {/* 4. 배송 조회 섹션 */}
      <div id="dlvs" className="mainshow-section-frame"><MainDLVS /></div>

      {/* 5. 고객센터 섹션 */}
      <div id="cs" className="mainshow-section-frame"><MainCS /></div>

      {/* 6. 파트너십 섹션 (제휴 문의) */}
      <div id="ptns" className="mainshow-section-frame"><MainPTNS /></div>
    </div>
  );
}
