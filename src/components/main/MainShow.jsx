/**
 * @file src/components/main/MainShow.jsx
 * @description 메인 페이지(app) 
 * 251216 v1.0.0 sara init 
 */
import { useState, useEffect, useRef } from 'react';

import MainCover from './sections/MainCover.jsx';
import MainInfo from './sections/MainInfo.jsx';     // 1. 서비스소개
import MainPTNSSearch from './sections/MainPTNSSearch.jsx'; // 2. 지점안내
import MainFee from './sections/MainFee.jsx';       // 3. 요금안내
import MainDLVS from './sections/MainDLVS.jsx';     // 4. 배송현황
import MainCS from './sections/MainCS.jsx';         // 5. 고객센터
import MainPTNS from './sections/MainPTNS.jsx';     // 6. 제휴문의
import './MainShow.css';

export default function MainShow() {
  const [activeSection, setActiveSection] = useState(0);
  // 배민 구조에 맞춘 6개 섹션 ID
  const sections = ['info', 'search', 'fee', 'dlvs', 'cs', 'ptns'];
  const observer = useRef(null);
  
  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.indexOf(entry.target.id);
          setActiveSection(index);
        }
      });
    }, { threshold: 0.5 });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.current.observe(el);
    });

    return () => observer.current.disconnect();
  }, []);

return (
    <div className="mainshow-page-container">
      {/* 0. 커버이미지 + 배송조회 섹션 */}
      <MainCover />

      {/* 우측 플로팅 모노크롬 내비게이션 (6단계) */}
      <nav className="mainshow-floating-nav">
        {sections.map((_, index) => (
          <button 
            key={index} 
            className={`nav-dot ${activeSection === index ? 'active' : ''}`}
            onClick={() => {
              document.getElementById(sections[index]).scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ))}
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