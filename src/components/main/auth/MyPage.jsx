/**
 * @file src/components/main/auth/MyPage.jsx
 * @description 마이 페이지 및 배송 상태 가이드(step img) 
 * 251217 v1.0.0 sara init 
 * 260102 v1.1.0 sara - add delivery tracking feature
 * 260110 v1.2.0 sara - delivery tracking error handling
 */

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../../../context/LanguageContext";
import { ORDER_STATUS } from "../../../constants/orderStatus";
import { orderIndexThunk } from "../../../store/thunks/orders/orderIndexThunk.js";
// ✅ allOrders를 세팅하는 액션이 있는 슬라이스에서 가져와야 함 (경로는 프로젝트에 맞게 수정)
import { setAllOrders } from "../../../store/slices/ordersSlice.js";
import "./MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("delivery"); // 'delivery' | 'question'

  const { allOrders = [] } = useSelector((state) => state.orders || {});
  const { isLoggedIn, user } = useSelector((state) => state.auth || {});

  // ✅ 질문 히스토리 더미(일단 에러 방지용)
  const dummyQuestions = useMemo(() => [], []);

  useEffect(() => {
    // 로그인 + 유저 존재 + 배송 탭일 때만 호출
    if (!isLoggedIn || !user || activeTab !== "delivery") return;

    dispatch(orderIndexThunk({ userId: user.id, role: "COM" }))
      .unwrap()
      .then((res) => {
        // res.data가 배열인지 확실치 않으면 안전 처리
        const list = Array.isArray(res?.data) ? res.data : [];
        dispatch(setAllOrders(list));
      })
      .catch(() => {
        // 에러 나도 UI는 살아있게
        dispatch(setAllOrders([]));
      });
  }, [isLoggedIn, user, activeTab, dispatch]);

  // 1) 비로그인
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

  // 2) 로그인
  return (
    <div className="mypage-frame mypage-frame--auth">
      {/* 프로필 카드 */}
      <div className="mypage-profile-card">
        <div className="mypage-profile-circle">👤</div>
        <div>
          <div className="mypage-user-name">{user?.name || t("myPageUserName")}</div>
          <div className="mypage-user-email">{user?.email || t("myPageUserEmail")}</div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mypage-tab-nav">
        <button className={activeTab === "delivery" ? "is-active" : ""} onClick={() => setActiveTab("delivery")}>
          {t("myDeliveryHistory")}
        </button>
        <button className={activeTab === "question" ? "is-active" : ""} onClick={() => setActiveTab("question")}>
          {t("myQuestionHistory")}
        </button>
      </div>

      <div className="mypage-tab-content">
        {activeTab === "delivery" ? (
          <div className="mypage-history-list">
            {allOrders.length > 0 ? (
              allOrders.map((order) => {
                const isCompleted = order.status === ORDER_STATUS.COMPLETED;
                return (
                  <div key={order.id} className="mypage-order-card">
                    <div className="order-card-header">
                      <span className="order-no">No. {order.id}</span>
                      <span className={`status-badge ${isCompleted ? "is-completed" : "is-pending"}`}>
                        {isCompleted ? "✓ " : ""}
                        {t(`orderStatus.${order.status}`)}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <strong className="order-name">{order.name || "-"}</strong>
                      <span className="order-price">
                        {typeof order.price === "number" ? order.price.toLocaleString() : "-"}원
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-msg">{t("noDeliveryHistory")}</div>
            )}
          </div>
        ) : (
          <div className="mypage-history-list">
            {dummyQuestions.length > 0 ? (
              dummyQuestions.map((question) => (
                <div key={question.id} className="mypage-question-card">
                  <div className="question-card-header">
                    <span className="question-title">{question.title}</span>
                    <span
                      className={`status-badge ${
                        question.status === "답변 완료" ? "is-completed" : "is-pending"
                      }`}
                    >
                      {question.status}
                    </span>
                  </div>
                  <div className="question-card-body">
                    <strong className="question-content">{question.content}</strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-msg">{t("noQuestionHistory")}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
