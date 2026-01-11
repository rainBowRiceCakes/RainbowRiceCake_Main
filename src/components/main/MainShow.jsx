/**
 * @file src/components/main/MainShow.jsx
 * @description 메인 페이지(app) 
 * 251216 v1.0.0 sara init 
 * 260104 v1.0.1 sara - MainFee -> MainPromotion 섹션 추가
 */

import { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import MainCover from './sections/MainCover.jsx';
import MainIntro from './sections/MainIntro.jsx';
import MainInfo from './sections/MainInfo.jsx';              // 1. 서비스 소개
import MainPTNSSearch from './sections/MainPTNSSearch.jsx';
import MainPromotion from './sections/MainPromotion.jsx';
import MainCS from './sections/MainCS.jsx';
import MainPTNS from './sections/MainPTNS.jsx';
import Carousel from '../common/Carousel.jsx';               // 7. 로고 캐러샐
import './MainShow.css';
import { LanguageContext } from '../../context/LanguageContext.js';  // en/ko 
import { useDispatch, useSelector } from 'react-redux';
import { partnerCarouselThunk } from '../../store/thunks/partnerCarouselThunk.js'; // 로고 가져오기 Thunk

export default function MainShow() {
  const { t } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const location = useLocation(); // Add useLocation hook

  // 파트너 로고 이미지 상태 가져오기
  const imageState = useSelector((state) => state.partnerCarousel);
  const { logoImages } = imageState || {}; // 여기서 안전하게 분해 할당

  // 섹션 네비게이션 설정
  const activeSectionRef = useRef(0); // 렌더링 없이 즉시 값 참조용
  const [activeSection, setActiveSection] = useState(0);

  const sectionConfig = [
    { id: 'intro', key: 'navIntro' },
    { id: 'plans', key: 'navPlans' } ,
    { id: 'branches', key: 'navBranches' },
    { id: 'support', key: 'navSupport' },
    { id: 'promotion', key: 'navPromotion' },
    { id: 'partners', key: 'navPartners' },
  ];

  const sections = sectionConfig.map(s => s.id);
  const sectionLabels = sectionConfig.map(s => t(s.key));

  const observer = useRef(null);

  // 초기 데이터 로드 (파트너 로고)
  useEffect(() => {
    dispatch(partnerCarouselThunk());
  }, [dispatch]);

  // 외부 라우트에서 스크롤 요청이 있을 경우 처리
  useEffect(() => {
    if (location.state?.scrollTo === 'partners') {
      const section = document.getElementById('partners');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 스크롤 후 상태를 초기화하여, 뒤로 가기 등으로 다시 MainShow에 진입 시
        // 불필요한 스크롤이 발생하지 않도록 합니다.
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [location.state]); // location.state가 변경될 때마다 실행

  // 스크롤 옵저버 설정
  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveSection(index);
            activeSectionRef.current = index;
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

  // 데이터 가공 (logoImages가 배열이 아닐 경우 빈 배열로 처리하여 에러 방지)
  const safeLogoList = Array.isArray(logoImages) ? logoImages : [];
  const formattedLogos = safeLogoList.map(fullUrl => ({ url: fullUrl }));

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
              onClick={() => document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })}
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

      {/* 0. 서비스소개 섹션 */}
      <div id="intro" className="mainshow-section-frame"><MainIntro /></div>

      {/* 1. 요금제 섹션 */}
      <div id="plans" className="mainshow-section-frame"><MainInfo /></div>

      {/* 2. 지점 안내 섹션 */}
      <div id="branches" className="mainshow-section-frame"><MainPTNSSearch /></div>

      {/* 3. 고객지원 섹션 */}
      <div id="support" className="mainshow-section-frame"><MainCS /></div>

      {/* 4. 제휴업체 프로모션 안내 섹션 */}
      <div id="promotion" className="mainshow-section-frame"><MainPromotion /></div>

      {/* 5. 제휴문의 섹션 */}
      <div id="partners" className="mainshow-section-frame"><MainPTNS /></div>

      {/* 6. 파트너 로고 캐러샐 (기존 제휴 업체 리스트) */}
      <div className="mainshow-carousel-wrapper">
        {/* Props로 images 전달 */}
        <Carousel images={formattedLogos} />
      </div>
    </div>
  );
}
