/**
 * @file src/components/main/sections/MainInfo.jsx
 * @description 메인 서비스 안내
 * 251216 v1.0.0 sara init 
 */
import { useContext } from 'react';
import './MainInfo.css';
import { LanguageContext } from '../../../context/LanguageContext';

export default function MainInfo() {
  const { t } = useContext(LanguageContext);

  return (
    // section -> div, class, id update
    <div className="maininfo-frame mainshow-section-frame" id="info"> 
      <div className="mainshow-section-wrapper">
        
        {/* Section Head: section__head -> maininfo-header-group */}
        <div className="maininfo-header-group">
          <div>
            <h2 className="maininfo-title-text">{t('infoTitle')}</h2>
            <p className="maininfo-desc-text">
              {t('infoDescription')}
            </p>
          </div>

          <div className="maininfo-actions-group">
            {/* btn -> maininfo-button */}
            <a className="maininfo-button maininfo-button--primary" href="#fee">
              {t('infoFeeGuideButton')}
            </a>
            <a className="maininfo-button" href="#search">
              {t('infoBranchGuideButton')}
            </a>
          </div>
        </div>

        {/* Content Grid: grid-2 -> maininfo-grid-2 */}
        <div className="maininfo-grid-2">
          {/* Card 1: card -> maininfo-card-box */}
          <div className="maininfo-card-box maininfo-card-box--step">
            <h3 className="maininfo-card-title-text">
              {t('infoHowToUseTitle')}
            </h3>
            {/* List remains ol/li, add classes */}
            <ol className="maininfo-step-list">
              <li>{t('infoStep1')}</li>
              <li>{t('infoStep2')}</li>
              <li>{t('infoStep3')}</li>
              <li>{t('infoStep4')}</li>
            </ol>

            {/* Inlined box -> maininfo-note-box */}
            <div className="maininfo-note-box maininfo-note-box--trust">
              <div className="maininfo-note-title-text">{t('infoTrustFactorTitle')}</div>
              <p className="maininfo-note-desc-text">
                {t('infoTrustFactorDesc')}
              </p>
            </div>
          </div>

          {/* Card 2: card -> maininfo-card-box */}
          <div className="maininfo-card-box maininfo-card-box--size">
            <h3 className="maininfo-card-title-text">
              {t('infoItemSizeTitle')}
            </h3>
            <p className="maininfo-card-desc-text">
              {t('infoItemSizeDesc')}
            </p>

            {/* Size Grid: grid-3 -> maininfo-grid-3 */}
            <div className="maininfo-grid-3">
              {/* Item with inline style -> maininfo-size-item */}
              <div className="maininfo-size-item">
                <div className="maininfo-size-title-text">{t('infoSizeSmall')}</div>
                <div className="maininfo-size-desc-text">80 × 75 × 200cm</div>
              </div>
              <div className="maininfo-size-item">
                <div className="maininfo-size-title-text">{t('infoSizeMedium')}</div>
                <div className="maininfo-size-desc-text">100 × 85 × 220cm</div>
              </div>
              <div className="maininfo-size-item">
                <div className="maininfo-size-title-text">{t('infoSizeLarge')}</div>
                <div className="maininfo-size-desc-text">140 × 100 × 240cm</div>
              </div>
            </div>

            {/* Note Group */}
            <div className="maininfo-note-group">
              <div className="maininfo-note-item">
                <div className="maininfo-note-title-text">{t('infoRestrictionsTitle')}</div>
                <div className="maininfo-note-desc-text">
                  {t('infoRestrictionsDesc')}
                </div>
              </div>

              <div className="maininfo-note-item">
                <div className="maininfo-note-title-text">{t('infoBranchNoticeTitle')}</div>
                <div className="maininfo-note-desc-text">
                  {t('infoBranchNoticeDesc')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
