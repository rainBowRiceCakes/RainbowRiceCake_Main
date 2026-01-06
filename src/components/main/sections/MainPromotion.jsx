/**
 * @file src/components/main/sections/MainPromotion.jsx
 * @description New promotion section with a tabbed interface.
 * 260106 v2.0.0 YourName redesign for responsiveness and UX.
 */

import { useState } from "react";
import { useTranslation } from "../../../context/LanguageContext";
import "./MainPromotion.css";
import RiderPromotionIcon from "../../common/icons/RiderPromotionIcon";
import PartnerPromotionIcon from "../../common/icons/PartnerPromotionIcon";

export default function MainPromotion() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('rider'); // 'rider' or 'partner'

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
              <div className="mainpromotion-content mainpromotion-content--rider">
                <div className="mainpromotion-icon-wrapper">
                  <RiderPromotionIcon />
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
              <div className="mainpromotion-content mainpromotion-content--partner">
                <div className="mainpromotion-icon-wrapper">
                  <PartnerPromotionIcon />
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
    </div>
  );
}