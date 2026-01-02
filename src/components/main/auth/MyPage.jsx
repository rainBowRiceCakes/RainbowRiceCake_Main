/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지 및 배송 상태 가이드(step img) 
 * 251217 v1.0.0 sara init 
 * 260102 v1.1.0 sara - add delivery tracking feature
 * 260110 v1.2.0 sara - delivery tracking error handling
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "../../../context/LanguageContext";
import { deliveryShowThunk } from '../../../store/thunks/deliveryShowThunk.js';
import { orderIndexThunk } from '../../../store/thunks/orders/orderIndexThunk.js'; // 주문 내역 초기화용 thunk
import { clearDeliveryShow } from '../../../store/slices/deliveryShowSlice.js';
import { setAllOrders } from '../../../store/slices/ordersSlice.js'; // 데이터 초기화용 액션
import MainCoverModal from "../sections/MainCoverItems/MainCoverModal.jsx";
import "./MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("delivery"); // 'delivery' | 'question'
  // 슬라이스에서 전체 배송 목록 가져오기
  const { allOrders } = useSelector((state) => state.orders);
  // 상세 조회용 상태
  const { show: currentOrder } = useSelector((state) => state.deliveryShow);
  const isModalOpen = !!currentOrder;
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  
  // 로그인 상태일 때 배송 히스토리 로드
  useEffect(() => {
    if (isLoggedIn && user && activeTab === "delivery") {
      // 제공해주신 텅크를 사용하여 일반 유저(COM)의 히스토리 요청
      dispatch(orderIndexThunk({ userId: user.id, role: 'COM' }))
      .unwrap()
      .then((res) => {
        // 서버에서 받은 목록을 슬라이스에 저장
        dispatch(setAllOrders(res.data)); 
      });
    }
  }, [isLoggedIn, user, activeTab, dispatch]);
  
  const handleOrderClick = (id) => {
    dispatch(deliveryShowThunk(id));
  };

  
  
  // 1. 비로그인 상태 UI (기본 디자인 유지)
  if (!isLoggedIn) {
    return (
      <div className="mypage-frame mypage-frame--unauth">
        <div className="mypage-lock-box">
          <div className="mypage-lock-icon">🔒</div>
          <h2 className="mypage-lock-title">{t("myPageLoginRequired")}</h2>
          <button className="mypage-login-btn" onClick={() => navigate("/login")}>
            {t("myPageLogin")}
          </button>
        </div>
      </div>
    );
  }

  // 2. 로그인 상태 UI (배송/질문 히스토리 탭 구조)
  return (
    <>
      <div className="mypage-frame mypage-frame--auth">
        {/* 프로필 카드 */}
        <div className="mypage-profile-card">
          <div className="mypage-profile-circle">👤</div>
          <div>
            <div className="mypage-user-name">{user?.name || t('myPageUserName')}</div>
            <div className="mypage-user-email">{user?.email || t('myPageUserEmail')}</div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mypage-tab-nav">
          <button 
            className={activeTab === "delivery" ? "is-active" : ""} 
            onClick={() => setActiveTab("delivery")}
          >
            {t('my Delivery History')}
          </button>
          <button 
            className={activeTab === "question" ? "is-active" : ""} 
            onClick={() => setActiveTab("question")}
          >
            {t('my Question History')}
          </button>
        </div>

        <div className="mypage-tab-content">
          {activeTab === "delivery" ? (
            <div className="mypage-history-list">
              {/* 히스토리 카드 목록 (DB 컬럼 매핑: id, status, price) */}
              {allOrders && allOrders.length > 0 ? (
                allOrders.map((order) => (
                  <div key={order.id} className="mypage-order-card" onClick={() => handleOrderClick(order.id)}>
                    <div className="order-card-header">
                      <span className="order-no">No. {order.id}</span>
                      <span className={`status-badge is-${order.status}`}>
                        {order.status === 'com' ? '✓ 완료' : order.status === 'match' ? '진행중' : '대기중'}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <strong className="order-name">{order.name}</strong>
                      <span className="order-price">{order.price?.toLocaleString()}원</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-msg">{t('noDeliveryHistory')}</div>
              )}
            </div>
          ) : (
            <div className="mypage-history-list">
              <div className="empty-msg">{t('noQuestionHistory')}</div>
            </div>
          )}
        </div>
      </div>

      <MainCoverModal
        isOpen={isModalOpen}
        onClose={() => dispatch(clearDeliveryShow())}
        order={currentOrder}
      />
    </>
  );
}