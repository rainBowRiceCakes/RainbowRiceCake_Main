/**
 * @file src/components/common/Footer01.jsx
 * @description 푸터
 * 251216 v1.0.0 sara init 
 */

import { useState, useContext } from "react";
import { LanguageContext } from '../../context/LanguageContext';
import "./Footer01.css";
import { footerData } from '../../data/footerData.js';

export default function Footer01() {
  const { lang, t } = useContext(LanguageContext);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (e, type) => {
    e.preventDefault();
    setActiveModal(type);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const modalData = activeModal ? footerData[lang][activeModal] : null;

  return (
    <>
      <div className="footer01-frame">
        <div className="footer01-container footer01-inner-group">
          
          <div className="footer01-brand-group">
            <div className="footer01-logo-text">RC</div>
          </div>

          <div className="footer01-info-group">
            
            <div className="footer01-links-group">
              <a href="#terms" onClick={(e) => openModal(e, 'terms')}>{t('footerTerms')}</a>
              <span className="footer01-separator">|</span>
              <a href="#policy" className="footer01-bold" onClick={(e) => openModal(e, 'privacy')}>{t('footerPrivacy')}</a>
              <span className="footer01-separator">|</span>
              <a href="#location" onClick={(e) => openModal(e, 'location')}>{t('footerLocation')}</a>
            </div>

            <div className="footer01-meta-info">
              <p>RC | RC Daegu Branch</p>
              <p>5F, Jeil Building, 394 Jungang-daero, Jung-gu, Daegu, 41937, Republic of Korea</p>
              <p>
                <span>{t('footerCEO')}</span>
                <span className="footer01-separator">|</span>
                <span>{t('footerPhone')}</span>
              </p>
              <p>{t('footerEmail')}</p>
              <p>{t('footerBizNum')}</p>
            </div>

            <div className="footer01-copyright-text">
              Copyright 2025©RC All right reserved.
            </div>
          </div>
        </div>
      </div>

      {modalData && (
        <div className="footer01-modal-overlay" onClick={closeModal}>
          <div className="footer01-modal-box" onClick={(e) => e.stopPropagation()}>
            
            <div className="footer01-modal-header">
              <h3>{modalData.title}</h3>
              <button className="footer01-close-x-btn" onClick={closeModal}>✕</button>
            </div>
            
            <div className="footer01-modal-body">
              <div className="footer01-text-content">
                
                {modalData.description && (
                  <p className="footer01-modal-description">
                    {modalData.description}
                  </p>
                )}

                {modalData.articles.map((article, index) => (
                  <div key={index} className="modal-article-block">
                    
                    {article.heading && <h4>{article.heading}</h4>}
                    
                    {article.text && <p>{article.text}</p>}
                    
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

            <div className="footer01-modal-footer">
              <button className="footer01-close-btn" onClick={closeModal}>{t('footerClose')}</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}