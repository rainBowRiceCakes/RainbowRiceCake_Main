/**
 * @file src/components/common/Footer01.jsx
 * @description 푸터
 * 251216 v1.0.0 sara init 
 */

import { useState } from "react";
import "./Footer01.css";
import footerData from '../../data/footerData.json'

export default function Footer01() {
// 모달 상태 관리 (null = 닫힘, 'terms' | 'privacy' | 'location' = 해당 모달 열림)
  const [activeModal, setActiveModal] = useState(null);

  // 모달 열기 핸들러
  const openModal = (e, type) => {
    e.preventDefault(); // a 태그의 기본 이동 동작 방지
    setActiveModal(type);
    document.body.style.overflow = 'hidden'; // 모달 떴을 때 뒷배경 스크롤 방지
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto'; // 스크롤 다시 허용
  };

  return (
    <>
      <div className="footer01-frame">
        <div className="footer01-container footer01-inner-group">
          
          {/* 좌측: 로고 (절대 위치) */}
          <div className="footer01-brand-group">
            <div className="footer01-logo-text">RC</div>
          </div>

          {/* 중앙: 정보 및 약관 영역 */}
          <div className="footer01-info-group">
            
            <div className="footer01-links-group">
              {/* href 대신 onClick 이벤트 연결 */}
              <a href="#terms" onClick={(e) => openModal(e, 'terms')}>이용약관</a>
              <span className="footer01-separator">|</span>
              <a href="#policy" className="footer01-bold" onClick={(e) => openModal(e, 'privacy')}>개인정보처리방침</a>
              <span className="footer01-separator">|</span>
              <a href="#location" onClick={(e) => openModal(e, 'location')}>위치기반서비스 약관</a>
            </div>

            <div className="footer01-meta-info">
              <p>RC | RC 대구지점</p>
              <p>41937 대구 중구 중앙대로 394 제일빌딩 5F</p>
              <p>
                <span>대표자: 정의욱</span>
                <span className="footer01-separator">|</span>
                <span>대표 번호: 010-0000-0000</span>
              </p>
              <p>대표 이메일: https://daegu.greenart.co.kr</p>
              <p>사업자 등록번호: 000-00-00000</p>
            </div>

            <div className="footer01-copyright-text">
              Copyright 2025©RC All right reserved.
            </div>
          </div>
        </div>
      </div>

{/* --- 모달 영역 --- */}
      {activeModal && footerData[activeModal] && (
        <div className="footer01-modal-overlay" onClick={closeModal}>
          <div className="footer01-modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* 1. 모달 헤더 (제목) */}
            <div className="footer01-modal-header">
              <h3>{footerData[activeModal].title}</h3>
              <button className="footer01-close-x-btn" onClick={closeModal}>✕</button>
            </div>
            
            {/* 2. 모달 본문 (내용 렌더링) */}
            <div className="footer01-modal-body">
              <div className="footer01-text-content">
                
                {/* 상단 설명글 (description)이 있으면 출력 */}
                {footerData[activeModal].description && (
                  <p className="modal-description">
                    {footerData[activeModal].description}
                  </p>
                )}

                {/* ★ 핵심: 조항(articles) 배열을 순회하며 렌더링 ★ */}
                {footerData[activeModal].articles.map((article, index) => (
                  <div key={index} className="modal-article-block">
                    
                    {/* 소제목 (heading) */}
                    {article.heading && <h4>{article.heading}</h4>}
                    
                    {/* 본문 텍스트 (text) */}
                    {article.text && <p>{article.text}</p>}
                    
                    {/* 리스트 목록 (list) - 데이터가 있을 때만 렌더링 */}
                    {article.list && article.list.length > 0 && (
                      <ul>
                        {article.list.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {article.text2 && <p>{article.text2}</p>}
                    {article.text3 && <p>{article.text3}</p>}
                    {article.list2 && article.list2.length > 0 && (
                      <ul>
                        {article.list2.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

              </div>
            </div>

            {/* 모달 하단 (닫기 버튼) */}
            <div className="footer01-modal-footer">
              <button className="footer01-close-btn" onClick={closeModal}>닫기</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}