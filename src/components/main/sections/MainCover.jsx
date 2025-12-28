/**
 * @file src/components/main/sections/MainCover.jsx
 * @description 메인 첫화면 섹션
 * 251216 v1.0.0 sara init 
 * 251229 v1.1.0 video & motion 추가
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext'; //
import MainCoverModal from "./MainCoverItems/MainCoverModal.jsx";
import orderData from '../../../data/orderData.json';
import './MainCover.css';

export default function MainCover() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  /**
   * 유효성 검사: 숫자만 입력 가능하게 처리
   */
  const handleOrderNumberChange = (e) => {
    const value = e.target.value;
    // 숫자가 아닌 모든 문자를 즉시 제거
    const numericValue = value.replace(/[^0-9]/g, '');
    setOrderNumber(numericValue);
  };

  const handleOpenModal = (e) => {
    if (e) e.preventDefault();
    if (!orderNumber) {
      alert(t('coverOrderNumberPlaceholder'));
      return;
    }
    setIsModalOpen(true);
  };

  /** [Motion] 애니메이션 설정 */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 }, // 왼쪽에서 오른쪽으로 스르륵
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="maincover-frame">
      {/* --- 섹션 1: 상단 비주얼 (블렌딩 효과 적용) --- */}
      <div className="maincover-visual-area">
        {/* 우측 배경 영상 */}
        <video autoPlay muted loop playsInline className="maincover-video">
          <source src="/resource/main-cover.mp4" type="video/mp4" />
          <img src="/resource/main-cover.png" alt="Fallback" />
        </video>

        {/* 좌측 배경색과 영상을 이어주는 그라데이션 마스크 */}
        <div className="maincover-side-mask"></div>

        {/* 좌측 텍스트 콘텐츠 */}
        <div className="maincover-text-wrapper">
          <motion.div 
            className="maincover-text-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="maincover-hero-title" variants={itemVariants}>
              Leave the heavy behind,<br /> <span className="maincover-hero-subtitle">take your travel beyond.</span>
            </motion.h1>
          </motion.div>
        </div>
      </div>
      
      {/* --- 섹션 2: 하단 배송 조회 폼 --- */}
      <div className="maincover-delivery-area">
        <form className="maincover-delivery-form" onSubmit={handleOpenModal}>
            <div className="maincover-delivery-title-text">{t('coverDeliveryTracking')}</div>
            <div className="maincover-input-group">
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={orderNumber}
                  onChange={handleOrderNumberChange}
                  placeholder={t('coverOrderNumberPlaceholder')} 
                  className="maincover-input-field" 
                  required 
                />
                <button type="submit" className="maincover-submit-button">
                  {t('coverTrackButton')}
                </button>
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