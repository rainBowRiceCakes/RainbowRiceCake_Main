/**
 * @file src/components/main/sections/MainFee.jsx
 * @description 요금 안내 / 지점 안내 
 * 251216 v1.0.0 sara init 
 */
import { useContext } from 'react';
import './MainFee.css';
import { LanguageContext } from '../../../context/LanguageContext';

export default function MainFee() {
  const { t } = useContext(LanguageContext);

  return (
    // container -> frame, web-wrapper -> mainshow-section-wrapper, id="fee"
    <div className="mainfee-frame mainshow-section-frame" id="fee"> 
      <div className="mainshow-section-wrapper"> 
        <div className="mainfee-header">
          <div className="mainfee-title-text">{t('feeTitle')}</div>
          <div className="mainfee-subtitle-text">{t('feeDesc')}</div>
        </div>
        
        <div className="mainfee-content-flex">
          
          {/* option 2 */}
         {/* 1. 가격표 컨테이너 */}
          <div className="mainfee-price-box">
            <div className="mainfee-box-title">{t('feeDaeguDeliveryTitle')}</div>
            
            {/* 기본 배송료 체계 (5,000원~10,000원 기준) */}
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row mainfee-table-header-row">
                <div className="mainfee-table-cell">{t('feeOrderAmount')}</div>
                <div className="mainfee-table-cell">{t('feeBaseFee')}</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">{t('feeOver10000')}</div>
                <div className="mainfee-table-cell mainfee-fee-free">{t('feeFree')}</div>
              </div>
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">{t('feeBetween5000And10000')}</div>
                <div className="mainfee-table-cell">{t('fee1000KRW')}</div>
              </div>
            </div>

            {/* 두 번째 이미지 스타일의 지역별 추가 요금 */}
            <div className="mainfee-box-title">{t('feeRegionalSurchargeTitle')}</div>
            <div className="mainfee-table-wrapper" >
              <div>
                <strong>{t('feeDaebongEtc')}</strong> <span>{t('feePlus500')}</span>
              </div>
              <div>
                <strong>{t('feeNaedangEtc')}</strong> <span>{t('feePlus1000')}</span>
              </div>
              <div>
                {t('feeSamdeokEtc')} <strong>{t('fee1500KRW')}</strong>
              </div>
            </div>

            {/* 시간 할증 */}
            <div className="mainfee-box-title">{t('feeNightHolidaySurchargeTitle')}</div>
            <div className="mainfee-table-wrapper">
              <div className="mainfee-table-row">
                <div className="mainfee-table-cell">{t('feeNightHours')}</div>
                <div className="mainfee-table-cell">{t('feePlus500')}</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
