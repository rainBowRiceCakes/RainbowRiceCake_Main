/**
 * @file src/components/main/sections/MainCover.jsx
 * @description 메인 첫화면 섹션
 * 251216 v1.0.0 sara init 
 */
import { useContext } from 'react';
import './MainCover.css';
import MaincoverImg from "../../../assets/main-cover.png";
import { LanguageContext } from '../../../context/LanguageContext';

export default function MainCover() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="maincover-frame">
      
{/* 1. 상단 히어로 이미지 영역 - 이미지 태그로 변경 */}
      <div className="maincover-image-area">
        <div className="maincover-image-wrapper">
          {/* ✅ 텍스트 오버레이 제거 및 img 태그로 대체 */}
          <img 
            src={MaincoverImg} 
            alt={t('coverImageAlt')} 
            className="maincover-cover-image"
          /> 
        </div>
      </div>
      
{/* 2. 하단 배송 조회 컨테이너 박스 영역 (FORM 태그 사용) */}
      <div className="maincover-delivery-area">
        <form className="maincover-delivery-form">
            <div className="maincover-delivery-title-text">{t('coverDeliveryTracking')}</div>
            <div className="maincover-input-group">
                <input 
                    type="text" 
                    placeholder={t('coverOrderNumberPlaceholder')} 
                    className="maincover-input-field" 
                />
                <button type="submit" className="maincover-submit-button">
                    {t('coverTrackButton')}
                </button>
            </div>
            <div className="maincover-link-group">
                <a href="#more-delivery" className="maincover-more-link" >
                    {t('coverGoToMyDeliveries')}
                </a>
            </div>
        </form>
      </div>
    </div>
  );
}
