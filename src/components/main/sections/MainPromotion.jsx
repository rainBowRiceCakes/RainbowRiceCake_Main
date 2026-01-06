/**
 * @file src/components/main/sections/MainFee.jsx
 * @description 요금 안내
 * 251216 v1.0.0 sara init 
 * 251223 v1.1.0 sara modify UI
 * 260104 v1.1.1 sara modify contents
 * 260105 v1.1.2 sara modify contents(비로그인 시 접근 불가 처리)
 */


import { useTranslation } from "../../../context/LanguageContext";
import "./MainPromotion.css";
import RiderPromotionIcon from "../../common/icons/RiderPromotionIcon";

export default function MainPromotion() {
  const { t } = useTranslation();

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
    <div className="mainshow-section-wrapper">
      <section className="mainpromotion-frame">
        {/* 상단 헤더 */}
        <header className="mainpromotion-header-frame">
          <p className="mainpromotion-eyebrow-text">{t('promotionEyebrow')}</p>
          <h2 className="mainpromotion-title-text">{t('promotionTitle')}</h2>
          <p className="mainpromotion-subtitle-text" dangerouslySetInnerHTML={{ __html: t('promotionSubtitle') }} />
        </header>

        {/* 메인 홍보 카드 그리드 */}
        <div className="mainpromotion-card-frame">
          
          {/* 좌측: 기사님 혜택 */}
          <div className="mainpromotion-half-frame mainpromotion-half-frame--left">
            <div className="mainpromotion-info-group">
              <span className="mainpromotion-badge mainpromotion-badge--rider">{t('riderBadge')}</span>
              <h3 className="mainpromotion-half-title">{t('riderTitle')}</h3>
              <p className="mainpromotion-half-desc">{t('riderDesc')}</p>
              
              <ul className="mainpromotion-list">
                {[1, 2, 3, 4].map((num) => (
                  <li key={num} className="mainpromotion-list-item" dangerouslySetInnerHTML={{ __html: t(`riderBenefit${num}`) }} />
                ))}
              </ul>
            </div>

            <div className="mainpromotion-rider-image-wrapper">
              <RiderPromotionIcon />
            </div>

            <div className="mainpromotion-action-group">
              <div className="mainpromotion-cta-frame">
                <button type="button" className="mainpromotion-cta-btn mainpromotion-cta-btn--ghost">
                  {t('riderCtaGuide')}
                </button>
                <button type="button" className="mainpromotion-cta-btn" onClick={handleRiderApplyClick}>
                  {t('riderCtaApply')}
                </button>
              </div>
              <p className="mainpromotion-footnote-text">{t('riderFootnote')}</p>
            </div>
          </div>

          {/* 우측: 점주님/제휴 혜택 */}
          <div className="mainpromotion-half-frame mainpromotion-half-frame--right">
            <div className="mainpromotion-info-group">
              <span className="mainpromotion-badge mainpromotion-badge--owner">{t('partnerBadge')}</span>
              <h3 className="mainpromotion-half-title">{t('partnerTitle')}</h3>
              <p className="mainpromotion-half-desc" dangerouslySetInnerHTML={{ __html: t('partnerDesc') }} />
            </div>

            <div className="mainpromotion-benefits-grid">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className={`mainpromotion-benefit-item ${num > 4 ? 'mainpromotion-benefit-item--highlight' : ''}`}>
                  <p className="mainpromotion-benefit-title">{t(`partnerBenefit${num}Title`)}</p>
                  <p className="mainpromotion-benefit-desc" dangerouslySetInnerHTML={{ __html: t(`partnerBenefit${num}Desc`) }} />
                </div>
              ))}
            </div>

            <div className="mainpromotion-action-group">
              <div className="mainpromotion-quote-frame">
                <p className="mainpromotion-quote-text" dangerouslySetInnerHTML={{ __html: t('partnerQuote') }} />
              </div>
              <div className="mainpromotion-cta-frame mainpromotion-cta-frame--right">
                <button type="button" className="mainpromotion-cta-btn mainpromotion-cta-btn--ghost">
                  {t('partnerCtaGuide')}
                </button>
                <button type="button" className="mainpromotion-cta-btn" onClick={handlePartnerApplyClick}>
                  {t('partnerCtaApply')}
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}