/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지, 내 문의/배송 내역 조회
 * 251217 v1.0.0 sara init
 * 260103 v2.0.0 sara - question history feature
 * 260105 v2.0.1 sara - 탭 변경 시 fetch + orders thunk 응답 형태 반영
 * 260111 v2.1.0 sara - 이미지 로딩 에러 처리, CSS 수정, UI 정리 및 배송 경로 가시성 강화
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../../../context/LanguageContext";
import { ORDER_STATUS } from "../../../constants/orderStatus";
import "./MyPage.css";
import { mypageIndexThunk } from "../../../store/thunks/myPage/myPageIndexThunk";

export default function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('delivery');
  const { user } = useSelector((state) => state.auth);
  const { allOrders } = useSelector((state) => state.orders);   // delivery history
  const { questions, loading: questionsLoading } = useSelector((state) => state.questions); // question history
  const { summary, loading: summaryLoading } = useSelector((state) => state.myPage); // summary info

  useEffect(() => {
    dispatch(mypageIndexThunk())
  }, []);

  // 이미지 존재하지 않을 시 대체  div 이미지 URL 반환
  const getImageUrl = (qnaImg) => {
      if (!qnaImg) return null;
      if (typeof qnaImg === "string") {
        if (qnaImg.startsWith("http") || qnaImg.startsWith("/")) return qnaImg;
        try { const p = JSON.parse(qnaImg); return p.url || p.path || null; } catch { return null; }
      }
      return qnaImg.url || qnaImg.path || null;
    };

    const getDeliveryImg = (order) => {
      const isVisible = order.status === "PICK" || order.status === "COM" || order.status === ORDER_STATUS.COMPLETED;
      // order.status가 픽업 또는 완료 상태일 때만 이미지 노출
      // order.status === ORDER_STATUS.COMPLETED; : 백엔드 상태 코드 반영 completed 일때는 무조건 노출
      return (isVisible && order.order_img) ? order.order_img : "/main-loginIcon.png";
      // pick, com이 아닐 때는 기본 이미지 노출
    };
      
  return (
    <div className="mypage-frame mypage-frame--auth">
      {/* 1. 상단 뒤로 가기 버튼 */}
      <button className="mypage-back-btn" onClick={() => navigate("/")} type="button">
        <span className="back-icon">←</span>
      </button>

      {/* 2. 유저 프로필 카드 */}
      <div className="mypage-profile-card">
        <div className="mypage-profile-circle">👤</div>
        <div>
          <div className="mypage-user-name">{user?.name || t("myPageUserName")}</div>
          <div className="mypage-user-email">{user?.email || t("myPageUserEmail")}</div>
        </div>
      </div>

      {/* 3. 현황 요약 카드 (Summary) */}
      {summaryLoading ? <div className="loading-msg">Loading...</div> : summary && (
        <div className="mypage-summary-card">
          <div className="summary-section">
            <h4>배송 현황</h4>
            <div className="summary-grid">
              <span>접수: {summary.deliveryStatus.req}</span>
              <span>배차: {summary.deliveryStatus.mat}</span>
              <span>픽업: {summary.deliveryStatus.pick}</span>
              <span>완료: {summary.deliveryStatus.com}</span>
            </div>
          </div>
          <div className="summary-section">
            <h4>문의 현황</h4>
            <div className="summary-grid">
              <span>대기: {summary.inquiryStatus.unanswered}</span>
              <span>완료: {summary.inquiryStatus.answered}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. 탭 네비게이션 */}
      <div className="mypage-tab-nav">
        <button 
          className={activeTab === "delivery" ? "is-active" : ""} 
          onClick={() => setActiveTab("delivery")}
          type="button"
        >
          {t("myDeliveryHistory")}
        </button>
        <button 
          className={activeTab === "question" ? "is-active" : ""} 
          onClick={() => setActiveTab("question")}
          type="button"
        >
          {t("myQuestionHistory")}
        </button>
      </div>

      {/* 5. 탭 컨텐츠 영역 */}
      <div className="mypage-tab-content">
        {activeTab === "delivery" ? (
          <div className="mypage-history-list">
            {allOrders?.length > 0 ? allOrders.map((order, idx) => (
              <div key={order.id || idx} className="mypage-order-card">
                <div className="order-card-header">
                  <span className="order-no">No. {order.order_code}</span>
                  <span className={`status-badge ${order.status === "COM" || order.status === ORDER_STATUS.COMPLETED ? "is-completed" : "is-pending"}`}>
                    {(order.status === "COM" || order.status === ORDER_STATUS.COMPLETED) && "✓ "}
                    {t(`orderStatus.${order.status}`)}
                  </span>
                </div>
                <div className="order-card-body">
                  <div className="order-photo-box">
                    <img src={getDeliveryImg(order)} alt="delivery" onError={(e) => e.target.src = "/main-loginIcon.png"} />
                  </div>
                  <div className="order-info">
                    <strong className="order-name">{order.partner_name} → {order.hotel_name}</strong>
                    <div className="order-user-name">({order.name})</div>
                  </div>
                  <span className="order-price">{order.price?.toLocaleString() || "-"}원</span>
                </div>
              </div>
            )) : <div className="empty-msg">{t("noDeliveryHistory")}</div>}
          </div>
        ) : (
          <div className="mypage-history-list">
            {questionsLoading ? (
              <div className="empty-msg">Loading...</div>
            ) : questions?.length > 0 ? questions.map((q, idx) => (
              <div key={q.id || idx} className="mypage-question-card">
                <div className="question-card-header">
                  <span className="question-title">{q.title}</span>
                  <span className={`status-badge ${q.isAnswered ? "is-completed" : "is-pending"}`}>
                    {q.isAnswered ? t("questionAnswered") : t("questionPending")}
                  </span>
                </div>
                <div className="question-card-body">
                  <p className="question-content">{q.content}</p>
                  {getImageUrl(q.qnaImg) && (
                    <img 
                      src={getImageUrl(q.qnaImg)} 
                      alt="attachment" 
                      className="question-image" 
                      onError={(e) => e.target.style.display = "none"} 
                    />
                  )}
                </div>
                {q.isAnswered && q.answer && (
                  <div className="question-card-footer">
                    <p className="question-answer">{q.answer}</p>
                  </div>
                )}
              </div>
            )) : <div className="empty-msg">{t("noQuestionHistory")}</div>}
          </div>
        )}
      </div>
    </div>
  );
}