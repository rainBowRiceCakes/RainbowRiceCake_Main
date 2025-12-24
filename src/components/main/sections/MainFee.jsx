/**
 * @file src/components/main/sections/MainFee.jsx
 * @description 요금 안내
 * 251216 v1.0.0 sara init 
 * 251223 v1.1.0 sara modify UI
 */

import { useContext } from 'react';
import './MainFee.css';
import { LanguageContext } from '../../../context/LanguageContext';

export default function MainFee() {
  const { t } = useContext(LanguageContext);

  return (
    /* 1. 프레임: 섹션 전체 레이아웃 */
    <div className="mainfee-frame mainshow-section-frame" id="fee"> 
      <div className="mainshow-section-wrapper"> 
        <div className="mainfee-header-group">
          <h2 className="mainfee-title-text">{t('feeTitle')}</h2>
          <p className="mainfee-desc-text">{t('feeDesc')}</p>
        </div>
        <div className="mainfee-content-container">
          <div className="mainfee-card-box">
            <h3 className="mainfee-box-title">{t('feeDaeguDeliveryTitle')}</h3>
            
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row mainfee-table-header">
                <div className="mainfee-table-cell">{t('feeOrderAmount')}</div>
                <div className="mainfee-table-cell">{t('feeBaseFee')}</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">{t('feeOver10000')}</div>
                <div className="mainfee-table-cell mainfee-emphasis-text">{t('feeFree')}</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">{t('feeBetween5000And10000')}</div>
                <div className="mainfee-table-cell">{t('fee1000KRW')}</div>
              </div>
            </div>
            <h3 className="mainfee-box-title">{t('feeRegionalSurchargeTitle')}</h3>
            <div className="mainfee-info-card">
              <div className="mainfee-info-item">
                <span className="mainfee-info-label">{t('feeDaebongEtc')}</span>
                <span className="mainfee-info-value">{t('feePlus500')}</span>
              </div>
              <div className="mainfee-info-item">
                <span className="mainfee-info-label">{t('feeNaedangEtc')}</span>
                <span className="mainfee-info-value">{t('feePlus1000')}</span>
              </div>
              <div className="mainfee-info-item mainfee-info-item--highlight">
                <span className="mainfee-info-label">{t('feeSamdeokEtc')}</span>
                <span className="mainfee-info-value">{t('fee1500KRW')}</span>
              </div>
            </div>
            <h3 className="mainfee-box-title">{t('feeNightHolidaySurchargeTitle')}</h3>
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">{t('feeNightHours')}</div>
                <div className="mainfee-table-cell mainfee-emphasis-text">{t('feePlus500')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};