/**
 * @file src/components/main/sections/MainCover.jsx
 * @description 메인 첫화면 섹션
 * 251216 v1.0.0 sara init 
 * 251229 v1.1.0 video & motion 추가
 * 251229 v1.2.0 텅크, 슬라이스 추가 및 통신 작업 추가
 * 260109 v1.3.0 jun 배송 조회 오류 시 모달 창 출력
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deliveryShowThunk } from '../../../store/thunks/deliveryShowThunk.js';
import { clearDeliveryShow } from '../../../store/slices/deliveryShowSlice.js';
import MainCoverModal from "./MainCoverItems/MainCoverModal.jsx";
import CustomAlertModal from '../../common/CustomAlertModal.jsx';
import FormShortcutIcon from '../../common/icons/FormShortcutIcon.jsx';
import MainCoverVideo from '/resource/main-cover.mp4';
import './MainCover.css';

export default function MainCover() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 결과 조회 모달 상태
  
  // 에러/알림용 모달 상태
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: ""
  });

  const { isLoggedIn } = useSelector((state) => state.auth);
  // error 상태를 useEffect로 감시하지 않으므로 여기서 error를 꺼내올 필요성은 줄어들었지만,
  // loading이나 show 데이터는 여전히 필요합니다.
  const { show, loading } = useSelector((state) => state.deliveryShow);

  // 컴포넌트 마운트 시 초기화 (이전 검색 기록 삭제)
  useEffect(() => {
    dispatch(clearDeliveryShow());
  }, [dispatch]);

  const handleOrderNumberChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, ''); 
    setOrderNumber(numericValue);
  };

  // [핵심 수정] unwrap()을 사용한 비동기 에러 핸들링
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    // 1. 유효성 검사
    if (!orderNumber || orderNumber.trim() === "") {
      setAlertModal({
        isOpen: true,
        title: t('coverOrderNumberInputErrorMsg') || "입력 확인",
        message: t('coverOrderNumberPlaceholder') || "주문번호를 입력해주세요."
      });
      return;
    }

    // 2. 로딩/결과 모달 열기 (데이터 오기 전이라도 로딩 표시 등을 위해 염)
    setIsModalOpen(true);

    try {
      // 3. 비동기 요청 및 결과 직접 확인
      await dispatch(deliveryShowThunk(orderNumber)).unwrap();
    } catch (err) {
      // 4. 실패 시: 즉시 에러 처리
      console.error("조회 실패:", err);
      
      // (1) 조회 모달 닫기
      setIsModalOpen(false);

      // (2) 에러 메시지 추출
      let errorMsg = t('coverOrderNotFound'); // 기본 메시지
      
      if (typeof err === 'object' && err.message) {
          errorMsg = err.message;
      } else if (typeof err === 'string') {
          errorMsg = err;
      }

      // (3) 에러 모달 띄우기
      setAlertModal({
        isOpen: true,
        title: t('coverOrderNumberCheckError') || "배송번호 조회 실패",
        message: errorMsg
      });

      // (4) Redux 에러 상태 초기화 (재검색을 위해 깔끔하게 정리)
      dispatch(clearDeliveryShow());
    }
  };

  const handleGoToMyDeliveries = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      setAlertModal({
        isOpen: true,
        title: t('alertErrorTitle') || "로그인 필요",
        message: t('coverLoginRequired') || "로그인이 필요한 서비스입니다."
      });
      // 확인 후 이동하고 싶다면 모달 닫기 핸들러 등에서 처리하거나,
      // UX 정책에 따라 setTimeout 등을 사용
    }
  };

  // 결과 조회 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearDeliveryShow()); 
  };

  // 알림 모달 닫기
  const handleCloseAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  // 제휴신청 폼 바로가기 스크롤 핸들러 추가
  const scrollToForm = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        <video src={MainCoverVideo} autoPlay muted loop playsInline className="maincover-video"> </video>
        {/* [추가] 우측 상단 숏컷 버튼 그룹 */}
        <div className="maincover-shortcut-group">
          <button 
            type="button" 
            className="maincover-shortcut-btn"
            onClick={() => scrollToForm('rider-application-form')}
          >
            {t('ptnsFormRiderTitle')} <FormShortcutIcon />
          </button>
          <button 
            type="button" 
            className="maincover-shortcut-btn"
            onClick={() => scrollToForm('partner-application-form')} 
          >
            {t('ptnsFormPartnerTitle')} <FormShortcutIcon />
          </button>
        </div>
        
        {/* 우측 배경 영상 */}
        <video autoPlay muted loop playsInline className="maincover-video">
          <source src="/resource/main-cover.mp4" type="video/mp4" />
          <img src="/resource/main-cover.png" alt={t('mainCoverFallbackAlt')} />
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
            <motion.h1 
              className="maincover-hero-title" 
              variants={itemVariants}
              dangerouslySetInnerHTML={{ __html: t('coverHeroTitle') }}
            />
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
        show={show}
      />

      {/* [추가] 에러/알림용 모달 */}
      <CustomAlertModal
        isOpen={alertModal.isOpen}
        onClose={handleCloseAlert}
        title={alertModal.title}
        message={alertModal.message}
      />
    </div>
  );
}