/**
 * @file src/components/main/sections/MainPromotion.jsx
 * @description 제휴업체 신청 프로모션 페이지
 * 260106 v2.0.0 sara init 
 * 260108 v2.1.0 sara update img view 기능 추가
 */

import { useState } from "react";
import { useTranslation } from "../../../context/LanguageContext";
import "./MainPromotion.css";
import MypageImgView from "../auth/MypageImgView/MypageImgView.jsx";

export default function MainPromotion() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('rider'); // 'rider' or 'partner'
  
  // State for image modal view
  const [imgViewOpen, setImgViewOpen] = useState(false);
  const [imgViewSrc, setImgViewSrc] = useState("");
  const [imgViewAlt, setImgViewAlt] = useState("");

  const openImgView = (src, alt = "image") => {
    if (!src) return;1
    setImgViewSrc(src);
    setImgViewAlt(alt);
    setImgViewOpen(true);
  };

  const closeImgView = () => setImgViewOpen(false);

  const handleRiderApplyClick = () => {
    const riderForm = document.getElementById('rider-application-form');
    if (riderForm) {
      riderForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePartnerApplyClick = () => {
    const partnerForm = document.getElementById('partner-application-form');
    if (partnerForm) {
      partnerForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

    const promoDLVImgSrc = "/resource/promotionWelcomBox.png";
    const promoPTNSImgSrc = "/resource/promotionRiderImg.png";
    
  
return (
    <div className="mainshow-section-wrapper main-section-padding">
      <section className="mainpromotion-frame">
        <header className="mainpromotion-header-frame">
          <p className="mainpromotion-eyebrow-text">{t('promotionEyebrow')}</p>
          <h2 className="mainpromotion-title-text">{t('promotionTitle')}</h2>
          <p className="mainpromotion-subtitle-text">{t('promotionSubtitle')}</p>
        </header>

        <div className="mainpromotion-card">
          <div className="mainpromotion-tabs">
            <button
              className={`mainpromotion-tab-btn ${activeTab === 'rider' ? 'active' : ''}`}
              onClick={() => setActiveTab('rider')}
            >
              {t('riderTab')}
            </button>
            <button
              className={`mainpromotion-tab-btn ${activeTab === 'partner' ? 'active' : ''}`}
              onClick={() => setActiveTab('partner')}
            >
              {t('partnerTab')}
            </button>
          </div>

          <div className="mainpromotion-content-wrapper">
            {activeTab === 'rider' && (
              <div className="mainpromotion-content">
                <div className="mainpromotion-icon-wrapper">
                  <img
                    src={promoDLVImgSrc}
                    alt="Rider Promotion"
                    className="mainpromotion-promo-img"
                    onClick={() => openImgView(promoDLVImgSrc, "Rider Promotion")}
                  />
                </div>
                <div className="mainpromotion-text-content">
                  <h3 className="mainpromotion-content-title">{t('riderBenefitTitle')}</h3>
                  <p className="mainpromotion-content-desc">{t('riderBenefitDesc')}</p>
                  <ul className="mainpromotion-benefit-list">
                    {[1, 2, 3].map(num => (
                      <li key={`rider-${num}`} dangerouslySetInnerHTML={{ __html: t(`riderBenefit${num}`) }} />
                    ))}
                  </ul>
                  <button type="button" className="mainpromotion-cta-btn" onClick={handleRiderApplyClick}>
                    {t('riderCta')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'partner' && (
              <div className="mainpromotion-content">
                <div className="mainpromotion-icon-wrapper">
                  <img
                    src={promoPTNSImgSrc}
                    alt="Partner Promotion"
                    className="mainpromotion-promo-img"
                    onClick={() => openImgView(promoPTNSImgSrc, "Partner Promotion")}
                  />
                </div>
                <div className="mainpromotion-text-content">
                  <h3 className="mainpromotion-content-title">{t('partnerBenefitTitle')}</h3>
                  <p className="mainpromotion-content-desc">{t('partnerBenefitDesc')}</p>
                  <ul className="mainpromotion-benefit-list">
                    {[1, 2, 3].map(num => (
                      <li key={`partner-${num}`} dangerouslySetInnerHTML={{ __html: t(`partnerBenefit${num}`) }} />
                    ))}
                  </ul>
                  <button type="button" className="mainpromotion-cta-btn" onClick={handlePartnerApplyClick}>
                    {t('partnerCta')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <MypageImgView
        isOpen={imgViewOpen}
        onClose={closeImgView}
        src={imgViewSrc}
        alt={imgViewAlt}
      />
    </div>
  );
}