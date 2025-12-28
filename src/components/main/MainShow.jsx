/**
 * @file src/components/main/MainShow.jsx
 * @description 메인 페이지(app) 
 * 251216 v1.0.0 sara init 
 */

import { useState, useEffect, useRef, useContext } from 'react';

import MainCover from './sections/MainCover.jsx';
import MainInfo from './sections/MainInfo.jsx';              // 1. 서비스 소개
import MainPTNSSearch from './sections/MainPTNSSearch.jsx';
import MainFee from './sections/MainFee.jsx';
import MainCS from './sections/MainCS.jsx';
import MainPTNS from './sections/MainPTNS.jsx';
import Carousel from '../common/Carousel.jsx';               // 7. 로고 캐러샐
import './MainShow.css';
import { LanguageContext } from '../../context/LanguageContext.jsx';  // en/ko 

export default function MainShow() {
  const { t } = useContext(LanguageContext);
  const [activeSection, setActiveSection] = useState(0);
  
  const sectionConfig = [
    { id: 'plans', key: 'navPlans' },
    { id: 'branches', key: 'navBranches' },
    { id: 'fee', key: 'navFee' },
    { id: 'support', key: 'navSupport' },
    { id: 'partners', key: 'navPartners' },
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

      {/* 1. 요금제 섹션 */}
      <div id="plans" className="mainshow-section-frame"><MainInfo /></div>

      {/* 2. 지점 안내 섹션 */}
      <div className="mainshow-section-frame mainshow-branches-section-style"><MainPTNSSearch /></div>

      {/* 3. 요금 안내 섹션 */}
      <div id="fee" className="mainshow-section-frame"><MainFee /></div>

      {/* 4. 고객지원 섹션 */}
      <div id="support" className="mainshow-section-frame"><MainCS /></div>

      {/* 5. 제휴문의 섹션 */}
      <div id="partners" className="mainshow-section-frame"><MainPTNS /></div>

      {/* 6. 파트너 로고 캐러샐 */}
      <div><Carousel /></div>
    </div>
  );
}
