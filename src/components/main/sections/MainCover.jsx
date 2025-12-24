/**
 * @file src/components/main/sections/MainCover.jsx
 * @description 메인 첫화면 섹션
 * 251216 v1.0.0 sara init 
 */
import { useState, useContext } from 'react';
import './MainCover.css';
import MaincoverImg from "../../../assets/main-cover.png";
import { LanguageContext } from '../../../context/LanguageContext';
import MainCoverModal from "../sections/MainCoverItems/MainCoverModal.jsx";
import orderData from '../../../data/orderData.json';

export default function MainCover() {
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e) => {
    if (e) e.preventDefault();
    setIsModalOpen(true);
  };

return (
    <div className="maincover-frame">
      <div className="maincover-image-area">
        <div className="maincover-image-wrapper">
          <img src={MaincoverImg} alt="DGD Hero" className="maincover-cover-image" /> 
        </div>
      </div>
      
      <div className="maincover-delivery-area">
        <form className="maincover-delivery-form" onSubmit={handleOpenModal}>
            <div className="maincover-delivery-title-text">{t('coverDeliveryTracking')}</div>
            <div className="maincover-input-group">
                <input type="text" placeholder={t('coverOrderNumberPlaceholder')} className="maincover-input-field" required />
                <button type="submit" className="maincover-submit-button">{t('coverTrackButton')}</button>
            </div>
            <div className="maincover-link-group">
                <button type="button" className="maincover-more-link" onClick={handleOpenModal}>
                    {t('coverGoToMyDeliveries')}
                </button>
            </div>
        </form>
      </div>

      <MainCoverModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={orderData[0]} 
      />
    </div>
  );
}