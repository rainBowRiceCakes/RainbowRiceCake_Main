/**
 * @file src/components/common/Footer01.jsx
 * @description 푸터
 * 251216 v1.0.0 sara init 
 */

import { useState, useContext } from "react";
import { LanguageContext } from '../../context/LanguageContext';
import "./Footer01.css";
import { footerData } from '../../data/footerData.js';
import  footerLogoImg  from '../../assets/footer-logo.png'; // 로고 이미지 경로

export default function Footer01() {
  const { lang, t } = useContext(LanguageContext);
  const [activeModal, setActiveModal] = useState(null);

  // 모달 열기
  const openModal = (e, type) => {
    e.preventDefault();
    setActiveModal(type);
    document.body.style.overflow = 'hidden';
  };

  // 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  // 현재 활성화된 모달 데이터 가져오기 (언어 설정 반영)
  const modalData = activeModal ? footerData[lang][activeModal] : null;

  return (
    <>
      <div className="footer01-frame">
        <div className="footer01-container footer01-inner-group">
          
          {/* 브랜드 로고 영역 */}
          <div className="footer01-brand-group">
            <img src={footerLogoImg} alt="logo" className="footer01-logo-img" />
          </div>

          {/* 정보 및 링크 영역 */}
          <div className="footer01-info-group">
            
            {/* 상단 링크(약관 등) */}
            <div className="footer01-links-group">
              <a href="#terms" onClick={(e) => openModal(e, 'terms')}>{t('footerTerms')}</a>
              <span className="footer01-separator">|</span>
              <a href="#policy" className="footer01-bold" onClick={(e) => openModal(e, 'privacy')}>{t('footerPrivacy')}</a>
              <span className="footer01-separator">|</span>
              <a href="#location" onClick={(e) => openModal(e, 'location')}>{t('footerLocation')}</a>
            </div>

            {/* 회사 상세 정보 */}
            <div className="footer01-meta-info">
              <p>{t('footerDaeguBranch')}</p>
              <p>{t('footerCompanyAddress')}</p>
              <p>
                <span>{t('footerCEO')}</span>
                <span className="footer01-separator">|</span>
                <span>{t('footerPhone')}</span>
              </p>
              <p>{t('footerEmail')}</p>
              <p>{t('footerBizNum')}</p>
            </div>

            {/* 카피라이트 */}
            <div className="footer01-copyright-text">
              Copyright 2025©RC All right reserved.
            </div>
          </div>
        </div>
      </div>

      {/* --- 모달 영역 --- */}
      {modalData && (
        <div className="footer01-modal-overlay" onClick={closeModal}>
          <div className="footer01-modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* 모달 헤더 */}
            <div className="footer01-modal-header">
              <h3>{modalData.title}</h3>
              <button className="footer01-close-x-btn" onClick={closeModal}>✕</button>
            </div>
            
            {/* 모달 본문 */}
            <div className="footer01-modal-body">
              <div className="footer01-text-content">
                
                {/* 설명글(description) */}
                {modalData.description && (
                  <p className="footer01-modal-description">
                    {modalData.description}
                  </p>
                )}

                {/* 조항(Article) 반복 렌더링 */}
                {modalData.articles.map((article, index) => (
                  <div key={index} className="modal-article-block">
                    
                    {article.heading && <h4>{article.heading}</h4>}
                    
                    {article.text && <p>{article.text}</p>}
                    
                    {/* 리스트 1 */}
                    {article.list && article.list.length > 0 && (
                      <ul>
                        {article.list.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {/* 추가 텍스트 및 리스트(확장성 고려) */}
                    {article.text2 && <p>{article.text2}</p>}
                    {article.text3 && <p>{article.text3}</p>}

                    {/* 리스트 2 */}
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
            {/* 모달 푸터(닫기 버튼) */}
            <div className="footer01-modal-footer">
              <button className="footer01-close-btn" onClick={closeModal}>{t('footerClose')}</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}