/**
 * @file src/components/main/sections/MainCover.jsx
 * @description 메인 첫화면 섹션
 * 251216 v1.0.0 sara init 
 * 251229 v1.1.0 video & motion 추가
 * 251229 v1.2.0 텅크, 슬라이스 추가 및 통신 작업 추가
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deliveryShowThunk } from '../../../store/thunks/deliveryShowThunk.js';
import { clearDeliveryShow } from '../../../store/slices/deliveryShowSlice.js';
import MainCoverModal from "./MainCoverItems/MainCoverModal.jsx";
import './MainCover.css';

export default function MainCover() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState("");

  const { isLoggedIn } = useSelector((state) => state.auth);
  // deliveryShow 슬라이스에서 상태 가져오기
  const { show: currentOrder, loading, error } = useSelector((state) =>
    state.deliveryShow
  );

  const isModalOpen = !!currentOrder;

  const handleOrderNumberChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, ''); // 숫자만 입력가능
    setOrderNumber(numericValue);
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderNumber) {
      alert(t('coverOrderNumberPlaceholder'));
      return;
    }
    dispatch(deliveryShowThunk(orderNumber));
  };

  // 로그인 여부에 따른 마이페이지 이동 로직
  const handleGoToMyDeliveries = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      alert(t('coverLoginRequired'));
      navigate('/login'); // 소셜 로그인 유도 
    }
  };

  const handleCloseModal = () => {
    dispatch(clearDeliveryShow()); // 상태 초기화
  };

  // 에러 발생 시 처리
  useEffect(() => {
    if (error) {
      alert(t('coverOrderNotFound'));
      dispatch(clearDeliveryShow()); //에러 상태를 비워야 다음 검색 시 alert가 중복되지 않음
    }
  }, [error, dispatch, t]);

  /** [Motion] 애니메이션 설정 */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
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
        <form className="maincover-delivery-form" onSubmit={handleTrackOrder}>
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
            <button type="submit" className="maincover-submit-button" disabled={loading}>
              {loading ? t('coverLoading') : t('coverTrackButton')}
            </button>
          </div>
          <div className="maincover-link-group">
            <button type="button" className="maincover-more-link" onClick={handleGoToMyDeliveries}>
              {t('coverGoToMyDeliveries')}
            </button>
          </div>
        </form>
      </div>

      <MainCoverModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={currentOrder}
      />
    </div>
  );
}